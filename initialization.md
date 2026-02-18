# Initialization

This page covers how to install `tira-node`, configure it, and initialize the `Tira` object. By the end, you'll have a working instance ready to make API calls.

## Installation

```bash
npm install tira-node
```

## Basic Setup

Import the `Tira` class and create an instance with your credentials and certificates:

::: code-group

```js [CommonJS]
const { Tira } = require("tira-node");

const tira = new Tira({
  base_url: "https://tiramis-test.tira.go.tz",
  client_code: "YOUR_CLIENT_CODE",
  client_key: "YOUR_CLIENT_KEY",
  system_code: "YOUR_SYSTEM_CODE",
  transacting_company_code: "YOUR_COMPANY_CODE",
  pfx_path: "./certs/tiramisclientprivate.pfx",
  pfx_passphrase: "your-pfx-password",
  tira_public_pfx_path: "./certs/tiramispublic.pfx",
  tira_public_pfx_passphrase: "tira-public-password",
});
```

```ts [ESM / TypeScript]
import { Tira } from "tira-node";

const tira = new Tira({
  base_url: "https://tiramis-test.tira.go.tz",
  client_code: "YOUR_CLIENT_CODE",
  client_key: "YOUR_CLIENT_KEY",
  system_code: "YOUR_SYSTEM_CODE",
  transacting_company_code: "YOUR_COMPANY_CODE",
  pfx_path: "./certs/tiramisclientprivate.pfx",
  pfx_passphrase: "your-pfx-password",
  tira_public_pfx_path: "./certs/tiramispublic.pfx",
  tira_public_pfx_passphrase: "tira-public-password",
});
```

:::

That's it. You can now use `tira.motor.submit(...)`, `tira.policy.submit(...)`, and all other resources.

## Configuration Reference

Every field you can pass to the `Tira` constructor:

### Required Fields

