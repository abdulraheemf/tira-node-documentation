# Cover Note Verification

The Cover Note Verification resource lets you verify whether a cover note exists in TIRA's registry. Use `tira.coverNoteVerification` to check cover note validity by reference number, with optional filtering by sticker number, registration number, or chassis number.

This is a **synchronous** operation — you get the result immediately, no callback or acknowledgement needed.

## Available Methods

| Method                                       | Description                                 | When to Use                                                            | Returns                         |
| -------------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------- |
| `tira.coverNoteVerification.verify(payload)` | Verify a cover note against TIRA's registry | When you need to check if a cover note exists and retrieve its details | `CoverNoteVerificationResponse` |

## .verify() Payload

```ts
await tira.coverNoteVerification.verify(payload): Promise<CoverNoteVerificationResponse>
```

Verifies a cover note against TIRA's registry. This is a **synchronous** request — you get the response immediately, no callback needed.

**Endpoint:** `POST /ecovernote/api/covernote/verification/v1/request`

### Payload Fields

| Field                        | Type     | Required | Default | XML Tag                    | Description                                    |
| ---------------------------- | -------- | -------- | ------- | -------------------------- | ---------------------------------------------- |
| `request_id`                 | `string` | Yes      | —       | `RequestId`                | Unique request identifier                      |
| `covernote_reference_number` | `string` | Yes      | —       | `CoverNoteReferenceNumber` | The TIRA cover note reference number to verify |
| `sticker_number`             | `string` | No       | `""`    | `StickerNumber`            | Motor sticker number (optional filter)         |
| `motor_registration_number`  | `string` | No       | `""`    | `MotorRegistrationNumber`  | Motor registration number (optional filter)    |
| `motor_chassis_number`       | `string` | No       | `""`    | `MotorChassisNumber`       | Motor chassis number (optional filter)         |

### Validation Rules

- `request_id` is required
- `covernote_reference_number` is required
- All other fields are optional — if not provided, they default to empty strings

### Example — Verify by Reference Number Only

```js
const result = await tira.coverNoteVerification.verify({
  request_id: "VERIFY-CN-001",
  covernote_reference_number: "SPCPLBA1013070418136",
});

if (result.tira_status_code === "TIRA001") {
  console.log("Cover note is valid");
  console.log(result.data); // Cover note details from TIRA
} else {
  console.log("Verification failed:", result.tira_status_desc);
}
```

### Example — Verify with All Optional Fields

```js
const result = await tira.coverNoteVerification.verify({
  request_id: "VERIFY-CN-002",
  covernote_reference_number: "SPCPLBA1013070418136",
  sticker_number: "1313-1414-124124",
  motor_registration_number: "T233SQA",
  motor_chassis_number: "4353646",
});

if (result.tira_status_code === "TIRA001") {
  console.log("Cover note is valid");
  console.log(result.data);
} else {
  console.log("Verification failed:", result.tira_status_desc);
}
```

## .verify() Response

When you call `tira.coverNoteVerification.verify()`, you get a `CoverNoteVerificationResponse`:

| Field              | Type     | Description                                                                            |
| ------------------ | -------- | -------------------------------------------------------------------------------------- |
| `response_id`      | `string` | TIRA's response ID                                                                     |
| `request_id`       | `string` | Your original request ID (echoed back)                                                 |
| `tira_status_code` | `string` | Status code — `"TIRA001"` means the cover note was found                               |
| `tira_status_desc` | `string` | Human-readable status description                                                      |
| `data`             | `object` | Cover note details from TIRA. **Only present when `tira_status_code` is `"TIRA001"`**. |

### Response Data Fields

When the cover note is found, `data` contains the full cover note details (parsed from the `CoverNoteDtl` XML element):

#### General Details

