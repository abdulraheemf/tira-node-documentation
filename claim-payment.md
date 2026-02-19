# Claim Payment

The Claim Payment resource handles claim payment submissions to TIRA. Use `tira.claimPayment` to submit claim payment details — including payment amounts, payment mode, notification status, litigation information, and claimant details — against an existing claim, and to handle TIRA's asynchronous callback responses.

For the general submit-callback-acknowledge flow, see [Callbacks & Acknowledgements](/callbacks-acknowledgements).

## Available Methods

| Method                                        | Description                                 | When to Use                                                                    | Returns                                            |
| --------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------- |
| `tira.claimPayment.submit(payload)`           | Submit a claim payment to TIRA              | After a claim has been processed and you need to record the payment            | `ClaimPaymentResponse`                             |
| `tira.claimPayment.handleCallback(input)`     | Parse and extract data from TIRA's callback | When TIRA sends the result of your submission to your callback URL             | `CallbackResult<ClaimPaymentCallbackResponse>`     |

## .submit() Payload

```ts
await tira.claimPayment.submit(payload): Promise<ClaimPaymentResponse>
```

Submits a claim payment to TIRA. This is an asynchronous operation — you receive an acknowledgement immediately, and the actual result comes later via your callback URL.

**Endpoint:** `POST /eclaim/api/claim/claim-payment/v1/request`

### Claim Payment Fields

