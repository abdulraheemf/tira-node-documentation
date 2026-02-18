# Policy

The Policy resource converts approved cover notes into formal insurance policies. Use `tira.policy` to submit policy requests that reference one or more previously approved cover notes, and handle TIRA's asynchronous callback responses.

For the general submit-callback-acknowledge flow, see [Callbacks & Acknowledgements](/callbacks-acknowledgements).

## Available Methods

| Method | Description | When to Use | Returns |
|---|---|---|---|
| `tira.policy.submit(payload)` | Submit a policy request referencing approved cover notes | After your cover notes have been approved by TIRA | `PolicyResponse` |
| `tira.policy.handleCallback(input)` | Parse and extract data from TIRA's callback | When TIRA sends the result of your submission to your callback URL | `CallbackResult<PolicyCallbackResponse>` |

## .submit() Payload

```ts
await tira.policy.submit(payload): Promise<PolicyResponse>
```

Submits a policy request to TIRA. This is an asynchronous operation — you receive an acknowledgement immediately, and the actual result comes later via your callback URL.

**Endpoint:** `POST /ecovernote/api/policy/v1/request`

### Payload Fields

| Field | Type | Required | Default | XML Tag | Description |
|---|---|---|---|---|---|
| `request_id` | `string` | Yes | — | `RequestId` | Unique request identifier |
| `callback_url` | `string` | Yes | — | `CallBackUrl` | Where TIRA sends results |
| `insurer_company_code` | `string` | Yes | — | `InsurerCompanyCode` | Insurer's company code |
| `policy_detail` | `PolicyDetail` | Yes | — | `PolicyDtl` | Policy details. See [Policy Detail](#policy-detail). |

### Policy Detail

The `policy_detail` object describes the policy being submitted.

| Field | Type | Required | Default | XML Tag | Description |
|---|---|---|---|---|---|
| `policy_number` | `string` | Yes | — | `PolicyNumber` | Policy number as per insurer. Max 50 characters. |
| `policy_operative_clause` | `string` | Yes | — | `PolicyOperativeClause` | Policy operative clauses. Max 1000 characters. |
| `special_conditions` | `string` | Yes | — | `SpecialConditions` | Policy special conditions. Max 1000 characters. |
| `exclusions` | `string` | No | `""` | `Exclusions` | Policy exclusions if any. Max 1000 characters. |
| `applied_cover_notes` | `string[]` | Yes | — | `AppliedCoverNotes > CoverNoteReferenceNumber` | Cover note reference numbers from previously approved cover notes. At least one required. |

### Validation Rules

The package validates your payload before sending it to TIRA. If validation fails, it throws a `TiraValidationError` with the field name and a descriptive message.

- `request_id` is required
- `callback_url` must be a valid URL
- `insurer_company_code` is required
- `policy_detail` is required
- `policy_detail.policy_number` is required
- `policy_detail.policy_operative_clause` is required
- `policy_detail.special_conditions` is required
- `policy_detail.applied_cover_notes` must be a non-empty array
- Each entry in `applied_cover_notes` must be a non-empty string

### Example — Submit a Policy

```js
const result = await tira.policy.submit({
  request_id: "NIC22424232355",
  callback_url: "https://example.com/policy/callback",
  insurer_company_code: "ICC103",
  policy_detail: {
    policy_number: "CV224223255",
    policy_operative_clause: "Full comprehensive coverage for all listed items",
    special_conditions: "Coverage applies only within Tanzania mainland",
    exclusions: "War and terrorism excluded",
    applied_cover_notes: ["4242424", "2323235"],
  },
});

console.log(result.acknowledgement_id); // "ACK123456"
console.log(result.tira_status_code);   // "TIRA001"
```

### Example — Multiple Cover Notes

A policy can reference multiple approved cover notes:

```js
const result = await tira.policy.submit({
  request_id: "NIC22424232356",
  callback_url: "https://example.com/policy/callback",
  insurer_company_code: "ICC103",
  policy_detail: {
    policy_number: "CV224223256",
    policy_operative_clause: "Comprehensive motor fleet coverage",
    special_conditions: "All vehicles must be registered in Tanzania",
    // No exclusions — defaults to ""
    applied_cover_notes: ["CN-2025-001", "CN-2025-002", "CN-2025-003"],
  },
});
```

## .submit() Response

When you call `tira.policy.submit()`, you get an immediate `PolicyResponse` from TIRA:

| Field | Type | Description |
|---|---|---|
| `acknowledgement_id` | `string` | TIRA's acknowledgement ID |
| `request_id` | `string` | Your original request ID (echoed back) |
| `tira_status_code` | `string` | Status code — `"TIRA001"` means received |
| `tira_status_desc` | `string` | Human-readable description |
| `requires_acknowledgement` | `boolean` | Always `true` |
| `acknowledgement_payload` | `Record<string, unknown>` | Raw parsed acknowledgement (rarely needed) |

::: tip "TIRA001" means "received", not "approved"
At this stage, `"TIRA001"` means TIRA received your request and it's being processed. It does **not** mean your policy has been approved. The actual result (approved or rejected) comes later via your callback URL.

If you get a code other than `"TIRA001"`, something went wrong with the submission itself. Check the [Error Codes](/error-codes) page for the specific code.
:::

## .submit() Callback Response

After TIRA processes your submission, it sends the result to your `callback_url`. The callback contains the actual outcome — whether your policy was approved or rejected.

### Extracted Data

The `extracted` field contains the parsed callback data:

| Field | Type | Description |
|---|---|---|
| `response_id` | `string` | TIRA's response ID |
| `request_id` | `string` | Your original request ID |
| `response_status_code` | `string` | `"TIRA001"` = approved. See [Error Codes](/error-codes) for other codes. |
| `response_status_desc` | `string` | Human-readable status description |

### On Success

When `response_status_code` is `"TIRA001"`, the policy was approved.

```js
// response_status_code === "TIRA001"
console.log(result.extracted.response_status_code); // "TIRA001"
console.log(result.extracted.response_status_desc); // "Successful"
```

### On Error

When `response_status_code` is anything other than `"TIRA001"`, the policy was rejected. Check the [Error Codes](/error-codes) page for the specific code.

```js
// response_status_code !== "TIRA001"
console.log(result.extracted.response_status_code); // e.g., "TIRA020"
console.log(result.extracted.response_status_desc); // e.g., "Invalid policy details"
```

### Example — Handling the Callback

```js
app.post("/tira/policy-callback", async (req, res) => {
  const result = await tira.policy.handleCallback(req.body);

  if (result.extracted.response_status_code === "TIRA001") {
    await db.policies.update({
      where: { request_id: result.extracted.request_id },
      data: { status: "approved" },
    });
  } else {
    console.error(
      `Policy rejected: ${result.extracted.response_status_code}`,
      result.extracted.response_status_desc
    );

    await db.policies.update({
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

| Argument | Description |
|---|---|
| `result.body` | The `body` from the callback result — the full parsed XML as a JS object |
| `uniqueId` | A unique string you generate (e.g., a UUID) |

The package automatically:
1. Derives the correct acknowledgement tag name (`PolicyRes` → `PolicyResAck`)
2. Fills in `AcknowledgementId`, `ResponseId`, `AcknowledgementStatusCode`, and `AcknowledgementStatusDesc`
3. Signs the XML with your private key
4. Wraps it in `<TiraMsg>` with `<MsgSignature>`

### What the XML Looks Like

You don't need to build this yourself — this is what the package generates:

```xml
<TiraMsg>
<PolicyResAck>
  <AcknowledgementId>your-unique-id</AcknowledgementId>
  <ResponseId>TIRA22424232355</ResponseId>
  <AcknowledgementStatusCode>TIRA001</AcknowledgementStatusCode>
  <AcknowledgementStatusDesc>Successful</AcknowledgementStatusDesc>
</PolicyResAck>
<MsgSignature>base64-encoded-signature...</MsgSignature>
</TiraMsg>
```

### Example

```js
const { v4: uuid } = require("uuid");

app.post("/tira/policy-callback", async (req, res) => {
  const result = await tira.policy.handleCallback(req.body);

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
app.post("/tira/policy-callback", async (req, res) => {
  const result = await tira.policy.handleCallback(req.body);

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
await tira.policy.handleCallback(input: string | Record<string, any>): Promise<CallbackResult<PolicyCallbackResponse>>
```

This function parses the callback XML that TIRA sends to your callback URL and extracts the relevant data. You can also use the universal `tira.handleCallback()` if you have a single endpoint for all callback types.

### What It Does

1. **Verifies the signature** — checks that the callback's `<MsgSignature>` matches TIRA's public key (if signature verification is configured)
2. **Parses the XML** — converts the raw XML into a JavaScript object
3. **Extracts the data** — pulls out the fields you care about (`response_id`, `request_id`, `response_status_code`, `response_status_desc`) into a clean `extracted` object

### Input

You can pass either:
- A **raw XML string** — the `req.body` from your Express handler (requires `express.text({ type: "application/xml" })` middleware)
- A **pre-parsed object** — if you've already parsed the XML yourself

### What It Returns

| Field | Type | Description |
|---|---|---|
| `type` | `"policy"` | Always `"policy"` for this handler |
| `extracted` | `PolicyCallbackResponse` | The extracted data (see [Callback Response](#submit-callback-response)) |
| `body` | `Record<string, any>` | Full parsed XML as JS object — pass this to `tira.acknowledge()` |
| `signature_verified` | `boolean` | Whether TIRA's digital signature was verified |
| `raw_xml` | `string` | The original XML string |

### Resource-Specific vs Universal Handler

| Approach | Method | When to Use |
|---|---|---|
| Resource-specific | `tira.policy.handleCallback(input)` | When you have separate endpoints per resource type |
| Universal | `tira.handleCallback(input)` | When you have one endpoint for all TIRA callbacks (requires `enabled_callbacks` in config) |

Both return the same data. The universal handler auto-detects the callback type. See [Callbacks & Acknowledgements](/callbacks-acknowledgements) for details on the universal handler.

## Full Example

A complete Express.js application that submits a policy, handles the callback, and acknowledges it.

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

// Submit a policy
app.post("/submit-policy", async (req, res) => {
  const result = await tira.policy.submit({
    request_id: uuid(),
    callback_url: "https://your-server.com/tira/policy-callback",
    insurer_company_code: "ICC103",
    policy_detail: {
      policy_number: req.body.policy_number,
      policy_operative_clause: req.body.operative_clause,
      special_conditions: req.body.special_conditions,
      exclusions: req.body.exclusions,
      applied_cover_notes: req.body.cover_note_references,
    },
  });

  res.json({
    message: "Submitted to TIRA",
    acknowledgement_id: result.acknowledgement_id,
    status: result.tira_status_code,
  });
});

// Handle TIRA's callback and acknowledge
app.post("/tira/policy-callback", async (req, res) => {
  const result = await tira.policy.handleCallback(req.body);

  try {
    await db.policies.update({
      where: { request_id: result.extracted.request_id },
      data: {
        status: result.extracted.response_status_code === "TIRA001"
          ? "approved"
          : "rejected",
        tira_response_code: result.extracted.response_status_code,
        tira_response_desc: result.extracted.response_status_desc,
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

### Exclusions Field

The `exclusions` field is optional and defaults to an empty string `""` in the XML. If you have no exclusions, you can omit it entirely:

```js
policy_detail: {
  policy_number: "CV224223255",
  policy_operative_clause: "Full comprehensive coverage",
  special_conditions: "Tanzania mainland only",
  // exclusions is omitted — defaults to ""
  applied_cover_notes: ["4242424"],
}
```

### Applied Cover Notes

The `applied_cover_notes` array must contain at least one cover note reference number, and every entry must be a non-empty string. These are the TIRA-assigned reference numbers you received in the callback response when your cover notes were approved.

```js
// Valid — at least one reference
applied_cover_notes: ["4242424"]

// Valid — multiple references
applied_cover_notes: ["4242424", "2323235", "5656789"]

// Invalid — empty array (throws TiraValidationError)
applied_cover_notes: []

// Invalid — contains empty string (throws TiraValidationError)
applied_cover_notes: ["4242424", ""]
```

## Common Mistakes

::: danger Forgetting to acknowledge the callback
TIRA retries callbacks indefinitely until you acknowledge them. Always call `tira.acknowledge(result.body, uuid())` and return the XML, even if processing the callback data failed.
:::

::: danger Invalid callback URL
The `callback_url` must be a valid URL. An invalid URL will throw a `TiraValidationError` before the request is sent to TIRA.
:::

::: danger Empty applied_cover_notes
You must provide at least one cover note reference number in `applied_cover_notes`. An empty array or an array containing empty strings will throw a `TiraValidationError`.
:::

::: danger Confusing submission acknowledgement with approval
`"TIRA001"` in the submission response means "received", not "approved". The actual approval or rejection comes later via the callback. Don't tell your users their policy is approved at submission time.
:::

::: danger Missing XML middleware
Without `express.text({ type: "application/xml" })`, your callback `req.body` will be empty and parsing will fail. Add this middleware before your callback route.
:::

## Related Pages

- [Callbacks & Acknowledgements](/callbacks-acknowledgements) — The full callback lifecycle
- [Signing & Verification](/signing-verification) — How digital signatures work
- [Error Codes](/error-codes) — All TIRA status codes and fixes
- [Initialization](/initialization) — Setting up the Tira client
