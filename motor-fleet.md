# Motor Fleet

The Motor Fleet resource handles motor vehicle fleet cover note submissions to TIRA. Use `tira.motorFleet` to submit cover notes for multiple vehicles in a single request, and handle TIRA's asynchronous callback responses. Unlike the [Motor](/motor) resource which handles one vehicle at a time, Motor Fleet lets you insure an entire fleet — each vehicle gets its own cover note reference number and sticker number.

For the general submit-callback-acknowledge flow, see [Callbacks & Acknowledgements](/callbacks-acknowledgements).

## Available Methods

| Method                                  | Description                                                    | When to Use                                                                         | Returns                                      |
| --------------------------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------- |
| `tira.motorFleet.submit(payload)`       | Submit a motor fleet cover note (new, renewal, or endorsement) | When you want to create, renew, or modify cover notes for multiple vehicles at once | `CoverNoteResponse`                          |
| `tira.motorFleet.handleCallback(input)` | Parse and extract data from TIRA's fleet callback              | When TIRA sends the result of your fleet submission to your callback URL            | `CallbackResult<MotorFleetCallbackResponse>` |

## .submit() Payload

```ts
await tira.motorFleet.submit(payload): Promise<CoverNoteResponse>
```

Submits a motor fleet cover note to TIRA. This is an asynchronous operation — you receive an acknowledgement immediately, and the actual result (per-vehicle) comes later via your callback URL.

**Endpoint:** `POST /ecovernote/api/covernote/non-life/motor-fleet/v2/request`

### Cover Note Types

| Value | Type        | When to Use                       | Extra Required Fields                                                                                        |
| ----- | ----------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `"1"` | New         | First-time fleet cover note       | `covernote_number` on each fleet detail entry                                                                |
| `"2"` | Renewal     | Renewing existing fleet coverage  | `covernote_number` + `previous_covernote_reference_number` on each fleet detail entry                        |
| `"3"` | Endorsement | Modifying existing fleet coverage | `previous_covernote_reference_number` + `endorsement_type` + `endorsement_reason` on each fleet detail entry |

### Endorsement Types

When `covernote_type` is `"3"` (Endorsement), each fleet detail entry must specify its endorsement type:

| Value | Type                  | Description                                        |
| ----- | --------------------- | -------------------------------------------------- |
| `"1"` | Increasing Premium    | Policy changes that increase the premium           |
| `"2"` | Decreasing Premium    | Policy changes that decrease the premium           |
| `"3"` | Cover Details Changed | Changes to coverage details without premium impact |
| `"4"` | Cancellation          | Cancelling the cover note entirely                 |

### Fleet Header Fields

These are the top-level fields in the fleet submission payload. The fleet header wraps all vehicles in the fleet.

