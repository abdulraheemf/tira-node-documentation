# Non-Life Other

The Non-Life Other resource handles cover note submissions for all non-life insurance types that aren't motor-specific — such as fire, marine, aviation, engineering, and other general insurance products. Use `tira.nonLifeOther` to submit new cover notes, renewals, and endorsements, and handle TIRA's asynchronous callback responses.

For the general submit-callback-acknowledge flow, see [Callbacks & Acknowledgements](/callbacks-acknowledgements).

## Available Methods

| Method                                    | Description                                                       | When to Use                                                        | Returns                                        |
| ----------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------- |
| `tira.nonLifeOther.submit(payload)`       | Submit a non-life other cover note (new, renewal, or endorsement) | When you want to create, renew, or modify a cover note             | `CoverNoteResponse`                            |
| `tira.nonLifeOther.handleCallback(input)` | Parse and extract data from TIRA's callback                       | When TIRA sends the result of your submission to your callback URL | `CallbackResult<NonLifeOtherCallbackResponse>` |

## .submit() Payload

```ts
await tira.nonLifeOther.submit(payload): Promise<CoverNoteResponse>
```

Submits a non-life other cover note to TIRA. This is an asynchronous operation — you receive an acknowledgement immediately, and the actual result comes later via your callback URL.

**Endpoint:** `POST /ecovernote/api/covernote/non-life/other/v2/request`

### Cover Note Types

| Value | Type        | When to Use                 | Extra Required Fields                                                             |
| ----- | ----------- | --------------------------- | --------------------------------------------------------------------------------- |
| `"1"` | New         | First-time cover note       | `covernote_number`                                                                |
| `"2"` | Renewal     | Renewing existing coverage  | `covernote_number` + `previous_covernote_reference_number`                        |
| `"3"` | Endorsement | Modifying existing coverage | `previous_covernote_reference_number` + `endorsement_type` + `endorsement_reason` |

### Endorsement Types

When `covernote_type` is `"3"` (Endorsement), you must specify the endorsement type:

| Value | Type                  | Description                                        |
| ----- | --------------------- | -------------------------------------------------- |
| `"1"` | Increasing Premium    | Policy changes that increase the premium           |
| `"2"` | Decreasing Premium    | Policy changes that decrease the premium           |
| `"3"` | Cover Details Changed | Changes to coverage details without premium impact |
| `"4"` | Cancellation          | Cancelling the cover note entirely                 |

### Cover Note Fields

These are the top-level fields in the submission payload.

