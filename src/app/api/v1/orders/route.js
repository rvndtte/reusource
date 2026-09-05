import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const buyerCompanyId = searchParams.get('buyer_company_id');

    const orders = db.orders.find((o) => {
      if (buyerCompanyId && o.buyer_company_id !== buyerCompanyId) return false;
      return true;
    });

    const response = orders.map((o) => {
      const items = db.order_items.find((item) => item.order_id === o.id);
      const buyerCompany = db.companies.findById(o.buyer_company_id);

      const itemsRes = items.map((item) => {
        const listing = db.material_listings.findById(item.material_listing_id);
        const supplierCompany = item.supplier_company_id ? db.companies.findById(item.supplier_company_id) : null;
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
      });

      return {
        id: o.id,
        aggregated_supply_id: o.aggregated_supply_id,
        buying_request_id: o.buying_request_id,
        buyer_company_id: o.buyer_company_id,
        buyer_company_name: buyerCompany?.name || '',
        total_amount: o.total_amount,
        platform_fee: o.platform_fee,
        order_status: o.order_status,
        items: itemsRes,
        created_at: o.created_at,
      };
    });

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
    const { searchParams } = new URL(request.url);
    const body = await request.json().catch(() => ({}));
    const buyerCompanyId = body.buyer_company_id || searchParams.get('buyer_company_id') || searchParams.get('company_id');

    // Case 1: Direct purchase of listing / cluster from Buyer Catalog
    if (body.material_listing_id || body.listing_id) {
      const listingId = body.material_listing_id || body.listing_id;
      const listing = db.material_listings.findById(listingId);
      if (!listing) {
        return NextResponse.json({ detail: 'Material listing not found' }, { status: 404 });
      }

      const qty = Number(body.quantity || listing.available_quantity || 100);
      const pricePerKg = Number(listing.price_per_unit || (listing.grade_spec?.grade === 'A' ? 800 : 450));
      const totalAmount = qty * pricePerKg;
      const fee = totalAmount * 0.03;

      const order = db.orders.create({
        buyer_company_id: buyerCompanyId || 'comp-buy-001',
        total_amount: totalAmount + fee,
        platform_fee: fee,
        order_status: 'in_delivery', // Live Milk-Run delivery status
      });

      const supplierCompany = listing.company_id ? db.companies.findById(listing.company_id) : null;

      db.order_items.create({
        order_id: order.id,
        supplier_company_id: listing.company_id,
        material_listing_id: listing.id,
        quantity: qty,
        unit_price: pricePerKg,
        subtotal: totalAmount,
      });

      // Update listing remaining quantity
      const newQty = Math.max(0.0, listing.available_quantity - qty);
      db.material_listings.update(listing.id, {
        available_quantity: newQty,
        status: newQty === 0 ? 'sold_out' : 'active',
      });

      // Create ESG Impact Log
      db.impact_logs.create({
        order_id: order.id,
        buyer_company_id: order.buyer_company_id,
        category_id: listing.category_id,
        total_material_reused: qty,
        co2_avoided_kg: qty * (listing.grade_spec?.grade === 'A' ? 1.25 : 1.1),
        supplier_revenue_earned: totalAmount,
        buyer_cost_saved: totalAmount * 0.15,
      });

      return NextResponse.json(
        {
          id: order.id,
          buyer_company_id: order.buyer_company_id,
          total_amount: order.total_amount,
          platform_fee: order.platform_fee,
          order_status: order.order_status,
          created_at: order.created_at,
          items: [
            {
              material_listing_id: listing.id,
              listing_title: listing.title,
              supplier_company_name: supplierCompany?.name || 'Mitra Pemasok Terverifikasi',
              quantity: qty,
              unit_price: pricePerKg,
              subtotal: totalAmount,
            },
          ],
        },
        { status: 201 }
      );
    }

    // Case 2: Aggregated supply proposal conversion
    const aggregatedSupplyId = body.aggregated_supply_id;
    const agg = db.aggregated_supplies.findById(aggregatedSupplyId);
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

    const buyingReq = db.buying_requests.findById(agg.buying_request_id);
    const aggItems = db.aggregated_supply_items.find(
      (item) => item.aggregated_supply_id === agg.id
    );

    const order = db.orders.create({
      aggregated_supply_id: agg.id,
      buying_request_id: buyingReq?.id,
      buyer_company_id: buyingReq?.buyer_company_id || buyerCompanyId,
      total_amount: agg.total_estimated_price,
      platform_fee: agg.platform_fee,
      order_status: 'pending_payment',
    });

    for (const item of aggItems) {
      const listing = db.material_listings.findById(item.material_listing_id);
      db.order_items.create({
        order_id: order.id,
        supplier_company_id: listing ? listing.company_id : null,
        material_listing_id: item.material_listing_id,
        quantity: item.allocated_quantity,
        unit_price: item.unit_price,
        subtotal: item.subtotal,
      });

      if (listing) {
        const newQty = Math.max(0.0, listing.available_quantity - item.allocated_quantity);
        db.material_listings.update(listing.id, {
          available_quantity: newQty,
          status: newQty === 0 ? 'sold_out' : 'partially_aggregated',
        });
      }
    }

    db.aggregated_supplies.update(agg.id, { status: 'converted_to_order' });
    if (buyingReq) {
      db.buying_requests.update(buyingReq.id, { status: 'fulfilled' });
    }

    const createdItems = db.order_items.find((item) => item.order_id === order.id);
    const itemsRes = createdItems.map((item) => {
      const listing = db.material_listings.findById(item.material_listing_id);
      const supplierCompany = item.supplier_company_id ? db.companies.findById(item.supplier_company_id) : null;
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
    });

    const buyerCompany = buyingReq ? db.companies.findById(buyingReq.buyer_company_id) : null;

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
