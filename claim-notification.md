# Claim Notification

The Claim Notification resource handles claim notification submissions to TIRA. Use `tira.claimNotification` to notify TIRA about an insurance claim against an existing cover note, and to handle TIRA's asynchronous callback responses.

For the general submit-callback-acknowledge flow, see [Callbacks & Acknowledgements](/callbacks-acknowledgements).

## Available Methods

| Method                                         | Description                                 | When to Use                                                        | Returns                                             |
| ---------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------ | --------------------------------------------------- |
| `tira.claimNotification.submit(payload)`       | Submit a claim notification to TIRA         | When a policyholder reports a claim against an existing cover note | `ClaimNotificationResponse`                         |
| `tira.claimNotification.handleCallback(input)` | Parse and extract data from TIRA's callback | When TIRA sends the result of your submission to your callback URL | `CallbackResult<ClaimNotificationCallbackResponse>` |

## .submit() Payload

```ts
await tira.claimNotification.submit(payload): Promise<ClaimNotificationResponse>
```

Submits a claim notification to TIRA. This is an asynchronous operation — you receive an acknowledgement immediately, and the actual result (including the `claim_reference_number`) comes later via your callback URL.

**Endpoint:** `POST /eclaim/api/claim/claim-notification/v1/request`

### Payload Fields

