# Discharge Voucher

The Discharge Voucher resource handles discharge voucher submissions to TIRA. Use `tira.dischargeVoucher` to submit discharge voucher details — including claim offer amounts, adjustment information, reconciliation data, and claimant details — against an existing claim assessment, and to handle TIRA's asynchronous callback responses.

For the general submit-callback-acknowledge flow, see [Callbacks & Acknowledgements](/callbacks-acknowledgements).

## Available Methods

| Method                                          | Description                                 | When to Use                                                                         | Returns                                              |
| ----------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------- | ---------------------------------------------------- |
| `tira.dischargeVoucher.submit(payload)`         | Submit a discharge voucher to TIRA          | After a claim assessment has been submitted and you have discharge voucher details   | `DischargeVoucherResponse`                           |
| `tira.dischargeVoucher.handleCallback(input)`   | Parse and extract data from TIRA's callback | When TIRA sends the result of your submission to your callback URL                  | `CallbackResult<DischargeVoucherCallbackResponse>`   |

## .submit() Payload

```ts
await tira.dischargeVoucher.submit(payload): Promise<DischargeVoucherResponse>
```

Submits a discharge voucher to TIRA. This is an asynchronous operation — you receive an acknowledgement immediately, and the actual result comes later via your callback URL.

**Endpoint:** `POST /eclaim/api/claim/claim-dischargevoucher/v1/request`

### Discharge Voucher Fields

