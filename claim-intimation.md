# Claim Intimation

The Claim Intimation resource handles claim intimation submissions to TIRA. Use `tira.claimIntimation` to submit claim intimation details — including claimant information, estimated amounts, reserve details, and assessor information — against an existing claim reference, and to handle TIRA's asynchronous callback responses.

For the general submit-callback-acknowledge flow, see [Callbacks & Acknowledgements](/callbacks-acknowledgements).

## Available Methods

| Method                                       | Description                                 | When to Use                                                                        | Returns                                           |
| -------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------- |
| `tira.claimIntimation.submit(payload)`       | Submit a claim intimation to TIRA           | After a claim notification has been accepted and you have a claim reference number | `ClaimIntimationResponse`                         |
| `tira.claimIntimation.handleCallback(input)` | Parse and extract data from TIRA's callback | When TIRA sends the result of your submission to your callback URL                 | `CallbackResult<ClaimIntimationCallbackResponse>` |

## .submit() Payload

```ts
await tira.claimIntimation.submit(payload): Promise<ClaimIntimationResponse>
```

Submits a claim intimation to TIRA. This is an asynchronous operation — you receive an acknowledgement immediately, and the actual result comes later via your callback URL.

**Endpoint:** `POST /eclaim/api/claim/claim-intimation/v1/request`

### Claim Intimation Fields

