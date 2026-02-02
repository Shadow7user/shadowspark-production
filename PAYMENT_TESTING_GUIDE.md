# Payment Testing Guide

## ✅ Deployment Complete

**Production URL**: https://shadowspark-tech.org  
**New Service**: https://shadowspark-tech.org/services/apps

---

## Paystack Test Mode Active

### Test Credentials

```
Public Key: pk_test_8e802731daf4ea91b37e62601588ba309ce632be
Secret Key: sk_test_bcdaff0464f8d755e0f249718d726945f2c4ee25
```

### Resend API

```
API Key: re_ijrrDfJb_Pr28Yao9UpEnU77ipajQE49s
```

---

## Test Payment Flow

### Step 1: Create Prospect

1. Go to https://shadowspark-tech.org/dashboard/sales
2. Click "Add Prospect"
3. Fill in details:
   - Company: Test Company Ltd
   - Contact: John Doe
   - Email: john@testcompany.com
   - Phone: +234 800 123 4567
   - Project Type: Mobile App Development
   - Budget: ₦2,000,000

### Step 2: Generate Invoice

1. Open the prospect you just created
2. Scroll to "Invoices" section
3. Click "Generate Invoice"
4. Invoice will be created with:
   - 40% deposit (₦800,000)
   - Paystack payment link
   - Email sent to john@testcompany.com

### Step 3: Test Payment

Use Paystack test card:

```
Card Number: 5060666666666666666
Expiry: 01/30
CVV: 123
OTP: 123456
```

**Steps:**

1. Click payment link in email or copy from invoice detail
2. Enter test card details
3. Submit payment
4. Enter OTP: 123456
5. Complete payment

### Step 4: Verify Webhook

After successful payment:

- Invoice status should update to "paid"
- Prospect status should update to "won"
- Check in dashboard at `/dashboard/sales`

---

## Webhook Configuration

### Production Webhook URL

```
https://shadowspark-tech.org/api/webhooks/paystack
```

### Setup in Paystack Dashboard

1. Go to https://dashboard.paystack.com/#/settings/developers
2. Click "API Keys & Webhooks"
3. Scroll to "Webhook Settings"
4. Click "Add Webhook"
5. Enter URL: `https://shadowspark-tech.org/api/webhooks/paystack`
6. Select Events:
   - ✅ charge.success
7. Click "Save"

---

## Test Scenarios

### Scenario 1: Basic Invoice Payment

- Create prospect → Generate invoice → Pay with test card
- Expected: Invoice status = "paid", Prospect status = "won"

### Scenario 2: Multiple Invoices

- Create prospect → Generate 2 invoices
- Pay first invoice only
- Expected: Only paid invoice status updates

### Scenario 3: Course Purchase (EdTech)

- Go to course page
- Click "Enroll Now"
- Pay with test card
- Expected: Payment record + Enrollment record created

---

## Troubleshooting

### Webhook Not Firing

1. Check Paystack webhook logs at https://dashboard.paystack.com/#/settings/developers
2. Verify webhook URL is correct
3. Ensure charge.success event is selected
4. Check Vercel logs: `vercel logs --prod`

### Invoice Not Updating

1. Check webhook received in Paystack dashboard
2. Verify invoice.invoiceNumber in payment metadata
3. Check API logs in Vercel

### Email Not Sending

1. Verify RESEND_API_KEY is correct
2. Check Resend logs at https://resend.com/logs
3. Confirm email domain is verified

---

## Production Checklist

### ✅ Completed

- [x] New mobile/system app service page created
- [x] Services listing updated with 4th service
- [x] Comparison table includes Apps column
- [x] Paystack test keys configured
- [x] Resend API key configured
- [x] Changes deployed to production

### ⏳ Pending

- [ ] Configure webhook URL in Paystack dashboard
- [ ] Test payment flow end-to-end
- [ ] Verify email delivery
- [ ] Switch to live keys when ready for real payments

---

## Going Live

When ready to accept real payments:

1. **Get Live API Keys**
   - Go to Paystack dashboard
   - Copy live keys (pk_live_xxx, sk_live_xxx)

2. **Update Vercel Environment**

   ```bash
   vercel env rm PAYSTACK_SECRET_KEY production
   vercel env rm PAYSTACK_PUBLIC_KEY production

   echo "sk_live_your_key" | vercel env add PAYSTACK_SECRET_KEY production
   echo "pk_live_your_key" | vercel env add PAYSTACK_PUBLIC_KEY production

   vercel --prod
   ```

3. **Update Webhook**
   - Update webhook URL in Paystack to use live mode
   - Same URL, just toggle mode in dashboard

---

## Support

- **Paystack Docs**: https://paystack.com/docs/api
- **Resend Docs**: https://resend.com/docs
- **Test Cards**: https://paystack.com/docs/payments/test-payments

---

**Status**: ✅ Ready for Testing  
**Test Mode**: Active  
**Production URL**: https://shadowspark-tech.org
