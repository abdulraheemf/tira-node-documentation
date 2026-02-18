# Getting Started

Before you can use `tira-node`, you need to go through a setup process with TIRA. This page walks you through everything you need before writing a single line of code.

## Before You Start

`tira-node` connects to TIRA's TIRAMIS system. TIRAMIS does not allow just anyone to connect — you need to go through an onboarding process with TIRA first.

**None of the functions in this package will work** until TIRA has:

1. Approved your integration request
2. Given you your credentials and certificates
3. Whitelisted your server's IP address

If you haven't started this process yet, contact TIRA to begin.

## What You'll Receive from TIRA

Once TIRA approves your integration, they will provide you with several files and credentials. Here's what to expect:

### Reference Documents

TIRA should give you these documents. If you didn't receive them, you can download them from the links below:

| Document | Download Link |
|---|---|
| TIRAMIS API Documentation V1.0 | [Download PDF](https://storage.labedan.solutions/Tira%20Files/TIRAMIS%20API%20OFFICIAL%20DOCUMENTATION%20V1.0.pdf) |
| TIRAMIS API Documentation V1.3 | [Download PDF](https://storage.labedan.solutions/Tira%20Files/TIRAMIS%20API%20OFFICIAL%20DOCUMENTATION%20V1.3.pdf) |
| Countries List | [Download XLSX](https://storage.labedan.solutions/Tira%20Files/COUNTRIES.xlsx) |
| Currencies List | [Download XLSX](https://storage.labedan.solutions/Tira%20Files/CURRENCIES.xlsx) |
| Regions and Districts | [Download XLSX](https://storage.labedan.solutions/Tira%20Files/REGIONS%20AND%20DISTRICTS.xlsx) |
| Product Codes & Risk Codes | [Download XLSX](https://storage.labedan.solutions/Tira%20Files/TIRAMIS%20PRODUCT%20&%20RISK%20CODES.xlsx) |

All public reference files are available at: [storage.labedan.solutions/Tira Files/](https://storage.labedan.solutions/Tira%20Files/)

### API Endpoints

You don't need to memorize or hardcode any TIRAMIS API endpoints. The package includes all of them:

```js
const { ENDPOINTS } = require("tira-node");
// or: import { ENDPOINTS } from "tira-node";

console.log(ENDPOINTS.covernote_motor);
// "/ecovernote/api/covernote/non-life/motor/v2/request"
```

Here are all the available endpoints:

| Key | Endpoint |
|---|---|
| `covernote_motor` | `/ecovernote/api/covernote/non-life/motor/v2/request` |
| `covernote_motor_fleet` | `/ecovernote/api/covernote/non-life/motor-fleet/v2/request` |
| `motor_verification` | `/dispatch/api/motor/verification/v1/request` |
| `covernote_other` | `/ecovernote/api/covernote/non-life/other/v2/request` |
| `shortterm_covernote` | `/ecovernote/api/covernote/non-life/other/v2/request` |
| `longterm_covernote` | `/ecovernote/api/covernote/non-life/other/v2/request` |
| `covernote_verification` | `/ecovernote/api/covernote/verification/v1/request` |
| `policy_submission` | `/ecovernote/api/policy/v1/request` |
| `reinsurance_submission` | `/ecovernote/api/reinsurance/v1/request` |
| `claim_notification` | `/eclaim/api/claim/claim-notification/v1/request` |
| `claim_intimation` | `/eclaim/api/claim/claim-intimation/v1/request` |
| `claim_assessment` | `/eclaim/api/claim/claim-assessment/v1/request` |
| `discharge_voucher` | `/eclaim/api/claim/claim-dischargevoucher/v1/request` |
| `claim_payment` | `/eclaim/api/claim/claim-payment/v1/request` |
| `claim_rejection` | `/eclaim/api/claim/claim-rejection/v1/request` |

### Built-in Reference Data

The package also ships with countries, currencies, and regions built-in, so you don't need to load them from external files:

```js
import { COUNTRIES, CURRENCIES, REGIONS } from "tira-node";

console.log(COUNTRIES["Tanzania, United Republic of"]); // "TZA"
console.log(CURRENCIES["Tanzanian Shilling"]);          // "TZS"
```

## Certificates

This is the most important part. TIRA provides PFX certificate files that are used for two things:

1. **Signing your requests** — so TIRA can verify that the request is really coming from you
2. **Verifying TIRA's responses** — so you can verify that the response is really coming from TIRA

You will need these 4 items:

| Item | Description |
|---|---|
| `tiramisclientprivate.pfx` | Your private certificate file for signing requests |
| Client PFX passphrase | The password for your private certificate |
| `tiramispublic.pfx` | TIRA's public certificate for verifying their responses |
| TIRA public PFX passphrase | The password for TIRA's public certificate |

::: tip Testing vs Live
During the **testing phase**, TIRA provides both the client and server certificates. When you go **live**, you supply your own credentials and TIRA provides their live certificates.
:::

[Learn more about signing and verification](/signing-verification)

## Your Credentials

TIRA will give you these **fixed credentials** before you start:

| Credential | Description |
|---|---|
| `client_code` | Your unique client identifier |
| `client_key` | Your authentication key |
| `system_code` | The system identifier for your integration |

### What about `transacting_company_code`?

`transacting_company_code` is **not** a fixed credential from TIRA. It represents the company code of whoever is making the transaction. It depends on your situation:

- **If you're a broker**: your `transacting_company_code` is usually your own company code — it stays the same
- **If you're an insurer**: the code may change depending on which broker is involved in the transaction
- **If you connect multiple clients**: each client has their own company code

This gives you two ways to set up the `Tira` instance:

1. **Static** — create the instance once and reuse it everywhere. Best when your company code never changes (e.g. you're a broker)
2. **Dynamic** — create a new instance per transaction. Best when the company code changes (e.g. you're an insurer working with different brokers)

[See initialization examples](/initialization)

## Integration Checklist

Before you can start making API calls, make sure you have everything checked off:

- [ ] Contact TIRA to start the integration process
- [ ] Receive the TIRAMIS API documentation
- [ ] Receive reference data files (countries, currencies, regions, product codes)
- [ ] Receive PFX certificates (`tiramisclientprivate.pfx` + `tiramispublic.pfx`) and their passphrases
- [ ] Receive your credentials (`client_code`, `client_key`, `system_code`)
- [ ] Get your server IP whitelisted by TIRA
- [ ] Install the package: `npm install tira-node`
- [ ] Initialize the `Tira` object with your credentials and certificates — [see how](/initialization)

## Test, UAT, then Live

The integration process has 3 stages:

### 1. Test Environment

You develop and test your integration against TIRA's test server. This is where you make sure everything works — submitting cover notes, handling callbacks, processing responses. Use the test credentials and test endpoint TIRA gave you.

### 2. UAT (User Acceptance Testing)

Once you're confident everything works, you schedule a UAT session with the TIRA team. They will test your integration together with you to make sure everything meets their requirements.

### 3. Live / Production

After passing UAT, you switch to live credentials and the live endpoint. Your integration is now in production.

::: info Switching environments
To switch between test and live, just change the `base_url` and use the corresponding credentials. The rest of your code stays the same.
:::

## How TIRAMIS Communication Works

You don't need to worry about any of this — the package handles it all automatically. But it's good to understand what's happening under the hood.

### Message Format

Every request to TIRA is sent as an **XML POST request**. The package accepts your data as **JSON** and converts it to the correct XML format automatically.

### Encoding

TIRA supports UTF-8 and UTF-16 encoding. The package uses **UTF-8** — this is handled automatically.

### Special Character Escaping

TIRA requires all XML special characters to be escaped. The package does this for you automatically. Here's what gets escaped:

| Character | Description | Escaped As |
|---|---|---|
| `&` | Ampersand | `&amp;` |
| `<` | Less-than | `&lt;` |
| `>` | Greater-than | `&gt;` |
| `"` | Quotes | `&quot;` |
| `'` | Apostrophe | `&apos;` |

### Request Headers

Every request to TIRA includes these headers — handled automatically:

```
Content-Type: application/xml
ClientCode: <your client code>
ClientKey: <your client key>
```

### Request Structure

Every request sent to TIRA is wrapped in this XML structure:

```xml
<TiraMsg>
  <Content><!-- your data here --></Content>
  <MsgSignature><!-- digital signature --></MsgSignature>
</TiraMsg>
```

The package builds the `<Content>` XML from your JSON data, signs it with your PFX certificate to create the `<MsgSignature>`, and wraps everything together. You just pass in your JSON payload.

### Response Structure

TIRA responds with the same `<TiraMsg>` wrapper:

```xml
<TiraMsg>
  <Content><!-- response data --></Content>
  <MsgSignature><!-- TIRA's signature --></MsgSignature>
</TiraMsg>
```

The package parses the XML, verifies TIRA's signature using their public certificate, and returns clean JSON to you.

## Data Submission Flow

This is how data flows between your system and TIRA. Every submission follows this pattern:

```
Step 1: You submit data
        tira.motor.submit({...})
        Your payload includes a callback_url where TIRA will send the result.
              ↓
Step 2: TIRA acknowledges your request
        You get back an acknowledgement_id and a status code.
              ↓
Step 3: TIRA processes your request
        This happens on TIRA's side. You wait for the callback.
              ↓
Step 4: TIRA sends the result to your callback_url
        You handle it with:
        tira.motor.handleCallback(req.body)
        or: tira.handleCallback(req.body)
              ↓
Step 5: You acknowledge TIRA's response
        tira.acknowledge(parsedBody, acknowledgementId)
```

::: warning Retry Rules
- **Step 2**: If you don't receive an acknowledgement from TIRA, keep retrying your submission until you do (unless there's a network problem).
- **Step 5**: If TIRA doesn't receive your acknowledgement, they will keep retrying the callback until you acknowledge it.

Both sides keep retrying until the other side confirms receipt.
:::

## What's Next

Now that you understand the prerequisites and how TIRAMIS communication works, you're ready to start building:

- [Initialize the Tira object](/initialization) — set up your credentials and certificates
- [Signing & Verification](/signing-verification) — understand how request signing and response verification works