| Field                                 | Type                 | Required    | Default | XML Tag                        | Description                                                                             |
| ------------------------------------- | -------------------- | ----------- | ------- | ------------------------------ | --------------------------------------------------------------------------------------- |
| `request_id`                          | `string`             | Yes         | —       | `RequestId`                    | Unique request identifier                                                               |
| `callback_url`                        | `string`             | Yes         | —       | `CallBackUrl`                  | Where TIRA sends results                                                                |
| `insurer_company_code`                | `string`             | Yes         | —       | `InsurerCompanyCode`           | Insurer's company code                                                                  |
| `covernote_type`                      | `"1"\|"2"\|"3"`      | Yes         | —       | `CoverNoteType`                | 1=New, 2=Renewal, 3=Endorsement                                                         |
| `covernote_number`                    | `string`             | Conditional | `""`    | `CoverNoteNumber`              | Your cover note number. Required for New and Renewal.                                   |
| `previous_covernote_reference_number` | `string`             | Conditional | `""`    | `PrevCoverNoteReferenceNumber` | TIRA reference number of the previous cover note. Required for Renewal and Endorsement. |
| `sales_point_code`                    | `string`             | Yes         | —       | `SalePointCode`                | Sales point code given by TIRA                                                          |
| `covernote_start_date`                | `string\|Date`       | Yes         | —       | `CoverNoteStartDate`           | Start date. See [Date Handling](#date-handling).                                        |
| `covernote_end_date`                  | `string\|Date`       | Yes         | —       | `CoverNoteEndDate`             | End date. Must be after start date.                                                     |
| `covernote_desc`                      | `string`             | Yes         | —       | `CoverNoteDesc`                | Description (e.g., "Fire & Allied Perils")                                              |
| `operative_clause`                    | `string`             | Yes         | —       | `OperativeClause`              | Operative clause (e.g., "Standard Fire Policy")                                         |
| `payment_mode`                        | `"1"\|"2"\|"3"`      | Yes         | —       | `PaymentMode`                  | 1=Cash, 2=Cheque, 3=EFT                                                                 |
| `currency_code`                       | `string`             | No          | `"TZS"` | `CurrencyCode`                 | ISO currency code                                                                       |
| `exchange_rate`                       | `number`             | No          | `1.0`   | `ExchangeRate`                 | Exchange rate to TZS. Formatted to 2 decimal places.                                    |
| `total_premium_excluding_tax`         | `number`             | Yes         | —       | `TotalPremiumExcludingTax`     | Total premium before tax. Max 2 decimal places.                                         |
| `total_premium_including_tax`         | `number`             | Yes         | —       | `TotalPremiumIncludingTax`     | Total premium after tax. Must be >= excluding tax.                                      |
| `commission_paid`                     | `number`             | No          | `""`    | `CommisionPaid`                | Commission amount. Mandatory for intermediaries.                                        |
| `commission_rate`                     | `number`             | No          | `""`    | `CommisionRate`                | Commission rate. Max 5 decimal places.                                                  |
| `officer_name`                        | `string`             | Yes         | —       | `OfficerName`                  | Name of the processing officer                                                          |
| `officer_title`                       | `string`             | Yes         | —       | `OfficerTitle`                 | Title of the processing officer                                                         |
| `product_code`                        | `string`             | Yes         | —       | `ProductCode`                  | Product code from TIRA (e.g., `SP014002000000` for Fire)                                |
| `endorsement_type`                    | `"1"\|"2"\|"3"\|"4"` | Conditional | `""`    | `EndorsementType`              | Required when `covernote_type` is `"3"`. See [Endorsement Types](#endorsement-types).   |
| `endorsement_reason`                  | `string`             | Conditional | `""`    | `EndorsementReason`            | Required when `covernote_type` is `"3"`.                                                |
| `endorsement_premium_earned`          | `number`             | No          | `0`     | `EndorsementPremiumEarned`     | Premium earned from endorsement                                                         |
| `risks_covered`                       | `RisksCovered[]`     | Yes         | —       | `RisksCovered`                 | At least one risk. See [Risks Covered](#risks-covered).                                 |
| `subject_matters_covered`             | `SubjectMatter[]`    | Yes         | —       | `SubjectMattersCovered`        | At least one subject matter. See [Subject Matters](#subject-matters).                   |
| `covernote_addons`                    | `CoverNoteAddon[]`   | No          | `[]`    | `CoverNoteAddons`              | Optional addons. See [Cover Note Addons](#cover-note-addons).                           |
| `policy_holders`                      | `PolicyHolder[]`     | Yes         | —       | `PolicyHolders`                | At least one policy holder. See [Policy Holders](#policy-holders).                      |

### Risks Covered

At least one risk is required. Each item in the `risks_covered` array maps to a `<RiskCovered>` XML element.

| Field                              | Type                | Required | XML Tag                         | Description                                          |
| ---------------------------------- | ------------------- | -------- | ------------------------------- | ---------------------------------------------------- |
| `risk_code`                        | `string`            | Yes      | `RiskCode`                      | Risk code from TIRA (e.g., `SP014002000001`)         |
| `sum_insured`                      | `number`            | Yes      | `SumInsured`                    | Sum insured amount. Max 2 decimal places.            |
| `sum_insured_equivalent`           | `number`            | Yes      | `SumInsuredEquivalent`          | Sum insured equivalent in TZS. Max 2 decimal places. |
| `premium_rate`                     | `number`            | Yes      | `PremiumRate`                   | Premium rate. Max 5 decimal places.                  |
| `premium_before_discount`          | `number`            | Yes      | `PremiumBeforeDiscount`         | Premium before discount. Max 2 decimal places.       |
| `premium_after_discount`           | `number`            | Yes      | `PremiumAfterDiscount`          | Premium after discount. Max 2 decimal places.        |
| `premium_excluding_tax_equivalent` | `number`            | Yes      | `PremiumExcludingTaxEquivalent` | Premium excluding tax in TZS. Max 2 decimal places.  |
| `premium_including_tax`            | `number`            | Yes      | `PremiumIncludingTax`           | Premium including tax. Max 2 decimal places.         |
| `discounts_offered`                | `DiscountOffered[]` | No       | `DiscountsOffered`              | See [Discounts Offered](#discounts-offered)          |
| `taxes_charged`                    | `TaxCharged[]`      | Yes      | `TaxesCharged`                  | See [Taxes Charged](#taxes-charged)                  |

### Taxes Charged

Each risk and addon must include tax information. If no tax applies, set `is_tax_exempted` to `"Y"` and provide exemption details.

| Field                     | Type       | Required    | XML Tag                 | Description                                                       |
| ------------------------- | ---------- | ----------- | ----------------------- | ----------------------------------------------------------------- |
| `tax_code`                | `string`   | Yes         | `TaxCode`               | Tax code from TIRA (e.g., `VAT-MAINLAND`)                         |
| `is_tax_exempted`         | `"Y"\|"N"` | Yes         | `IsTaxExempted`         | Whether tax is exempted                                           |
| `tax_exemption_type`      | `"1"\|"2"` | Conditional | `TaxExemptionType`      | Required if exempted. 1=Policy Holder Exempted, 2=Risk Exempted   |
| `tax_exemption_reference` | `string`   | Conditional | `TaxExemptionReference` | Required if exempted. Exemption reference number.                 |
| `tax_rate`                | `number`   | Yes         | `TaxRate`               | Tax rate as decimal (e.g., `0.18` for 18%). Max 5 decimal places. |
| `tax_amount`              | `number`   | Yes         | `TaxAmount`             | Tax amount. Max 2 decimal places.                                 |

### Discounts Offered

Optional. Nested inside each risk.

| Field             | Type     | Required | XML Tag          | Description                            |
| ----------------- | -------- | -------- | ---------------- | -------------------------------------- |
| `discount_type`   | `"1"`    | Yes      | `DiscountType`   | Currently only `"1"` (Fleet Discount)  |
| `discount_rate`   | `number` | Yes      | `DiscountRate`   | Discount rate. Max 5 decimal places.   |
| `discount_amount` | `number` | Yes      | `DiscountAmount` | Discount amount. Max 2 decimal places. |

### Subject Matters

At least one subject matter is required. Each item maps to a `<SubjectMatter>` XML element.

| Field                      | Type     | Required | XML Tag                  | Description                               |
| -------------------------- | -------- | -------- | ------------------------ | ----------------------------------------- |
| `subject_matter_reference` | `string` | Yes      | `SubjectMatterReference` | Your reference (e.g., "BLD001")           |
| `subject_matter_desc`      | `string` | Yes      | `SubjectMatterDesc`      | Description (e.g., "Commercial Building") |

### Cover Note Addons

Optional. Each item maps to a `<CoverNoteAddon>` XML element.

| Field                              | Type           | Required | XML Tag                         | Description                                       |
| ---------------------------------- | -------------- | -------- | ------------------------------- | ------------------------------------------------- |
| `addon_reference`                  | `string`       | Yes      | `AddonReference`                | Your addon reference                              |
| `addon_description`                | `string`       | Yes      | `AddonDesc`                     | Description of the addon                          |
| `addon_amount`                     | `number`       | Yes      | `AddonAmount`                   | Addon amount. Max 2 decimal places.               |
| `addon_premium_rate`               | `number`       | Yes      | `AddonPremiumRate`              | Premium rate. Max 5 decimal places.               |
| `premium_excluding_tax`            | `number`       | Yes      | `PremiumExcludingTax`           | Premium before tax. Max 2 decimal places.         |
| `premium_excluding_tax_equivalent` | `number`       | Yes      | `PremiumExcludingTaxEquivalent` | Premium before tax in TZS. Max 2 decimal places.  |
| `premium_including_tax`            | `number`       | Yes      | `PremiumIncludingTax`           | Premium after tax. Max 2 decimal places.          |
| `taxes_charged`                    | `TaxCharged[]` | Yes      | `TaxesCharged`                  | Same structure as [Taxes Charged](#taxes-charged) |

### Policy Holders

At least one policy holder is required. Each item maps to a `<PolicyHolder>` XML element.

| Field                    | Type        | Required | Default | XML Tag                   | Description                                  |
| ------------------------ | ----------- | -------- | ------- | ------------------------- | -------------------------------------------- |
| `policyholder_name`      | `string`    | Yes      | —       | `PolicyHolderName`        | Full name                                    |
| `policyholder_birthdate` | `string`    | Yes      | —       | `PolicyHolderBirthDate`   | Date of birth (`YYYY-MM-DD`)                 |
| `policyholder_type`      | `"1"\|"2"`  | Yes      | —       | `PolicyHolderType`        | 1=Individual, 2=Corporate                    |
| `policyholder_id_type`   | `"1"`–`"7"` | Yes      | —       | `PolicyHolderIdType`      | See ID types table below                     |
| `policyholder_id_number` | `string`    | Yes      | —       | `PolicyHolderIdNumber`    | ID number                                    |
| `gender`                 | `"M"\|"F"`  | Yes      | —       | `Gender`                  | M=Male, F=Female                             |
| `country_code`           | `string`    | No       | `"TZA"` | `CountryCode`             | ISO country code (e.g., `TZA`, `KEN`, `UGA`) |
| `region`                 | `string`    | Yes      | —       | `Region`                  | Region code from TIRA                        |
| `district`               | `string`    | Yes      | —       | `District`                | District from TIRA                           |
| `street`                 | `string`    | Yes      | —       | `Street`                  | Street name                                  |
| `phone_number`           | `string`    | Yes      | —       | `PolicyHolderPhoneNumber` | Format: `2557XXXXXXXX` (12 digits)           |
| `fax_number`             | `string`    | No       | `""`    | `PolicyHolderFax`         | Fax number                                   |
| `postal_address`         | `string`    | Yes      | —       | `PostalAddress`           | Postal address                               |
| `email_address`          | `string`    | No       | `""`    | `EmailAddress`            | Email address (validated if provided)        |

#### Policy Holder ID Types

| Value | Description                              |
| ----- | ---------------------------------------- |
| `"1"` | NIDA                                     |
| `"2"` | Voters ID Card                           |
| `"3"` | Passport                                 |
| `"4"` | Driving License                          |
| `"5"` | Zanzibar ID                              |
| `"6"` | TIN                                      |
| `"7"` | Company Incorporation Certificate Number |

### Date Handling

The package automatically converts dates to East Africa Time (UTC+3) and formats them as `YYYY-MM-DDTHH:mm:ss` (no timezone suffix). You can pass either an ISO string or a JavaScript `Date` object.

::: tip Example
If you pass `"2025-05-31T21:00:00Z"` (9 PM UTC), the package converts it to `"2025-06-01T00:00:00"` (midnight EAT, June 1st).

This means if you want a cover note to start on June 1st Tanzania time, pass `"2025-05-31T21:00:00Z"` or `new Date("2025-05-31T21:00:00Z")`.
:::

### Validation Rules

The package validates your payload before sending it to TIRA. If validation fails, it throws a `TiraValidationError` with the field name and a descriptive message.

- `callback_url` must be a valid URL
- `covernote_number` is required when `covernote_type` is `"1"` (New) or `"2"` (Renewal)
- `previous_covernote_reference_number` is required when `covernote_type` is `"2"` (Renewal) or `"3"` (Endorsement)
- `endorsement_type` and `endorsement_reason` are required when `covernote_type` is `"3"` (Endorsement)
- `total_premium_including_tax` must be greater than or equal to `total_premium_excluding_tax`
- `covernote_end_date` must be after `covernote_start_date`
- At least one item is required in `risks_covered`, `subject_matters_covered`, and `policy_holders`
- `phone_number` must be 12 digits starting with `2557`
- `policyholder_birthdate` must be a valid ISO date (`YYYY-MM-DD`)
- `email_address` is validated if provided

### Conditional Fields Quick Reference

**By cover note type:**

| Scenario            | `covernote_number` | `previous_covernote_reference_number` | `endorsement_type` | `endorsement_reason` |
| ------------------- | ------------------ | ------------------------------------- | ------------------ | -------------------- |
| New (`"1"`)         | Required           | —                                     | —                  | —                    |
| Renewal (`"2"`)     | Required           | Required                              | —                  | —                    |
| Endorsement (`"3"`) | —                  | Required                              | Required           | Required             |

### Example — New Cover Note

```js
const result = await tira.nonLifeOther.submit({
  request_id: "REQ-NLO-2025-001",
  callback_url: "https://your-server.com/tira/non-life-callback",
  insurer_company_code: "ICC103",
  covernote_type: "1", // New
  covernote_number: "FIRE-2025-001",
  sales_point_code: "SP719",
  covernote_start_date: "2025-05-31T21:00:00Z", // June 1st EAT
  covernote_end_date: "2026-05-31T21:00:00Z", // June 1st next year EAT
  covernote_desc: "Fire & Allied Perils",
  operative_clause: "Standard Fire Policy",
  payment_mode: "3", // EFT
  total_premium_excluding_tax: 1200000,
  total_premium_including_tax: 1416000,
  commission_paid: 150000,
  commission_rate: 0.125,
  officer_name: "Johnson Abraham",
  officer_title: "Underwriter",
  product_code: "SP014002000000",
  risks_covered: [
    {
      risk_code: "SP014002000001",
      sum_insured: 50000000,
      sum_insured_equivalent: 50000000,
      premium_rate: 0.024,
      premium_before_discount: 1200000,
      premium_after_discount: 1200000,
      premium_excluding_tax_equivalent: 1200000,
      premium_including_tax: 1416000,
      taxes_charged: [
        {
          tax_code: "VAT-MAINLAND",
          is_tax_exempted: "N",
          tax_rate: 0.18,
          tax_amount: 216000,
        },
      ],
    },
  ],
  subject_matters_covered: [
    {
      subject_matter_reference: "BLD001",
      subject_matter_desc: "Commercial Building",
    },
  ],
  policy_holders: [
    {
      policyholder_name: "Acme Holdings Ltd",
      policyholder_birthdate: "2005-03-15",
      policyholder_type: "2", // Corporate
      policyholder_id_type: "7", // Company Incorporation Certificate
      policyholder_id_number: "TZA-2005-INC-12345",
      gender: "M",
      region: "Dar es Salaam",
      district: "Ilala",
      street: "Samora Avenue",
      phone_number: "255712345678",
      postal_address: "P.O. Box 54321, Dar es Salaam",
    },
  ],
});

console.log(result.acknowledgement_id); // "ACK123456"
console.log(result.tira_status_code); // "TIRA001"
```

### Example — Renewal

```js
const result = await tira.nonLifeOther.submit({
  // ...same fields as New, plus:
  covernote_type: "2", // Renewal
  covernote_number: "FIRE-2026-001",
  previous_covernote_reference_number: "CN-NLO-2025-001", // From last year's cover note
  // ...rest of payload
});
```

### Example — Endorsement

```js
const result = await tira.nonLifeOther.submit({
  // ...same base fields, but:
  covernote_type: "3", // Endorsement
  previous_covernote_reference_number: "CN-NLO-2025-001", // The cover note being modified
  endorsement_type: "1", // Increasing Premium
  endorsement_reason: "Additional coverage for stock in trade",
  endorsement_premium_earned: 100000,
  // Note: covernote_number is NOT required for endorsements
  // ...rest of payload
});
```

## .submit() Response

When you call `tira.nonLifeOther.submit()`, you get an immediate `CoverNoteResponse` from TIRA:

| Field                      | Type                      | Description                                |
| -------------------------- | ------------------------- | ------------------------------------------ |
| `acknowledgement_id`       | `string`                  | TIRA's acknowledgement ID                  |
| `request_id`               | `string`                  | Your original request ID (echoed back)     |
| `tira_status_code`         | `string`                  | Status code — `"TIRA001"` means received   |
| `tira_status_desc`         | `string`                  | Human-readable description                 |
| `requires_acknowledgement` | `boolean`                 | Always `true`                              |
| `acknowledgement_payload`  | `Record<string, unknown>` | Raw parsed acknowledgement (rarely needed) |

::: tip "TIRA001" means "received", not "approved"
At this stage, `"TIRA001"` means TIRA received your request and it's being processed. It does **not** mean your cover note has been approved. The actual result (approved or rejected) comes later via your callback URL.

If you get a code other than `"TIRA001"`, something went wrong with the submission itself. Check the [Error Codes](/error-codes) page for the specific code.
:::

## .submit() Callback Response

After TIRA processes your submission, it sends the result to your `callback_url`. The callback contains the actual outcome — whether your cover note was approved or rejected.

### Extracted Data

The `extracted` field contains the parsed callback data:

| Field                        | Type     | Description                                                              |
| ---------------------------- | -------- | ------------------------------------------------------------------------ |
| `response_id`                | `string` | TIRA's response ID                                                       |
| `request_id`                 | `string` | Your original request ID                                                 |
| `response_status_code`       | `string` | `"TIRA001"` = approved. See [Error Codes](/error-codes) for other codes. |
| `response_status_desc`       | `string` | Human-readable status description                                        |
| `covernote_reference_number` | `string` | TIRA's cover note reference number (on success)                          |

### Full Result Fields

| Field                | Type                           | Description                                                      |
| -------------------- | ------------------------------ | ---------------------------------------------------------------- |
| `type`               | `"non_life_other"`             | Callback type identifier                                         |
| `extracted`          | `NonLifeOtherCallbackResponse` | The extracted data (see table above)                             |
| `body`               | `Record<string, any>`          | Full parsed XML as JS object — pass this to `tira.acknowledge()` |
| `signature_verified` | `boolean`                      | Whether TIRA's digital signature was verified                    |
| `raw_xml`            | `string`                       | The original XML string                                          |

### On Success

When `response_status_code` is `"TIRA001"`, the cover note was approved. You'll receive the `covernote_reference_number` — save this, it's the official TIRA identifier.

```js
// response_status_code === "TIRA001"
console.log(result.extracted.covernote_reference_number); // "CN-NLO-2025-001"
```

### On Error

When `response_status_code` is anything other than `"TIRA001"`, the cover note was rejected. The `covernote_reference_number` will be empty. Check the [Error Codes](/error-codes) page — cover note errors are in the "Cover Note" section.

```js
// response_status_code !== "TIRA001"
console.log(result.extracted.response_status_code); // e.g., "TIRA020"
console.log(result.extracted.response_status_desc); // e.g., "Invalid covernote start date"
```

### Example — Handling the Callback

```js
app.post("/tira/non-life-callback", async (req, res) => {
  const result = await tira.nonLifeOther.handleCallback(req.body);

  if (result.extracted.response_status_code === "TIRA001") {
    await db.coverNotes.update({
      where: { request_id: result.extracted.request_id },
      data: {
        status: "approved",
        reference_number: result.extracted.covernote_reference_number,
      },
    });
  } else {
    console.error(
      `Cover note rejected: ${result.extracted.response_status_code}`,
      result.extracted.response_status_desc,
    );

    await db.coverNotes.update({
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

1. Derives the correct acknowledgement tag name (`CoverNoteRefRes` → `CoverNoteRefResAck`)
2. Fills in `AcknowledgementId`, `ResponseId`, `AcknowledgementStatusCode`, and `AcknowledgementStatusDesc`
3. Signs the XML with your private key
4. Wraps it in `<TiraMsg>` with `<MsgSignature>`

### What the XML Looks Like

You don't need to build this yourself — this is what the package generates:

```xml
<TiraMsg>
<CoverNoteRefResAck>
  <AcknowledgementId>your-unique-id</AcknowledgementId>
  <ResponseId>RES-NLO-001</ResponseId>
  <AcknowledgementStatusCode>TIRA001</AcknowledgementStatusCode>
  <AcknowledgementStatusDesc>Successful</AcknowledgementStatusDesc>
</CoverNoteRefResAck>
<MsgSignature>base64-encoded-signature...</MsgSignature>
</TiraMsg>
```

### Example

```js
const { v4: uuid } = require("uuid");

app.post("/tira/non-life-callback", async (req, res) => {
  const result = await tira.nonLifeOther.handleCallback(req.body);

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
app.post("/tira/non-life-callback", async (req, res) => {
  const result = await tira.nonLifeOther.handleCallback(req.body);

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
await tira.nonLifeOther.handleCallback(input: string | Record<string, any>): Promise<CallbackResult<NonLifeOtherCallbackResponse>>
```

This function parses the callback XML that TIRA sends to your callback URL and extracts the relevant data. You can also use the universal `tira.handleCallback()` if you have a single endpoint for all callback types.

### What It Does

1. **Verifies the signature** — checks that the callback's `<MsgSignature>` matches TIRA's public key (if signature verification is configured)
2. **Parses the XML** — converts the raw XML into a JavaScript object
3. **Extracts the data** — pulls out the fields you care about (`covernote_reference_number`, etc.) into a clean `extracted` object

### Input

You can pass either:

- A **raw XML string** — the `req.body` from your Express handler (requires `express.text({ type: "application/xml" })` middleware)
- A **pre-parsed object** — if you've already parsed the XML yourself

### What It Returns

| Field                | Type                           | Description                                                             |
| -------------------- | ------------------------------ | ----------------------------------------------------------------------- |
| `type`               | `"non_life_other"`             | Always `"non_life_other"` for this handler                              |
| `extracted`          | `NonLifeOtherCallbackResponse` | The extracted data (see [Callback Response](#submit-callback-response)) |
| `body`               | `Record<string, any>`          | Full parsed XML as JS object — pass this to `tira.acknowledge()`        |
| `signature_verified` | `boolean`                      | Whether TIRA's digital signature was verified                           |
| `raw_xml`            | `string`                       | The original XML string                                                 |

### Resource-Specific vs Universal Handler

| Approach          | Method                                    | When to Use                                                                                |
| ----------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------ |
| Resource-specific | `tira.nonLifeOther.handleCallback(input)` | When you have separate endpoints per resource type                                         |
| Universal         | `tira.handleCallback(input)`              | When you have one endpoint for all TIRA callbacks (requires `enabled_callbacks` in config) |

Both return the same data. The universal handler auto-detects the callback type. See [Callbacks & Acknowledgements](/callbacks-acknowledgements) for details on the universal handler.

## Full Example

A complete Express.js application that submits a non-life other cover note, handles the callback, and acknowledges it.

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

// Submit a non-life other cover note
app.post("/submit-non-life", async (req, res) => {
  const result = await tira.nonLifeOther.submit({
    request_id: uuid(),
    callback_url: "https://your-server.com/tira/non-life-callback",
    insurer_company_code: "ICC103",
    covernote_type: "1",
    covernote_number: req.body.covernote_number,
    sales_point_code: "SP719",
    covernote_start_date: req.body.start_date,
    covernote_end_date: req.body.end_date,
    covernote_desc: "Fire & Allied Perils",
    operative_clause: "Standard Fire Policy",
    payment_mode: "3",
    total_premium_excluding_tax: req.body.premium_excl_tax,
    total_premium_including_tax: req.body.premium_incl_tax,
    officer_name: "Johnson Abraham",
    officer_title: "Underwriter",
    product_code: "SP014002000000",
    risks_covered: req.body.risks,
    subject_matters_covered: req.body.subject_matters,
    policy_holders: req.body.policy_holders,
  });

  res.json({
    message: "Submitted to TIRA",
    acknowledgement_id: result.acknowledgement_id,
    status: result.tira_status_code,
  });
});

// Handle TIRA's callback and acknowledge
app.post("/tira/non-life-callback", async (req, res) => {
  const result = await tira.nonLifeOther.handleCallback(req.body);

  try {
    await db.coverNotes.update({
      where: { request_id: result.extracted.request_id },
      data: {
        status: result.extracted.response_status_code,
        reference_number: result.extracted.covernote_reference_number,
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

### Endorsement Cancellation

When `endorsement_type` is `"4"` (Cancellation), you must set `covernote_end_date` to the end date of the **original policy**, not the current date. This tells TIRA when the coverage actually ends.

```js
// Cancelling a cover note that runs from June 1, 2025 to June 1, 2026
const result = await tira.nonLifeOther.submit({
  covernote_type: "3",
  previous_covernote_reference_number: "CN-NLO-2025-001",
  endorsement_type: "4", // Cancellation
  endorsement_reason: "Client requested policy cancellation",
  // Use the ORIGINAL policy end date, not today's date
  covernote_start_date: "2025-05-31T21:00:00Z",
  covernote_end_date: "2026-05-31T21:00:00Z", // Original end date
  // ...rest of payload
});
```

If you set `covernote_end_date` to today's date instead, TIRA may reject the submission or the cancellation may not be processed correctly.

### Currency

If you're using a foreign currency (not TZS), provide both `currency_code` and `exchange_rate`. If omitted, they default to `"TZS"` and `1.0` respectively.

```js
// TZS (default) — no need to specify
{
  total_premium_excluding_tax: 1200000,
  total_premium_including_tax: 1416000,
}

// Foreign currency — specify both
{
  currency_code: "USD",
  exchange_rate: 2500.00,
  total_premium_excluding_tax: 480,
  total_premium_including_tax: 566.40,
}
```

### Commission Fields

`commission_paid` and `commission_rate` are **mandatory for intermediaries** (brokers and agents) but optional for direct insurers. If you're submitting through a broker, always include these.

```js
// Broker/agent submission — commission required
{
  commission_paid: 150000,
  commission_rate: 0.125, // 12.5%
}

// Direct insurer — commission can be omitted
{
  // No commission_paid or commission_rate needed
}
```

### XML Tag Spelling

The XML tags `CommisionPaid` and `CommisionRate` use a single "s" ("Commision" instead of "Commission"). This matches TIRA's specification. The package handles this mapping automatically — you just use `commission_paid` and `commission_rate` in your payload.

## Common Mistakes

::: danger Forgetting to acknowledge the callback
TIRA retries callbacks indefinitely until you acknowledge them. Always call `tira.acknowledge(result.body, uuid())` and return the XML, even if processing the callback data failed.
:::

::: danger Invalid callback URL
The `callback_url` must be a valid URL (including the protocol). Passing something like `"your-server.com/callback"` without `https://` will throw a `TiraValidationError`.
:::

::: danger Wrong end date for cancellation endorsements
When cancelling a cover note (`endorsement_type: "4"`), set `covernote_end_date` to the end date of the original policy — **not** the current date.
:::

::: danger Missing XML middleware
Without `express.text({ type: "application/xml" })`, your callback `req.body` will be empty and parsing will fail. Add this middleware before your callback route.
:::

::: danger Confusing submission acknowledgement with approval
`"TIRA001"` in the submission response means "received", not "approved". The actual approval or rejection comes later via the callback. Don't tell your users their cover note is approved at submission time.
:::

::: danger Missing endorsement fields
When `covernote_type` is `"3"`, you must provide `endorsement_type` and `endorsement_reason`. Forgetting these throws a `TiraValidationError`.
:::

::: danger Phone number format
Phone numbers must be 12 digits starting with `2557` (e.g., `"255712345678"`). Other formats will fail validation.
:::

## Related Pages

- [Callbacks & Acknowledgements](/callbacks-acknowledgements) — The full callback lifecycle
- [Signing & Verification](/signing-verification) — How digital signatures work
- [Error Codes](/error-codes) — All TIRA status codes and fixes
- [Initialization](/initialization) — Setting up the Tira client
