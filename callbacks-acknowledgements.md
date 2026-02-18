# Callbacks & Acknowledgements

After you submit data to TIRA, you don't get the result right away. TIRA processes your request asynchronously and sends the result later to your callback URL. You then need to acknowledge that you received it.

This page explains the full flow — from submission to callback to acknowledgement. The package handles the hard parts (XML building, signing, parsing) automatically.

## The Full Flow

Every submission to TIRA follows this pattern:

```
Step 1: You submit data
        tira.motor.submit({...})
        Your payload includes a callback_url.
              ↓
Step 2: TIRA acknowledges your submission
        You get back an acknowledgement_id and status.
        This means "we received your request" — not "it's approved".
              ↓
Step 3: TIRA processes your request
        This happens on TIRA's side. You wait for the callback.
              ↓
Step 4: TIRA sends the result to your callback_url
              ↓
Step 5: You handle the callback
        tira.motor.handleCallback(req.body)
              ↓
Step 6: You acknowledge TIRA's callback
        tira.acknowledge(result.body, ackId)
        Send the XML response back to TIRA.
```

::: warning Retry Rules
- **Step 2**: If you don't receive an acknowledgement from TIRA, retry your submission.
- **Step 6**: If TIRA doesn't receive your acknowledgement, they will keep retrying the callback until you acknowledge it.

Both sides keep retrying until the other side confirms receipt.
:::

## Submitting Data

When you call `.submit()`, you include a `callback_url` in your payload. This is where TIRA will send the result.

```js
const result = await tira.motor.submit({
  request_id: "REQ-001",
  callback_url: "https://your-server.com/tira/motor-callback",
  // ...rest of your payload
});

console.log(result.acknowledgement_id); // "ACK123456"
console.log(result.tira_status_code);   // "TIRA001"
console.log(result.tira_status_desc);   // "Successful"
```

The response tells you TIRA received your request:

