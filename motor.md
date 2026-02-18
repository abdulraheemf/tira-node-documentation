# Motor

The Motor resource handles motor vehicle and motor cycle cover note submissions to TIRA. Use `tira.motor` to submit new cover notes, renewals, and endorsements, handle TIRA's asynchronous callback responses, and verify motor vehicles against TIRA's registry.

For the general submit-callback-acknowledge flow, see [Callbacks & Acknowledgements](/callbacks-acknowledgements).

## Available Methods

| Method | Description | When to Use | Returns |
|---|---|---|---|
| `tira.motor.verify(payload)` | Verify a motor vehicle against TIRA's registry | Before submitting a cover note — check if the vehicle exists and get its details | `MotorVerificationResponse` |
| `tira.motor.submit(payload)` | Submit a motor cover note (new, renewal, or endorsement) | When you want to create, renew, or modify a cover note | `CoverNoteResponse` |
| `tira.motor.handleCallback(input)` | Parse and extract data from TIRA's callback | When TIRA sends the result of your submission to your callback URL | `CallbackResult<MotorCallbackResponse>` |

## .verify() Payload

```ts
await tira.motor.verify(payload): Promise<MotorVerificationResponse>
```

Verifies a motor vehicle against TIRA's registry. This is a **synchronous** request — you get the response immediately, no callback needed. Use this to check if a vehicle exists before submitting a cover note.

**Endpoint:** `POST /dispatch/api/motor/verification/v1/request`

### Payload Fields

| Field | Type | Required | Description |
|---|---|---|---|
| `request_id` | `string` | Yes | Unique request identifier |
| `motor_category` | `"1"\|"2"` | Yes | 1=Motor Vehicle, 2=Motor Cycle |
| `motor_registration_number` | `string` | Conditional | Registration number. Provide this OR `motor_chassis_number`. |
| `motor_chassis_number` | `string` | Conditional | Chassis number. Provide this OR `motor_registration_number`. |

### Validation Rules

- `request_id` is required
- `motor_category` must be `"1"` or `"2"`
- You must provide **exactly one** of `motor_registration_number` or `motor_chassis_number` — providing both or neither throws a `TiraValidationError`

## .verify() Response

When you call `tira.motor.verify()`, you get a `MotorVerificationResponse`:

| Field | Type | Description |
|---|---|---|
| `response_id` | `string` | TIRA's response ID |
| `request_id` | `string` | Your original request ID |
| `tira_status_code` | `string` | `"TIRA001"` = vehicle found |
| `tira_status_desc` | `string` | Human-readable description |
| `data` | `object` | Motor details from TIRA's registry. **Only present when `tira_status_code` is `"TIRA001"`**. |

### Response Data Fields

When the vehicle is found, `data` contains:

| Field | Type | Description |
|---|---|---|
| `MotorCategory` | `string` | `"1"` = Motor Vehicle, `"2"` = Motor Cycle |
| `RegistrationNumber` | `string` | Vehicle registration number |
| `ChassisNumber` | `string` | Chassis number |
| `Make` | `string` | Vehicle make (e.g., "TRAILER", "TOYOTA") |
| `Model` | `string` | Vehicle model (e.g., "SKELETAL", "RAV4") |
| `ModelNumber` | `string` | Model number |
| `BodyType` | `string` | Body type (e.g., "Trailer", "Saloon") |
| `Color` | `string` | Vehicle color |
| `EngineNumber` | `string` | Engine number (may be empty for trailers) |
| `EngineCapacity` | `string` | Engine capacity in cc (e.g., `"0"` for trailers) |
| `FuelUsed` | `string` | Fuel type (e.g., "Petrol", "Diesel", "Not applicable") |
| `NumberOfAxles` | `string` | Number of axles |
| `AxleDistance` | `string` | Axle distance |
| `SittingCapacity` | `string` | Sitting capacity |
| `YearOfManufacture` | `string` | Year of manufacture |
| `TareWeight` | `string` | Empty weight in kg |
| `GrossWeight` | `string` | Loaded weight in kg |
| `MotorUsage` | `string` | Usage type (e.g., "Commercial", "Private") |
| `OwnerName` | `string` | Registered owner name |
| `OwnerCategory` | `string` | Owner category (e.g., "Company", "Individual") |

::: info
All values in `data` are returned as strings by TIRA, even numeric fields like `EngineCapacity` and `YearOfManufacture`. Some fields may be empty (e.g., `EngineNumber` for trailers) or `"0"` when not applicable.
:::

### Example — Verify by Registration Number