| Field                        | Type           | Required | Default | XML Tag                    | Description                                                                |
| ---------------------------- | -------------- | -------- | ------- | -------------------------- | -------------------------------------------------------------------------- |
| `request_id`                 | `string`       | Yes      | —       | `RequestId`                | Unique request identifier                                                  |
| `callback_url`               | `string`       | Yes      | —       | `CallBackUrl`              | Where TIRA sends results                                                   |
| `insurer_company_code`       | `string`       | Yes      | —       | `InsurerCompanyCode`       | Insurer's company code                                                     |
| `claim_notification_number`  | `string`       | Yes      | —       | `ClaimNotificationNumber`  | Claim notification number as per insurer. String(50).                      |
| `covernote_reference_number` | `string`       | Yes      | —       | `CoverNoteReferenceNumber` | The TIRA cover note reference number the claim is against. String(50).     |
| `claim_report_date`          | `string\|Date` | Yes      | —       | `ClaimReportDate`          | Date and time the claim was reported. See [Date Handling](#date-handling). |
| `claim_form_duly_filled`     | `"Y"\|"N"`     | Yes      | —       | `ClaimFormDullyFilled`     | Whether a filled claim form has been submitted. Y=Yes, N=No.               |
| `loss_date`                  | `string\|Date` | Yes      | —       | `LossDate`                 | Date and time the loss occurred. See [Date Handling](#date-handling).      |
| `loss_nature`                | `string`       | Yes      | —       | `LossNature`               | Nature of the loss (e.g., "Fire and Allied Perils"). String(100).          |
| `loss_type`                  | `string`       | Yes      | —       | `LossType`                 | Type of the loss (e.g., "Bodily Injury"). String(100).                     |
| `loss_location`              | `string`       | Yes      | —       | `LossLocation`             | Location where the loss occurred (e.g., "Morogoro"). String(100).          |
| `officer_name`               | `string`       | Yes      | —       | `OfficerName`              | Name of the authorizing officer. String(100).                              |
| `officer_title`              | `string`       | Yes      | —       | `OfficerTitle`             | Title of the authorizing officer (e.g., "Underwriter"). String(100).       |

::: info Auto-filled header fields
The XML header fields `CompanyCode`, `SystemCode`, and `TranCompanyCode` are automatically filled from your Tira config — you don't need to include them in the payload.
:::

### Date Handling

The package automatically converts dates to East Africa Time (UTC+3) and formats them as `YYYY-MM-DDTHH:mm:ss` (no timezone suffix). You can pass either an ISO string or a JavaScript `Date` object.

::: tip Example
If you pass `"2020-09-15T10:55:22Z"` (10:55 AM UTC), the package converts it to `"2020-09-15T13:55:22"` (1:55 PM EAT).
:::

### Validation Rules

The package validates your payload before sending it to TIRA. If validation fails, it throws a `TiraValidationError` with the field name and a descriptive message.

- All fields are required — there are no optional or conditional fields
- `callback_url` must be a valid URL
- `claim_report_date` must be a valid date string (ISO format)
- `loss_date` must be a valid date string (ISO format)
- `claim_form_duly_filled` must be `"Y"` or `"N"`

### Example — Submit a Claim Notification

```js
const result = await tira.claimNotification.submit({
  request_id: "NIC22424232355",
  callback_url: "https://your-server.com/tira/claim-notification-callback",
  insurer_company_code: "IC001",
  claim_notification_number: "NIC00004",
  covernote_reference_number: "3252-5252",
  claim_report_date: "2020-09-15T13:55:22",
  claim_form_duly_filled: "Y",
  loss_date: "2020-09-15T13:55:22",
  loss_nature: "Fire and Allied Perils",
  loss_type: "Bodily Injury",
  loss_location: "Morogoro",
  officer_name: "John Doe",
  officer_title: "Underwriter",
});

console.log(result.acknowledgement_id); // "ACK123456"
console.log(result.tira_status_code); // "TIRA001"
```

## .submit() Response

When you call `tira.claimNotification.submit()`, you get an immediate `ClaimNotificationResponse` from TIRA:

| Field                      | Type                      | Description                                |
| -------------------------- | ------------------------- | ------------------------------------------ |
| `acknowledgement_id`       | `string`                  | TIRA's acknowledgement ID                  |
| `request_id`               | `string`                  | Your original request ID (echoed back)     |
| `tira_status_code`         | `string`                  | Status code — `"TIRA001"` means received   |
| `tira_status_desc`         | `string`                  | Human-readable description                 |
| `requires_acknowledgement` | `boolean`                 | Always `true`                              |
| `acknowledgement_payload`  | `Record<string, unknown>` | Raw parsed acknowledgement (rarely needed) |

::: tip "TIRA001" means "received", not "approved"
At this stage, `"TIRA001"` means TIRA received your request and it's being processed. It does **not** mean your claim notification has been approved. The actual result (including the `claim_reference_number`) comes later via your callback URL.

If you get a code other than `"TIRA001"`, something went wrong with the submission itself. Check the [Error Codes](/error-codes) page for the specific code.
:::

## .submit() Callback Response

After TIRA processes your submission, it sends the result to your `callback_url`. The callback contains the actual outcome — whether your claim notification was accepted or rejected, and the assigned `claim_reference_number` on success.

### Extracted Data

The `extracted` field contains the parsed callback data:

| Field                    | Type     | Description                                                              |
| ------------------------ | -------- | ------------------------------------------------------------------------ |
| `response_id`            | `string` | TIRA's response ID                                                       |
| `request_id`             | `string` | Your original request ID                                                 |
| `response_status_code`   | `string` | `"TIRA001"` = accepted. See [Error Codes](/error-codes) for other codes. |
| `response_status_desc`   | `string` | Human-readable status description                                        |
| `claim_reference_number` | `string` | Claim reference number assigned by TIRA (on success)                     |

### On Success

When `response_status_code` is `"TIRA001"`, the claim notification was accepted. You'll receive the `claim_reference_number` — save this, it's the official TIRA identifier you'll need for subsequent claim lifecycle steps (intimation, assessment, etc.).

```js
// response_status_code === "TIRA001"
console.log(result.extracted.claim_reference_number); // "3325253254"
console.log(result.extracted.request_id); // "NIC22424232355"
```

### On Error

When `response_status_code` is anything other than `"TIRA001"`, the claim notification was rejected. The `claim_reference_number` will be empty. Check the [Error Codes](/error-codes) page for the specific code.

```js
// response_status_code !== "TIRA001"
console.log(result.extracted.response_status_code); // e.g., "TIRA020"
console.log(result.extracted.response_status_desc); // e.g., "Invalid request"
```

### Example — Handling the Callback

```js
app.post("/tira/claim-notification-callback", async (req, res) => {
  const result = await tira.claimNotification.handleCallback(req.body);

  if (result.extracted.response_status_code === "TIRA001") {
    await db.claimNotifications.update({
      where: { request_id: result.extracted.request_id },
      data: {
        status: "accepted",
        claim_reference_number: result.extracted.claim_reference_number,
      },
    });
  } else {
    console.error(
      `Claim notification rejected: ${result.extracted.response_status_code}`,
      result.extracted.response_status_desc,
    );

    await db.claimNotifications.update({
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

1. Derives the correct acknowledgement tag name (`ClaimNotificationRefRes` → `ClaimNotificationRefResAck`)
2. Fills in `AcknowledgementId`, `ResponseId`, `AcknowledgementStatusCode`, and `AcknowledgementStatusDesc`
3. Signs the XML with your private key
4. Wraps it in `<TiraMsg>` with `<MsgSignature>`

### What the XML Looks Like

You don't need to build this yourself — this is what the package generates:

```xml
<TiraMsg>
<ClaimNotificationRefResAck>
  <AcknowledgementId>your-unique-id</AcknowledgementId>
  <ResponseId>TIRA22424232355</ResponseId>
  <AcknowledgementStatusCode>TIRA001</AcknowledgementStatusCode>
  <AcknowledgementStatusDesc>Successful</AcknowledgementStatusDesc>
</ClaimNotificationRefResAck>
<MsgSignature>base64-encoded-signature...</MsgSignature>
</TiraMsg>
```

### Example

```js
const { v4: uuid } = require("uuid");

app.post("/tira/claim-notification-callback", async (req, res) => {
  const result = await tira.claimNotification.handleCallback(req.body);

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
app.post("/tira/claim-notification-callback", async (req, res) => {
  const result = await tira.claimNotification.handleCallback(req.body);

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
await tira.claimNotification.handleCallback(input: string | Record<string, any>): Promise<CallbackResult<ClaimNotificationCallbackResponse>>
```

This function parses the callback XML that TIRA sends to your callback URL and extracts the relevant data. You can also use the universal `tira.handleCallback()` if you have a single endpoint for all callback types.

### What It Does

1. **Verifies the signature** — checks that the callback's `<MsgSignature>` matches TIRA's public key (if signature verification is configured)
2. **Parses the XML** — converts the raw XML into a JavaScript object
3. **Extracts the data** — pulls out the fields you care about (`claim_reference_number`, `response_status_code`, etc.) into a clean `extracted` object

### Input

You can pass either:

- A **raw XML string** — the `req.body` from your Express handler (requires `express.text({ type: "application/xml" })` middleware)
- A **pre-parsed object** — if you've already parsed the XML yourself

### What It Returns

| Field                | Type                                | Description                                                             |
| -------------------- | ----------------------------------- | ----------------------------------------------------------------------- |
| `type`               | `"claim_notification"`              | Always `"claim_notification"` for this handler                          |
| `extracted`          | `ClaimNotificationCallbackResponse` | The extracted data (see [Callback Response](#submit-callback-response)) |
| `body`               | `Record<string, any>`               | Full parsed XML as JS object — pass this to `tira.acknowledge()`        |
| `signature_verified` | `boolean`                           | Whether TIRA's digital signature was verified                           |
| `raw_xml`            | `string`                            | The original XML string                                                 |

### Resource-Specific vs Universal Handler

| Approach          | Method                                         | When to Use                                                                                |
| ----------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Resource-specific | `tira.claimNotification.handleCallback(input)` | When you have separate endpoints per resource type                                         |
| Universal         | `tira.handleCallback(input)`                   | When you have one endpoint for all TIRA callbacks (requires `enabled_callbacks` in config) |

Both return the same data. The universal handler auto-detects the callback type. See [Callbacks & Acknowledgements](/callbacks-acknowledgements) for details on the universal handler.

## Full Example

A complete Express.js application that submits a claim notification, handles the callback, and acknowledges it.

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
  pfx_path: "./certs/tiramisclientprivate.pfx",
  pfx_passphrase: process.env.TIRA_PFX_PASSPHRASE,
  tira_public_pfx_path: "./certs/tiramispublic.pfx",
  tira_public_pfx_passphrase: process.env.TIRA_PUBLIC_PFX_PASSPHRASE,
});

// Submit a claim notification
app.post("/submit-claim-notification", async (req, res) => {
  const result = await tira.claimNotification.submit({
    request_id: uuid(),
    callback_url: "https://your-server.com/tira/claim-notification-callback",
    insurer_company_code: "IC001",
    claim_notification_number: req.body.claim_notification_number,
    covernote_reference_number: req.body.covernote_reference_number,
    claim_report_date: req.body.claim_report_date,
    claim_form_duly_filled: req.body.claim_form_duly_filled,
    loss_date: req.body.loss_date,
    loss_nature: req.body.loss_nature,
    loss_type: req.body.loss_type,
    loss_location: req.body.loss_location,
    officer_name: req.body.officer_name,
    officer_title: req.body.officer_title,
  });

  res.json({
    message: "Submitted to TIRA",
    acknowledgement_id: result.acknowledgement_id,
    status: result.tira_status_code,
  });
});

// Handle TIRA's callback and acknowledge
app.post("/tira/claim-notification-callback", async (req, res) => {
  const result = await tira.claimNotification.handleCallback(req.body);

  try {
    await db.claimNotifications.update({
      where: { request_id: result.extracted.request_id },
      data: {
        status: result.extracted.response_status_code,
        claim_reference_number: result.extracted.claim_reference_number,
      },
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

### Claim Report Date vs Loss Date

These two date fields serve different purposes:

- `claim_report_date` — when the claim was **reported** to the insurer (i.e., when the policyholder came to your office)
- `loss_date` — when the loss actually **occurred** (i.e., the date of the accident, fire, theft, etc.)

These can be the same date (if the claim is reported on the day of loss) or different dates (if reported later). Both are required.

## Common Mistakes

::: danger Forgetting to acknowledge the callback
TIRA retries callbacks indefinitely until you acknowledge them. Always call `tira.acknowledge(result.body, uuid())` and return the XML, even if processing the callback data failed.
:::

::: danger Missing XML middleware
Without `express.text({ type: "application/xml" })`, your callback `req.body` will be empty and parsing will fail. Add this middleware before your callback route.
:::

::: danger Confusing submission acknowledgement with approval
`"TIRA001"` in the submission response means "received", not "approved". The actual approval or rejection comes later via the callback. Don't tell your users their claim notification is accepted at submission time.
:::

::: danger Invalid callback URL
The `callback_url` must be a valid, publicly accessible URL. The package validates the URL format before sending. If the URL is malformed, you'll get a `TiraValidationError`. If it's valid but unreachable by TIRA, you'll never receive the callback.
:::

::: danger Saving the claim reference number
The `claim_reference_number` returned in the callback is required for subsequent claim lifecycle steps — claim intimation, assessment, discharge voucher, payment, and rejection all reference this number. Make sure you save it.
:::

## Related Pages

- [Callbacks & Acknowledgements](/callbacks-acknowledgements) — The full callback lifecycle
- [Signing & Verification](/signing-verification) — How digital signatures work
- [Error Codes](/error-codes) — All TIRA status codes and fixes
- [Initialization](/initialization) — Setting up the Tira client
