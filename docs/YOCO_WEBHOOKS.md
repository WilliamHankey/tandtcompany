# Yoco webhook setup

Yoco Checkout API webhooks are registered through the API, not through the
Yoco dashboard. The production receiver in this project is:

```text
https://YOUR_DEPLOYED_DOMAIN/api/yoco/webhook
```

## 1. Configure the registration guard

Generate a random value locally and add it to the production environment as
`YOCO_WEBHOOK_REGISTRATION_TOKEN`:

```bash
openssl rand -hex 32
```

`YOCO_SECRET_KEY`, `SANITY_API_TOKEN`, the Sanity variables, and the Resend
variables must also be configured in the production environment.

## 2. Deploy, then register the webhook once

Replace the token below with the value configured in step 1:

```bash
curl --request POST \
  --url https://YOUR_DEPLOYED_DOMAIN/api/yoco/register-webhook \
  --header "Authorization: Bearer YOUR_REGISTRATION_TOKEN" \
  --header "Content-Type: application/json" \
  --data '{
    "name": "tandtcompany-production",
    "url": "https://YOUR_DEPLOYED_DOMAIN/api/yoco/webhook"
  }'
```

The response contains a `secret` beginning with `whsec_`. Yoco returns that
value only once. Save it immediately as `YOCO_WEBHOOK_SECRET` in the production
environment, then redeploy so the receiver can verify Yoco signatures.

Do not register the same URL repeatedly. Yoco recommends one webhook and limits
an account to five. To inspect existing registrations directly:

```bash
curl --request GET \
  --url https://payments.yoco.com/api/webhooks \
  --header "Authorization: Bearer YOUR_YOCO_SECRET_KEY"
```

## 3. Test the complete flow

1. Start a test checkout from the storefront and complete payment with Yoco's
   test credentials.
2. Open the matching `order` document in Sanity.
3. Confirm `status` is `paid` and the Yoco section contains the checkout,
   payment, and webhook event IDs.
4. Confirm the customer received one order-confirmation email.

The receiver validates the raw-body HMAC signature, rejects timestamps older
than three minutes, checks that the Checkout ID belongs to a Sanity order,
checks amount and currency, and handles Yoco retries idempotently.