```js
const result = await tira.motor.verify({
  request_id: "VERIFY-001",
  motor_category: "1", // Motor Vehicle
  motor_registration_number: "T337DSE",
});

if (result.tira_status_code === "TIRA001") {
  console.log(result.data.Make);             // "TRAILER"
  console.log(result.data.Model);            // "SKELETAL"
  console.log(result.data.OwnerName);        // "KALKAALOW TRANSPORT LIMITED"
  console.log(result.data.YearOfManufacture); // "2008"
  console.log(result.data.MotorUsage);       // "Commercial"
} else {
  console.log("Vehicle not found:", result.tira_status_desc);
}
```

### Example — Verify by Chassis Number

```js
const result = await tira.motor.verify({
  request_id: "VERIFY-002",
  motor_category: "1",
  motor_chassis_number: "JTDBW933901234567",
});

if (result.tira_status_code === "TIRA001") {
  console.log(result.data.RegistrationNumber); // e.g., "T123ABC"
  console.log(result.data.ChassisNumber);      // "JTDBW933901234567"
  console.log(result.data.OwnerName);          // Owner's name
} else {
  console.log("Vehicle not found:", result.tira_status_desc);
}
```

## .submit() Payload

```ts
await tira.motor.submit(payload): Promise<CoverNoteResponse>
```

Submits a motor cover note to TIRA. This is an asynchronous operation — you receive an acknowledgement immediately, and the actual result comes later via your callback URL.

**Endpoint:** `POST /ecovernote/api/covernote/non-life/motor/v2/request`

### Cover Note Types

| Value | Type | When to Use | Extra Required Fields |
|---|---|---|---|
| `"1"` | New | First-time cover note | `covernote_number` |
| `"2"` | Renewal | Renewing existing coverage | `covernote_number` + `previous_covernote_reference_number` |
| `"3"` | Endorsement | Modifying existing coverage | `previous_covernote_reference_number` + `endorsement_type` + `endorsement_reason` |

### Endorsement Types

When `covernote_type` is `"3"` (Endorsement), you must specify the endorsement type:

| Value | Type | Description |
|---|---|---|
| `"1"` | Increasing Premium | Policy changes that increase the premium |
| `"2"` | Decreasing Premium | Policy changes that decrease the premium |
| `"3"` | Cover Details Changed | Changes to coverage details without premium impact |
| `"4"` | Cancellation | Cancelling the cover note entirely |

### Cover Note Fields

These are the top-level fields in the submission payload.