| Field                          | Type     | Description                                                         |
| ------------------------------ | -------- | ------------------------------------------------------------------- |
| `CoverNoteTypeDesc`            | `string` | Cover note type description (e.g., "Endorsement", "New", "Renewal") |
| `CoverNoteNumber`              | `string` | The insurer's cover note number                                     |
| `CoverNoteReferenceNumber`     | `string` | TIRA's cover note reference number                                  |
| `PrevCoverNoteReferenceNumber` | `string` | Previous cover note reference (for renewals/endorsements)           |
| `InsurerCompanyCode`           | `string` | Insurer company code                                                |
| `InsurerCompanyName`           | `string` | Insurer company name                                                |
| `TransactionCompanyCode`       | `string` | Transacting company code                                            |
| `TransactionCompanyName`       | `string` | Transacting company name                                            |
| `BranchCode`                   | `string` | Branch code                                                         |
| `SalePointCode`                | `string` | Sales point code                                                    |
| `CoverNoteIssueDate`           | `string` | Date the cover note was issued                                      |
| `CoverNoteStartDate`           | `string` | Coverage start date                                                 |
| `CoverNoteEndDate`             | `string` | Coverage end date                                                   |
| `AuthorizationDate`            | `string` | Date the cover note was authorized                                  |
| `CoverNoteDesc`                | `string` | Cover note description (e.g., "School Bus")                         |
| `OperativeClause`              | `string` | Operative clause (e.g., "Fire and Allied Perils")                   |
| `PaymentMode`                  | `string` | Payment mode (1=Cash, 2=Cheque, 3=EFT)                              |
| `CurrencyCode`                 | `string` | Currency code (e.g., "USD", "TZS")                                  |
| `ExchangeRate`                 | `string` | Exchange rate to TZS                                                |
| `TotalPremiumExcludingTax`     | `string` | Total premium before tax                                            |
| `TotalPremiumIncludingTax`     | `string` | Total premium after tax                                             |
| `CommissionPaid`               | `string` | Commission amount                                                   |
| `CommissionRate`               | `string` | Commission rate                                                     |
| `IsFleet`                      | `string` | Whether this is a fleet cover note ("Y"/"N")                        |
| `FleetId`                      | `string` | Fleet identifier (if fleet)                                         |
| `FleetSize`                    | `string` | Number of vehicles in fleet (if fleet)                              |
| `ComprehensiveInsured`         | `string` | Number of comprehensively insured vehicles (if fleet)               |
| `FleetEntry`                   | `string` | Fleet entry number (if fleet)                                       |
| `OfficerName`                  | `string` | Processing officer name                                             |
| `OfficerTitle`                 | `string` | Processing officer title                                            |
| `ProductCode`                  | `string` | Product code                                                        |

#### Risks Covered

`data.RisksCovered.RiskCovered` contains an array (or single object) of risks:

| Field                           | Type     | Description                                                        |
| ------------------------------- | -------- | ------------------------------------------------------------------ |
| `RiskCode`                      | `string` | Risk code                                                          |
| `SumInsured`                    | `string` | Sum insured                                                        |
| `PremiumRate`                   | `string` | Premium rate                                                       |
| `PremiumBeforeDiscount`         | `string` | Premium before discount                                            |
| `PremiumDiscount`               | `string` | Discount amount                                                    |
| `DiscountType`                  | `string` | Discount type                                                      |
| `PremiumAfterDiscount`          | `string` | Premium after discount                                             |
| `PremiumExcludingTaxEquivalent` | `string` | Premium excluding tax in TZS                                       |
| `PremiumIncludingTax`           | `string` | Premium including tax                                              |
| `TaxesCharged`                  | `object` | Contains `TaxCharged` array with `TaxCode`, `TaxRate`, `TaxAmount` |

#### Subject Matters Covered

`data.SubjectMattersCovered.SubjectMatter` contains an array (or single object):

| Field                    | Type     | Description                |
| ------------------------ | -------- | -------------------------- |
| `SubjectMatterReference` | `string` | Subject matter reference   |
| `SubjectMatterDesc`      | `string` | Subject matter description |

#### Cover Note Addons

`data.CoverNoteAddons.CoverNoteAddon` contains an array (or single object), if any addons exist:

| Field                           | Type     | Description                                                        |
| ------------------------------- | -------- | ------------------------------------------------------------------ |
| `AddonReference`                | `string` | Addon reference                                                    |
| `AddonDesc`                     | `string` | Addon description                                                  |
| `AddonAmount`                   | `string` | Addon amount                                                       |
| `AddonPremiumRate`              | `string` | Addon premium rate                                                 |
| `PremiumExcludingTax`           | `string` | Premium before tax                                                 |
| `PremiumExcludingTaxEquivalent` | `string` | Premium before tax in TZS                                          |
| `PremiumIncludingTax`           | `string` | Premium after tax                                                  |
| `TaxesCharged`                  | `object` | Contains `TaxCharged` array with `TaxCode`, `TaxRate`, `TaxAmount` |

#### Policy Holders

`data.PolicyHolders.PolicyHolder` contains an array (or single object):

