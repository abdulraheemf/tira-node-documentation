# Signing & Verification

Every message exchanged between your system and TIRA is digitally signed. This means TIRA can be sure a request is really from you, and you can be sure a response is really from TIRA. The package handles all of this automatically — you don't need to write any signing or verification code yourself.

This page explains how it works under the hood.

## How It Works (The Big Picture)

TIRA uses a system called **PKI (Public Key Infrastructure)**. The idea is simple:

- **You** have a private key that only you know. You use it to sign your messages.
- **TIRA** has a public key that you can use to verify their messages.
- The same works in reverse — TIRA uses your public key to verify your messages.

These keys come packaged in `.pfx` certificate files using the **PKCS#12** standard. The signing algorithm is **SHA1withRSA**, and the signature is **BASE64** encoded.

This gives you three guarantees:
1. **Authentication** — both sides know who they're talking to
2. **Integrity** — the message hasn't been changed in transit
3. **Non-repudiation** — the sender can't deny they sent the message

## Your Two Certificate Files

You received two `.pfx` files from TIRA. Here's what each one does:

### `tiramisclientprivate.pfx` — Your Private Certificate

This is **your** certificate. It contains your private key and is used for two things:

1. **Signing your requests** — every time you send data to TIRA, the package signs it with this key. TIRA then uses your public key on their side to verify it's really from you.
2. **Mutual TLS** — the package uses this certificate to prove your identity at the network level too.

### `tiramispublic.pfx` — TIRA's Public Certificate

This is **TIRA's** certificate. It contains TIRA's public key and is used for two things:

1. **Verifying callbacks** — when TIRA sends a response to your callback URL, the package verifies the signature using this certificate. If the signature doesn't match, the package throws an error.
2. **TLS trust** — the package uses this certificate to trust TIRA's server during HTTPS connections.

::: tip You never handle these directly
You just pass the file paths and passphrases to the `Tira` constructor. The package reads the files, extracts the keys, and uses them whenever needed. You don't need to call any signing or verification functions yourself.
:::

## What Happens When You Send a Request

When you call something like `tira.motor.submit({...})`, here's what happens behind the scenes:

```
Step 1: Your JSON data is converted to XML
        { motor_category: "1", ... }  →  <MotorCoverNoteRefReq>...</MotorCoverNoteRefReq>

Step 2: The XML is signed with your private key (SHA1withRSA)
        The signature is BASE64 encoded

Step 3: Everything is wrapped in the TiraMsg envelope
```

The final message that gets sent to TIRA looks like this:

```xml
<TiraMsg>
<MotorCoverNoteRefReq>
  <CoverNoteHdr>
    <RequestId>YOUR-REQUEST-ID</RequestId>
    <!-- ...your data... -->
  </CoverNoteHdr>
  <CoverNoteDtl>
    <!-- ...your data... -->
  </CoverNoteDtl>
</MotorCoverNoteRefReq>
<MsgSignature>U6vJ6jZYnrQQST5e/wBifETG9aiP...base64...</MsgSignature>
</TiraMsg>
```

The `<MsgSignature>` is the digital signature of everything above it. TIRA uses this to verify the message came from you and wasn't changed.

**You don't need to do any of this yourself.** Just call `.submit()` with your JSON payload and the package does the rest.

## What Happens When TIRA Sends a Callback

When TIRA sends a result to your callback URL, the message looks the same:

```xml
<TiraMsg>
<CoverNoteRefRes>
  <ResponseId>TIRA22424232355</ResponseId>
  <RequestId>NIC22424232355</RequestId>
  <CoverNoteReferenceNumber>3325253254</CoverNoteReferenceNumber>
  <ResponseStatusCode>TIRA001</ResponseStatusCode>
  <ResponseStatusDesc>Successful</ResponseStatusDesc>
</CoverNoteRefRes>
<MsgSignature>btrhrtigronoirengoienfionewif...base64...</MsgSignature>
</TiraMsg>
```

When you handle this callback, the package:

1. Extracts the content and the `<MsgSignature>` from the XML
2. Verifies the signature using TIRA's public certificate (`tiramispublic.pfx`)
3. If the signature is **valid** — parses the XML and returns clean JSON to you
4. If the signature is **invalid** — throws a `TiraSignatureError` (the message may have been tampered with or it's not from TIRA)

```js
// The package verifies the signature automatically
const result = await tira.motor.handleCallback(callbackData);

// result.signature_verified → true (signature was checked and is valid)
// result.extracted → your clean data as JSON
```

## The `signature_verified` Field

Every callback result includes a `signature_verified` field:

| Value | Meaning |
|---|---|
| `true` | The signature was verified and is valid — the message is genuinely from TIRA |
| `false` | Verification was skipped (e.g. you set `verify_signatures: false` in your config) |

```js
const result = await tira.motor.handleCallback(callbackData);

if (result.signature_verified) {
  console.log("This callback is verified — it's from TIRA");
}
```

::: warning
If `verify_signatures` is set to `false`, the package won't check the signature at all. Only do this during development. In production, always keep signature verification enabled.
:::

## Mutual TLS

On top of digital signatures, the package also sets up **mutual TLS** (mTLS). This is a second layer of security at the network level.

Normal HTTPS only proves the server is who they say they are. Mutual TLS goes both ways:

- **Your PFX** provides a client certificate — so TIRA's server can verify it's your system connecting
- **TIRA's PFX** provides the CA certificate — so your system trusts TIRA's server

This is set up once when you create the `Tira` instance and is used for every request automatically. You don't need to configure anything extra.

## Error Handling

The package provides specific error classes for signing and verification issues:

### `TiraSignatureError`

Thrown when a callback's signature doesn't match. This means the message may not be from TIRA, or it was changed in transit.

```js
const { TiraSignatureError } = require("tira-node");

try {
  const result = await tira.motor.handleCallback(callbackData);
} catch (err) {
  if (err instanceof TiraSignatureError) {
    console.error("Signature verification failed:", err.message);
    // Don't trust this callback — it may not be from TIRA
  }
}
```

### `TiraApiError`

Thrown when TIRA returns an HTTP error (non-2xx status code). This is not a signature issue — it means something went wrong with the request itself.

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

## Summary

| What | How | Handled By |
|---|---|---|
| Signing your requests | RSA-SHA1 with your private PFX, BASE64 encoded | Automatic |
| Verifying TIRA's callbacks | RSA-SHA1 with TIRA's public PFX | Automatic |
| Mutual TLS | Client cert from your PFX, CA from TIRA's PFX | Automatic |
| XML wrapping (`<TiraMsg>`) | Content + `<MsgSignature>` | Automatic |
| JSON ↔ XML conversion | Your JSON in, clean JSON out | Automatic |

You write JSON. The package handles the rest.