| Field                        | Type           | Required | Default | XML Tag                    | Description                                                                |
| ---------------------------- | -------------- | -------- | ------- | -------------------------- | -------------------------------------------------------------------------- |
| `request_id`                 | `string`       | Yes      | —       | `RequestId`                | Unique request identifier                                                  |
| `callback_url`               | `string`       | Yes      | —       | `CallBackUrl`              | Where TIRA sends results                                                   |
| `insurer_company_code`       | `string`       | Yes      | —       | `InsurerCompanyCode`       | Insurer's company code                                                     |
| `claim_intimation_number`    | `string`       | Yes      | —       | `ClaimIntimationNumber`    | Claim intimation number as per insurer. String(50).                        |
| `claim_reference_number`     | `string`       | Yes      | —       | `ClaimReferenceNumber`     | The TIRA claim reference number from the claim notification. String(50).   |
| `covernote_reference_number` | `string`       | Yes      | —       | `CoverNoteReferenceNumber` | The TIRA cover note reference number the claim is against. String(50).     |
| `claim_intimation_date`      | `string\|Date` | Yes      | —       | `ClaimIntimationDate`      | Date and time of the intimation. See [Date Handling](#date-handling).      |
| `currency_code`              | `string`       | No       | `"TZS"` | `CurrencyCode`             | ISO 4217 currency code.                                                    |
| `exchange_rate`              | `number`       | No       | `1.0`   | `ExchangeRate`             | Exchange rate to TZS. Formatted to 2 decimal places.                       |
| `claim_estimated_amount`     | `number`       | Yes      | —       | `ClaimEstimatedAmount`     | Estimated claim amount. Numeric(36,2).                                     |
| `claim_reserve_amount`       | `number`       | Yes      | —       | `ClaimReserveAmount`       | Reserve amount set aside for the claim. Numeric(36,2).                     |
| `claim_reserve_method`       | `string`       | Yes      | —       | `ClaimReserveMethod`       | Method used to calculate the reserve (e.g., "Chain Ladder"). String(100).  |
| `loss_assessment_option`     | `"1"\|"2"`     | Yes      | —       | `LossAssessmentOption`     | 1=In-house (insurer employee), 2=External (registered insurance adjuster). |
| `assessor_name`              | `string`       | Yes      | —       | `AssessorName`             | Name of the assessor. String(100).                                         |
| `assessor_id_number`         | `string`       | Yes      | —       | `AssessorIdNumber`         | Assessor identification number. String(50).                                |
| `assessor_id_type`           | `"1"\|…\|"7"`  | Yes      | —       | `AssessorIdType`           | Assessor ID type. See [Identification Types](#identification-types).       |
| `claimants`                  | `Claimant[]`   | Yes      | —       | `Claimants > Claimant`     | At least one claimant required. See [Claimants](#claimants).               |

::: info Auto-filled header fields
The XML header fields `CompanyCode` and `SystemCode` are automatically filled from your Tira config — you don't need to include them in the payload.
:::

### Claimants

Each claimant in the `claimants` array has the following fields:

| Field                   | Type          | Required | Default | XML Tag               | Description                                                 |
| ----------------------- | ------------- | -------- | ------- | --------------------- | ----------------------------------------------------------- |
| `claimant_name`         | `string`      | Yes      | —       | `ClaimantName`        | Claimant's full name. String(100).                          |
| `claimant_birth_date`   | `string`      | Yes      | —       | `ClaimantBirthDate`   | Birth date in YYYY-MM-DD format.                            |
| `claimant_category`     | `"1"\|"2"`    | Yes      | —       | `ClaimantCategory`    | 1=Policyholder, 2=Third Party.                              |
| `claimant_type`         | `"1"\|"2"`    | Yes      | —       | `ClaimantType`        | 1=Individual, 2=Corporate.                                  |
| `claimant_id_number`    | `string`      | Yes      | —       | `ClaimantIdNumber`    | Identification number. String(50).                          |
| `claimant_id_type`      | `"1"\|…\|"7"` | Yes      | —       | `ClaimantIdType`      | ID type. See [Identification Types](#identification-types). |
| `gender`                | `"M"\|"F"`    | No       | `""`    | `Gender`              | M=Male, F=Female.                                           |
| `country_code`          | `string`      | No       | `"TZA"` | `CountryCode`         | ISO 3166 alpha-3 country code.                              |
| `region`                | `string`      | Yes      | —       | `Region`              | Claimant's region.                                          |
| `district`              | `string`      | Yes      | —       | `District`            | Claimant's district. String(100).                           |
| `street`                | `string`      | No       | `""`    | `Street`              | Claimant's street. String(100).                             |
| `claimant_phone_number` | `string`      | Yes      | —       | `ClaimantPhoneNumber` | Claimant's phone number. String(50).                        |
| `claimant_fax`          | `string`      | No       | `""`    | `ClaimantFax`         | Claimant's fax number. String(50).                          |
| `postal_address`        | `string`      | No       | `""`    | `PostalAddress`       | Claimant's postal address. String(50).                      |
| `email_address`         | `string`      | No       | `""`    | `EmailAddress`        | Claimant's email address. String(50).                       |

### Identification Types

Both `assessor_id_type` and `claimant_id_type` use the same values:

| Value | Description                              |
| ----- | ---------------------------------------- |
| `"1"` | NIN (National Identification Number)     |
| `"2"` | Voters Registration Number               |
| `"3"` | Passport Number                          |
| `"4"` | Driving License                          |
| `"5"` | Zanzibar Resident ID (ZANID)             |
| `"6"` | TIN (Tax Identification Number)          |
| `"7"` | Company Incorporation Certificate Number |

### Date Handling

The package automatically converts dates to East Africa Time (UTC+3) and formats them as `YYYY-MM-DDTHH:mm:ss` (no timezone suffix). You can pass either an ISO string or a JavaScript `Date` object.

::: tip Example
If you pass `"2020-09-10T10:55:22Z"` (10:55 AM UTC), the package converts it to `"2020-09-10T13:55:22"` (1:55 PM EAT).
:::

### Validation Rules

The package validates your payload before sending it to TIRA. If validation fails, it throws a `TiraValidationError` with the field name and a descriptive message.

- `request_id`, `insurer_company_code`, `claim_intimation_number`, `claim_reference_number`, `covernote_reference_number`, `claim_reserve_method`, `assessor_name`, `assessor_id_number` — all required strings
- `callback_url` — required and must be a valid URL
- `claim_intimation_date` — must be a valid date string (ISO format) or `Date` object
- `claim_estimated_amount`, `claim_reserve_amount` — must be valid numbers
- `loss_assessment_option` — must be `"1"` or `"2"`
- `assessor_id_type` — must be a valid identification type (`"1"` through `"7"`)
- `claimants` — at least one claimant is required
- Per claimant: `claimant_name`, `claimant_birth_date`, `claimant_id_number`, `region`, `district`, `claimant_phone_number` are required; `claimant_category` must be `"1"` or `"2"`; `claimant_type` must be `"1"` or `"2"`; `claimant_id_type` must be a valid identification type

### Example — Submit a Claim Intimation

```js
const result = await tira.claimIntimation.submit({
  request_id: "AB3232532523344",
  callback_url: "https://your-server.com/tira/claim-intimation-callback",
  insurer_company_code: "IC100",
  claim_intimation_number: "322WQ25234234",
  claim_reference_number: "10020-25400-07720",
  covernote_reference_number: "10020-25400-07720",
  claim_intimation_date: "2020-09-10T13:55:22",
  currency_code: "USD",
  exchange_rate: 2000.0,
  claim_estimated_amount: 2000000.0,
  claim_reserve_amount: 1000000.0,
  claim_reserve_method: "Chain Ladder",
  loss_assessment_option: "1",
  assessor_name: "Baraka Kiswigu",
  assessor_id_number: "124214114",
  assessor_id_type: "1",
  claimants: [
    {
      claimant_name: "Augustino Aidan Mwageni",
      claimant_birth_date: "1920-02-05",
      claimant_category: "2",
      claimant_type: "1",
      claimant_id_number: "24241241",
      claimant_id_type: "1",
      country_code: "TZA",
      region: "Dar es Salaam",
      district: "Ilala",
      claimant_phone_number: "255713525539",
    },
    {
      claimant_name: "KISWIGU Company Ltd",
      claimant_birth_date: "1950-02-05",
      claimant_category: "2",
      claimant_type: "2",
      claimant_id_number: "3452525235525",
      claimant_id_type: "3",
      country_code: "TZA",
      region: "Dar es Salaam",
      district: "Ilala",
      claimant_phone_number: "255713525539",
    },
  ],
});

console.log(result.acknowledgement_id); // "ACK123456"
console.log(result.tira_status_code); // "TIRA001"
```

## .submit() Response

When you call `tira.claimIntimation.submit()`, you get an immediate `ClaimIntimationResponse` from TIRA:

| Field                      | Type                      | Description                                |
| -------------------------- | ------------------------- | ------------------------------------------ |
| `acknowledgement_id`       | `string`                  | TIRA's acknowledgement ID                  |
| `request_id`               | `string`                  | Your original request ID (echoed back)     |
| `tira_status_code`         | `string`                  | Status code — `"TIRA001"` means received   |
| `tira_status_desc`         | `string`                  | Human-readable description                 |
| `requires_acknowledgement` | `boolean`                 | Always `true`                              |
| `acknowledgement_payload`  | `Record<string, unknown>` | Raw parsed acknowledgement (rarely needed) |

::: tip "TIRA001" means "received", not "approved"
At this stage, `"TIRA001"` means TIRA received your request and it's being processed. It does **not** mean your claim intimation has been approved. The actual result comes later via your callback URL.

If you get a code other than `"TIRA001"`, something went wrong with the submission itself. Check the [Error Codes](/error-codes) page for the specific code.
:::

## .submit() Callback Response

After TIRA processes your submission, it sends the result to your `callback_url`. The callback contains the actual outcome — whether your claim intimation was accepted or rejected.

### Extracted Data

The `extracted` field contains the parsed callback data:

| Field                  | Type     | Description                                                              |
| ---------------------- | -------- | ------------------------------------------------------------------------ |
| `response_id`          | `string` | TIRA's response ID                                                       |
| `request_id`           | `string` | Your original request ID                                                 |
| `response_status_code` | `string` | `"TIRA001"` = accepted. See [Error Codes](/error-codes) for other codes. |
| `response_status_desc` | `string` | Human-readable status description                                        |

### On Success

When `response_status_code` is `"TIRA001"`, the claim intimation was accepted.

```js
// response_status_code === "TIRA001"
console.log(result.extracted.response_status_code); // "TIRA001"
console.log(result.extracted.response_status_desc); // "Successful"
console.log(result.extracted.request_id); // "AB3232532523344"
```

### On Error

When `response_status_code` is anything other than `"TIRA001"`, the claim intimation was rejected. Check the [Error Codes](/error-codes) page for the specific code.

```js
// response_status_code !== "TIRA001"
console.log(result.extracted.response_status_code); // e.g., "TIRA020"
console.log(result.extracted.response_status_desc); // e.g., "Invalid request"
```

### Example — Handling the Callback

```js
app.post("/tira/claim-intimation-callback", async (req, res) => {
  const result = await tira.claimIntimation.handleCallback(req.body);

  if (result.extracted.response_status_code === "TIRA001") {
    await db.claimIntimations.update({
      where: { request_id: result.extracted.request_id },
      data: { status: "accepted" },
    });
  } else {
    console.error(
      `Claim intimation rejected: ${result.extracted.response_status_code}`,
      result.extracted.response_status_desc,
    );

    await db.claimIntimations.update({
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

1. Derives the correct acknowledgement tag name (`ClaimIntimationRes` → `ClaimIntimationResAck`)
2. Fills in `AcknowledgementId`, `ResponseId`, `AcknowledgementStatusCode`, and `AcknowledgementStatusDesc`
3. Signs the XML with your private key
4. Wraps it in `<TiraMsg>` with `<MsgSignature>`

### What the XML Looks Like

You don't need to build this yourself — this is what the package generates:

```xml
<TiraMsg>
<ClaimIntimationResAck>
  <AcknowledgementId>your-unique-id</AcknowledgementId>
  <ResponseId>TIRA22424232355</ResponseId>
  <AcknowledgementStatusCode>TIRA001</AcknowledgementStatusCode>
  <AcknowledgementStatusDesc>Successful</AcknowledgementStatusDesc>
</ClaimIntimationResAck>
<MsgSignature>base64-encoded-signature...</MsgSignature>
</TiraMsg>
```

### Example

```js
const { v4: uuid } = require("uuid");

app.post("/tira/claim-intimation-callback", async (req, res) => {
  const result = await tira.claimIntimation.handleCallback(req.body);

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
app.post("/tira/claim-intimation-callback", async (req, res) => {
  const result = await tira.claimIntimation.handleCallback(req.body);

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
await tira.claimIntimation.handleCallback(input: string | Record<string, any>): Promise<CallbackResult<ClaimIntimationCallbackResponse>>
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

| Field                | Type                              | Description                                                             |
| -------------------- | --------------------------------- | ----------------------------------------------------------------------- |
| `type`               | `"claim_intimation"`              | Always `"claim_intimation"` for this handler                            |
| `extracted`          | `ClaimIntimationCallbackResponse` | The extracted data (see [Callback Response](#submit-callback-response)) |
| `body`               | `Record<string, any>`             | Full parsed XML as JS object — pass this to `tira.acknowledge()`        |
| `signature_verified` | `boolean`                         | Whether TIRA's digital signature was verified                           |
| `raw_xml`            | `string`                          | The original XML string                                                 |

### Resource-Specific vs Universal Handler

| Approach          | Method                                       | When to Use                                                                                |
| ----------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Resource-specific | `tira.claimIntimation.handleCallback(input)` | When you have separate endpoints per resource type                                         |
| Universal         | `tira.handleCallback(input)`                 | When you have one endpoint for all TIRA callbacks (requires `enabled_callbacks` in config) |

Both return the same data. The universal handler auto-detects the callback type. See [Callbacks & Acknowledgements](/callbacks-acknowledgements) for details on the universal handler.

## Full Example

A complete Express.js application that submits a claim intimation, handles the callback, and acknowledges it.

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

// Submit a claim intimation
app.post("/submit-claim-intimation", async (req, res) => {
  const result = await tira.claimIntimation.submit({
    request_id: uuid(),
    callback_url: "https://your-server.com/tira/claim-intimation-callback",
    insurer_company_code: "IC100",
    claim_intimation_number: req.body.claim_intimation_number,
    claim_reference_number: req.body.claim_reference_number,
    covernote_reference_number: req.body.covernote_reference_number,
    claim_intimation_date: req.body.claim_intimation_date,
    currency_code: req.body.currency_code,
    exchange_rate: req.body.exchange_rate,
    claim_estimated_amount: req.body.claim_estimated_amount,
    claim_reserve_amount: req.body.claim_reserve_amount,
    claim_reserve_method: req.body.claim_reserve_method,
    loss_assessment_option: req.body.loss_assessment_option,
    assessor_name: req.body.assessor_name,
    assessor_id_number: req.body.assessor_id_number,
    assessor_id_type: req.body.assessor_id_type,
    claimants: req.body.claimants,
  });

  res.json({
    message: "Submitted to TIRA",
    acknowledgement_id: result.acknowledgement_id,
    status: result.tira_status_code,
  });
});

// Handle TIRA's callback and acknowledge
app.post("/tira/claim-intimation-callback", async (req, res) => {
  const result = await tira.claimIntimation.handleCallback(req.body);

  try {
    await db.claimIntimations.update({
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

### Loss Assessment Option

The `loss_assessment_option` field determines who performs the loss assessment:

- `"1"` — **In-house**: The assessment is done by an insurer employee. The `assessor_name`, `assessor_id_number`, and `assessor_id_type` should refer to the insurer's staff member.
- `"2"` — **External**: The assessment is done by a registered insurance adjuster. The assessor details should refer to the external adjuster.

### Currency and Exchange Rate

By default, `currency_code` is `"TZS"` and `exchange_rate` is `1.0`. If the claim involves a foreign currency:

```js
{
  currency_code: "USD",
  exchange_rate: 2000.0, // 1 USD = 2000 TZS
  claim_estimated_amount: 2000000.0,
  claim_reserve_amount: 1000000.0,
}
```

Both `claim_estimated_amount` and `claim_reserve_amount` should be in the specified currency. The exchange rate is formatted to 2 decimal places in the XML.

### Multiple Claimants

The `claimants` array supports multiple claimants — for example, a policyholder and a third party involved in the same claim. Each claimant is independently validated. At least one claimant is required.

```js
claimants: [
  {
    claimant_name: "Augustino Aidan Mwageni",
    claimant_category: "2", // Third Party
    claimant_type: "1", // Individual
    // ...other fields
  },
  {
    claimant_name: "KISWIGU Company Ltd",
    claimant_category: "2", // Third Party
    claimant_type: "2", // Corporate
    // ...other fields
  },
];
```

## Common Mistakes

::: danger Forgetting to acknowledge the callback
TIRA retries callbacks indefinitely until you acknowledge them. Always call `tira.acknowledge(result.body, uuid())` and return the XML, even if processing the callback data failed.
:::

::: danger Missing XML middleware
Without `express.text({ type: "application/xml" })`, your callback `req.body` will be empty and parsing will fail. Add this middleware before your callback route.
:::

::: danger Confusing submission acknowledgement with approval
`"TIRA001"` in the submission response means "received", not "approved". The actual approval or rejection comes later via the callback. Don't tell your users their claim intimation is accepted at submission time.
:::

::: danger Invalid callback URL
The `callback_url` must be a valid, publicly accessible URL. The package validates the URL format before sending. If the URL is malformed, you'll get a `TiraValidationError`. If it's valid but unreachable by TIRA, you'll never receive the callback.
:::

::: danger Missing claim reference number
The `claim_reference_number` must be the one returned by TIRA in the claim notification callback. If you use an incorrect or missing reference number, TIRA will reject the intimation.
:::

::: danger Empty claimants array
At least one claimant is required. Passing an empty array or omitting `claimants` will throw a `TiraValidationError`.
:::

## Related Pages

- [Callbacks & Acknowledgements](/callbacks-acknowledgements) — The full callback lifecycle
- [Signing & Verification](/signing-verification) — How digital signatures work
- [Error Codes](/error-codes) — All TIRA status codes and fixes
- [Initialization](/initialization) — Setting up the Tira client