| Field                         | Type                 | Required | Default  | XML Tag                    | Description                                                                     |
| ----------------------------- | -------------------- | -------- | -------- | -------------------------- | ------------------------------------------------------------------------------- |
| `request_id`                  | `string`             | Yes      | —        | `RequestId`                | Unique request identifier                                                       |
| `callback_url`                | `string`             | Yes      | —        | `CallBackUrl`              | Where TIRA sends results                                                        |
| `insurer_company_code`        | `string`             | Yes      | —        | `InsurerCompanyCode`       | Insurer's company code                                                          |
| `covernote_type`              | `"1"\|"2"\|"3"`      | Yes      | —        | `CoverNoteType`            | 1=New, 2=Renewal, 3=Endorsement                                                 |
| `fleet_id`                    | `string`             | Yes      | —        | `FleetId`                  | Unique fleet identifier                                                         |
| `fleet_type`                  | `"1"\|"2"`           | Yes      | —        | `FleetType`                | 1=New fleet, 2=Additional vehicles to existing fleet                            |
| `fleet_size`                  | `number`             | Yes      | —        | `FleetSize`                | Total number of vehicles in the fleet. Must be positive.                        |
| `comprehensive_insured`       | `number`             | No       | `""`     | `ComprehensiveInsured`     | Number of vehicles with comprehensive insurance                                 |
| `sales_point_code`            | `string`             | Yes      | —        | `SalePointCode`            | Sales point code given by TIRA                                                  |
| `covernote_start_date`        | `string\|Date`       | Yes      | —        | `CoverNoteStartDate`       | Start date. See [Date Handling](#date-handling).                                |
| `covernote_end_date`          | `string\|Date`       | Yes      | —        | `CoverNoteEndDate`         | End date. Must be after start date.                                             |
| `payment_mode`                | `"1"\|"2"\|"3"`      | Yes      | —        | `PaymentMode`              | 1=Cash, 2=Cheque, 3=EFT                                                         |
| `currency_code`               | `string`             | No       | `"TZS"`  | `CurrencyCode`             | ISO currency code                                                               |
| `exchange_rate`               | `number`             | No       | `1.0`    | `ExchangeRate`             | Exchange rate to TZS. Formatted to 2 decimal places.                            |
| `total_premium_excluding_tax` | `number`             | Yes      | —        | `TotalPremiumExcludingTax` | Total premium before tax (sum of all vehicles). Max 2 decimal places.           |
| `total_premium_including_tax` | `number`             | Yes      | —        | `TotalPremiumIncludingTax` | Total premium after tax (sum of all vehicles). Must be >= excluding tax.        |
| `commission_paid`             | `number`             | No       | `"0.00"` | `CommisionPaid`            | Commission amount. Mandatory for intermediaries.                                |
| `commission_rate`             | `number`             | No       | `"0.00"` | `CommisionRate`            | Commission rate. Max 5 decimal places.                                          |
| `officer_name`                | `string`             | Yes      | —        | `OfficerName`              | Name of the processing officer                                                  |
| `officer_title`               | `string`             | Yes      | —        | `OfficerTitle`             | Title of the processing officer                                                 |
| `product_code`                | `string`             | Yes      | —        | `ProductCode`              | Product code (e.g., `SP014001000000` for Motor Private Vehicle)                 |
| `policy_holders`              | `PolicyHolder[]`     | Yes      | —        | `PolicyHolders`            | At least one policy holder. Fleet-level. See [Policy Holders](#policy-holders). |
| `fleet_details`               | `FleetDetailEntry[]` | Yes      | —        | `FleetDtl`                 | At least one vehicle entry. See [Fleet Detail Fields](#fleet-detail-fields).    |

### Fleet Detail Fields

Each entry in the `fleet_details` array represents one vehicle in the fleet. Each vehicle gets its own cover note number, risks, subject matters, addons, and motor details.

| Field                                 | Type                 | Required    | Default | XML Tag                        | Description                                                                           |
| ------------------------------------- | -------------------- | ----------- | ------- | ------------------------------ | ------------------------------------------------------------------------------------- |
| `fleet_entry`                         | `number`             | Yes         | —       | `FleetEntry`                   | Sequence number (1, 2, 3, etc.)                                                       |
| `covernote_number`                    | `string`             | Yes         | —       | `CoverNoteNumber`              | Cover note number for this vehicle                                                    |
| `previous_covernote_reference_number` | `string`             | Conditional | `""`    | `PrevCoverNoteReferenceNumber` | Required for Renewal and Endorsement                                                  |
| `covernote_desc`                      | `string`             | Yes         | —       | `CoverNoteDesc`                | Description (e.g., "Private Vehicles")                                                |
| `operative_clause`                    | `string`             | Yes         | —       | `OperativeClause`              | Operative clause (e.g., "Comprehensive")                                              |
| `endorsement_type`                    | `"1"\|"2"\|"3"\|"4"` | Conditional | `""`    | `EndorsementType`              | Required when `covernote_type` is `"3"`. See [Endorsement Types](#endorsement-types). |
| `endorsement_reason`                  | `string`             | Conditional | `""`    | `EndorsementReason`            | Required when `covernote_type` is `"3"`.                                              |
| `endorsement_premium_earned`          | `number`             | No          | `""`    | `EndorsementPremiumEarned`     | Premium earned from endorsement                                                       |
| `risks_covered`                       | `RisksCovered[]`     | Yes         | —       | `RisksCovered`                 | At least one risk per vehicle. See [Risks Covered](#risks-covered).                   |
| `subject_matters_covered`             | `SubjectMatter[]`    | Yes         | —       | `SubjectMattersCovered`        | At least one subject matter per vehicle. See [Subject Matters](#subject-matters).     |
| `covernote_addons`                    | `CoverNoteAddon[]`   | No          | `[]`    | `CoverNoteAddons`              | Optional addons per vehicle. See [Cover Note Addons](#cover-note-addons).             |
| `motor_details`                       | `MotorDetails`       | Yes         | —       | `MotorDtl`                     | Motor vehicle details for this vehicle. See [Motor Details](#motor-details).          |

### Motor Details

The `motor_details` object on each fleet detail entry describes the vehicle being insured. This is the same structure used by the [Motor](/motor) resource.

| Field                 | Type       | Required    | Default | XML Tag              | Description                                          |
| --------------------- | ---------- | ----------- | ------- | -------------------- | ---------------------------------------------------- |
| `motor_category`      | `"1"\|"2"` | Yes         | —       | `MotorCategory`      | 1=Motor Vehicle, 2=Motor Cycle                       |
| `motor_type`          | `"1"\|"2"` | Yes         | —       | `MotorType`          | 1=Registered, 2=In Transit                           |
| `registration_number` | `string`   | Conditional | `""`    | `RegistrationNumber` | Required if `motor_type` is `"1"` (Registered)       |
| `chassis_number`      | `string`   | Yes         | —       | `ChassisNumber`      | Vehicle chassis number                               |
| `make`                | `string`   | Yes         | —       | `Make`               | e.g., "Toyota"                                       |
| `model`               | `string`   | Yes         | —       | `Model`              | e.g., "RAV4"                                         |
| `model_number`        | `string`   | Yes         | —       | `ModelNumber`        | e.g., "2010"                                         |
| `body_type`           | `string`   | Yes         | —       | `BodyType`           | e.g., "STATION WAGON"                                |
| `color`               | `string`   | Yes         | —       | `Color`              | e.g., "WHITE"                                        |
| `engine_number`       | `string`   | Yes         | —       | `EngineNumber`       | Engine serial number                                 |
| `engine_capacity`     | `string`   | Yes         | —       | `EngineCapacity`     | Engine capacity in cc (e.g., "2360")                 |
| `fuel_used`           | `string`   | Yes         | —       | `FuelUsed`           | e.g., "PETROL", "DIESEL"                             |
| `number_of_axles`     | `number`   | Conditional | `""`    | `NumberOfAxles`      | Required for Motor Vehicle, optional for Motor Cycle |
| `axle_distance`       | `number`   | Conditional | `0`     | `AxleDistance`       | Required for Motor Vehicle, optional for Motor Cycle |
| `sitting_capacity`    | `number`   | Conditional | `""`    | `SittingCapacity`    | Required for Motor Vehicle, optional for Motor Cycle |
| `year_of_manufacture` | `number`   | Yes         | —       | `YearOfManufacture`  | Must be between 1900 and next year                   |
| `tare_weight`         | `number`   | Yes         | —       | `TareWeight`         | Empty weight in kg. Must be positive.                |
| `gross_weight`        | `number`   | Yes         | —       | `GrossWeight`        | Loaded weight in kg. Must be positive.               |
| `motor_usage`         | `"1"\|"2"` | Yes         | —       | `MotorUsage`         | 1=Private, 2=Commercial                              |
| `owner_name`          | `string`   | No          | `""`    | `OwnerName`          | Vehicle owner's name                                 |
| `owner_category`      | `"1"\|"2"` | Yes         | —       | `OwnerCategory`      | 1=Sole Proprietor, 2=Corporate                       |
| `owner_address`       | `string`   | Yes         | —       | `OwnerAddress`       | Vehicle owner's address                              |

### Risks Covered

At least one risk is required per vehicle. Each item in the `risks_covered` array maps to a `<RiskCovered>` XML element.

| Field                              | Type                | Required | XML Tag                         | Description                                          |
| ---------------------------------- | ------------------- | -------- | ------------------------------- | ---------------------------------------------------- |
| `risk_code`                        | `string`            | Yes      | `RiskCode`                      | Risk code from TIRA (e.g., `SP014001000001`)         |
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

At least one subject matter is required per vehicle. Each item maps to a `<SubjectMatter>` XML element.

| Field                      | Type     | Required | XML Tag                  | Description                     |
| -------------------------- | -------- | -------- | ------------------------ | ------------------------------- |
| `subject_matter_reference` | `string` | Yes      | `SubjectMatterReference` | Your reference (e.g., "HSB001") |
| `subject_matter_desc`      | `string` | Yes      | `SubjectMatterDesc`      | Description (e.g., "Vehicle")   |

### Cover Note Addons

Optional per vehicle. Each item maps to a `<CoverNoteAddon>` XML element.

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

At least one policy holder is required. Policy holders are at the **fleet level** (not per-vehicle). Each item maps to a `<PolicyHolder>` XML element.

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
- `fleet_id` is required
- `fleet_type` must be `"1"` (New Fleet) or `"2"` (Additional vehicles)
- `fleet_size` must be a positive number
- `covernote_end_date` must be after `covernote_start_date`
- `total_premium_including_tax` must be greater than or equal to `total_premium_excluding_tax`
- At least one `fleet_details` entry must be provided
- Each fleet detail entry requires `fleet_entry`, `covernote_number`, `covernote_desc`, and `operative_clause`
- `previous_covernote_reference_number` is required on each fleet detail entry when `covernote_type` is `"2"` (Renewal) or `"3"` (Endorsement)
- `endorsement_type` and `endorsement_reason` are required on each fleet detail entry when `covernote_type` is `"3"` (Endorsement)
- Each fleet detail entry must have at least one item in `risks_covered` and `subject_matters_covered`
- Each fleet detail entry's `motor_details` is validated (see Motor Details validation below)
- `registration_number` is required when `motor_type` is `"1"` (Registered)
- `number_of_axles`, `axle_distance`, and `sitting_capacity` are required when `motor_category` is `"1"` (Motor Vehicle), optional for Motor Cycle
- `year_of_manufacture` must be between 1900 and next year
- `tare_weight` and `gross_weight` must be positive numbers
- At least one policy holder is required (fleet-level)
- `phone_number` must be 12 digits starting with `2557`
- `policyholder_birthdate` must be a valid ISO date (`YYYY-MM-DD`)
- `email_address` is validated if provided

### Conditional Fields Quick Reference

**By cover note type (applies to each fleet detail entry):**

| Scenario            | `covernote_number` | `previous_covernote_reference_number` | `endorsement_type` | `endorsement_reason` |
| ------------------- | ------------------ | ------------------------------------- | ------------------ | -------------------- |
| New (`"1"`)         | Required           | —                                     | —                  | —                    |
| Renewal (`"2"`)     | Required           | Required                              | —                  | —                    |
| Endorsement (`"3"`) | Required           | Required                              | Required           | Required             |

**By motor category and type (per-vehicle `motor_details`):**

| Scenario                   | `registration_number` | `number_of_axles` | `axle_distance` | `sitting_capacity` |
| -------------------------- | --------------------- | ----------------- | --------------- | ------------------ |
| Motor Vehicle + Registered | Required              | Required          | Required        | Required           |
| Motor Vehicle + In Transit | —                     | Required          | Required        | Required           |
| Motor Cycle + Registered   | Required              | Optional          | Optional        | Optional           |
| Motor Cycle + In Transit   | —                     | Optional          | Optional        | Optional           |

### Example — New Fleet

```js
const result = await tira.motorFleet.submit({
  request_id: "FLEET-2025-001",
  callback_url: "https://your-server.com/tira/fleet-callback",
  insurer_company_code: "ICC103",
  covernote_type: "1", // New
  fleet_id: "FLT-001",
  fleet_type: "1", // New fleet
  fleet_size: 2,
  sales_point_code: "SP719",
  covernote_start_date: "2025-05-31T21:00:00Z", // June 1st EAT
  covernote_end_date: "2026-05-31T21:00:00Z", // June 1st next year EAT
  payment_mode: "3", // EFT
  total_premium_excluding_tax: 1050000,
  total_premium_including_tax: 1239000,
  commission_paid: 131250,
  commission_rate: 0.125,
  officer_name: "Johnson Abraham",
  officer_title: "Manager",
  product_code: "SP014001000000",
  policy_holders: [
    {
      policyholder_name: "FLEET OWNER",
      policyholder_birthdate: "1984-06-19",
      policyholder_type: "2", // Corporate
      policyholder_id_type: "6", // TIN
      policyholder_id_number: "19840619566676776857",
      gender: "M",
      region: "Dar es Salaam",
      district: "Ilala",
      street: "Kariakoo",
      phone_number: "255712345678",
      postal_address: "P.O. Box 12345, Dar es Salaam",
    },
  ],
  fleet_details: [
    {
      fleet_entry: 1,
      covernote_number: "SPCPLBA000001",
      covernote_desc: "Private Vehicles",
      operative_clause: "Comprehensive",
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
        { subject_matter_reference: "HSB001", subject_matter_desc: "Vehicle" },
      ],
      motor_details: {
        motor_category: "1",
        motor_type: "1",
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
        motor_usage: "1",
        owner_name: "FLEET OWNER",
        owner_category: "2",
        owner_address: "Kariakoo, Dar es Salaam",
      },
    },
    {
      fleet_entry: 2,
      covernote_number: "SPCPLBA000002",
      covernote_desc: "Private Vehicles",
      operative_clause: "Comprehensive",
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
        { subject_matter_reference: "HSB001", subject_matter_desc: "Vehicle" },
      ],
      motor_details: {
        motor_category: "1",
        motor_type: "1",
        registration_number: "T456DEF",
        chassis_number: "9876543210",
        make: "Nissan",
        model: "X-Trail",
        model_number: "2015",
        body_type: "STATION WAGON",
        color: "SILVER",
        engine_number: "QR25DE123456",
        engine_capacity: "2488",
        fuel_used: "PETROL",
        number_of_axles: 2,
        axle_distance: 0,
        sitting_capacity: 5,
        year_of_manufacture: 2015,
        tare_weight: 1550,
        gross_weight: 1650,
        motor_usage: "1",
        owner_name: "FLEET OWNER",
        owner_category: "2",
        owner_address: "Kariakoo, Dar es Salaam",
      },
    },
  ],
});

console.log(result.acknowledgement_id); // "ACK123456"
console.log(result.tira_status_code); // "TIRA001"
```

### Example — Renewal

```js
const result = await tira.motorFleet.submit({
  // ...same fleet header fields, plus:
  covernote_type: "2", // Renewal
  fleet_type: "1",
  // ...
  fleet_details: [
    {
      fleet_entry: 1,
      covernote_number: "SPCPLBA000001",
      previous_covernote_reference_number: "CN-FLT-2024-001", // From last year
      covernote_desc: "Private Vehicles",
      operative_clause: "Comprehensive",
      // ...risks, subject_matters, motor_details
    },
    // ...more vehicles
  ],
});
```

### Example — Endorsement

```js
const result = await tira.motorFleet.submit({
  // ...same fleet header fields, but:
  covernote_type: "3", // Endorsement
  // ...
  fleet_details: [
    {
      fleet_entry: 1,
      covernote_number: "SPCPLBA000001",
      previous_covernote_reference_number: "CN-FLT-2025-001",
      endorsement_type: "1", // Increasing Premium
      endorsement_reason: "Additional coverage for windscreen",
      endorsement_premium_earned: 25000,
      covernote_desc: "Private Vehicles",
      operative_clause: "Comprehensive",
      // ...risks, subject_matters, motor_details
    },
    // ...more vehicles
  ],
});
```

## .submit() Response

When you call `tira.motorFleet.submit()`, you get an immediate `CoverNoteResponse` from TIRA:

| Field                      | Type                      | Description                                |
| -------------------------- | ------------------------- | ------------------------------------------ |
| `acknowledgement_id`       | `string`                  | TIRA's acknowledgement ID                  |
| `request_id`               | `string`                  | Your original request ID (echoed back)     |
| `tira_status_code`         | `string`                  | Status code — `"TIRA001"` means received   |
| `tira_status_desc`         | `string`                  | Human-readable description                 |
| `requires_acknowledgement` | `boolean`                 | Always `true`                              |
| `acknowledgement_payload`  | `Record<string, unknown>` | Raw parsed acknowledgement (rarely needed) |

::: tip "TIRA001" means "received", not "approved"
At this stage, `"TIRA001"` means TIRA received your fleet request and it's being processed. It does **not** mean your cover notes have been approved. The actual results (approved or rejected, per vehicle) come later via your callback URL.

If you get a code other than `"TIRA001"`, something went wrong with the submission itself. Check the [Error Codes](/error-codes) page for the specific code.
:::

## .submit() Callback Response

After TIRA processes your fleet submission, it sends the result to your `callback_url`. Unlike the single-vehicle motor callback, the fleet callback contains **fleet-level status** and **per-vehicle results**.

### Fleet-Level Extracted Data

| Field               | Type                         | Description                                                            |
| ------------------- | ---------------------------- | ---------------------------------------------------------------------- |
| `response_id`       | `string`                     | TIRA's response ID                                                     |
| `request_id`        | `string`                     | Your original request ID                                               |
| `fleet_id`          | `string`                     | Your fleet identifier (echoed back)                                    |
| `fleet_status_code` | `string`                     | Fleet-level status. `"TIRA001"` = all vehicles processed successfully. |
| `fleet_status_desc` | `string`                     | Fleet-level status description                                         |
| `fleet_details`     | `MotorFleetCallbackDetail[]` | Per-vehicle results. See below.                                        |

### Per-Vehicle Callback Data

Each entry in `fleet_details` contains:

| Field                        | Type     | Description                                                                  |
| ---------------------------- | -------- | ---------------------------------------------------------------------------- |
| `fleet_entry`                | `number` | Matches your `fleet_entry` sequence number                                   |
| `covernote_number`           | `string` | Your cover note number for this vehicle                                      |
| `covernote_reference_number` | `string` | TIRA's cover note reference number (on success)                              |
| `sticker_number`             | `string` | Sticker number assigned by TIRA (on success)                                 |
| `response_status_code`       | `string` | Per-vehicle status. `"TIRA001"` = approved. See [Error Codes](/error-codes). |
| `response_status_desc`       | `string` | Per-vehicle status description                                               |

### On Success

When `fleet_status_code` is `"TIRA001"`, all vehicles were processed successfully. Each vehicle's `covernote_reference_number` and `sticker_number` should be saved — they're the official TIRA identifiers.

```js
// fleet_status_code === "TIRA001"
for (const vehicle of result.extracted.fleet_details) {
  console.log(`Vehicle ${vehicle.fleet_entry}:`);
  console.log(`  Cover note: ${vehicle.covernote_reference_number}`);
  console.log(`  Sticker: ${vehicle.sticker_number}`);
  console.log(`  Status: ${vehicle.response_status_code}`);
}
```

### On Error

When a vehicle's `response_status_code` is not `"TIRA001"`, that specific vehicle's cover note was rejected. Other vehicles in the fleet may still succeed. Check the [Error Codes](/error-codes) page — motor-specific errors are in the "Motor Vehicle & Fleet" and "Cover Note" sections.

```js
for (const vehicle of result.extracted.fleet_details) {
  if (vehicle.response_status_code !== "TIRA001") {
    console.error(
      `Vehicle ${vehicle.fleet_entry} rejected:`,
      vehicle.response_status_code,
      vehicle.response_status_desc,
    );
  }
}
```

### Example — Handling the Callback

```js
app.post("/tira/fleet-callback", async (req, res) => {
  const result = await tira.motorFleet.handleCallback(req.body);

  for (const vehicle of result.extracted.fleet_details) {
    if (vehicle.response_status_code === "TIRA001") {
      await db.fleetVehicles.update({
        where: {
          fleet_id: result.extracted.fleet_id,
          fleet_entry: vehicle.fleet_entry,
        },
        data: {
          status: "approved",
          reference_number: vehicle.covernote_reference_number,
          sticker_number: vehicle.sticker_number,
        },
      });
    } else {
      console.error(
        `Vehicle ${vehicle.fleet_entry} rejected: ${vehicle.response_status_code}`,
        vehicle.response_status_desc,
      );

      await db.fleetVehicles.update({
        where: {
          fleet_id: result.extracted.fleet_id,
          fleet_entry: vehicle.fleet_entry,
        },
        data: {
          status: "rejected",
          rejection_code: vehicle.response_status_code,
          rejection_reason: vehicle.response_status_desc,
        },
      });
    }
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

1. Derives the correct acknowledgement tag name (`MotorCoverNoteRefRes` → `MotorCoverNoteRefResAck`)
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

app.post("/tira/fleet-callback", async (req, res) => {
  const result = await tira.motorFleet.handleCallback(req.body);

  // Process the callback data...
  await saveFleetResults(result.extracted);

  // Build the acknowledgement XML
  const ackXml = tira.acknowledge(result.body, uuid());

  // Send it back as the HTTP response
  res.set("Content-Type", "application/xml").send(ackXml);
});
```

::: warning Always acknowledge
Even if processing the callback data fails, you should still acknowledge. Only wrap your business logic in try-catch — the callback parsing and acknowledgement should always run:

```js
app.post("/tira/fleet-callback", async (req, res) => {
  const result = await tira.motorFleet.handleCallback(req.body);

  try {
    await saveFleetResults(result.extracted);
  } catch (err) {
    console.error("Error saving fleet results:", err);
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
await tira.motorFleet.handleCallback(input: string | Record<string, any>): Promise<CallbackResult<MotorFleetCallbackResponse>>
```

This function parses the callback XML that TIRA sends to your callback URL and extracts the fleet-level and per-vehicle data. You can also use the universal `tira.handleCallback()` if you have a single endpoint for all callback types.

### What It Does

1. **Verifies the signature** — checks that the callback's `<MsgSignature>` matches TIRA's public key (if signature verification is configured)
2. **Parses the XML** — converts the raw XML into a JavaScript object
3. **Extracts the data** — pulls out fleet-level fields (`fleet_id`, `fleet_status_code`) and per-vehicle results (`covernote_reference_number`, `sticker_number`, etc.) into a clean `extracted` object

### Input

You can pass either:

- A **raw XML string** — the `req.body` from your Express handler (requires `express.text({ type: "application/xml" })` middleware)
- A **pre-parsed object** — if you've already parsed the XML yourself

### What It Returns

| Field                | Type                         | Description                                                                   |
| -------------------- | ---------------------------- | ----------------------------------------------------------------------------- |
| `type`               | `"motor_fleet"`              | Always `"motor_fleet"` for this handler                                       |
| `extracted`          | `MotorFleetCallbackResponse` | The extracted fleet data (see [Callback Response](#submit-callback-response)) |
| `body`               | `Record<string, any>`        | Full parsed XML as JS object — pass this to `tira.acknowledge()`              |
| `signature_verified` | `boolean`                    | Whether TIRA's digital signature was verified                                 |
| `raw_xml`            | `string`                     | The original XML string                                                       |

### Resource-Specific vs Universal Handler

| Approach          | Method                                  | When to Use                                                                                |
| ----------------- | --------------------------------------- | ------------------------------------------------------------------------------------------ |
| Resource-specific | `tira.motorFleet.handleCallback(input)` | When you have separate endpoints per resource type                                         |
| Universal         | `tira.handleCallback(input)`            | When you have one endpoint for all TIRA callbacks (requires `enabled_callbacks` in config) |

Both return the same data. The universal handler auto-detects the callback type — for fleet callbacks, it identifies the `FleetResHdr` element to distinguish fleet from single-vehicle motor callbacks. See [Callbacks & Acknowledgements](/callbacks-acknowledgements) for details on the universal handler.

## Full Example

A complete Express.js application that submits a motor fleet cover note, handles the callback, and acknowledges it.

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

// Submit a motor fleet cover note
app.post("/submit-fleet", async (req, res) => {
  const result = await tira.motorFleet.submit({
    request_id: uuid(),
    callback_url: "https://your-server.com/tira/fleet-callback",
    insurer_company_code: "ICC103",
    covernote_type: "1",
    fleet_id: req.body.fleet_id,
    fleet_type: "1",
    fleet_size: req.body.vehicles.length,
    sales_point_code: "SP719",
    covernote_start_date: req.body.start_date,
    covernote_end_date: req.body.end_date,
    payment_mode: "3",
    total_premium_excluding_tax: req.body.premium_excl_tax,
    total_premium_including_tax: req.body.premium_incl_tax,
    officer_name: "Johnson Abraham",
    officer_title: "Manager",
    product_code: "SP014001000000",
    policy_holders: req.body.policy_holders,
    fleet_details: req.body.vehicles.map((v, i) => ({
      fleet_entry: i + 1,
      covernote_number: v.covernote_number,
      covernote_desc: "Private Vehicles",
      operative_clause: "Comprehensive",
      risks_covered: v.risks,
      subject_matters_covered: v.subject_matters,
      motor_details: v.motor_details,
    })),
  });

  res.json({
    message: "Fleet submitted to TIRA",
    acknowledgement_id: result.acknowledgement_id,
    status: result.tira_status_code,
  });
});

// Handle TIRA's fleet callback and acknowledge
app.post("/tira/fleet-callback", async (req, res) => {
  const result = await tira.motorFleet.handleCallback(req.body);

  try {
    for (const vehicle of result.extracted.fleet_details) {
      await db.fleetVehicles.update({
        where: {
          fleet_id: result.extracted.fleet_id,
          fleet_entry: vehicle.fleet_entry,
        },
        data: {
          status:
            vehicle.response_status_code === "TIRA001"
              ? "approved"
              : "rejected",
          reference_number: vehicle.covernote_reference_number,
          sticker_number: vehicle.sticker_number,
          rejection_code:
            vehicle.response_status_code !== "TIRA001"
              ? vehicle.response_status_code
              : null,
        },
      });
    }
  } catch (err) {
    console.error("Error saving fleet results:", err);
  }

  // Acknowledge — always, regardless of whether processing succeeded
  const ackXml = tira.acknowledge(result.body, uuid());
  res.set("Content-Type", "application/xml").send(ackXml);
});

app.listen(3000);
```

## Special Cases

### Endorsement Cancellation

When `endorsement_type` is `"4"` (Cancellation) on a fleet detail entry, you must set the fleet-level `covernote_end_date` to the end date of the **original policy**, not the current date. This tells TIRA when the coverage actually ends.

```js
const result = await tira.motorFleet.submit({
  covernote_type: "3",
  // Use the ORIGINAL policy end date, not today's date
  covernote_start_date: "2025-05-31T21:00:00Z",
  covernote_end_date: "2026-05-31T21:00:00Z", // Original end date
  // ...
  fleet_details: [
    {
      fleet_entry: 1,
      covernote_number: "SPCPLBA000001",
      previous_covernote_reference_number: "CN-FLT-2025-001",
      endorsement_type: "4", // Cancellation
      endorsement_reason: "Client requested fleet cancellation",
      covernote_desc: "Private Vehicles",
      operative_clause: "Comprehensive",
      // ...risks, subject_matters, motor_details
    },
  ],
});
```

If you set `covernote_end_date` to today's date instead, TIRA may reject the submission or the cancellation may not be processed correctly.

### Per-Vehicle vs Fleet-Level Fields

Motor Fleet splits fields between the fleet level and per-vehicle level differently from regular Motor:

**Fleet level** (shared across all vehicles):

- `request_id`, `callback_url`, `insurer_company_code`, `covernote_type`
- `fleet_id`, `fleet_type`, `fleet_size`, `comprehensive_insured`
- `sales_point_code`, `covernote_start_date`, `covernote_end_date`
- `payment_mode`, `currency_code`, `exchange_rate`
- `total_premium_excluding_tax`, `total_premium_including_tax`
- `commission_paid`, `commission_rate`
- `officer_name`, `officer_title`, `product_code`
- `policy_holders`

**Per-vehicle** (in each `fleet_details` entry):

- `fleet_entry`, `covernote_number`, `previous_covernote_reference_number`
- `covernote_desc`, `operative_clause`
- `endorsement_type`, `endorsement_reason`, `endorsement_premium_earned`
- `risks_covered`, `subject_matters_covered`, `covernote_addons`
- `motor_details`

This means each vehicle can have different risks, coverage descriptions, and motor details, but they all share the same policy holders, dates, and payment terms.

### Motor Cycle vs Motor Vehicle

Fields `number_of_axles`, `axle_distance`, and `sitting_capacity` are **required** for motor vehicles (`motor_category: "1"`) but **optional** for motor cycles (`motor_category: "2"`). This applies to each vehicle's `motor_details` individually — you can mix motor vehicles and motor cycles in the same fleet.

```js
fleet_details: [
  {
    fleet_entry: 1,
    motor_details: {
      motor_category: "1", // Motor Vehicle — axles, distance, capacity required
      number_of_axles: 2,
      axle_distance: 0,
      sitting_capacity: 5,
      // ...other fields
    },
    // ...
  },
  {
    fleet_entry: 2,
    motor_details: {
      motor_category: "2", // Motor Cycle — these three can be omitted
      // number_of_axles, axle_distance, sitting_capacity are optional
      // ...other fields
    },
    // ...
  },
];
```

### In Transit Vehicles

When `motor_type` is `"2"` (In Transit) on a fleet detail entry's motor details, `registration_number` is not required because the vehicle hasn't been registered yet. All other motor detail fields are still required.

```js
fleet_details: [
  {
    fleet_entry: 1,
    motor_details: {
      motor_category: "1",
      motor_type: "2", // In Transit
      // registration_number is NOT needed
      chassis_number: "1234567890", // Still required
      // ...other fields
    },
    // ...
  },
];
```

### Currency

If you're using a foreign currency (not TZS), provide both `currency_code` and `exchange_rate` at the fleet level. If omitted, they default to `"TZS"` and `1.0` respectively.

```js
// TZS (default) — no need to specify
{
  total_premium_excluding_tax: 1050000,
  total_premium_including_tax: 1239000,
}

// Foreign currency — specify both
{
  currency_code: "USD",
  exchange_rate: 2500.00,
  total_premium_excluding_tax: 420,
  total_premium_including_tax: 495.60,
}
```

### Commission Fields

`commission_paid` and `commission_rate` are **mandatory for intermediaries** (brokers and agents) but optional for direct insurers. If you're submitting through a broker, always include these at the fleet level. They default to `"0.00"` if not provided.

```js
// Broker/agent submission — commission required
{
  commission_paid: 131250,
  commission_rate: 0.125, // 12.5%
}

// Direct insurer — commission can be omitted (defaults to 0.00)
{
  // No commission_paid or commission_rate needed
}
```

### XML Tag Spelling

The XML tags `CommisionPaid` and `CommisionRate` use a single "s" ("Commision" instead of "Commission"). This matches TIRA's specification. The package handles this mapping automatically — you just use `commission_paid` and `commission_rate` in your payload.

### Single Vehicle Fleet Callback

When a fleet has only one vehicle, TIRA's XML response returns `FleetResDtl` as a single object instead of an array. The package normalizes this automatically — `result.extracted.fleet_details` is always an array, even for single-vehicle fleets. You don't need to handle this edge case yourself.

## Common Mistakes

::: danger Forgetting to acknowledge the callback
TIRA retries callbacks indefinitely until you acknowledge them. Always call `tira.acknowledge(result.body, uuid())` and return the XML, even if processing the callback data failed.
:::

::: danger Wrong end date for cancellation endorsements
When cancelling fleet cover notes (`endorsement_type: "4"`), set `covernote_end_date` to the end date of the original policy — **not** the current date.
:::

::: danger Missing XML middleware
Without `express.text({ type: "application/xml" })`, your callback `req.body` will be empty and parsing will fail. Add this middleware before your callback route.
:::

::: danger Confusing submission acknowledgement with approval
`"TIRA001"` in the submission response means "received", not "approved". The actual approval or rejection comes later via the callback. Don't tell your users their fleet cover notes are approved at submission time.
:::

::: danger Missing endorsement fields on fleet details
When `covernote_type` is `"3"`, each fleet detail entry must have `endorsement_type` and `endorsement_reason`. Forgetting these throws a `TiraValidationError`.
:::

::: danger Empty fleet_details array
At least one fleet detail entry is required. Submitting with an empty `fleet_details` array throws a `TiraValidationError`.
:::

::: danger Phone number format
Phone numbers must be 12 digits starting with `2557` (e.g., `"255712345678"`). Other formats will fail validation.
:::

::: danger Checking only fleet-level status
The fleet-level `fleet_status_code` may be `"TIRA001"` even when individual vehicles have different statuses. Always loop through `fleet_details` and check each vehicle's `response_status_code` individually.
:::

## Related Pages

- [Motor](/motor) — Single-vehicle motor cover notes
- [Callbacks & Acknowledgements](/callbacks-acknowledgements) — The full callback lifecycle
- [Signing & Verification](/signing-verification) — How digital signatures work
- [Error Codes](/error-codes) — All TIRA status codes and fixes
- [Initialization](/initialization) — Setting up the Tira client
