import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request) {
  try {
    await db.ready();
    const { searchParams } = new URL(request.url);
    const buyerCompanyId = searchParams.get('buyer_company_id');

    const orders = await db.orders.find((o) => {
      if (buyerCompanyId && o.buyer_company_id !== buyerCompanyId) return false;
      return true;
    });

    const response = await Promise.all(orders.map(async (o) => {
      const items = await db.order_items.find((item) => item.order_id === o.id);
      const buyerCompany = await db.companies.findById(o.buyer_company_id);

      const itemsRes = await Promise.all(items.map(async (item) => {
        const listing = await db.material_listings.findById(item.material_listing_id);
        const supplierCompany = item.supplier_company_id ? await db.companies.findById(item.supplier_company_id) : null;
        return {
          id: item.id,
          supplier_company_id: item.supplier_company_id,
          supplier_company_name: supplierCompany?.name || 'Mitra UMKM Terverifikasi',
          material_listing_id: item.material_listing_id,
          listing_title: listing?.title || 'Pasokan Biomassa Kayu Teragregasi',
          quantity: item.quantity,
          unit_price: item.unit_price,
          subtotal: item.subtotal,
        };
      }));

      return {
        id: o.id,
        aggregated_supply_id: o.aggregated_supply_id,
        buying_request_id: o.buying_request_id,
        buyer_company_id: o.buyer_company_id,
        buyer_company_name: buyerCompany?.name || 'PT Pembeli Industri',
        total_amount: o.total_amount,
        platform_fee: o.platform_fee,
        order_status: o.order_status,
        items: itemsRes,
        created_at: o.created_at,
      };
    }));

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      { detail: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await db.ready();
    const { searchParams } = new URL(request.url);
    const body = await request.json().catch(() => ({}));
    const buyerCompanyId = body.buyer_company_id || searchParams.get('buyer_company_id') || searchParams.get('company_id') || 'comp-buy-nusantara';

    // Case 1: Direct purchase of listing / cluster from Buyer Catalog
    if (body.material_listing_id || body.listing_id || body.cluster_id || body.listing_ids) {
      let targetListings = [];

      // If specific listing IDs are provided (from an aggregated cluster)
      if (Array.isArray(body.listing_ids) && body.listing_ids.length > 0) {
        const found = await Promise.all(body.listing_ids.map((id) => db.material_listings.findById(id)));
        targetListings = found.filter((l) => l && l.available_quantity > 0);
      } else {
        const idToCheck = body.material_listing_id || body.listing_id || body.cluster_id;
        const single = await db.material_listings.findById(idToCheck);
        if (single) {
          targetListings = [single];
        } else {
          // Check if idToCheck is a cluster prefix (e.g. KLS-CIM-A-...)
          const activeListings = await db.material_listings.find((l) => l.status === 'active' && l.available_quantity > 0);
          targetListings = activeListings;
        }
      }

      if (targetListings.length === 0) {
        return NextResponse.json(
          { detail: 'Tidak ada pasokan biomassa aktif yang tersedia untuk dibeli.' },
          { status: 404 }
        );
      }

      const totalAvailable = targetListings.reduce((sum, l) => sum + Number(l.available_quantity || 0), 0);
      const requestedQty = Number(body.quantity) > 0 ? Number(body.quantity) : totalAvailable;
      let remainingToBuy = Math.min(requestedQty, totalAvailable);

      // Create Order
      const order = await db.orders.create({
        buyer_company_id: buyerCompanyId,
        total_amount: 0,
        platform_fee: 0,
        order_status: 'in_delivery', // Live Milk-Run delivery status
      });

      let totalMaterialCost = 0.0;
      let totalPurchasedQty = 0.0;
      const createdItems = [];

      // Allocate across target listings FIFO
      for (const listing of targetListings) {
        if (remainingToBuy <= 0) break;

        const takeQty = Math.min(listing.available_quantity, remainingToBuy);
        if (takeQty <= 0) continue;

        const pricePerKg = Number(listing.price_per_unit || 800.0);
        const subtotal = takeQty * pricePerKg;
        const supplierCompany = listing.company_id ? await db.companies.findById(listing.company_id) : null;

        const orderItem = await db.order_items.create({
          order_id: order.id,
          supplier_company_id: listing.company_id,
          material_listing_id: listing.id,
          quantity: takeQty,
          unit_price: pricePerKg,
          subtotal: subtotal,
        });

        createdItems.push({
          material_listing_id: listing.id,
          listing_title: listing.title,
          supplier_company_name: supplierCompany?.name || 'Mitra Pemasok Terverifikasi',
          quantity: takeQty,
          unit_price: pricePerKg,
          subtotal: subtotal,
        });

        totalMaterialCost += subtotal;
        totalPurchasedQty += takeQty;
        remainingToBuy -= takeQty;

        // Update listing remaining quantity
        const newQty = Math.max(0.0, listing.available_quantity - takeQty);
        await db.material_listings.update(listing.id, {
          available_quantity: newQty,
          status: newQty === 0 ? 'sold_out' : 'active',
        });
      }

      const platformFee = Math.round(totalMaterialCost * 0.03 * 100) / 100;
      const finalTotalAmount = totalMaterialCost + platformFee;

      await db.orders.update(order.id, {
        total_amount: finalTotalAmount,
        platform_fee: platformFee,
      });

      // Create ESG Impact Log
      const primaryListing = targetListings[0];
      const grade = primaryListing?.grade_spec?.grade || 'A';
      const co2eFactor = grade === 'A' ? 1.25 : 1.1;

      await db.impact_logs.create({
        order_id: order.id,
        buyer_company_id: order.buyer_company_id,
        category_id: primaryListing?.category_id || 'cat-wood-001',
        total_material_reused: totalPurchasedQty,
        co2_avoided_kg: totalPurchasedQty * co2eFactor,
        supplier_revenue_earned: totalMaterialCost,
        buyer_cost_saved: totalMaterialCost * 0.15,
      });

      return NextResponse.json(
        {
          id: order.id,
          buyer_company_id: order.buyer_company_id,
          total_amount: finalTotalAmount,
          platform_fee: platformFee,
          order_status: order.order_status,
          created_at: order.created_at,
          items: createdItems,
        },
        { status: 201 }
      );
    }

    // Case 2: Aggregated supply proposal conversion
    const aggregatedSupplyId = body.aggregated_supply_id;
    const agg = await db.aggregated_supplies.findById(aggregatedSupplyId);
    if (!agg) {
      return NextResponse.json(
        { detail: 'Aggregated supply proposal not found' },
        { status: 404 }
      );
    }

    if (agg.status === 'converted_to_order') {
      return NextResponse.json(
        { detail: 'Order already created for this aggregation proposal' },
        { status: 400 }
      );
    }

    const buyingReq = await db.buying_requests.findById(agg.buying_request_id);
    const aggItems = await db.aggregated_supply_items.find(
      (item) => item.aggregated_supply_id === agg.id
    );

    const order = await db.orders.create({
      aggregated_supply_id: agg.id,
      buying_request_id: buyingReq?.id,
      buyer_company_id: buyingReq?.buyer_company_id || buyerCompanyId,
      total_amount: agg.total_estimated_price,
      platform_fee: agg.platform_fee,
      order_status: 'pending_payment',
    });

    for (const item of aggItems) {
      const listing = await db.material_listings.findById(item.material_listing_id);
      await db.order_items.create({
        order_id: order.id,
        supplier_company_id: listing ? listing.company_id : null,
        material_listing_id: item.material_listing_id,
        quantity: item.allocated_quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
      });

      if (listing) {
        const newQty = Math.max(0.0, listing.available_quantity - item.allocated_quantity);
        await db.material_listings.update(listing.id, {
          available_quantity: newQty,
          status: newQty === 0 ? 'sold_out' : 'partially_aggregated',
        });
      }
    }

    await db.aggregated_supplies.update(agg.id, { status: 'converted_to_order' });
    if (buyingReq) {
      await db.buying_requests.update(buyingReq.id, { status: 'fulfilled' });
    }

    // ESG log for Case 2
    await db.impact_logs.create({
      order_id: order.id,
      buyer_company_id: order.buyer_company_id,
      category_id: buyingReq?.category_id || 'cat-wood-001',
      total_material_reused: agg.total_matched_quantity,
      co2_avoided_kg: agg.total_matched_quantity * 1.25,
      supplier_revenue_earned: agg.total_material_cost,
      buyer_cost_saved: agg.total_material_cost * 0.15,
    });

    const createdItems = await db.order_items.find((item) => item.order_id === order.id);
    const itemsRes = await Promise.all(createdItems.map(async (item) => {
      const listing = await db.material_listings.findById(item.material_listing_id);
      const supplierCompany = item.supplier_company_id ? await db.companies.findById(item.supplier_company_id) : null;
      return {
        id: item.id,
        supplier_company_id: item.supplier_company_id,
        supplier_company_name: supplierCompany?.name || '',
        material_listing_id: item.material_listing_id,
        listing_title: listing?.title || '',
        quantity: item.quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
      };
    }));

    const buyerCompany = buyingReq ? await db.companies.findById(buyingReq.buyer_company_id) : null;

    return NextResponse.json(
      {
        id: order.id,
        aggregated_supply_id: order.aggregated_supply_id,
        buying_request_id: order.buying_request_id,
        buyer_company_id: order.buyer_company_id,
        buyer_company_name: buyerCompany?.name || '',
        total_amount: order.total_amount,
        platform_fee: order.platform_fee,
        order_status: order.order_status,
        items: itemsRes,
        created_at: order.created_at,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { detail: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