| Field | Type | Description |
|---|---|---|
| `base_url` | `string` | The TIRAMIS API base URL. This is the only thing that changes between test and live environments. |
| `client_code` | `string` | Your unique client identifier. Provided by TIRA during onboarding. |
| `client_key` | `string` | Your authentication key. Provided by TIRA during onboarding. |
| `system_code` | `string` | The system identifier for your integration. Provided by TIRA during onboarding. |
| `transacting_company_code` | `string` | The company code for the current transaction. See [Understanding transacting_company_code](#understanding-transacting-company-code) below. |
| `pfx_path` | `string` | File path to your `tiramisclientprivate.pfx` certificate. Used for signing requests and mutual TLS authentication. |
| `pfx_passphrase` | `string` | The passphrase for your private PFX certificate. |
| `tira_public_pfx_path` | `string` | File path to TIRA's `tiramispublic.pfx` certificate. Used for verifying callback signatures and as the TLS CA certificate. |
| `tira_public_pfx_passphrase` | `string` | The passphrase for TIRA's public PFX certificate. |

::: danger All required fields must be provided
If any required field is missing or empty, the constructor will throw an error immediately. For example:

```
Error: Tira: client_code is required
```

This is intentional — it's better to fail fast on startup than to fail silently on your first API call.
:::

### Optional Fields

| Field | Type | Default | Description |
|---|---|---|---|
| `verify_signatures` | `boolean` | `true` | Whether to verify TIRA's callback signatures using their public certificate. |
| `enabled_callbacks` | `EnabledCallbacks` | `undefined` | Which callback types the universal `tira.handleCallback()` method should accept. |

These are covered in detail in [Optional Configuration](#optional-configuration).

## Understanding `transacting_company_code`

Unlike the other credentials which are fixed and given to you by TIRA, `transacting_company_code` can change depending on your situation.

### If you're a broker

Your company code is your own code. It stays the same for every transaction. You can set it once during initialization and forget about it.

```js
const tira = new Tira({
  // ...other config...
  transacting_company_code: "MY_BROKER_CODE", // Always the same
});
```

### If you're an insurer

The company code may change depending on which broker is involved in the transaction. For example, if broker A sends you a motor cover note, you use broker A's company code. If broker B sends one, you use broker B's code.

```js
// Broker A's transaction
const tiraForBrokerA = new Tira({
  // ...other config...
  transacting_company_code: "BROKER_A_CODE",
});

// Broker B's transaction
const tiraForBrokerB = new Tira({
  // ...other config...
  transacting_company_code: "BROKER_B_CODE",
});
```

### If you serve multiple clients

You're building a platform that connects multiple insurance companies or brokers. Each client has their own company code, so you create a `Tira` instance per client.

```js
function getTiraForClient(clientCompanyCode) {
  return new Tira({
    // ...other config...
    transacting_company_code: clientCompanyCode,
  });
}
```

## Initialization Patterns

### Pattern 1: Initialize Once, Use Everywhere

Best when your `transacting_company_code` never changes. This is the simplest approach — create the instance once and use it throughout your application.

```js
const { Tira } = require("tira-node");

// Create once at startup
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

// Use it anywhere in your application
app.post("/submit-motor", async (req, res) => {
  const result = await tira.motor.submit(req.body);
  res.json(result);
});

app.post("/submit-policy", async (req, res) => {
  const result = await tira.policy.submit(req.body);
  res.json(result);
});

app.post("/tira-callback", async (req, res) => {
  const result = await tira.motor.handleCallback(req.body);
  // process result...
  const ackXml = tira.acknowledge(result.body, "your-ack-id");
  res.set("Content-Type", "application/xml").send(ackXml);
});
```

### Pattern 2: Initialize Per Transaction

Best when the `transacting_company_code` changes per request. Create a new `Tira` instance for each transaction.

```js
const { Tira } = require("tira-node");

function createTira(companyCode) {
  return new Tira({
    base_url: process.env.TIRA_BASE_URL,
    client_code: process.env.TIRA_CLIENT_CODE,
    client_key: process.env.TIRA_CLIENT_KEY,
    system_code: process.env.TIRA_SYSTEM_CODE,
    transacting_company_code: companyCode,
    pfx_path: "./certs/tiramisclientprivate.pfx",
    pfx_passphrase: process.env.TIRA_PFX_PASSPHRASE,
    tira_public_pfx_path: "./certs/tiramispublic.pfx",
    tira_public_pfx_passphrase: process.env.TIRA_PUBLIC_PFX_PASSPHRASE,
  });
}

app.post("/submit-motor", async (req, res) => {
  const { broker_code, ...payload } = req.body;

  // Create a Tira instance for this specific broker
  const tira = createTira(broker_code);
  const result = await tira.motor.submit(payload);
  res.json(result);
});
```

### Pattern 3: Keep Config DRY with a Base Object

If you're creating many instances, avoid repeating the same config over and over by extracting the shared part:

```js
const { Tira } = require("tira-node");

// Shared config — everything except transacting_company_code
const baseConfig = {
  base_url: process.env.TIRA_BASE_URL,
  client_code: process.env.TIRA_CLIENT_CODE,
  client_key: process.env.TIRA_CLIENT_KEY,
  system_code: process.env.TIRA_SYSTEM_CODE,
  pfx_path: "./certs/tiramisclientprivate.pfx",
  pfx_passphrase: process.env.TIRA_PFX_PASSPHRASE,
  tira_public_pfx_path: "./certs/tiramispublic.pfx",
  tira_public_pfx_passphrase: process.env.TIRA_PUBLIC_PFX_PASSPHRASE,
};

// Create instances with different company codes
const tiraForBrokerA = new Tira({ ...baseConfig, transacting_company_code: "BROKER_A" });
const tiraForBrokerB = new Tira({ ...baseConfig, transacting_company_code: "BROKER_B" });

// Or use a function
function createTira(companyCode) {
  return new Tira({ ...baseConfig, transacting_company_code: companyCode });
}
```

::: tip Use environment variables
Always store sensitive values like `client_key`, `pfx_passphrase`, and certificate passphrases in environment variables. Never hardcode them in your source code.
:::

## Optional Configuration

### `verify_signatures`

By default, `tira-node` verifies the digital signature on every callback from TIRA. This ensures the response is genuinely from TIRA and hasn't been tampered with.

```js
const tira = new Tira({
  // ...required fields...
  verify_signatures: true, // This is the default
});
```

You can disable this during development if you're testing with mock callbacks that aren't signed:

```js
const tira = new Tira({
  // ...required fields...
  verify_signatures: false, // Only for development!
});
```

::: danger Never disable in production
Setting `verify_signatures: false` in production means you're trusting any callback without verifying it came from TIRA. This is a security risk. Only disable it during local development or testing.
:::

### `enabled_callbacks`

This option is only needed if you use the **universal** `tira.handleCallback()` method. This is the method on the main `tira` object that automatically detects the callback type (motor, policy, claim, etc.) and routes it accordingly.

If you use **resource-specific** handlers like `tira.motor.handleCallback()`, you don't need to set this.

```js
const tira = new Tira({
  // ...required fields...
  enabled_callbacks: {
    motor: true,
    motor_fleet: true,
    non_life_other: true,
    policy: true,
    // Only enable what you need
  },
});

// Now you can use the universal handler
app.post("/tira-callback", async (req, res) => {
  // Automatically detects whether it's a motor, policy, claim, etc. callback
  const result = await tira.handleCallback(req.body);
  console.log(result.type); // "motor", "policy", etc.
});
```

If a callback type isn't enabled, the universal handler will throw an error:

```
Error: Callback type 'motor' is not enabled.
Add { enabled_callbacks: { motor: true } } to your Tira config.
```

Here are all the available callback types:

| Callback Type | Description |
|---|---|
| `motor` | Motor cover note callbacks |
| `motor_fleet` | Motor fleet cover note callbacks |
| `non_life_other` | Non-life other cover note callbacks |
| `reinsurance` | Reinsurance submission callbacks |
| `policy` | Policy submission callbacks |
| `claim_notification` | Claim notification callbacks |
| `claim_intimation` | Claim intimation callbacks |
| `claim_assessment` | Claim assessment callbacks |
| `discharge_voucher` | Discharge voucher callbacks |
| `claim_payment` | Claim payment callbacks |
| `claim_rejection` | Claim rejection callbacks |

## Switching Between Test and Live

Your code doesn't need to change between environments. Just update the `base_url` and use the corresponding credentials:

```js
// .env for test
TIRA_BASE_URL=https://tiramis-test.tira.go.tz

// .env for live
TIRA_BASE_URL=https://tiramis.tira.go.tz
```

```js
const tira = new Tira({
  base_url: process.env.TIRA_BASE_URL, // Points to test or live depending on env
  client_code: process.env.TIRA_CLIENT_CODE,
  client_key: process.env.TIRA_CLIENT_KEY,
  system_code: process.env.TIRA_SYSTEM_CODE,
  transacting_company_code: process.env.TIRA_COMPANY_CODE,
  pfx_path: process.env.TIRA_PFX_PATH,
  pfx_passphrase: process.env.TIRA_PFX_PASSPHRASE,
  tira_public_pfx_path: process.env.TIRA_PUBLIC_PFX_PATH,
  tira_public_pfx_passphrase: process.env.TIRA_PUBLIC_PFX_PASSPHRASE,
});
```

::: info
Remember that test and live environments use **different certificates and credentials**. When switching to live, make sure you update your PFX files and all credential values — not just the `base_url`.
:::

## Available Resources

After initialization, the `tira` object gives you access to all TIRAMIS resources:

### Cover Notes

| Resource | Description | Methods |
|---|---|---|
| `tira.motor` | Motor vehicle cover notes | `.submit()`, `.handleCallback()`, `.verify()` |
| `tira.motorFleet` | Motor fleet cover notes (multiple vehicles) | `.submit()`, `.handleCallback()` |
| `tira.nonLifeOther` | Non-life other cover notes (fire, marine, etc.) | `.submit()`, `.handleCallback()` |

### Verification

| Resource | Description | Methods |
|---|---|---|
| `tira.coverNoteVerification` | Verify a cover note's status with TIRA | `.submit()` |

### Policy & Reinsurance

| Resource | Description | Methods |
|---|---|---|
| `tira.policy` | Policy submissions | `.submit()`, `.handleCallback()` |
| `tira.reinsurance` | Reinsurance submissions | `.submit()`, `.handleCallback()` |

### Claims

| Resource | Description | Methods |
|---|---|---|
| `tira.claimNotification` | Notify TIRA of a new claim | `.submit()`, `.handleCallback()` |
| `tira.claimIntimation` | Submit claim intimation details | `.submit()`, `.handleCallback()` |
| `tira.claimAssessment` | Submit claim assessment | `.submit()`, `.handleCallback()` |
| `tira.dischargeVoucher` | Submit discharge voucher | `.submit()`, `.handleCallback()` |
| `tira.claimPayment` | Submit claim payment | `.submit()`, `.handleCallback()` |
| `tira.claimRejection` | Submit claim rejection | `.submit()`, `.handleCallback()` |

### Top-Level Methods

| Method | Description |
|---|---|
| `tira.handleCallback(input)` | Universal callback handler. Automatically detects the callback type and extracts data. Requires `enabled_callbacks` in config. |
| `tira.acknowledge(body, ackId)` | Builds a signed acknowledgement XML to send back to TIRA after receiving a callback. |

## What's Next

- [Signing & Verification](/signing-verification) — how request signing and response verification works under the hood