| Field | Description |
|---|---|
| `acknowledgement_id` | TIRA's ID for this acknowledgement |
| `request_id` | Your original request ID (echoed back) |
| `tira_status_code` | `"TIRA001"` means TIRA received your request |
| `tira_status_desc` | Human-readable description |
| `requires_acknowledgement` | Always `true` |
| `acknowledgement_payload` | Raw parsed acknowledgement data (you won't usually need this) |

::: tip "TIRA001" means "received", not "approved"
At this stage, `"TIRA001"` only means TIRA got your request. It does **not** mean your cover note was approved or your claim was accepted. The actual result comes later via the callback.
:::

## Handling Callbacks

When TIRA finishes processing your request, they send the result to your `callback_url`. You handle it with one of two approaches.

### Approach A: Resource-Specific Handler

Use this when you have a separate endpoint for each callback type. This is the simplest approach.

```js
app.post("/tira/motor-callback", async (req, res) => {
  const result = await tira.motor.handleCallback(req.body);

  console.log(result.extracted); // Clean data — see below for what you get
  console.log(result.signature_verified); // true if signature was valid

  // ...acknowledge (see next section)
});
```

### Approach B: Universal Handler

Use this when you have one endpoint for all TIRA callbacks. Requires `enabled_callbacks` in your config.

```js
const tira = new Tira({
  // ...your config
  enabled_callbacks: {
    motor: true,
    policy: true,
    // only enable what you need
  },
});

app.post("/tira-callback", async (req, res) => {
  const result = await tira.handleCallback(req.body);

  console.log(result.type); // "motor", "policy", etc.
  console.log(result.extracted); // Clean data

  // ...acknowledge (see next section)
});
```

### The Callback Result

Both approaches return a `CallbackResult` with these fields:

| Field | Description |
|---|---|
| `type` | The detected callback type (`"motor"`, `"policy"`, `"motor_fleet"`, etc.) |
| `extracted` | Clean JSON with the response data. See each resource's own documentation page for the exact fields you receive. |
| `body` | Full parsed XML as a JS object (you'll need this for acknowledgement) |
| `signature_verified` | `true` if the digital signature was verified |
| `raw_xml` | The original XML string |

## Acknowledging the Callback

This is the most important step. TIRA expects you to acknowledge every callback. If you don't, they'll keep retrying.

```js
app.post("/tira/motor-callback", async (req, res) => {
  const result = await tira.motor.handleCallback(req.body);

  // Save the result to your database
  await saveToDatabase(result.extracted);

  // Build the acknowledgement XML
  const ackXml = tira.acknowledge(result.body, "your-unique-ack-id");

  // Send it back as the HTTP response
  res.set("Content-Type", "application/xml").send(ackXml);
});
```

### How `tira.acknowledge()` Works

It takes two arguments:

| Argument | Description |
|---|---|
| `result.body` | The `body` from the callback result (the full parsed XML object) |
| `acknowledgementId` | A unique string you generate (e.g. a UUID) |

It returns a signed XML string ready to send as the HTTP response. The package automatically:

- Determines the correct acknowledgement tag (e.g. `MotorCoverNoteRefRes` becomes `MotorCoverNoteRefResAck`)
- Fills in `AcknowledgementId`, `ResponseId`, `AcknowledgementStatusCode`, and `AcknowledgementStatusDesc`
- Signs the XML with your private key
- Wraps it in `<TiraMsg>` with `<MsgSignature>`

### What the Acknowledgement XML Looks Like

You don't need to build this yourself — this is what the package generates:

```xml
<TiraMsg>
<MotorCoverNoteRefResAck>
  <AcknowledgementId>your-unique-ack-id</AcknowledgementId>
  <ResponseId>TIRA22424232355</ResponseId>
  <AcknowledgementStatusCode>TIRA001</AcknowledgementStatusCode>
  <AcknowledgementStatusDesc>Successful</AcknowledgementStatusDesc>
</MotorCoverNoteRefResAck>
<MsgSignature>base64-encoded-signature...</MsgSignature>
</TiraMsg>
```

## Complete Example

Here's a full Express.js example putting it all together — submitting data, handling the callback, and acknowledging it.

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

// Step 1: Submit a motor cover note
app.post("/submit", async (req, res) => {
  const result = await tira.motor.submit({
    request_id: uuid(),
    callback_url: "https://your-server.com/tira/motor-callback",
    // ...rest of your payload
  });

  // Step 2: TIRA acknowledges your submission
  res.json({
    message: "Submitted to TIRA",
    acknowledgement_id: result.acknowledgement_id,
    status: result.tira_status_code,
  });
});

// Step 4 & 5: TIRA sends the result, you handle it
app.post("/tira/motor-callback", async (req, res) => {
  const result = await tira.motor.handleCallback(req.body);

  // Save to your database
  await db.coverNotes.update({
    where: { request_id: result.extracted.request_id },
    data: {
      status: result.extracted.response_status_code,
      reference_number: result.extracted.covernote_reference_number,
      sticker_number: result.extracted.sticker_number,
    },
  });

  // Step 6: Acknowledge TIRA's callback
  const ackXml = tira.acknowledge(result.body, uuid());
  res.set("Content-Type", "application/xml").send(ackXml);
});

app.listen(3000);
```

## Possible Errors

Here are the errors you might encounter when handling callbacks:

### `TiraSignatureError`

The callback's digital signature doesn't match. The message may not be from TIRA, or it was changed in transit.

```js
const { TiraSignatureError } = require("tira-node");

try {
  const result = await tira.motor.handleCallback(req.body);
} catch (err) {
  if (err instanceof TiraSignatureError) {
    console.error("Signature verification failed:", err.message);
    // Don't trust this callback
  }
}
```

See [Signing & Verification](/signing-verification) for more details on how signatures work.

### `TiraApiError`

TIRA returned an HTTP error (non-2xx status code) when you submitted your request. This is not a callback issue — it means something went wrong with the submission itself.

```js
const { TiraApiError } = require("tira-node");

try {
  const result = await tira.motor.submit(payload);
} catch (err) {
  if (err instanceof TiraApiError) {
    console.error("HTTP status:", err.status);
    console.error("Response:", err.bodyText);
  }
}
```

### Callback Type Not Enabled

If you're using the universal `tira.handleCallback()` and the callback type isn't enabled in your config, you'll get this error:

```
Error: Callback type 'motor' is not enabled.
Add { enabled_callbacks: { motor: true } } to your Tira config.
```

Fix it by adding the callback type to your `enabled_callbacks` config. See [Initialization](/initialization#enabled-callbacks) for details.

### Unknown Callback Type

If the callback XML has a response tag the package doesn't recognize:

```
Error: Unknown callback type: unrecognized response tag 'SomeNewTag'.
```

This could mean TIRA added a new response type that the package doesn't support yet. Check for package updates or report it as an issue.

For a full list of TIRA status codes and what they mean, see [Error Codes](/error-codes).

## Important Notes

::: tip Always acknowledge
TIRA will keep retrying the callback if you don't acknowledge it. Always send back the acknowledgement XML, even if you encounter an error while processing the data.
:::

::: tip Unique acknowledgement IDs
The acknowledgement ID should be unique for each callback you receive. Using a UUID is the easiest approach.
:::

::: warning XML content type
Make sure your callback endpoint accepts XML. In Express.js, add this middleware:

```js
app.use(express.text({ type: "application/xml" }));
```

Without this, `req.body` will be empty and the callback handler will fail.
:::

::: warning Error handling
Wrap your callback handler in a try/catch. If something goes wrong while processing the data, try to acknowledge anyway to prevent TIRA from retrying:

```js
app.post("/tira/motor-callback", async (req, res) => {
  let result;
  try {
    result = await tira.motor.handleCallback(req.body);
    await saveToDatabase(result.extracted);
  } catch (err) {
    console.error("Error processing callback:", err);
  }

  // Acknowledge even if processing failed
  if (result) {
    const ackXml = tira.acknowledge(result.body, uuid());
    res.set("Content-Type", "application/xml").send(ackXml);
  } else {
    res.status(500).send("Failed to process callback");
  }
});
```
:::