| Field | Type | Required | Default | XML Tag | Description |
|---|---|---|---|---|---|
| `request_id` | `string` | Yes | — | `RequestId` | Unique request identifier |
| `callback_url` | `string` | Yes | — | `CallBackUrl` | Where TIRA sends results. Must be HTTPS. |
| `insurer_company_code` | `string` | Yes | — | `InsurerCompanyCode` | Insurer's company code |
| `covernote_type` | `"1"\|"2"\|"3"` | Yes | — | `CoverNoteType` | 1=New, 2=Renewal, 3=Endorsement |
| `covernote_number` | `string` | Conditional | `""` | `CoverNoteNumber` | Your cover note number. Required for New and Renewal. |
| `previous_covernote_reference_number` | `string` | Conditional | `""` | `PrevCoverNoteReferenceNumber` | TIRA reference number of the previous cover note. Required for Renewal and Endorsement. |
| `sales_point_code` | `string` | Yes | — | `SalePointCode` | Sales point code given by TIRA |
| `covernote_start_date` | `string\|Date` | Yes | — | `CoverNoteStartDate` | Start date. See [Date Handling](#date-handling). |
| `covernote_end_date` | `string\|Date` | Yes | — | `CoverNoteEndDate` | End date. Must be after start date. |
| `covernote_desc` | `string` | Yes | — | `CoverNoteDesc` | Description (e.g., "Private Vehicles") |
| `operative_clause` | `string` | Yes | — | `OperativeClause` | Operative clause (e.g., "Comprehensive") |
| `payment_mode` | `"1"\|"2"\|"3"` | Yes | — | `PaymentMode` | 1=Cash, 2=Cheque, 3=EFT |
| `currency_code` | `string` | No | `"TZS"` | `CurrencyCode` | ISO currency code |
| `exchange_rate` | `number` | No | `1.0` | `ExchangeRate` | Exchange rate to TZS. Formatted to 2 decimal places. |
| `total_premium_excluding_tax` | `number` | Yes | — | `TotalPremiumExcludingTax` | Total premium before tax. Max 2 decimal places. |
| `total_premium_including_tax` | `number` | Yes | — | `TotalPremiumIncludingTax` | Total premium after tax. Must be >= excluding tax. |
| `commission_paid` | `number` | No | `""` | `CommisionPaid` | Commission amount. Mandatory for intermediaries. |
| `commission_rate` | `number` | No | `""` | `CommisionRate` | Commission rate. Max 5 decimal places. |
| `officer_name` | `string` | Yes | — | `OfficerName` | Name of the processing officer |
| `officer_title` | `string` | Yes | — | `OfficerTitle` | Title of the processing officer |
| `product_code` | `string` | Yes | — | `ProductCode` | Product code (e.g., `SP014001000000` for Motor Private Vehicle) |
| `endorsement_type` | `"1"\|"2"\|"3"\|"4"` | Conditional | `""` | `EndorsementType` | Required when `covernote_type` is `"3"`. See [Endorsement Types](#endorsement-types). |
| `endorsement_reason` | `string` | Conditional | `""` | `EndorsementReason` | Required when `covernote_type` is `"3"`. |
| `endorsement_premium_earned` | `number` | No | `0` | `EndorsementPremiumEarned` | Premium earned from endorsement |
| `risks_covered` | `RisksCovered[]` | Yes | — | `RisksCovered` | At least one risk. See [Risks Covered](#risks-covered). |
| `subject_matters_covered` | `SubjectMatter[]` | Yes | — | `SubjectMattersCovered` | At least one subject matter. See [Subject Matters](#subject-matters). |
| `covernote_addons` | `CoverNoteAddon[]` | No | `[]` | `CoverNoteAddons` | Optional addons. See [Cover Note Addons](#cover-note-addons). |
| `policy_holders` | `PolicyHolder[]` | Yes | — | `PolicyHolders` | At least one policy holder. See [Policy Holders](#policy-holders). |
| `motor_details` | `MotorDetails` | Yes | — | `MotorDtl` | Motor vehicle details. See [Motor Details](#motor-details). |

### Motor Details

The `motor_details` object describes the vehicle being insured.

| Field | Type | Required | Default | XML Tag | Description |
|---|---|---|---|---|---|
| `motor_category` | `"1"\|"2"` | Yes | — | `MotorCategory` | 1=Motor Vehicle, 2=Motor Cycle |
| `motor_type` | `"1"\|"2"` | Yes | — | `MotorType` | 1=Registered, 2=In Transit |
| `registration_number` | `string` | Conditional | `""` | `RegistrationNumber` | Required if `motor_type` is `"1"` (Registered) |
| `chassis_number` | `string` | Yes | — | `ChassisNumber` | Vehicle chassis number |
| `make` | `string` | Yes | — | `Make` | e.g., "Toyota" |
| `model` | `string` | Yes | — | `Model` | e.g., "RAV4" |
| `model_number` | `string` | Yes | — | `ModelNumber` | e.g., "2010" |
| `body_type` | `string` | Yes | — | `BodyType` | e.g., "STATION WAGON" |
| `color` | `string` | Yes | — | `Color` | e.g., "WHITE" |
| `engine_number` | `string` | Yes | — | `EngineNumber` | Engine serial number |
| `engine_capacity` | `string` | Yes | — | `EngineCapacity` | Engine capacity in cc (e.g., "2360") |
| `fuel_used` | `string` | Yes | — | `FuelUsed` | e.g., "PETROL", "DIESEL" |
| `number_of_axles` | `number` | Conditional | `""` | `NumberOfAxles` | Required for Motor Vehicle, optional for Motor Cycle |
| `axle_distance` | `number` | Conditional | `0` | `AxleDistance` | Required for Motor Vehicle, optional for Motor Cycle |
| `sitting_capacity` | `number` | Conditional | `""` | `SittingCapacity` | Required for Motor Vehicle, optional for Motor Cycle |
| `year_of_manufacture` | `number` | Yes | — | `YearOfManufacture` | Must be between 1900 and next year |
| `tare_weight` | `number` | Yes | — | `TareWeight` | Empty weight in kg. Must be positive. |
| `gross_weight` | `number` | Yes | — | `GrossWeight` | Loaded weight in kg. Must be positive. |
| `motor_usage` | `"1"\|"2"` | Yes | — | `MotorUsage` | 1=Private, 2=Commercial |
| `owner_name` | `string` | Yes | — | `OwnerName` | Vehicle owner's name |
| `owner_category` | `"1"\|"2"` | Yes | — | `OwnerCategory` | 1=Sole Proprietor, 2=Corporate |
| `owner_address` | `string` | Yes | — | `OwnerAddress` | Vehicle owner's address |

### Risks Covered

At least one risk is required. Each item in the `risks_covered` array maps to a `<RiskCovered>` XML element.

| Field | Type | Required | XML Tag | Description |
|---|---|---|---|---|
| `risk_code` | `string` | Yes | `RiskCode` | Risk code from TIRA (e.g., `SP014001000001`) |
| `sum_insured` | `number` | Yes | `SumInsured` | Sum insured amount. Max 2 decimal places. |
| `sum_insured_equivalent` | `number` | Yes | `SumInsuredEquivalent` | Sum insured equivalent in TZS. Max 2 decimal places. |
| `premium_rate` | `number` | Yes | `PremiumRate` | Premium rate. Max 5 decimal places. |
| `premium_before_discount` | `number` | Yes | `PremiumBeforeDiscount` | Premium before discount. Max 2 decimal places. |
| `premium_after_discount` | `number` | Yes | `PremiumAfterDiscount` | Premium after discount. Max 2 decimal places. |
| `premium_excluding_tax_equivalent` | `number` | Yes | `PremiumExcludingTaxEquivalent` | Premium excluding tax in TZS. Max 2 decimal places. |
| `premium_including_tax` | `number` | Yes | `PremiumIncludingTax` | Premium including tax. Max 2 decimal places. |
| `discounts_offered` | `DiscountOffered[]` | No | `DiscountsOffered` | See [Discounts Offered](#discounts-offered) |
| `taxes_charged` | `TaxCharged[]` | Yes | `TaxesCharged` | See [Taxes Charged](#taxes-charged) |

### Taxes Charged

Each risk and addon must include tax information. If no tax applies, set `is_tax_exempted` to `"Y"` and provide exemption details.

| Field | Type | Required | XML Tag | Description |
|---|---|---|---|---|
| `tax_code` | `string` | Yes | `TaxCode` | Tax code from TIRA (e.g., `VAT-MAINLAND`) |
| `is_tax_exempted` | `"Y"\|"N"` | Yes | `IsTaxExempted` | Whether tax is exempted |
| `tax_exemption_type` | `"1"\|"2"` | Conditional | `TaxExemptionType` | Required if exempted. 1=Policy Holder Exempted, 2=Risk Exempted |
| `tax_exemption_reference` | `string` | Conditional | `TaxExemptionReference` | Required if exempted. Exemption reference number. |
| `tax_rate` | `number` | Yes | `TaxRate` | Tax rate as decimal (e.g., `0.18` for 18%). Max 5 decimal places. |
| `tax_amount` | `number` | Yes | `TaxAmount` | Tax amount. Max 2 decimal places. |

### Discounts Offered

Optional. Nested inside each risk.

| Field | Type | Required | XML Tag | Description |
|---|---|---|---|---|
| `discount_type` | `"1"` | Yes | `DiscountType` | Currently only `"1"` (Fleet Discount) |
| `discount_rate` | `number` | Yes | `DiscountRate` | Discount rate. Max 5 decimal places. |
| `discount_amount` | `number` | Yes | `DiscountAmount` | Discount amount. Max 2 decimal places. |

### Subject Matters

At least one subject matter is required. Each item maps to a `<SubjectMatter>` XML element.

| Field | Type | Required | XML Tag | Description |
|---|---|---|---|---|
| `subject_matter_reference` | `string` | Yes | `SubjectMatterReference` | Your reference (e.g., "HSB001") |
| `subject_matter_desc` | `string` | Yes | `SubjectMatterDesc` | Description (e.g., "Vehicle") |

### Cover Note Addons

Optional. Each item maps to a `<CoverNoteAddon>` XML element.

| Field | Type | Required | XML Tag | Description |
|---|---|---|---|---|
| `addon_reference` | `string` | Yes | `AddonReference` | Your addon reference |
| `addon_description` | `string` | Yes | `AddonDesc` | Description of the addon |
| `addon_amount` | `number` | Yes | `AddonAmount` | Addon amount. Max 2 decimal places. |
| `addon_premium_rate` | `number` | Yes | `AddonPremiumRate` | Premium rate. Max 5 decimal places. |
| `premium_excluding_tax` | `number` | Yes | `PremiumExcludingTax` | Premium before tax. Max 2 decimal places. |
| `premium_excluding_tax_equivalent` | `number` | Yes | `PremiumExcludingTaxEquivalent` | Premium before tax in TZS. Max 2 decimal places. |
| `premium_including_tax` | `number` | Yes | `PremiumIncludingTax` | Premium after tax. Max 2 decimal places. |
| `taxes_charged` | `TaxCharged[]` | Yes | `TaxesCharged` | Same structure as [Taxes Charged](#taxes-charged) |

### Policy Holders

At least one policy holder is required. Each item maps to a `<PolicyHolder>` XML element.

| Field | Type | Required | Default | XML Tag | Description |
|---|---|---|---|---|---|
| `policyholder_name` | `string` | Yes | — | `PolicyHolderName` | Full name |
| `policyholder_birthdate` | `string` | Yes | — | `PolicyHolderBirthDate` | Date of birth (`YYYY-MM-DD`) |
| `policyholder_type` | `"1"\|"2"` | Yes | — | `PolicyHolderType` | 1=Individual, 2=Corporate |
| `policyholder_id_type` | `"1"`–`"7"` | Yes | — | `PolicyHolderIdType` | See ID types table below |
| `policyholder_id_number` | `string` | Yes | — | `PolicyHolderIdNumber` | ID number |
| `gender` | `"M"\|"F"` | Yes | — | `Gender` | M=Male, F=Female |
| `country_code` | `string` | No | `"TZA"` | `CountryCode` | ISO country code (e.g., `TZA`, `KEN`, `UGA`) |
| `region` | `string` | Yes | — | `Region` | Region code from TIRA |
| `district` | `string` | Yes | — | `District` | District from TIRA |
| `street` | `string` | Yes | — | `Street` | Street name |
| `phone_number` | `string` | Yes | — | `PolicyHolderPhoneNumber` | Format: `2557XXXXXXXX` (12 digits) |
| `fax_number` | `string` | No | `""` | `PolicyHolderFax` | Fax number |
| `postal_address` | `string` | Yes | — | `PostalAddress` | Postal address |
| `email_address` | `string` | No | `""` | `EmailAddress` | Email address (validated if provided) |

#### Policy Holder ID Types

| Value | Description |
|---|---|
| `"1"` | NIDA |
| `"2"` | Voters ID Card |
| `"3"` | Passport |
| `"4"` | Driving License |
| `"5"` | Zanzibar ID |
| `"6"` | TIN |
| `"7"` | Company Incorporation Certificate Number |

### Date Handling

The package automatically converts dates to East Africa Time (UTC+3) and formats them as `YYYY-MM-DDTHH:mm:ss` (no timezone suffix). You can pass either an ISO string or a JavaScript `Date` object.

::: tip Example
If you pass `"2025-05-31T21:00:00Z"` (9 PM UTC), the package converts it to `"2025-06-01T00:00:00"` (midnight EAT, June 1st).

This means if you want a cover note to start on June 1st Tanzania time, pass `"2025-05-31T21:00:00Z"` or `new Date("2025-05-31T21:00:00Z")`.
:::

### Validation Rules

The package validates your payload before sending it to TIRA. If validation fails, it throws a `TiraValidationError` with the field name and a descriptive message.

- `callback_url` must start with `https://`
- `covernote_number` is required when `covernote_type` is `"1"` (New) or `"2"` (Renewal)
- `previous_covernote_reference_number` is required when `covernote_type` is `"2"` (Renewal) or `"3"` (Endorsement)
- `endorsement_type` and `endorsement_reason` are required when `covernote_type` is `"3"` (Endorsement)
- `total_premium_including_tax` must be greater than or equal to `total_premium_excluding_tax`
- `covernote_end_date` must be after `covernote_start_date`
- `registration_number` is required when `motor_type` is `"1"` (Registered)
- `number_of_axles`, `axle_distance`, and `sitting_capacity` are required when `motor_category` is `"1"` (Motor Vehicle), optional for Motor Cycle
- `year_of_manufacture` must be between 1900 and next year
- `tare_weight` and `gross_weight` must be positive numbers
- At least one item is required in `risks_covered`, `subject_matters_covered`, and `policy_holders`
- `phone_number` must be 12 digits starting with `2557`
- `policyholder_birthdate` must be a valid ISO date (`YYYY-MM-DD`)
- `email_address` is validated if provided

### Conditional Fields Quick Reference

**By cover note type:**

| Scenario | `covernote_number` | `previous_covernote_reference_number` | `endorsement_type` | `endorsement_reason` |
|---|---|---|---|---|
| New (`"1"`) | Required | — | — | — |
| Renewal (`"2"`) | Required | Required | — | — |
| Endorsement (`"3"`) | — | Required | Required | Required |

**By motor category and type:**

| Scenario | `registration_number` | `number_of_axles` | `axle_distance` | `sitting_capacity` |
|---|---|---|---|---|
| Motor Vehicle + Registered | Required | Required | Required | Required |
| Motor Vehicle + In Transit | — | Required | Required | Required |
| Motor Cycle + Registered | Required | Optional | Optional | Optional |
| Motor Cycle + In Transit | — | Optional | Optional | Optional |

## .submit() Response

When you call `tira.motor.submit()`, you get an immediate `CoverNoteResponse` from TIRA:

| Field | Type | Description |
|---|---|---|
| `acknowledgement_id` | `string` | TIRA's acknowledgement ID |
| `request_id` | `string` | Your original request ID (echoed back) |
| `tira_status_code` | `string` | Status code — `"TIRA001"` means received |
| `tira_status_desc` | `string` | Human-readable description |
| `requires_acknowledgement` | `boolean` | Always `true` |
| `acknowledgement_payload` | `Record<string, unknown>` | Raw parsed acknowledgement (rarely needed) |

::: tip "TIRA001" means "received", not "approved"
At this stage, `"TIRA001"` means TIRA received your request and it's being processed. It does **not** mean your cover note has been approved. The actual result (approved or rejected) comes later via your callback URL.

If you get a code other than `"TIRA001"`, something went wrong with the submission itself. Check the [Error Codes](/error-codes) page for the specific code.
:::

### Example — New Cover Note

```js
const result = await tira.motor.submit({
  request_id: "REQ-2025-001",
  callback_url: "https://your-server.com/tira/motor-callback",
  insurer_company_code: "ICC103",
  covernote_type: "1", // New
  covernote_number: "SPCPLBA123456",
  sales_point_code: "SP719",
  covernote_start_date: "2025-05-31T21:00:00Z", // June 1st EAT
  covernote_end_date: "2026-05-31T21:00:00Z",   // June 1st next year EAT
  covernote_desc: "Private Vehicles",
  operative_clause: "Comprehensive",
  payment_mode: "3", // EFT
  total_premium_excluding_tax: 525000,
  total_premium_including_tax: 619500,
  commission_paid: 65625,
  commission_rate: 0.125,
  officer_name: "Johnson Abraham",
  officer_title: "Manager",
  product_code: "SP014001000000",
  risks_covered: [
    {
      risk_code: "SP014001000001",
      sum_insured: 15000000,
      sum_insured_equivalent: 15000000,
      premium_rate: 0.035,
      premium_before_discount: 525000,
      premium_after_discount: 525000,
      premium_excluding_tax_equivalent: 525000,
      premium_including_tax: 619500,
      taxes_charged: [
        {
          tax_code: "VAT-MAINLAND",
          is_tax_exempted: "N",
          tax_rate: 0.18,
          tax_amount: 94500,
        },
      ],
    },
  ],
  subject_matters_covered: [
    {
      subject_matter_reference: "HSB001",
      subject_matter_desc: "Vehicle",
    },
  ],
  policy_holders: [
    {
      policyholder_name: "Jane Doe",
      policyholder_birthdate: "1984-06-19",
      policyholder_type: "1", // Individual
      policyholder_id_type: "1", // NIDA
      policyholder_id_number: "19840619566676776857",
      gender: "F",
      region: "Dar es Salaam",
      district: "Ilala",
      street: "Kariakoo",
      phone_number: "255712345678",
      postal_address: "P.O. Box 12345, Dar es Salaam",
    },
  ],
  motor_details: {
    motor_category: "1", // Motor Vehicle
    motor_type: "1",     // Registered
    registration_number: "T123ABC",
    chassis_number: "1234567890",
    make: "Toyota",
    model: "RAV4",
    model_number: "2010",
    body_type: "STATION WAGON",
    color: "WHITE",
    engine_number: "984668484DDD",
    engine_capacity: "2360",
    fuel_used: "PETROL",
    number_of_axles: 2,
    axle_distance: 0,
    sitting_capacity: 5,
    year_of_manufacture: 2010,
    tare_weight: 1750,
    gross_weight: 1850,
    motor_usage: "1", // Private
    owner_name: "Jane Doe",
    owner_category: "1", // Sole Proprietor
    owner_address: "Kariakoo, Dar es Salaam",
  },
});

console.log(result.acknowledgement_id); // "ACK123456"
console.log(result.tira_status_code);   // "TIRA001"
```

### Example — Renewal

```js
const result = await tira.motor.submit({
  // ...same fields as New, plus:
  covernote_type: "2", // Renewal
  covernote_number: "SPCPLBA789012",
  previous_covernote_reference_number: "CN-2024-001", // From last year's cover note
  // ...rest of payload
});
```

### Example — Endorsement

```js
const result = await tira.motor.submit({
  // ...same base fields, but:
  covernote_type: "3", // Endorsement
  previous_covernote_reference_number: "CN-2025-001", // The cover note being modified
  endorsement_type: "1", // Increasing Premium
  endorsement_reason: "Additional coverage for windscreen",
  endorsement_premium_earned: 50000,
  // Note: covernote_number is NOT required for endorsements
  // ...rest of payload
});
```

## .submit() Callback Response

After TIRA processes your submission, it sends the result to your `callback_url`. The callback contains the actual outcome — whether your cover note was approved or rejected.

### Extracted Data

The `extracted` field contains the parsed callback data:

| Field | Type | Description |
|---|---|---|
| `response_id` | `string` | TIRA's response ID |
| `request_id` | `string` | Your original request ID |
| `response_status_code` | `string` | `"TIRA001"` = approved. See [Error Codes](/error-codes) for other codes. |
| `response_status_desc` | `string` | Human-readable status description |
| `covernote_reference_number` | `string` | TIRA's cover note reference number (on success) |
| `sticker_number` | `string` | Sticker number assigned by TIRA (on success) |

### On Success

When `response_status_code` is `"TIRA001"`, the cover note was approved. You'll receive the `covernote_reference_number` and `sticker_number` — save these, they're the official TIRA identifiers.

```js
// response_status_code === "TIRA001"
console.log(result.extracted.covernote_reference_number); // "CN-2025-001"
console.log(result.extracted.sticker_number);             // "STK-2025-001"
```

### On Error

When `response_status_code` is anything other than `"TIRA001"`, the cover note was rejected. The `covernote_reference_number` and `sticker_number` will be empty. Check the [Error Codes](/error-codes) page — motor-specific errors are in the "Motor Vehicle & Fleet" and "Cover Note" sections.

```js
// response_status_code !== "TIRA001"
console.log(result.extracted.response_status_code); // e.g., "TIRA020"
console.log(result.extracted.response_status_desc); // e.g., "Invalid covernote start date"
```

### Example — Handling the Callback

```js
app.post("/tira/motor-callback", async (req, res) => {
  const result = await tira.motor.handleCallback(req.body);

  if (result.extracted.response_status_code === "TIRA001") {
    await db.coverNotes.update({
      where: { request_id: result.extracted.request_id },
      data: {
        status: "approved",
        reference_number: result.extracted.covernote_reference_number,
        sticker_number: result.extracted.sticker_number,
      },
    });
  } else {
    console.error(
      `Cover note rejected: ${result.extracted.response_status_code}`,
      result.extracted.response_status_desc
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

| Argument | Description |
|---|---|
| `result.body` | The `body` from the callback result — the full parsed XML as a JS object |
| `uniqueId` | A unique string you generate (e.g., a UUID) |

The package automatically:
1. Derives the correct acknowledgement tag name (e.g., `MotorCoverNoteRefRes` → `MotorCoverNoteRefResAck`)
2. Fills in `AcknowledgementId`, `ResponseId`, `AcknowledgementStatusCode`, and `AcknowledgementStatusDesc`
3. Signs the XML with your private key
4. Wraps it in `<TiraMsg>` with `<MsgSignature>`

### What the XML Looks Like

You don't need to build this yourself — this is what the package generates:

```xml
<TiraMsg>
<MotorCoverNoteRefResAck>
  <AcknowledgementId>your-unique-id</AcknowledgementId>
  <ResponseId>TIRA22424232355</ResponseId>
  <AcknowledgementStatusCode>TIRA001</AcknowledgementStatusCode>
  <AcknowledgementStatusDesc>Successful</AcknowledgementStatusDesc>
</MotorCoverNoteRefResAck>
<MsgSignature>base64-encoded-signature...</MsgSignature>
</TiraMsg>
```

### Example

```js
const { v4: uuid } = require("uuid");

app.post("/tira/motor-callback", async (req, res) => {
  const result = await tira.motor.handleCallback(req.body);

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
app.post("/tira/motor-callback", async (req, res) => {
  const result = await tira.motor.handleCallback(req.body);

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
await tira.motor.handleCallback(input: string | Record<string, any>): Promise<CallbackResult<MotorCallbackResponse>>
```

This function parses the callback XML that TIRA sends to your callback URL and extracts the relevant data. You can also use the universal `tira.handleCallback()` if you have a single endpoint for all callback types.

### What It Does

1. **Verifies the signature** — checks that the callback's `<MsgSignature>` matches TIRA's public key (if signature verification is configured)
2. **Parses the XML** — converts the raw XML into a JavaScript object
3. **Extracts the data** — pulls out the fields you care about (`covernote_reference_number`, `sticker_number`, etc.) into a clean `extracted` object

### Input

You can pass either:
- A **raw XML string** — the `req.body` from your Express handler (requires `express.text({ type: "application/xml" })` middleware)
- A **pre-parsed object** — if you've already parsed the XML yourself

### What It Returns

| Field | Type | Description |
|---|---|---|
| `type` | `"motor"` | Always `"motor"` for this handler |
| `extracted` | `MotorCallbackResponse` | The extracted data (see [Callback Response](#submit-callback-response)) |
| `body` | `Record<string, any>` | Full parsed XML as JS object — pass this to `tira.acknowledge()` |
| `signature_verified` | `boolean` | Whether TIRA's digital signature was verified |
| `raw_xml` | `string` | The original XML string |

### Resource-Specific vs Universal Handler

| Approach | Method | When to Use |
|---|---|---|
| Resource-specific | `tira.motor.handleCallback(input)` | When you have separate endpoints per resource type |
| Universal | `tira.handleCallback(input)` | When you have one endpoint for all TIRA callbacks (requires `enabled_callbacks` in config) |

Both return the same data. The universal handler auto-detects the callback type. See [Callbacks & Acknowledgements](/callbacks-acknowledgements) for details on the universal handler.

## Full Example

A complete Express.js application that verifies a vehicle, submits a motor cover note, handles the callback, and acknowledges it.

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

// Verify a motor vehicle
app.get("/verify-motor/:registration", async (req, res) => {
  const result = await tira.motor.verify({
    request_id: uuid(),
    motor_category: "1",
    motor_registration_number: req.params.registration,
  });

  res.json({
    found: result.tira_status_code === "TIRA001",
    data: result.data,
  });
});

// Submit a motor cover note
app.post("/submit-motor", async (req, res) => {
  const result = await tira.motor.submit({
    request_id: uuid(),
    callback_url: "https://your-server.com/tira/motor-callback",
    insurer_company_code: "ICC103",
    covernote_type: "1",
    covernote_number: req.body.covernote_number,
    sales_point_code: "SP719",
    covernote_start_date: req.body.start_date,
    covernote_end_date: req.body.end_date,
    covernote_desc: "Private Vehicles",
    operative_clause: "Comprehensive",
    payment_mode: "3",
    total_premium_excluding_tax: req.body.premium_excl_tax,
    total_premium_including_tax: req.body.premium_incl_tax,
    officer_name: "Johnson Abraham",
    officer_title: "Manager",
    product_code: "SP014001000000",
    risks_covered: req.body.risks,
    subject_matters_covered: req.body.subject_matters,
    policy_holders: req.body.policy_holders,
    motor_details: req.body.motor_details,
  });

  res.json({
    message: "Submitted to TIRA",
    acknowledgement_id: result.acknowledgement_id,
    status: result.tira_status_code,
  });
});

// Handle TIRA's callback and acknowledge
app.post("/tira/motor-callback", async (req, res) => {
  const result = await tira.motor.handleCallback(req.body);

  try {
    await db.coverNotes.update({
      where: { request_id: result.extracted.request_id },
      data: {
        status: result.extracted.response_status_code,
        reference_number: result.extracted.covernote_reference_number,
        sticker_number: result.extracted.sticker_number,
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
const result = await tira.motor.submit({
  covernote_type: "3",
  previous_covernote_reference_number: "CN-2025-001",
  endorsement_type: "4", // Cancellation
  endorsement_reason: "Client requested policy cancellation",
  // Use the ORIGINAL policy end date, not today's date
  covernote_start_date: "2025-05-31T21:00:00Z",
  covernote_end_date: "2026-05-31T21:00:00Z", // Original end date
  // ...rest of payload
});
```

If you set `covernote_end_date` to today's date instead, TIRA may reject the submission or the cancellation may not be processed correctly.

### Motor Cycle vs Motor Vehicle

Fields `number_of_axles`, `axle_distance`, and `sitting_capacity` are **required** for motor vehicles (`motor_category: "1"`) but **optional** for motor cycles (`motor_category: "2"`). The package skips validation for these fields on motor cycles.

```js
// Motor vehicle — all three fields required
motor_details: {
  motor_category: "1",
  number_of_axles: 2,
  axle_distance: 0,
  sitting_capacity: 5,
  // ...other fields
}

// Motor cycle — these three can be omitted
motor_details: {
  motor_category: "2",
  // number_of_axles, axle_distance, sitting_capacity are optional
  // ...other fields
}
```

### In Transit Vehicles

When `motor_type` is `"2"` (In Transit), `registration_number` is not required because the vehicle hasn't been registered yet. All other motor detail fields are still required.

```js
motor_details: {
  motor_category: "1",
  motor_type: "2", // In Transit
  // registration_number is NOT needed
  chassis_number: "1234567890", // Still required
  // ...other fields
}
```

### Currency

If you're using a foreign currency (not TZS), provide both `currency_code` and `exchange_rate`. If omitted, they default to `"TZS"` and `1.0` respectively.

```js
// TZS (default) — no need to specify
{
  total_premium_excluding_tax: 525000,
  total_premium_including_tax: 619500,
}

// Foreign currency — specify both
{
  currency_code: "USD",
  exchange_rate: 2500.00,
  total_premium_excluding_tax: 210,
  total_premium_including_tax: 247.80,
}
```

### Commission Fields

`commission_paid` and `commission_rate` are **mandatory for intermediaries** (brokers and agents) but optional for direct insurers. If you're submitting through a broker, always include these.

```js
// Broker/agent submission — commission required
{
  commission_paid: 65625,
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

::: danger Using HTTP for callback_url
The `callback_url` must start with `https://`. Using `http://` will throw a `TiraValidationError` before the request is sent.
:::

::: danger Providing both registration and chassis number in verify()
`tira.motor.verify()` requires **exactly one** of `motor_registration_number` or `motor_chassis_number`. Providing both throws a `TiraValidationError`.
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