| Field                     | Type     | Description                                     |
| ------------------------- | -------- | ----------------------------------------------- |
| `PolicyHolderName`        | `string` | Full name                                       |
| `PolicyHolderBirthDate`   | `string` | Date of birth                                   |
| `PolicyHolderType`        | `string` | 1=Individual, 2=Corporate                       |
| `PolicyHolderIdNumber`    | `string` | ID number                                       |
| `PolicyHolderIdType`      | `string` | ID type (1=NIDA, 2=Voters ID, 3=Passport, etc.) |
| `Gender`                  | `string` | Gender (may be empty)                           |
| `CountryCode`             | `string` | Country code (e.g., "TZA")                      |
| `Region`                  | `string` | Region                                          |
| `District`                | `string` | District                                        |
| `Street`                  | `string` | Street (may be empty)                           |
| `PolicyHolderPhoneNumber` | `string` | Phone number                                    |
| `PolicyHolderFax`         | `string` | Fax number (may be empty)                       |
| `PostalAddress`           | `string` | Postal address (may be empty)                   |
| `EmailAddress`            | `string` | Email address (may be empty)                    |

#### Motor Details

`data.MotorDtl` contains motor vehicle details (present for motor cover notes):

| Field                | Type     | Description                                |
| -------------------- | -------- | ------------------------------------------ |
| `MotorCategory`      | `string` | 1=Motor Vehicle, 2=Motor Cycle             |
| `RegistrationNumber` | `string` | Vehicle registration number                |
| `ChassisNumber`      | `string` | Chassis number                             |
| `Make`               | `string` | Vehicle make (e.g., "Toyota")              |
| `Model`              | `string` | Vehicle model (e.g., "IST")                |
| `ModelNumber`        | `string` | Model number                               |
| `BodyType`           | `string` | Body type (e.g., "Station Wagon")          |
| `Color`              | `string` | Vehicle color                              |
| `EngineNumber`       | `string` | Engine number                              |
| `EngineCapacity`     | `string` | Engine capacity in cc                      |
| `FuelUsed`           | `string` | Fuel type (e.g., "Petrol", "Diesel")       |
| `NumberOfAxles`      | `string` | Number of axles                            |
| `AxleDistance`       | `string` | Axle distance (may be empty)               |
| `SittingCapacity`    | `string` | Sitting capacity (may be empty)            |
| `YearOfManufacture`  | `string` | Year of manufacture                        |
| `TareWeight`         | `string` | Empty weight in kg                         |
| `GrossWeight`        | `string` | Loaded weight in kg                        |
| `MotorUsage`         | `string` | Usage type (e.g., "Private", "Commercial") |
| `OwnerName`          | `string` | Registered owner name                      |
| `OwnerCategory`      | `string` | Owner category                             |
| `OwnerAddress`       | `string` | Owner address (may be empty)               |

::: info
All values in `data` are returned as strings by TIRA, even numeric fields like `SumInsured` and `ExchangeRate`. Some fields may be empty strings when not applicable. When `tira_status_code` is not `"TIRA001"`, `data` is `undefined`.
:::

::: tip Motor Details
The `MotorDtl` section is present for motor-related cover notes. For non-motor cover notes, this section may not be included in the response.
:::

## Full Example

A complete Express.js application that verifies a cover note against TIRA's registry.

```js
const express = require("express");
const { Tira } = require("tira-node");

const app = express();
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

// Verify a cover note
app.get("/verify-cover-note", async (req, res) => {
  try {
    const result = await tira.coverNoteVerification.verify({
      request_id: `VERIFY-${Date.now()}`,
      covernote_reference_number: req.query.reference_number,
    });

    if (result.tira_status_code === "TIRA001") {
      res.json({
        valid: true,
        data: result.data,
      });
    } else {
      res.json({
        valid: false,
        code: result.tira_status_code,
        message: result.tira_status_desc,
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000);
```

## Common Mistakes

::: danger Missing required fields
Both `request_id` and `covernote_reference_number` are required. Omitting either one throws a `TiraValidationError`.
:::

::: danger Confusing this with motor verification
`tira.coverNoteVerification.verify()` checks whether a **cover note** exists in TIRA's system. To verify a **motor vehicle** against TIRA's registry, use `tira.motor.verify()` instead.
:::

::: danger Expecting a callback
Cover note verification is synchronous — the result is returned immediately. There is no callback URL, no acknowledgement, and no need for `express.text({ type: "application/xml" })` middleware.
:::

## Related Pages

- [Error Codes](/error-codes) — All TIRA status codes and fixes
- [Initialization](/initialization) — Setting up the Tira client
- [Motor](/motor) — Motor vehicle cover notes and verification
- [Non-Life Other](/non-life-other) — Non-life other cover notes