| Field                        | Type               | Required | Default  | XML Tag                    | Description                                                              |
| ---------------------------- | ------------------ | -------- | -------- | -------------------------- | ------------------------------------------------------------------------ |
| `request_id`                 | `string`           | Yes      | —        | `RequestId`                | Unique request identifier                                                |
| `callback_url`               | `string`           | Yes      | —        | `CallBackUrl`              | Where TIRA sends results                                                 |
| `insurer_company_code`       | `string`           | Yes      | —        | `InsurerCompanyCode`       | Insurer's company code                                                   |
| `claim_payment_number`       | `string`           | Yes      | —        | `ClaimPaymentNumber`       | Claim payment number as per insurer. String(50).                         |
| `claim_reference_number`     | `string`           | Yes      | —        | `ClaimReferenceNumber`     | The TIRA claim reference number from the claim notification. String(50). |
| `claim_intimation_number`    | `string`           | Yes      | —        | `ClaimIntimationNumber`    | The claim intimation number. String(50).                                 |
| `covernote_reference_number` | `string`           | Yes      | —        | `CoverNoteReferenceNumber` | The TIRA cover note reference number the claim is against. String(50).   |
| `payment_date`               | `string\|Date`     | Yes      | —        | `PaymentDate`              | Date of the payment. See [Date Handling](#date-handling).                |
| `paid_amount`                | `number`           | Yes      | —        | `PaidAmount`               | Amount paid. Numeric(36,2).                                              |
| `payment_mode`               | `"1"\|"2"\|"3"`    | Yes      | —        | `PaymentMode`              | Payment mode. See [Payment Mode Values](#payment-mode-values).           |
| `parties_notified`           | `"Y"\|"N"`         | Yes      | —        | `PartiesNotified`          | Whether parties were notified. See [Parties Notified Values](#parties-notified-values). |
| `net_premium_earned`         | `number`           | Yes      | —        | `NetPremiumEarned`         | Net premium earned. Numeric(36,2).                                       |
| `claim_resulted_litigation`  | `"Y"\|"N"`         | Yes      | —        | `ClaimResultedLitigation`  | Whether the claim resulted in litigation. See [Litigation Values](#litigation-values). |
| `litigation_reason`          | `string`           | Yes      | —        | `LitigationReason`         | Reason for litigation. String(1000). Required even if no litigation — see [Litigation Reason](#litigation-reason). |
| `currency_code`              | `string`           | No       | `"TZS"`  | `CurrencyCode`             | ISO 4217 currency code.                                                  |
| `exchange_rate`              | `number`           | No       | `1.0`    | `ExchangeRate`             | Exchange rate to TZS. Formatted to 2 decimal places.                     |
| `claimants`                  | `SimpleClaimant[]` | Yes      | —        | `Claimants > Claimant`     | At least one claimant required. See [Claimants](#claimants).             |

::: info Auto-filled header fields
The XML header fields `CompanyCode` and `SystemCode` are automatically filled from your Tira config — you don't need to include them in the payload.
:::

### Claimants

Each claimant in the `claimants` array has the following fields:

| Field                | Type           | Required | Default | XML Tag            | Description                                                        |
| -------------------- | -------------- | -------- | ------- | ------------------ | ------------------------------------------------------------------ |
| `claimant_category`  | `"1"\|"2"`     | Yes      | —       | `ClaimantCategory` | 1=Policyholder, 2=Third Party.                                     |
| `claimant_type`      | `"1"\|"2"`     | Yes      | —       | `ClaimantType`     | 1=Individual, 2=Corporate.                                         |
| `claimant_id_number` | `string`       | Yes      | —       | `ClaimantIdNumber` | Identification number. String(50).                                 |
| `claimant_id_type`   | `"1"\|…\|"7"` | Yes      | —       | `ClaimantIdType`   | ID type. See [Identification Types](#identification-types).        |

::: info Simplified claimants
Claim payment uses a simplified claimant structure (`SimpleClaimant`) with only 4 fields. This is different from [Claim Intimation](/claim-intimation), which requires full claimant details (name, birth date, address, phone, etc.).
:::

### Identification Types

| Value | Description                              |
| ----- | ---------------------------------------- |
| `"1"` | NIN (National Identification Number)     |
| `"2"` | Voters Registration Number               |
| `"3"` | Passport Number                          |
| `"4"` | Driving License                          |
| `"5"` | Zanzibar Resident ID (ZANID)             |
| `"6"` | TIN (Tax Identification Number)          |
| `"7"` | Company Incorporation Certificate Number |

### Payment Mode Values

| Value | Description                        |
| ----- | ---------------------------------- |
| `"1"` | Cash                               |
| `"2"` | Cheque                             |
| `"3"` | EFT (Electronic Funds Transfer)    |

### Parties Notified Values

| Value | Description                                      |
| ----- | ------------------------------------------------ |
| `"Y"` | Parties were notified about the claim payment    |
| `"N"` | Parties were not notified                        |

### Litigation Values

| Value | Description                        |
| ----- | ---------------------------------- |
| `"Y"` | Claim resulted in litigation       |
| `"N"` | Claim did not result in litigation |

### Date Handling

The package automatically converts dates to East Africa Time (UTC+3) and formats them as `YYYY-MM-DDTHH:mm:ss` (no timezone suffix). You can pass either an ISO string or a JavaScript `Date` object.

::: tip Example
If you pass `"2020-09-10T10:55:22Z"` (10:55 AM UTC), the package converts it to `"2020-09-10T13:55:22"` (1:55 PM EAT).
:::

### Validation Rules

The package validates your payload before sending it to TIRA. If validation fails, it throws a `TiraValidationError` with the field name and a descriptive message.

- `request_id`, `insurer_company_code`, `claim_payment_number`, `claim_reference_number`, `claim_intimation_number`, `covernote_reference_number`, `litigation_reason` — all required strings
- `callback_url` — required and must be a valid URL
- `payment_date` — must be a valid date string (ISO format) or `Date` object
- `paid_amount`, `net_premium_earned` — must be valid numbers
- `payment_mode` — must be `"1"`, `"2"`, or `"3"`
- `parties_notified` — must be `"Y"` or `"N"`
- `claim_resulted_litigation` — must be `"Y"` or `"N"`
- `claimants` — at least one claimant is required
- Per claimant: `claimant_id_number` is required; `claimant_category` must be `"1"` or `"2"`; `claimant_type` must be `"1"` or `"2"`; `claimant_id_type` must be a valid identification type (`"1"` through `"7"`)

### Example — Submit a Claim Payment

```js
const result = await tira.claimPayment.submit({
  request_id: "AB3232532523344",
  callback_url: "https://your-server.com/tira/claim-payment-callback",
  insurer_company_code: "IC100",
  claim_payment_number: "322WQ25234234",
  claim_reference_number: "10020-25400-07720",
  claim_intimation_number: "322WQ25234234",
  covernote_reference_number: "10020-25400-07720",
  payment_date: "2020-09-10T13:55:22",
  paid_amount: 20000,
  payment_mode: "1",
  parties_notified: "Y",
  net_premium_earned: 200,
  claim_resulted_litigation: "Y",
  litigation_reason: "Claimant disputed liability and filed suit in the High Court",
  currency_code: "USD",
  exchange_rate: 2000.0,
  claimants: [
    {
      claimant_category: "2",
      claimant_type: "1",
      claimant_id_number: "24241241",
      claimant_id_type: "1",
    },
    {
      claimant_category: "2",
      claimant_type: "2",
      claimant_id_number: "3452525235525",
      claimant_id_type: "3",
    },
  ],
});

console.log(result.acknowledgement_id); // "ACK123456"
console.log(result.tira_status_code); // "TIRA001"
```

## .submit() Response

When you call `tira.claimPayment.submit()`, you get an immediate `ClaimPaymentResponse` from TIRA:

| Field                      | Type                      | Description                                |
| -------------------------- | ------------------------- | ------------------------------------------ |
| `acknowledgement_id`       | `string`                  | TIRA's acknowledgement ID                  |
| `request_id`               | `string`                  | Your original request ID (echoed back)     |
| `tira_status_code`         | `string`                  | Status code — `"TIRA001"` means received   |
| `tira_status_desc`         | `string`                  | Human-readable description                 |
| `requires_acknowledgement` | `boolean`                 | Always `true`                              |
| `acknowledgement_payload`  | `Record<string, unknown>` | Raw parsed acknowledgement (rarely needed) |

::: tip "TIRA001" means "received", not "approved"
At this stage, `"TIRA001"` means TIRA received your request and it's being processed. It does **not** mean your claim payment has been approved. The actual result comes later via your callback URL.

If you get a code other than `"TIRA001"`, something went wrong with the submission itself. Check the [Error Codes](/error-codes) page for the specific code.
:::

## .submit() Callback Response

After TIRA processes your submission, it sends the result to your `callback_url`. The callback contains the actual outcome — whether your claim payment was accepted or rejected.

### Extracted Data

The `extracted` field contains the parsed callback data:

| Field                  | Type     | Description                                                              |
| ---------------------- | -------- | ------------------------------------------------------------------------ |
| `response_id`          | `string` | TIRA's response ID                                                       |
| `request_id`           | `string` | Your original request ID                                                 |
| `response_status_code` | `string` | `"TIRA001"` = accepted. See [Error Codes](/error-codes) for other codes. |
| `response_status_desc` | `string` | Human-readable status description                                        |

### On Success

When `response_status_code` is `"TIRA001"`, the claim payment was accepted.

```js
// response_status_code === "TIRA001"
console.log(result.extracted.response_status_code); // "TIRA001"
console.log(result.extracted.response_status_desc); // "Successful"
console.log(result.extracted.request_id); // "AB3232532523344"
```

### On Error

When `response_status_code` is anything other than `"TIRA001"`, the claim payment was rejected. Check the [Error Codes](/error-codes) page for the specific code.

```js
// response_status_code !== "TIRA001"
console.log(result.extracted.response_status_code); // e.g., "TIRA020"
console.log(result.extracted.response_status_desc); // e.g., "Invalid request"
```

### Example — Handling the Callback

```js
app.post("/tira/claim-payment-callback", async (req, res) => {
  const result = await tira.claimPayment.handleCallback(req.body);

  if (result.extracted.response_status_code === "TIRA001") {
    await db.claimPayments.update({
      where: { request_id: result.extracted.request_id },
      data: { status: "accepted" },
    });
  } else {
    console.error(
      `Claim payment rejected: ${result.extracted.response_status_code}`,
      result.extracted.response_status_desc,
    );

    await db.claimPayments.update({
      where: { request_id: result.extracted.request_id },
      data: {
        status: "rejected",
        rejection_code: result.extracted.response_status_code,
        rejection_reason: result.extracted.response_status_desc,
      },
    });
  }

  // Always acknowledge — see next section
  const ackXml = tira.acknowledge(result.body, uuid());
  res.set("Content-Type", "application/xml").send(ackXml);
});
```

## .submit() Acknowledgement

TIRA expects you to acknowledge every callback. If you don't, they'll keep retrying the callback indefinitely. The package makes this easy with `tira.acknowledge()`.

### How It Works

Call `tira.acknowledge(result.body, uniqueId)` with:

| Argument      | Description                                                              |
| ------------- | ------------------------------------------------------------------------ |
| `result.body` | The `body` from the callback result — the full parsed XML as a JS object |
| `uniqueId`    | A unique string you generate (e.g., a UUID)                              |

The package automatically:

1. Derives the correct acknowledgement tag name (`ClaimPaymentRes` → `ClaimPaymentResAck`)
2. Fills in `AcknowledgementId`, `ResponseId`, `AcknowledgementStatusCode`, and `AcknowledgementStatusDesc`
3. Signs the XML with your private key
4. Wraps it in `<TiraMsg>` with `<MsgSignature>`

### What the XML Looks Like

You don't need to build this yourself — this is what the package generates:

```xml
<TiraMsg>
<ClaimPaymentResAck>
  <AcknowledgementId>your-unique-id</AcknowledgementId>
  <ResponseId>TIRA22424232355</ResponseId>
  <AcknowledgementStatusCode>TIRA001</AcknowledgementStatusCode>
  <AcknowledgementStatusDesc>Successful</AcknowledgementStatusDesc>
</ClaimPaymentResAck>
<MsgSignature>base64-encoded-signature...</MsgSignature>
</TiraMsg>
```

### Example

```js
const { v4: uuid } = require("uuid");

app.post("/tira/claim-payment-callback", async (req, res) => {
  const result = await tira.claimPayment.handleCallback(req.body);

  // Process the callback data...
  await saveToDatabase(result.extracted);

  // Build the acknowledgement XML
  const ackXml = tira.acknowledge(result.body, uuid());

  // Send it back as the HTTP response
  res.set("Content-Type", "application/xml").send(ackXml);
});
```

::: warning Always acknowledge
Even if processing the callback data fails, you should still acknowledge. Only wrap your business logic in try-catch — the callback parsing and acknowledgement should always run:

```js
app.post("/tira/claim-payment-callback", async (req, res) => {
  const result = await tira.claimPayment.handleCallback(req.body);

  try {
    await saveToDatabase(result.extracted);
  } catch (err) {
    console.error("Error saving to database:", err);
  }

  // Always runs, regardless of whether your processing succeeded
  const ackXml = tira.acknowledge(result.body, uuid());
  res.set("Content-Type", "application/xml").send(ackXml);
});
```

:::

::: danger Repetitive non-acknowledgement
TIRA monitors acknowledgement responses. Repeatedly failing to acknowledge callbacks may result in TIRA taking action against your integration. Always ensure your callback endpoint acknowledges every callback it receives.
:::

## .handleCallback() Function

```ts
await tira.claimPayment.handleCallback(input: string | Record<string, any>): Promise<CallbackResult<ClaimPaymentCallbackResponse>>
```

This function parses the callback XML that TIRA sends to your callback URL and extracts the relevant data. You can also use the universal `tira.handleCallback()` if you have a single endpoint for all callback types.

### What It Does

1. **Verifies the signature** — checks that the callback's `<MsgSignature>` matches TIRA's public key (if signature verification is configured)
2. **Parses the XML** — converts the raw XML into a JavaScript object
3. **Extracts the data** — pulls out the fields you care about (`response_status_code`, `response_id`, etc.) into a clean `extracted` object

### Input

You can pass either:

- A **raw XML string** — the `req.body` from your Express handler (requires `express.text({ type: "application/xml" })` middleware)
- A **pre-parsed object** — if you've already parsed the XML yourself

### What It Returns

| Field                | Type                                   | Description                                                             |
| -------------------- | -------------------------------------- | ----------------------------------------------------------------------- |
| `type`               | `"claim_payment"`                      | Always `"claim_payment"` for this handler                               |
| `extracted`          | `ClaimPaymentCallbackResponse`         | The extracted data (see [Callback Response](#submit-callback-response)) |
| `body`               | `Record<string, any>`                  | Full parsed XML as JS object — pass this to `tira.acknowledge()`        |
| `signature_verified` | `boolean`                              | Whether TIRA's digital signature was verified                           |
| `raw_xml`            | `string`                               | The original XML string                                                 |

### Resource-Specific vs Universal Handler

| Approach          | Method                                        | When to Use                                                                                |
| ----------------- | --------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Resource-specific | `tira.claimPayment.handleCallback(input)`     | When you have separate endpoints per resource type                                         |
| Universal         | `tira.handleCallback(input)`                  | When you have one endpoint for all TIRA callbacks (requires `enabled_callbacks` in config)  |

Both return the same data. The universal handler auto-detects the callback type. See [Callbacks & Acknowledgements](/callbacks-acknowledgements) for details on the universal handler.

## Full Example

A complete Express.js application that submits a claim payment, handles the callback, and acknowledges it.

```js
const express = require("express");
const { Tira } = require("tira-node");
const { v4: uuid } = require("uuid");

const app = express();
app.use(express.text({ type: "application/xml" }));
app.use(express.json());

const tira = new Tira({
  base_url: process.env.TIRA_BASE_URL,
  client_code: process.env.TIRA_CLIENT_CODE,
  client_key: process.env.TIRA_CLIENT_KEY,
  system_code: process.env.TIRA_SYSTEM_CODE,
  transacting_company_code: process.env.TIRA_COMPANY_CODE,
  client_private_pfx_path: "./certs/tiramisclientprivate.pfx",
  client_private_pfx_passphrase: process.env.TIRA_PFX_PASSPHRASE,
  tira_public_pfx_path: "./certs/tiramispublic.pfx",
  tira_public_pfx_passphrase: process.env.TIRA_PUBLIC_PFX_PASSPHRASE,
});

// Submit a claim payment
app.post("/submit-claim-payment", async (req, res) => {
  const result = await tira.claimPayment.submit({
    request_id: uuid(),
    callback_url: "https://your-server.com/tira/claim-payment-callback",
    insurer_company_code: "IC100",
    claim_payment_number: req.body.claim_payment_number,
    claim_reference_number: req.body.claim_reference_number,
    claim_intimation_number: req.body.claim_intimation_number,
    covernote_reference_number: req.body.covernote_reference_number,
    payment_date: req.body.payment_date,
    paid_amount: req.body.paid_amount,
    payment_mode: req.body.payment_mode,
    parties_notified: req.body.parties_notified,
    net_premium_earned: req.body.net_premium_earned,
    claim_resulted_litigation: req.body.claim_resulted_litigation,
    litigation_reason: req.body.litigation_reason,
    currency_code: req.body.currency_code,
    exchange_rate: req.body.exchange_rate,
    claimants: req.body.claimants,
  });

  res.json({
    message: "Submitted to TIRA",
    acknowledgement_id: result.acknowledgement_id,
    status: result.tira_status_code,
  });
});

// Handle TIRA's callback and acknowledge
app.post("/tira/claim-payment-callback", async (req, res) => {
  const result = await tira.claimPayment.handleCallback(req.body);

  try {
    await db.claimPayments.update({
      where: { request_id: result.extracted.request_id },
      data: { status: result.extracted.response_status_code },
    });
  } catch (err) {
    console.error("Error saving to database:", err);
  }

  // Acknowledge — always, regardless of whether processing succeeded
  const ackXml = tira.acknowledge(result.body, uuid());
  res.set("Content-Type", "application/xml").send(ackXml);
});

app.listen(3000);
```

## Special Cases

### Currency and Exchange Rate

By default, `currency_code` is `"TZS"` and `exchange_rate` is `1.0`. If the claim payment involves a foreign currency:

```js
{
  currency_code: "USD",
  exchange_rate: 2000.0, // 1 USD = 2000 TZS
  paid_amount: 20000,
  net_premium_earned: 200,
}
```

All monetary amounts (`paid_amount`, `net_premium_earned`) should be in the specified currency. The exchange rate is formatted to 2 decimal places in the XML.

### Litigation Reason

The `litigation_reason` field is always required, even when `claim_resulted_litigation` is `"N"`. This is because the package validates it unconditionally.

```js
// Claim resulted in litigation
{
  claim_resulted_litigation: "Y",
  litigation_reason: "Claimant disputed liability and filed suit in the High Court",
}

// No litigation — still must provide a reason
{
  claim_resulted_litigation: "N",
  litigation_reason: "No litigation arose from this claim",
}
```

Omitting `litigation_reason` or passing an empty string will throw a `TiraValidationError` regardless of the `claim_resulted_litigation` value.

### Simplified Claimants

Unlike [Claim Intimation](/claim-intimation) which requires full claimant details (name, birth date, address, phone number, etc.), claim payment uses a simplified claimant structure with only 4 fields:

```js
claimants: [
  {
    claimant_category: "1", // Policyholder
    claimant_type: "1",     // Individual
    claimant_id_number: "24241241",
    claimant_id_type: "1",  // NIN
  },
]
```

This is because claimant details were already captured during the claim intimation step.

### Payment Modes

The `payment_mode` field describes how the claim payment was disbursed to the claimant:

```js
// Cash payment
{ payment_mode: "1" }

// Payment by cheque
{ payment_mode: "2" }

// Electronic funds transfer
{ payment_mode: "3" }
```

## Common Mistakes

::: danger Forgetting to acknowledge the callback
TIRA retries callbacks indefinitely until you acknowledge them. Always call `tira.acknowledge(result.body, uuid())` and return the XML, even if processing the callback data failed.
:::

::: danger Missing XML middleware
Without `express.text({ type: "application/xml" })`, your callback `req.body` will be empty and parsing will fail. Add this middleware before your callback route.
:::

::: danger Confusing submission acknowledgement with approval
`"TIRA001"` in the submission response means "received", not "approved". The actual approval or rejection comes later via the callback. Don't tell your users their claim payment is accepted at submission time.
:::

::: danger Invalid callback URL
The `callback_url` must be a valid, publicly accessible URL. The package validates the URL format before sending. If the URL is malformed, you'll get a `TiraValidationError`. If it's valid but unreachable by TIRA, you'll never receive the callback.
:::

::: danger Missing claim reference numbers
The `claim_reference_number` must be the one returned by TIRA in the claim notification callback, `claim_intimation_number` must match a previously submitted intimation, and `covernote_reference_number` must reference a valid cover note. Using incorrect or missing reference numbers will cause TIRA to reject the payment.
:::

::: danger Empty claimants array
At least one claimant is required. Passing an empty array or omitting `claimants` will throw a `TiraValidationError`.
:::

## Related Pages

- [Callbacks & Acknowledgements](/callbacks-acknowledgements) — The full callback lifecycle
- [Signing & Verification](/signing-verification) — How digital signatures work
- [Error Codes](/error-codes) — All TIRA status codes and fixes
- [Initialization](/initialization) — Setting up the Tira client
