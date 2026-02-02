# Payment Flow Testing Checklist

## 🎯 Priority: Revenue System Validation

**Status**: Ready for Testing  
**Test Mode**: Paystack Test Keys Active  
**Expected Duration**: 30 minutes

---

## Manual Payment Flow Test

### Step 1: Create Test Prospect
```
1. Login: https://shadowspark-tech.org/login
   Email: architect@shadowspark-technologies.com
   Password: Motonto17$

2. Navigate to: /dashboard/sales

3. Click: "Add Prospect"

4. Fill form:
   - Company: Test Company Ltd
   - Contact Name: John Doe
   - Email: test@example.com
   - Phone: +234 800 123 4567
   - Status: ACTIVE
   - Project Type: WhatsApp Chatbot
   - Budget: ₦500,000
   - Notes: Testing payment flow

5. Click: "Save"
```

### Step 2: Generate Invoice
```
1. Click: "View" on Test Company prospect

2. Scroll to: "Invoices" section

3. Click: "Generate Invoice" button

4. Verify invoice created:
   - Invoice number: INV-XXXXX
   - Amount: ₦200,000 (40% of ₦500K)
   - Status: pending
   - Payment link visible

5. Copy payment link
```

### Step 3: Test Paystack Payment
```
Use Paystack test card:

Card Number: 5060666666666666666
Expiry: 01/30
CVV: 123
PIN: (if asked) 1234
OTP: 123456

Steps:
1. Open payment link in new tab
2. Enter test card details
3. Click "Pay"
4. Enter OTP when prompted
5. Complete payment
```

### Step 4: Verify Webhook Processing
```
Expected Results:
✅ Payment success page displayed
✅ Invoice status updates to "paid"
✅ Prospect status updates to "won"
✅ Email sent to test@example.com (check Resend logs)

Verification:
1. Return to /dashboard/sales
2. Refresh page
3. Check Test Company prospect:
   - Status badge shows "Won"
   - Invoice shows "Paid" status
   - Payment date recorded
```

---

## Webhook Verification

### Check Webhook Logs
```bash
# View recent webhook calls
vercel logs --prod | grep "webhooks/paystack"

# Expected output:
POST /api/webhooks/paystack 200
Event: charge.success
Invoice: INV-XXXXX
Status: paid
```

### Manual Webhook Test
```bash
# Test webhook endpoint directly
curl -X POST https://shadowspark-tech.org/api/webhooks/paystack \
  -H "Content-Type: application/json" \
  -H "x-paystack-signature: test_signature" \
  -d '{
    "event": "charge.success",
    "data": {
      "reference": "test_ref_123",
      "amount": 20000000,
      "status": "success",
      "metadata": {
        "invoiceNumber": "INV-00001"
      }
    }
  }'
```

---

## Test Scenarios

### ✅ Scenario 1: Happy Path
- Create prospect → Generate invoice → Pay → Verify status
- **Expected**: All updates successful

### ✅ Scenario 2: Multiple Invoices
- Create prospect → Generate 2 invoices → Pay first only
- **Expected**: Only paid invoice updates

### ✅ Scenario 3: Failed Payment
- Use declined card: 5060666666666666667
- **Expected**: Invoice remains "pending", no status change

### ✅ Scenario 4: PDF Download
- Generate invoice → Click "Download PDF"
- **Expected**: PDF downloads with correct data

---

## Known Issues & Workarounds

### Issue 1: Database Connection During Build
```
Warning: Could not fetch courses for sitemap during build
Status: Non-blocking (sitemap generation continues)
Impact: None on production functionality
```

### Issue 2: Webhook Signature Verification
```
If webhook fails with "Invalid signature":
1. Check PAYSTACK_SECRET_KEY in Vercel env
2. Verify webhook URL in Paystack dashboard
3. Ensure test mode matches key type
```

---

## Paystack Dashboard Setup

### Configure Webhook (Required)
```
1. Go to: https://dashboard.paystack.com/#/settings/developers
2. Navigate to: "Webhooks" section
3. Click: "Add Webhook"
4. Enter URL: https://shadowspark-tech.org/api/webhooks/paystack
5. Select Events:
   - ✅ charge.success
6. Mode: Test (or Live if using live keys)
7. Click: "Save"
```

### Test Cards Reference
```
Success:
5060666666666666666 (OTP: 123456)
408408408408408 (OTP: 123456)

Declined:
5060666666666666667 (insufficient funds)

Expired:
4084084084084081
```

---

## Success Criteria

### Must Pass:
- [ ] Prospect creation works
- [ ] Invoice generation creates Paystack link
- [ ] Test card payment completes
- [ ] Webhook updates invoice to "paid"
- [ ] Webhook updates prospect to "won"
- [ ] PDF download works
- [ ] Email sent (check Resend logs)

### Nice to Have:
- [ ] Webhook logs visible in Vercel
- [ ] Payment recorded in Paystack dashboard
- [ ] Activity log updated in prospect notes

---

## Troubleshooting

### Payment Link Not Showing
```
1. Check browser console for errors
2. Verify PAYSTACK_PUBLIC_KEY in .env.local
3. Check invoice.paymentUrl in database
```

### Webhook Not Firing
```
1. Verify webhook URL in Paystack dashboard
2. Check x-paystack-signature header
3. View Paystack webhook logs
4. Check Vercel function logs
```

### Invoice Not Updating
```
1. Check webhook received (Paystack logs)
2. Verify invoiceNumber in metadata
3. Check database directly:
   - Invoice status field
   - Prospect status field
```

---

## Next Steps After Testing

### If All Tests Pass:
1. Switch to live Paystack keys
2. Update webhook URL to live mode
3. Test with real ₦100 transaction
4. Create first real client invoice

### If Tests Fail:
1. Document exact failure point
2. Check error logs in Vercel
3. Review webhook payload structure
4. Test locally with ngrok tunnel

---

## Production Readiness

### Before Going Live:
- [ ] Replace test keys with live keys
- [ ] Update webhook mode to "live"
- [ ] Test ₦100 real transaction
- [ ] Verify email delivery works
- [ ] Configure Resend domain verification
- [ ] Add invoice terms & conditions
- [ ] Set up payment failure alerts

---

**Test Now**: https://shadowspark-tech.org/dashboard/sales  
**Support**: Check PAYMENT_TESTING_GUIDE.md for detailed setup
