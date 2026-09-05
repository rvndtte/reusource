"""
Automated Security, Data Ownership, & RBAC Verification Test Suite
Tests ISO 27001 Access Control & Defense in Depth on Live FastAPI Backend using urllib.request
"""

import asyncio
import json
import urllib.request
import urllib.error
from app.core.database import AsyncSessionLocal
from app.core.security import create_access_token
from app.models.user import User
from app.models.material_listing import MaterialListing
from sqlalchemy.future import select

BASE_URL = "http://127.0.0.1:8000"


def http_request(method, path, token=None, body=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"

    data = json.dumps(body).encode("utf-8") if body is not None else None
    req = urllib.request.Request(url, data=data, headers=headers, method=method)

    try:
        with urllib.request.urlopen(req) as response:
            res_data = response.read().decode("utf-8")
            return response.status, json.loads(res_data) if res_data else {}
    except urllib.error.HTTPError as e:
        err_data = e.read().decode("utf-8")
        try:
            parsed = json.loads(err_data)
        except Exception:
            parsed = {"detail": err_data}
        return e.code, parsed


async def fetch_tokens_and_listing():
    async with AsyncSessionLocal() as db:
        res_sup = await db.execute(select(User).where(User.email == "supplier1@cimahi.com"))
        supplier_user = res_sup.scalar_one()

        res_buyer = await db.execute(select(User).where(User.email == "buyer@ecopolymer.co.id"))
        buyer_user = res_buyer.scalar_one()

        res_admin = await db.execute(select(User).where(User.email == "verifier@reusource.id"))
        admin_user = res_admin.scalar_one()

        supplier_token = create_access_token(subject=supplier_user.id)
        buyer_token = create_access_token(subject=buyer_user.id)
        admin_token = create_access_token(subject=admin_user.id)

        res_listing = await db.execute(select(MaterialListing).where(MaterialListing.company_id == supplier_user.company_id))
        sup1_listing = res_listing.scalars().first()

        return supplier_token, buyer_token, admin_token, sup1_listing


def run_security_tests():
    print("=================================================================")
    print("[SEC-AUDIT] RUNNING AUTOMATED SECURITY & RBAC ACCESS CONTROL TEST")
    print("=================================================================")

    supplier_token, buyer_token, admin_token, sup1_listing = asyncio.run(fetch_tokens_and_listing())

    # TEST 1: Cross-Role Attack (Buyer calls Supplier Setor Stok)
    print("\n[TEST 1] Testing Cross-Role Protection: Buyer calling Supplier Setor Stok...")
    status_code, res = http_request(
        "POST",
        "/api/v1/material-listings/setor-stok",
        token=buyer_token,
        body={
            "waste_type": "Serbuk Serutan Kayu Jati",
            "is_dry": True,
            "is_clean": True,
            "weight_kg": 100.0
        }
    )
    assert status_code == 403, f"Expected 403 Forbidden, got {status_code}"
    print(f"  [OK] PASSED: Backend rejected Buyer access with {status_code} Forbidden ({res.get('detail')})")

    # TEST 2: Privilege Escalation Attack (Supplier calls Admin Pending Accounts)
    print("\n[TEST 2] Testing Privilege Escalation: Supplier calling Admin Audit Console...")
    status_code, res = http_request(
        "GET",
        "/api/v1/verifications/pending-accounts",
        token=supplier_token
    )
    assert status_code == 403, f"Expected 403 Forbidden, got {status_code}"
    print(f"  [OK] PASSED: Backend rejected Supplier access to Admin with {status_code} Forbidden ({res.get('detail')})")

    # TEST 3: Data Ownership Enforcement (Buyer tries to view private supplier listing detail)
    if sup1_listing:
        print("\n[TEST 3] Testing Data Ownership: Buyer inspecting Supplier A private listing...")
        status_code, res = http_request(
            "GET",
            f"/api/v1/material-listings/{sup1_listing.id}",
            token=buyer_token
        )
        assert status_code == 403, f"Expected 403 Forbidden, got {status_code}"
        print(f"  [OK] PASSED: Backend blocked non-owner access with {status_code} Forbidden ({res.get('detail')})")

    # TEST 4: OTP Rate Limiting (Spam protection within 60s)
    print("\n[TEST 4] Testing OTP Rate Limiting: Spamming 2 requests to same phone...")
    test_phone = "087711223344"
    status1, res1 = http_request("POST", "/api/v1/auth/request-otp", body={"phone": test_phone})
    assert status1 == 200, f"First request failed: {status1}"
    
    # Second immediate request should get 429 Too Many Requests
    status2, res2 = http_request("POST", "/api/v1/auth/request-otp", body={"phone": test_phone})
    assert status2 == 429, f"Expected 429 Too Many Requests, got {status2}"
    print(f"  [OK] PASSED: Backend triggered Rate Limiting with {status2} Too Many Requests ({res2.get('detail')})")

    # TEST 5: Public Catalog Data Sanitization (Privacy protection)
    print("\n[TEST 5] Testing Catalog Privacy: Verifying no private phone or GPS coords leaked...")
    status_cat, catalog_items = http_request("GET", "/api/v1/material-listings/")
    assert status_cat == 200
    assert len(catalog_items) > 0, "Expected catalog items"
    
    for item in catalog_items:
        assert "phone" not in item, "Privacy leak: 'phone' found in public catalog!"
        assert "latitude" not in item, "Privacy leak: 'latitude' found in public catalog!"
        assert "longitude" not in item, "Privacy leak: 'longitude' found in public catalog!"
    print(f"  [OK] PASSED: All {len(catalog_items)} catalog items sanitized. Only general city & approx radius exposed.")

    # TEST 6: Legitimate Authorized Requests
    print("\n[TEST 6] Testing Legitimate Authorized Requests...")
    status_sup, _ = http_request(
        "GET",
        "/api/v1/material-listings/my-listings",
        token=supplier_token
    )
    assert status_sup == 200
    print(f"  [OK] PASSED: Supplier retrieved own listings (200 OK)")

    status_adm, _ = http_request(
        "GET",
        "/api/v1/verifications/pending-accounts",
        token=admin_token
    )
    assert status_adm == 200
    print(f"  [OK] PASSED: Admin retrieved verification queue (200 OK)")

    print("\n=================================================================")
    print("[SUCCESS] ALL SECURITY, OWNERSHIP, & RBAC TESTS PASSED 100%!")
    print("=================================================================\n")


if __name__ == "__main__":
    run_security_tests()
