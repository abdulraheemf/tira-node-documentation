# Reinsurance

The Reinsurance resource handles reinsurance detail submissions to TIRA for previously submitted cover notes. Use `tira.reinsurance` to submit reinsurance arrangements (facultative outward and inward) and handle TIRA's asynchronous callback responses.

For the general submit-callback-acknowledge flow, see [Callbacks & Acknowledgements](/callbacks-acknowledgements).

## Available Methods

| Method                                   | Description                                                      | When to Use                                                        | Returns                                       |
| ---------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------ | --------------------------------------------- |
| `tira.reinsurance.submit(payload)`       | Submit reinsurance details for a previously submitted cover note | When you want to report reinsurance arrangements to TIRA           | `ReinsuranceResponse`                         |
| `tira.reinsurance.handleCallback(input)` | Parse and extract data from TIRA's callback                      | When TIRA sends the result of your submission to your callback URL | `CallbackResult<ReinsuranceCallbackResponse>` |

## .submit() Payload

```ts
await tira.reinsurance.submit(payload): Promise<ReinsuranceResponse>
```

Submits reinsurance details to TIRA for a previously submitted cover note. This is an asynchronous operation — you receive an acknowledgement immediately, and the actual result comes later via your callback URL.

**Endpoint:** `POST /ecovernote/api/reinsurance/v1/request`

### Reinsurance Categories

| Value | Category            | Description                         |
| ----- | ------------------- | ----------------------------------- |
| `"1"` | Facultative Outward | Ceding risk to another reinsurer    |
| `"2"` | Facultative Inward  | Accepting risk from another insurer |

### Reinsurance Header Fields

These are the top-level fields in the submission payload.