| Field                            | Type           | Required | Default | XML Tag                       | Description                                                                    |
| -------------------------------- | -------------- | -------- | ------- | ----------------------------- | ------------------------------------------------------------------------------ |
| `request_id`                     | `string`       | Yes      | —       | `RequestId`                   | Unique request identifier                                                      |
| `callback_url`                   | `string`       | Yes      | —       | `CallBackUrl`                 | Where TIRA sends results                                                       |
| `insurer_company_code`           | `string`       | Yes      | —       | `InsurerCompanyCode`          | Insurer's company code                                                         |
| `discharge_voucher_number`       | `string`       | Yes      | —       | `DischargeVoucherNumber`      | Discharge voucher number as per insurer. String(50).                           |
| `claim_assessment_number`        | `string`       | Yes      | —       | `ClaimAssessmentNumber`       | The claim assessment number this voucher is for. String(50).                   |
| `claim_reference_number`         | `string`       | Yes      | —       | `ClaimReferenceNumber`        | The TIRA claim reference number from the claim notification. String(50).       |
| `covernote_reference_number`     | `string`       | Yes      | —       | `CoverNoteReferenceNumber`    | The TIRA cover note reference number the claim is against. String(50).         |
| `discharge_voucher_date`         | `string\|Date` | Yes      | —       | `DischargeVoucherDate`        | Date of the discharge voucher. See [Date Handling](#date-handling).             |
| `currency_code`                  | `string`       | No       | `"TZS"` | `CurrencyCode`                | ISO 4217 currency code.                                                        |
| `exchange_rate`                  | `number`       | No       | `1.0`   | `ExchangeRate`                | Exchange rate to TZS. Formatted to 2 decimal places.                           |
| `claim_offer_communication_date` | `string\|Date` | Yes      | —       | `ClaimOfferCommunicationDate` | Date the claim offer was communicated. See [Date Handling](#date-handling).     |
| `claim_offer_amount`             | `number`       | Yes      | —       | `ClaimOfferAmount`            | Amount offered to the claimant. Numeric(36,2).                                 |
| `claimant_response_date`         | `string\|Date` | Yes      | —       | `ClaimantResponseDate`        | Date the claimant responded. See [Date Handling](#date-handling).               |
| `adjustment_date`                | `string\|Date` | Yes      | —       | `AdjustmentDate`              | Date of the adjustment. See [Date Handling](#date-handling).                    |
| `adjustment_reason`              | `string`       | Yes      | —       | `AdjustmentReason`            | Reason for the adjustment. String(1000).                                       |
| `adjustment_amount`              | `number`       | Yes      | —       | `AdjustmentAmount`            | Adjustment amount. Numeric(36,2).                                              |
| `reconciliation_date`            | `string\|Date` | Yes      | —       | `ReconciliationDate`          | Date of the reconciliation. See [Date Handling](#date-handling).                |
| `reconciliation_summary`         | `string`       | Yes      | —       | `ReconciliationSummary`       | Summary of the reconciliation. String(1000).                                   |
| `reconciled_amount`              | `number`       | Yes      | —       | `ReconciledAmount`            | Final reconciled amount. Numeric(36,2).                                        |
| `offer_accepted`                 | `"Y"\|"N"`     | Yes      | —       | `OfferAccepted`               | Whether the claimant accepted the offer. Y=Yes, N=No.                          |
| `claimants`                      | `SimpleClaimant[]` | Yes  | —       | `Claimants > Claimant`        | At least one claimant required. See [Claimants](#claimants).                   |

::: info Auto-filled header fields
The XML header fields `CompanyCode` and `SystemCode` are automatically filled from your Tira config — you don't need to include them in the payload.
:::

### Claimants

Each claimant in the `claimants` array has the following fields:

| Field                | Type          | Required | Default | XML Tag            | Description                                                        |
| -------------------- | ------------- | -------- | ------- | ------------------ | ------------------------------------------------------------------ |
| `claimant_category`  | `"1"\|"2"`    | Yes      | —       | `ClaimantCategory` | 1=Policyholder, 2=Third Party.                                     |
| `claimant_type`      | `"1"\|"2"`    | Yes      | —       | `ClaimantType`     | 1=Individual, 2=Corporate.                                         |
| `claimant_id_number` | `string`      | Yes      | —       | `ClaimantIdNumber` | Identification number. String(50).                                 |
| `claimant_id_type`   | `"1"\|…\|"7"` | Yes      | —       | `ClaimantIdType`   | ID type. See [Identification Types](#identification-types).        |

::: info Simplified claimants
Discharge voucher uses a simplified claimant structure (`SimpleClaimant`) with only 4 fields. This is different from [Claim Intimation](/claim-intimation), which requires full claimant details (name, birth date, address, phone, etc.).
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

### Offer Accepted Values

| Value | Description                        |
| ----- | ---------------------------------- |
| `"Y"` | Claimant accepted the offer        |
| `"N"` | Claimant did not accept the offer  |

### Date Handling

The package automatically converts dates to East Africa Time (UTC+3) and formats them as `YYYY-MM-DDTHH:mm:ss` (no timezone suffix). You can pass either an ISO string or a JavaScript `Date` object.

::: tip Example
If you pass `"2020-09-10T10:55:22Z"` (10:55 AM UTC), the package converts it to `"2020-09-10T13:55:22"` (1:55 PM EAT).
:::

### Validation Rules

The package validates your payload before sending it to TIRA. If validation fails, it throws a `TiraValidationError` with the field name and a descriptive message.

- `request_id`, `insurer_company_code`, `discharge_voucher_number`, `claim_assessment_number`, `claim_reference_number`, `covernote_reference_number`, `adjustment_reason`, `reconciliation_summary` — all required strings
- `callback_url` — required and must be a valid URL
- `discharge_voucher_date`, `claim_offer_communication_date`, `claimant_response_date`, `adjustment_date`, `reconciliation_date` — must be valid date strings (ISO format) or `Date` objects
- `claim_offer_amount`, `adjustment_amount`, `reconciled_amount` — must be valid numbers
- `offer_accepted` — must be `"Y"` or `"N"`
- `claimants` — at least one claimant is required
- Per claimant: `claimant_id_number` is required; `claimant_category` must be `"1"` or `"2"`; `claimant_type` must be `"1"` or `"2"`; `claimant_id_type` must be a valid identification type (`"1"` through `"7"`)

### Example — Submit a Discharge Voucher

```js
const result = await tira.dischargeVoucher.submit({
  request_id: "AB3232532523344",
  callback_url: "https://your-server.com/tira/discharge-voucher-callback",
  insurer_company_code: "IC100",
  discharge_voucher_number: "322WQ25234234",
  claim_assessment_number: "322WQ252323423q4",
  claim_reference_number: "10020-25400-07720",
  covernote_reference_number: "10020-25400-07720",
  discharge_voucher_date: "2020-09-10T13:55:22",
  currency_code: "USD",
  exchange_rate: 2000.0,
  claim_offer_communication_date: "2020-09-10T13:55:22",
  claim_offer_amount: 5000000,
  claimant_response_date: "2020-09-10T13:55:22",
  adjustment_date: "2020-09-10T13:55:22",
  adjustment_reason: "Adjustment after further review of claim documentation",
  adjustment_amount: 1000000.0,
  reconciliation_date: "2020-09-10T13:55:22",
  reconciliation_summary: "Final reconciliation after adjustment and claimant negotiation",
  reconciled_amount: 200000,
  offer_accepted: "N",
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

When you call `tira.dischargeVoucher.submit()`, you get an immediate `DischargeVoucherResponse` from TIRA:

| Field                      | Type                      | Description                                |
| -------------------------- | ------------------------- | ------------------------------------------ |
| `acknowledgement_id`       | `string`                  | TIRA's acknowledgement ID                  |
| `request_id`               | `string`                  | Your original request ID (echoed back)     |
| `tira_status_code`         | `string`                  | Status code — `"TIRA001"` means received   |
| `tira_status_desc`         | `string`                  | Human-readable description                 |
| `requires_acknowledgement` | `boolean`                 | Always `true`                              |
| `acknowledgement_payload`  | `Record<string, unknown>` | Raw parsed acknowledgement (rarely needed) |

::: tip "TIRA001" means "received", not "approved"
At this stage, `"TIRA001"` means TIRA received your request and it's being processed. It does **not** mean your discharge voucher has been approved. The actual result comes later via your callback URL.

If you get a code other than `"TIRA001"`, something went wrong with the submission itself. Check the [Error Codes](/error-codes) page for the specific code.
:::

## .submit() Callback Response

After TIRA processes your submission, it sends the result to your `callback_url`. The callback contains the actual outcome — whether your discharge voucher was accepted or rejected.

### Extracted Data

The `extracted` field contains the parsed callback data:

| Field                  | Type     | Description                                                              |
| ---------------------- | -------- | ------------------------------------------------------------------------ |
| `response_id`          | `string` | TIRA's response ID                                                       |
| `request_id`           | `string` | Your original request ID                                                 |
| `response_status_code` | `string` | `"TIRA001"` = accepted. See [Error Codes](/error-codes) for other codes. |
| `response_status_desc` | `string` | Human-readable status description                                        |

### On Success

When `response_status_code` is `"TIRA001"`, the discharge voucher was accepted.

```js
// response_status_code === "TIRA001"
console.log(result.extracted.response_status_code); // "TIRA001"
console.log(result.extracted.response_status_desc); // "Successful"
console.log(result.extracted.request_id); // "AB3232532523344"
```

### On Error

When `response_status_code` is anything other than `"TIRA001"`, the discharge voucher was rejected. Check the [Error Codes](/error-codes) page for the specific code.

```js
// response_status_code !== "TIRA001"
console.log(result.extracted.response_status_code); // e.g., "TIRA020"
console.log(result.extracted.response_status_desc); // e.g., "Invalid request"
```

### Example — Handling the Callback

```js
app.post("/tira/discharge-voucher-callback", async (req, res) => {
  const result = await tira.dischargeVoucher.handleCallback(req.body);

  if (result.extracted.response_status_code === "TIRA001") {
    await db.dischargeVouchers.update({
      where: { request_id: result.extracted.request_id },
      data: { status: "accepted" },
    });
  } else {
    console.error(
      `Discharge voucher rejected: ${result.extracted.response_status_code}`,
      result.extracted.response_status_desc,
    );

    await db.dischargeVouchers.update({
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

1. Derives the correct acknowledgement tag name (`DischargeVoucherRes` → `DischargeVoucherResAck`)
2. Fills in `AcknowledgementId`, `ResponseId`, `AcknowledgementStatusCode`, and `AcknowledgementStatusDesc`
3. Signs the XML with your private key
4. Wraps it in `<TiraMsg>` with `<MsgSignature>`

### What the XML Looks Like

You don't need to build this yourself — this is what the package generates:

```xml
<TiraMsg>
<DischargeVoucherResAck>
  <AcknowledgementId>your-unique-id</AcknowledgementId>
  <ResponseId>TIRA22424232355</ResponseId>
  <AcknowledgementStatusCode>TIRA001</AcknowledgementStatusCode>
  <AcknowledgementStatusDesc>Successful</AcknowledgementStatusDesc>
</DischargeVoucherResAck>
<MsgSignature>base64-encoded-signature...</MsgSignature>
</TiraMsg>
```

### Example

```js
const { v4: uuid } = require("uuid");

app.post("/tira/discharge-voucher-callback", async (req, res) => {
  const result = await tira.dischargeVoucher.handleCallback(req.body);

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
app.post("/tira/discharge-voucher-callback", async (req, res) => {
  const result = await tira.dischargeVoucher.handleCallback(req.body);

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
await tira.dischargeVoucher.handleCallback(input: string | Record<string, any>): Promise<CallbackResult<DischargeVoucherCallbackResponse>>
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

| Field                | Type                                     | Description                                                               |
| -------------------- | ---------------------------------------- | ------------------------------------------------------------------------- |
| `type`               | `"discharge_voucher"`                    | Always `"discharge_voucher"` for this handler                             |
| `extracted`          | `DischargeVoucherCallbackResponse`       | The extracted data (see [Callback Response](#submit-callback-response))   |
| `body`               | `Record<string, any>`                    | Full parsed XML as JS object — pass this to `tira.acknowledge()`          |
| `signature_verified` | `boolean`                                | Whether TIRA's digital signature was verified                             |
| `raw_xml`            | `string`                                 | The original XML string                                                   |

### Resource-Specific vs Universal Handler

| Approach          | Method                                          | When to Use                                                                                |
| ----------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Resource-specific | `tira.dischargeVoucher.handleCallback(input)`   | When you have separate endpoints per resource type                                         |
| Universal         | `tira.handleCallback(input)`                    | When you have one endpoint for all TIRA callbacks (requires `enabled_callbacks` in config)  |

Both return the same data. The universal handler auto-detects the callback type. See [Callbacks & Acknowledgements](/callbacks-acknowledgements) for details on the universal handler.

## Full Example

A complete Express.js application that submits a discharge voucher, handles the callback, and acknowledges it.

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

// Submit a discharge voucher
app.post("/submit-discharge-voucher", async (req, res) => {
  const result = await tira.dischargeVoucher.submit({
    request_id: uuid(),
    callback_url: "https://your-server.com/tira/discharge-voucher-callback",
    insurer_company_code: "IC100",
    discharge_voucher_number: req.body.discharge_voucher_number,
    claim_assessment_number: req.body.claim_assessment_number,
    claim_reference_number: req.body.claim_reference_number,
    covernote_reference_number: req.body.covernote_reference_number,
    discharge_voucher_date: req.body.discharge_voucher_date,
    currency_code: req.body.currency_code,
    exchange_rate: req.body.exchange_rate,
    claim_offer_communication_date: req.body.claim_offer_communication_date,
    claim_offer_amount: req.body.claim_offer_amount,
    claimant_response_date: req.body.claimant_response_date,
    adjustment_date: req.body.adjustment_date,
    adjustment_reason: req.body.adjustment_reason,
    adjustment_amount: req.body.adjustment_amount,
    reconciliation_date: req.body.reconciliation_date,
    reconciliation_summary: req.body.reconciliation_summary,
    reconciled_amount: req.body.reconciled_amount,
    offer_accepted: req.body.offer_accepted,
    claimants: req.body.claimants,
  });

  res.json({
    message: "Submitted to TIRA",
    acknowledgement_id: result.acknowledgement_id,
    status: result.tira_status_code,
  });
});

// Handle TIRA's callback and acknowledge
app.post("/tira/discharge-voucher-callback", async (req, res) => {
  const result = await tira.dischargeVoucher.handleCallback(req.body);

  try {
    await db.dischargeVouchers.update({
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

### Offer Accepted vs Rejected

The `offer_accepted` field indicates whether the claimant accepted or rejected the claim offer. This affects the overall discharge voucher flow:

```js
// Claimant accepted the offer
{
  offer_accepted: "Y",
  claim_offer_amount: 5000000,
  adjustment_amount: 0,
  reconciled_amount: 5000000,
  // ...other fields
}

// Claimant did not accept — adjustment and reconciliation apply
{
  offer_accepted: "N",
  claim_offer_amount: 5000000,
  adjustment_amount: 1000000,
  adjustment_reason: "Claimant disputed the initial offer amount",
  reconciled_amount: 4000000,
  reconciliation_summary: "Final settlement after negotiation",
  // ...other fields
}
```

Even when `offer_accepted` is `"Y"`, you must still provide `adjustment_date`, `adjustment_reason`, `adjustment_amount`, `reconciliation_date`, `reconciliation_summary`, and `reconciled_amount` as they are all required fields.

### Currency and Exchange Rate

By default, `currency_code` is `"TZS"` and `exchange_rate` is `1.0`. If the claim involves a foreign currency:

```js
{
  currency_code: "USD",
  exchange_rate: 2000.0, // 1 USD = 2000 TZS
  claim_offer_amount: 5000000,
  adjustment_amount: 1000000,
  reconciled_amount: 200000,
}
```

All monetary amounts (`claim_offer_amount`, `adjustment_amount`, `reconciled_amount`) should be in the specified currency. The exchange rate is formatted to 2 decimal places in the XML.

### Simplified Claimants

Unlike [Claim Intimation](/claim-intimation) which requires full claimant details (name, birth date, address, phone number, etc.), discharge voucher uses a simplified claimant structure with only 4 fields:

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

## Common Mistakes

::: danger Forgetting to acknowledge the callback
TIRA retries callbacks indefinitely until you acknowledge them. Always call `tira.acknowledge(result.body, uuid())` and return the XML, even if processing the callback data failed.
:::

::: danger Missing XML middleware
Without `express.text({ type: "application/xml" })`, your callback `req.body` will be empty and parsing will fail. Add this middleware before your callback route.
:::

::: danger Confusing submission acknowledgement with approval
`"TIRA001"` in the submission response means "received", not "approved". The actual approval or rejection comes later via the callback. Don't tell your users their discharge voucher is accepted at submission time.
:::

::: danger Invalid callback URL
The `callback_url` must be a valid, publicly accessible URL. The package validates the URL format before sending. If the URL is malformed, you'll get a `TiraValidationError`. If it's valid but unreachable by TIRA, you'll never receive the callback.
:::

::: danger Missing claim reference numbers
The `claim_reference_number` must be the one returned by TIRA in the claim notification callback, and `claim_assessment_number` must match a previously submitted assessment. Using incorrect or missing reference numbers will cause TIRA to reject the discharge voucher.
:::

::: danger Empty claimants array
At least one claimant is required. Passing an empty array or omitting `claimants` will throw a `TiraValidationError`.
:::

## Related Pages

- [Callbacks & Acknowledgements](/callbacks-acknowledgements) — The full callback lifecycle
- [Signing & Verification](/signing-verification) — How digital signatures work
- [Error Codes](/error-codes) — All TIRA status codes and fixes
- [Initialization](/initialization) — Setting up the Tira client