| Field                        | Type                  | Required | Default | XML Tag                    | Description                                                                         |
| ---------------------------- | --------------------- | -------- | ------- | -------------------------- | ----------------------------------------------------------------------------------- |
| `request_id`                 | `string`              | Yes      | —       | `RequestId`                | Unique request identifier                                                           |
| `callback_url`               | `string`              | Yes      | —       | `CallBackUrl`              | Where TIRA sends results                                                            |
| `insurer_company_code`       | `string`              | Yes      | —       | `InsurerCompanyCode`       | Insurer's company code                                                              |
| `covernote_reference_number` | `string`              | Yes      | —       | `CoverNoteReferenceNumber` | Reference number from a previously submitted cover note                             |
| `premium_including_tax`      | `number`              | Yes      | —       | `PremiumIncludingTax`      | Total premium including tax. Max 2 decimal places.                                  |
| `currency_code`              | `string`              | No       | `"TZS"` | `CurrencyCode`             | ISO currency code                                                                   |
| `exchange_rate`              | `number`              | No       | `1.0`   | `ExchangeRate`             | Exchange rate to TZS. Formatted to 2 decimal places.                                |
| `authorizing_officer_name`   | `string`              | Yes      | —       | `AuthorizingOfficerName`   | Name of the authorizing officer                                                     |
| `authorizing_officer_title`  | `string`              | Yes      | —       | `AuthorizingOfficerTitle`  | Title of the authorizing officer                                                    |
| `reinsurance_category`       | `"1"\|"2"`            | Yes      | —       | `ReinsuranceCategory`      | 1=Facultative Outward, 2=Facultative Inward                                         |
| `reinsurance_details`        | `ReinsuranceDetail[]` | Yes      | —       | `ReinsuranceDtl`           | At least one required. See [Reinsurance Detail Fields](#reinsurance-detail-fields). |

### Reinsurance Detail Fields

Each item in the `reinsurance_details` array maps to a `<ReinsuranceDtl>` XML element. At least one is required.

| Field                    | Type           | Required | XML Tag                 | Description                                                                           |
| ------------------------ | -------------- | -------- | ----------------------- | ------------------------------------------------------------------------------------- |
| `participant_code`       | `string`       | Yes      | `ParticipantCode`       | Participant code assigned by TIRA                                                     |
| `participant_type`       | `"1"`–`"7"`    | Yes      | `ParticipantType`       | See [Participant Types](#participant-types)                                           |
| `reinsurance_form`       | `"1"`–`"3"`    | Yes      | `ReinsuranceForm`       | See [Reinsurance Forms](#reinsurance-forms)                                           |
| `reinsurance_type`       | `"1"`–`"8"`    | Yes      | `ReinsuranceType`       | See [Reinsurance Types](#reinsurance-types)                                           |
| `re_broker_code`         | `string`       | Yes      | `ReBrokerCode`          | Reinsurance broker code. Provided by TIRA.                                            |
| `brokerage_commission`   | `number`       | Yes      | `BrokerageCommission`   | Brokerage commission amount. Max 2 decimal places.                                    |
| `reinsurance_commission` | `number`       | Yes      | `ReinsuranceCommission` | Reinsurance commission amount. Max 2 decimal places.                                  |
| `premium_share`          | `number`       | Yes      | `PremiumShare`          | Premium share amount. Max 2 decimal places.                                           |
| `participation_date`     | `string\|Date` | Yes      | `ParticipationDate`     | Participation date in ISO format or Date object. See [Date Handling](#date-handling). |

### Participant Types

| Value | Description                 |
| ----- | --------------------------- |
| `"1"` | Leader                      |
| `"2"` | Treaty Cession              |
| `"3"` | Policy Cession Outward      |
| `"4"` | Facultative Outward Local   |
| `"5"` | Facultative Outward Foreign |
| `"6"` | Facultative Inward Local    |
| `"7"` | Facultative Inward Foreign  |

### Reinsurance Forms

| Value | Description    |
| ----- | -------------- |
| `"1"` | Policy Cession |
| `"2"` | Treaty Cession |
| `"3"` | Facultative    |

### Reinsurance Types

| Value | Description                            |
| ----- | -------------------------------------- |
| `"1"` | Fac Proportion — Quota Share           |
| `"2"` | Fac Non Proportion — Excess of Loss    |
| `"3"` | Fac Proportion — Surplus Treaty        |
| `"4"` | Fac Obligatory                         |
| `"5"` | Treaty Proportion — Quota Share        |
| `"6"` | Treaty Proportion — Surplus Treaty     |
| `"7"` | Treaty Non Proportion — Excess of Loss |
| `"8"` | Treaty Non Proportion — Stop Loss      |

### Date Handling

The package automatically converts dates to East Africa Time (UTC+3) and formats them as `YYYY-MM-DDTHH:mm:ss` (no timezone suffix). You can pass either an ISO string or a JavaScript `Date` object.

::: tip Example
If you pass `"2025-05-31T21:00:00Z"` (9 PM UTC), the package converts it to `"2025-06-01T00:00:00"` (midnight EAT, June 1st).

This means if you want a participation date of June 1st Tanzania time, pass `"2025-05-31T21:00:00Z"` or `new Date("2025-05-31T21:00:00Z")`.
:::

### Validation Rules

The package validates your payload before sending it to TIRA. If validation fails, it throws a `TiraValidationError` with the field name and a descriptive message.

- `request_id` is required
- `callback_url` must be a valid URL
- `insurer_company_code` is required
- `covernote_reference_number` is required
- `premium_including_tax` must be a positive number
- `authorizing_officer_name` is required
- `authorizing_officer_title` is required
- `reinsurance_category` must be `"1"` or `"2"`
- `reinsurance_details` must be a non-empty array
- For each item in `reinsurance_details`:
  - `participant_code` is required
  - `re_broker_code` is required
  - `participant_type` must be `"1"` through `"7"`
  - `reinsurance_form` must be `"1"` through `"3"`
  - `reinsurance_type` must be `"1"` through `"8"`
  - `brokerage_commission` must be a number
  - `reinsurance_commission` must be a number
  - `premium_share` must be a number
  - `participation_date` must be a valid date string

### Example — Facultative Outward Reinsurance

```js
const result = await tira.reinsurance.submit({
  request_id: "NIC22424232355",
  callback_url: "https://your-server.com/tira/reinsurance-callback",
  insurer_company_code: "ICC103",
  covernote_reference_number: "CN-2025-001",
  premium_including_tax: 619500,
  authorizing_officer_name: "Johnson Abraham",
  authorizing_officer_title: "Manager",
  reinsurance_category: "1", // Facultative Outward
  reinsurance_details: [
    {
      participant_code: "RE001",
      participant_type: "1", // Leader
      reinsurance_form: "3", // Facultative
      reinsurance_type: "1", // Fac Proportion — Quota Share
      re_broker_code: "BRK001",
      brokerage_commission: 5000,
      reinsurance_commission: 10000,
      premium_share: 250000,
      participation_date: "2025-05-31T21:00:00Z",
    },
    {
      participant_code: "RE002",
      participant_type: "4", // Facultative Outward Local
      reinsurance_form: "3", // Facultative
      reinsurance_type: "1", // Fac Proportion — Quota Share
      re_broker_code: "BRK002",
      brokerage_commission: 5000,
      reinsurance_commission: 10000,
      premium_share: 150000,
      participation_date: "2025-05-31T21:00:00Z",
    },
  ],
});

console.log(result.acknowledgement_id); // "ACK123456"
console.log(result.tira_status_code); // "TIRA001"
```

### Example — Facultative Inward Reinsurance

```js
const result = await tira.reinsurance.submit({
  request_id: "NIC22424232356",
  callback_url: "https://your-server.com/tira/reinsurance-callback",
  insurer_company_code: "ICC103",
  covernote_reference_number: "CN-2025-002",
  premium_including_tax: 450000,
  currency_code: "USD",
  exchange_rate: 2500.0,
  authorizing_officer_name: "Johnson Abraham",
  authorizing_officer_title: "Manager",
  reinsurance_category: "2", // Facultative Inward
  reinsurance_details: [
    {
      participant_code: "RE003",
      participant_type: "6", // Facultative Inward Local
      reinsurance_form: "3", // Facultative
      reinsurance_type: "1", // Fac Proportion — Quota Share
      re_broker_code: "BRK003",
      brokerage_commission: 3000,
      reinsurance_commission: 8000,
      premium_share: 200000,
      participation_date: "2025-06-15T00:00:00Z",
    },
  ],
});
```

## .submit() Response

When you call `tira.reinsurance.submit()`, you get an immediate `ReinsuranceResponse` from TIRA:

| Field                      | Type                      | Description                                |
| -------------------------- | ------------------------- | ------------------------------------------ |
| `acknowledgement_id`       | `string`                  | TIRA's acknowledgement ID                  |
| `request_id`               | `string`                  | Your original request ID (echoed back)     |
| `tira_status_code`         | `string`                  | Status code — `"TIRA001"` means received   |
| `tira_status_desc`         | `string`                  | Human-readable description                 |
| `requires_acknowledgement` | `boolean`                 | Always `true`                              |
| `acknowledgement_payload`  | `Record<string, unknown>` | Raw parsed acknowledgement (rarely needed) |

::: tip "TIRA001" means "received", not "approved"
At this stage, `"TIRA001"` means TIRA received your request and it's being processed. It does **not** mean your reinsurance submission has been approved. The actual result (approved or rejected) comes later via your callback URL.

If you get a code other than `"TIRA001"`, something went wrong with the submission itself. Check the [Error Codes](/error-codes) page for the specific code.
:::

## .submit() Callback Response

After TIRA processes your submission, it sends the result to your `callback_url`. The callback contains the actual outcome — whether your reinsurance submission was approved or rejected.

### Extracted Data

The `extracted` field contains the parsed callback data:

| Field                  | Type     | Description                                                              |
| ---------------------- | -------- | ------------------------------------------------------------------------ |
| `response_id`          | `string` | TIRA's response ID                                                       |
| `request_id`           | `string` | Your original request ID                                                 |
| `response_status_code` | `string` | `"TIRA001"` = approved. See [Error Codes](/error-codes) for other codes. |
| `response_status_desc` | `string` | Human-readable status description                                        |

### On Success

When `response_status_code` is `"TIRA001"`, the reinsurance submission was approved.

```js
// response_status_code === "TIRA001"
console.log(result.extracted.response_status_code); // "TIRA001"
console.log(result.extracted.response_status_desc); // "Successful"
```

### On Error

When `response_status_code` is anything other than `"TIRA001"`, the submission was rejected. Check the [Error Codes](/error-codes) page for the specific code.

```js
// response_status_code !== "TIRA001"
console.log(result.extracted.response_status_code); // e.g., "TIRA020"
console.log(result.extracted.response_status_desc); // e.g., "Invalid request"
```

### Example — Handling the Callback

```js
app.post("/tira/reinsurance-callback", async (req, res) => {
  const result = await tira.reinsurance.handleCallback(req.body);

  if (result.extracted.response_status_code === "TIRA001") {
    await db.reinsurance.update({
      where: { request_id: result.extracted.request_id },
      data: { status: "approved" },
    });
  } else {
    console.error(
      `Reinsurance rejected: ${result.extracted.response_status_code}`,
      result.extracted.response_status_desc,
    );

    await db.reinsurance.update({
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

1. Derives the correct acknowledgement tag name (`ReinsuranceRes` → `ReinsuranceResAck`)
2. Fills in `AcknowledgementId`, `ResponseId`, `AcknowledgementStatusCode`, and `AcknowledgementStatusDesc`
3. Signs the XML with your private key
4. Wraps it in `<TiraMsg>` with `<MsgSignature>`

### What the XML Looks Like

You don't need to build this yourself — this is what the package generates:

```xml
<TiraMsg>
<ReinsuranceResAck>
  <AcknowledgementId>your-unique-id</AcknowledgementId>
  <ResponseId>TIRA22424232355</ResponseId>
  <AcknowledgementStatusCode>TIRA001</AcknowledgementStatusCode>
  <AcknowledgementStatusDesc>Successful</AcknowledgementStatusDesc>
</ReinsuranceResAck>
<MsgSignature>base64-encoded-signature...</MsgSignature>
</TiraMsg>
```

### Example

```js
const { v4: uuid } = require("uuid");

app.post("/tira/reinsurance-callback", async (req, res) => {
  const result = await tira.reinsurance.handleCallback(req.body);

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
app.post("/tira/reinsurance-callback", async (req, res) => {
  const result = await tira.reinsurance.handleCallback(req.body);

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
await tira.reinsurance.handleCallback(input: string | Record<string, any>): Promise<CallbackResult<ReinsuranceCallbackResponse>>
```

This function parses the callback XML that TIRA sends to your callback URL and extracts the relevant data. You can also use the universal `tira.handleCallback()` if you have a single endpoint for all callback types.

### What It Does

1. **Verifies the signature** — checks that the callback's `<MsgSignature>` matches TIRA's public key (if signature verification is configured)
2. **Parses the XML** — converts the raw XML into a JavaScript object
3. **Extracts the data** — pulls out the fields you care about (`response_status_code`, `response_status_desc`, etc.) into a clean `extracted` object

### Input

You can pass either:

- A **raw XML string** — the `req.body` from your Express handler (requires `express.text({ type: "application/xml" })` middleware)
- A **pre-parsed object** — if you've already parsed the XML yourself

### What It Returns

| Field                | Type                          | Description                                                             |
| -------------------- | ----------------------------- | ----------------------------------------------------------------------- |
| `type`               | `"reinsurance"`               | Always `"reinsurance"` for this handler                                 |
| `extracted`          | `ReinsuranceCallbackResponse` | The extracted data (see [Callback Response](#submit-callback-response)) |
| `body`               | `Record<string, any>`         | Full parsed XML as JS object — pass this to `tira.acknowledge()`        |
| `signature_verified` | `boolean`                     | Whether TIRA's digital signature was verified                           |
| `raw_xml`            | `string`                      | The original XML string                                                 |

### Resource-Specific vs Universal Handler

| Approach          | Method                                   | When to Use                                                                                |
| ----------------- | ---------------------------------------- | ------------------------------------------------------------------------------------------ |
| Resource-specific | `tira.reinsurance.handleCallback(input)` | When you have separate endpoints per resource type                                         |
| Universal         | `tira.handleCallback(input)`             | When you have one endpoint for all TIRA callbacks (requires `enabled_callbacks` in config) |

Both return the same data. The universal handler auto-detects the callback type. See [Callbacks & Acknowledgements](/callbacks-acknowledgements) for details on the universal handler.

## Full Example

A complete Express.js application that submits reinsurance details and handles the callback.

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

// Submit reinsurance details
app.post("/submit-reinsurance", async (req, res) => {
  const result = await tira.reinsurance.submit({
    request_id: uuid(),
    callback_url: "https://your-server.com/tira/reinsurance-callback",
    insurer_company_code: "ICC103",
    covernote_reference_number: req.body.covernote_reference_number,
    premium_including_tax: req.body.premium_including_tax,
    authorizing_officer_name: "Johnson Abraham",
    authorizing_officer_title: "Manager",
    reinsurance_category: req.body.reinsurance_category,
    reinsurance_details: req.body.reinsurance_details,
  });

  res.json({
    message: "Submitted to TIRA",
    acknowledgement_id: result.acknowledgement_id,
    status: result.tira_status_code,
  });
});

// Handle TIRA's callback and acknowledge
app.post("/tira/reinsurance-callback", async (req, res) => {
  const result = await tira.reinsurance.handleCallback(req.body);

  try {
    await db.reinsurance.update({
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

### Currency

If you're using a foreign currency (not TZS), provide both `currency_code` and `exchange_rate`. If omitted, they default to `"TZS"` and `1.0` respectively.

```js
// TZS (default) — no need to specify
{
  premium_including_tax: 619500,
}

// Foreign currency — specify both
{
  currency_code: "USD",
  exchange_rate: 2500.00,
  premium_including_tax: 247.80,
}
```

### Multiple Participants

A reinsurance arrangement typically involves multiple participants. At least one `reinsurance_details` entry is required, but most real-world submissions include several — a leader and one or more local or foreign reinsurers.

Each participant has their own `premium_share`, `brokerage_commission`, `reinsurance_commission`, and `participation_date`.

```js
reinsurance_details: [
  {
    participant_code: "RE001",
    participant_type: "1", // Leader
    reinsurance_form: "3",
    reinsurance_type: "1",
    re_broker_code: "BRK001",
    brokerage_commission: 5000,
    reinsurance_commission: 10000,
    premium_share: 250000,
    participation_date: "2025-05-31T21:00:00Z",
  },
  {
    participant_code: "RE002",
    participant_type: "4", // Facultative Outward Local
    reinsurance_form: "3",
    reinsurance_type: "1",
    re_broker_code: "BRK002",
    brokerage_commission: 3000,
    reinsurance_commission: 8000,
    premium_share: 150000,
    participation_date: "2025-05-31T21:00:00Z",
  },
  {
    participant_code: "RE003",
    participant_type: "5", // Facultative Outward Foreign
    reinsurance_form: "3",
    reinsurance_type: "1",
    re_broker_code: "BRK003",
    brokerage_commission: 2000,
    reinsurance_commission: 6000,
    premium_share: 100000,
    participation_date: "2025-05-31T21:00:00Z",
  },
];
```

## Common Mistakes

::: danger Forgetting to acknowledge the callback
TIRA retries callbacks indefinitely until you acknowledge them. Always call `tira.acknowledge(result.body, uuid())` and return the XML, even if processing the callback data failed.
:::

::: danger Invalid cover note reference number
The `covernote_reference_number` must be from a previously submitted and approved cover note. Using a pending or rejected reference will cause TIRA to reject your reinsurance submission.
:::

::: danger Empty reinsurance details array
At least one `ReinsuranceDetail` entry is required. An empty array throws a `TiraValidationError`.
:::

::: danger Missing XML middleware
Without `express.text({ type: "application/xml" })`, your callback `req.body` will be empty and parsing will fail. Add this middleware before your callback route.
:::

::: danger Confusing submission acknowledgement with approval
`"TIRA001"` in the submission response means "received", not "approved". The actual approval or rejection comes later via the callback. Don't tell your users their reinsurance is approved at submission time.
:::

## Related Pages

- [Callbacks & Acknowledgements](/callbacks-acknowledgements) — The full callback lifecycle
- [Signing & Verification](/signing-verification) — How digital signatures work
- [Error Codes](/error-codes) — All TIRA status codes and fixes
- [Initialization](/initialization) — Setting up the Tira client
