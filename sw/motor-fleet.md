# Magari ya Msafara

Rasilimali ya Magari ya Msafara inashughulikia utumaji wa covernote za msafara wa magari kwa TIRA. Tumia `tira.motorFleet` kutuma covernote kwa magari mengi katika ombi moja, na kushughulikia majibu ya callback ya TIRA. Tofauti na rasilimali ya [Magari](/sw/motor) inayoshughulikia gari moja kwa wakati mmoja, Magari ya Msafara inakuruhusu kubimisha msafara mzima — kila gari linapata nambari yake ya rejea ya covernote na nambari ya stika.

Kwa mtiririko wa jumla wa kutuma-callback-kuthibitisha, tazama [Callback na Uthibitisho](/sw/callbacks-acknowledgements).

## Mbinu Zinazopatikana

| Mbinu                                   | Maelezo                                                            | Wakati wa Kutumia                                                                          | Inarudisha                                   |
| --------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | -------------------------------------------- |
| `tira.motorFleet.submit(payload)`       | Tuma covernote ya msafara wa magari (mpya, upyaji, au marekebisho) | Unapotaka kuunda, kufanya upya, au kubadilisha covernote kwa magari mengi kwa wakati mmoja | `CoverNoteResponse`                          |
| `tira.motorFleet.handleCallback(input)` | Chambua na kutoa data kutoka callback ya msafara ya TIRA           | TIRA inapotuma matokeo ya utumaji wako wa msafara kwa callback URL yako                    | `CallbackResult<MotorFleetCallbackResponse>` |

## Mzigo wa .submit()

```ts
await tira.motorFleet.submit(payload): Promise<CoverNoteResponse>
```

Inatuma covernote ya msafara wa magari kwa TIRA. Hii ni operesheni ya asynchronous — unapata uthibitisho mara moja, na matokeo halisi (kwa kila gari) yanakuja baadaye kupitia callback URL yako.

**Endpoint:** `POST /ecovernote/api/covernote/non-life/motor-fleet/v2/request`

### Aina za Covernote

| Thamani | Aina        | Wakati wa Kutumia                      | Sehemu za Ziada Zinazohitajika                                                                                   |
| ------- | ----------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `"1"`   | Mpya        | Covernote ya msafara ya mara ya kwanza | `covernote_number` kwa kila kipengele cha msafara                                                                |
| `"2"`   | Upyaji      | Kufanya upya bima ya msafara iliyopo   | `covernote_number` + `previous_covernote_reference_number` kwa kila kipengele cha msafara                        |
| `"3"`   | Marekebisho | Kubadilisha bima ya msafara iliyopo    | `previous_covernote_reference_number` + `endorsement_type` + `endorsement_reason` kwa kila kipengele cha msafara |

### Aina za Marekebisho

Wakati `covernote_type` ni `"3"` (Marekebisho), kila kipengele cha msafara lazima kibainishe aina yake ya marekebisho:

| Thamani | Aina                           | Maelezo                                            |
| ------- | ------------------------------ | -------------------------------------------------- |
| `"1"`   | Kuongeza Primi                 | Mabadiliko ya sera yanayoongeza primi              |
| `"2"`   | Kupunguza Primi                | Mabadiliko ya sera yanayopunguza primi             |
| `"3"`   | Maelezo ya Bima Yamebadilishwa | Mabadiliko ya maelezo ya bima bila athari ya primi |
| `"4"`   | Kufuta                         | Kufuta covernote kabisa                            |

### Sehemu za Kichwa cha Msafara

Hizi ni sehemu za kiwango cha juu katika mzigo wa utumaji wa msafara. Kichwa cha msafara kinafunga magari yote katika msafara.

| Sehemu                        | Aina                 | Inahitajika | Chaguomsingi | XML Tag                    | Maelezo                                                                                                  |
| ----------------------------- | -------------------- | ----------- | ------------ | -------------------------- | -------------------------------------------------------------------------------------------------------- |
| `request_id`                  | `string`             | Ndiyo       | —            | `RequestId`                | Kitambulisho cha kipekee cha ombi                                                                        |
| `callback_url`                | `string`             | Ndiyo       | —            | `CallBackUrl`              | Mahali TIRA inatuma matokeo                                                                              |
| `insurer_company_code`        | `string`             | Ndiyo       | —            | `InsurerCompanyCode`       | Msimbo wa kampuni ya bima                                                                                |
| `covernote_type`              | `"1"\|"2"\|"3"`      | Ndiyo       | —            | `CoverNoteType`            | 1=Mpya, 2=Upyaji, 3=Marekebisho                                                                          |
| `fleet_id`                    | `string`             | Ndiyo       | —            | `FleetId`                  | Kitambulisho cha kipekee cha msafara                                                                     |
| `fleet_type`                  | `"1"\|"2"`           | Ndiyo       | —            | `FleetType`                | 1=Msafara mpya, 2=Magari ya ziada kwa msafara uliopo                                                     |
| `fleet_size`                  | `number`             | Ndiyo       | —            | `FleetSize`                | Jumla ya magari katika msafara. Lazima iwe chanya.                                                       |
| `comprehensive_insured`       | `number`             | Hapana      | `""`         | `ComprehensiveInsured`     | Idadi ya magari yenye bima kamili                                                                        |
| `sales_point_code`            | `string`             | Ndiyo       | —            | `SalePointCode`            | Msimbo wa kituo cha mauzo kutoka TIRA                                                                    |
| `covernote_start_date`        | `string\|Date`       | Ndiyo       | —            | `CoverNoteStartDate`       | Tarehe ya kuanza. Tazama [Usimamizi wa Tarehe](#usimamizi-wa-tarehe).                                    |
| `covernote_end_date`          | `string\|Date`       | Ndiyo       | —            | `CoverNoteEndDate`         | Tarehe ya mwisho. Lazima iwe baada ya tarehe ya kuanza.                                                  |
| `payment_mode`                | `"1"\|"2"\|"3"`      | Ndiyo       | —            | `PaymentMode`              | 1=Taslimu, 2=Hundi, 3=EFT                                                                                |
| `currency_code`               | `string`             | Hapana      | `"TZS"`      | `CurrencyCode`             | Msimbo wa sarafu ya ISO                                                                                  |
| `exchange_rate`               | `number`             | Hapana      | `1.0`        | `ExchangeRate`             | Kiwango cha ubadilishaji kwa TZS. Desimali 2.                                                            |
| `total_premium_excluding_tax` | `number`             | Ndiyo       | —            | `TotalPremiumExcludingTax` | Primi kabla ya kodi (jumla ya magari yote). Desimali 2.                                                  |
| `total_premium_including_tax` | `number`             | Ndiyo       | —            | `TotalPremiumIncludingTax` | Primi baada ya kodi (jumla ya magari yote). Lazima iwe >= kabla ya kodi.                                 |
| `commission_paid`             | `number`             | Hapana      | `"0.00"`     | `CommisionPaid`            | Kiasi cha kamisheni. Lazima kwa wasuluhishi.                                                             |
| `commission_rate`             | `number`             | Hapana      | `"0.00"`     | `CommisionRate`            | Kiwango cha kamisheni. Desimali 5.                                                                       |
| `officer_name`                | `string`             | Ndiyo       | —            | `OfficerName`              | Jina la afisa anayeshughulikia                                                                           |
| `officer_title`               | `string`             | Ndiyo       | —            | `OfficerTitle`             | Cheo cha afisa                                                                                           |
| `product_code`                | `string`             | Ndiyo       | —            | `ProductCode`              | Msimbo wa bidhaa (mf. `SP014001000000` kwa Gari Binafsi)                                                 |
| `policy_holders`              | `PolicyHolder[]`     | Ndiyo       | —            | `PolicyHolders`            | Angalau mmoja. Kiwango cha msafara. Tazama [Wamiliki wa Sera](#wamiliki-wa-sera).                        |
| `fleet_details`               | `FleetDetailEntry[]` | Ndiyo       | —            | `FleetDtl`                 | Angalau kipengele kimoja cha gari. Tazama [Sehemu za Maelezo ya Msafara](#sehemu-za-maelezo-ya-msafara). |

### Sehemu za Maelezo ya Msafara

Kila kipengele katika safu ya `fleet_details` kinawakilisha gari moja katika msafara. Kila gari linapata nambari yake ya covernote, hatari, mada za bima, nyongeza, na maelezo ya gari.

| Sehemu                                | Aina                 | Inahitajika | Chaguomsingi | XML Tag                        | Maelezo                                                                                           |
| ------------------------------------- | -------------------- | ----------- | ------------ | ------------------------------ | ------------------------------------------------------------------------------------------------- |
| `fleet_entry`                         | `number`             | Ndiyo       | —            | `FleetEntry`                   | Nambari ya mfuatano (1, 2, 3, n.k.)                                                               |
| `covernote_number`                    | `string`             | Ndiyo       | —            | `CoverNoteNumber`              | Nambari ya covernote ya gari hili                                                                 |
| `previous_covernote_reference_number` | `string`             | Masharti    | `""`         | `PrevCoverNoteReferenceNumber` | Inahitajika kwa Upyaji na Marekebisho                                                             |
| `covernote_desc`                      | `string`             | Ndiyo       | —            | `CoverNoteDesc`                | Maelezo (mf. "Private Vehicles")                                                                  |
| `operative_clause`                    | `string`             | Ndiyo       | —            | `OperativeClause`              | Kifungu cha uendeshaji (mf. "Comprehensive")                                                      |
| `endorsement_type`                    | `"1"\|"2"\|"3"\|"4"` | Masharti    | `""`         | `EndorsementType`              | Inahitajika wakati `covernote_type` ni `"3"`. Tazama [Aina za Marekebisho](#aina-za-marekebisho). |
| `endorsement_reason`                  | `string`             | Masharti    | `""`         | `EndorsementReason`            | Inahitajika wakati `covernote_type` ni `"3"`.                                                     |
| `endorsement_premium_earned`          | `number`             | Hapana      | `""`         | `EndorsementPremiumEarned`     | Primi iliyopatikana kutoka marekebisho                                                            |
| `risks_covered`                       | `RisksCovered[]`     | Ndiyo       | —            | `RisksCovered`                 | Angalau moja kwa kila gari. Tazama [Hatari Zinazofunikwa](#hatari-zinazofunikwa).                 |
| `subject_matters_covered`             | `SubjectMatter[]`    | Ndiyo       | —            | `SubjectMattersCovered`        | Angalau moja kwa kila gari. Tazama [Mada za Bima](#mada-za-bima).                                 |
| `covernote_addons`                    | `CoverNoteAddon[]`   | Hapana      | `[]`         | `CoverNoteAddons`              | Si lazima kwa kila gari. Tazama [Nyongeza za Covernote](#nyongeza-za-covernote).                  |
| `motor_details`                       | `MotorDetails`       | Ndiyo       | —            | `MotorDtl`                     | Maelezo ya gari kwa gari hili. Tazama [Maelezo ya Gari](#maelezo-ya-gari).                        |

### Maelezo ya Gari

Kitu cha `motor_details` kwenye kila kipengele cha msafara kinaeleza gari linalobimishwa. Huu ni muundo sawa unaotumika na rasilimali ya [Magari](/sw/motor).

| Sehemu                | Aina       | Inahitajika | Chaguomsingi | XML Tag              | Maelezo                                                |
| --------------------- | ---------- | ----------- | ------------ | -------------------- | ------------------------------------------------------ |
| `motor_category`      | `"1"\|"2"` | Ndiyo       | —            | `MotorCategory`      | 1=Gari, 2=Pikipiki                                     |
| `motor_type`          | `"1"\|"2"` | Ndiyo       | —            | `MotorType`          | 1=Limesajiliwa, 2=Safarini                             |
| `registration_number` | `string`   | Masharti    | `""`         | `RegistrationNumber` | Inahitajika ikiwa `motor_type` ni `"1"` (Limesajiliwa) |
| `chassis_number`      | `string`   | Ndiyo       | —            | `ChassisNumber`      | Nambari ya chasi ya gari                               |
| `make`                | `string`   | Ndiyo       | —            | `Make`               | mf. "Toyota"                                           |
| `model`               | `string`   | Ndiyo       | —            | `Model`              | mf. "RAV4"                                             |
| `model_number`        | `string`   | Ndiyo       | —            | `ModelNumber`        | mf. "2010"                                             |
| `body_type`           | `string`   | Ndiyo       | —            | `BodyType`           | mf. "STATION WAGON"                                    |
| `color`               | `string`   | Ndiyo       | —            | `Color`              | mf. "WHITE"                                            |
| `engine_number`       | `string`   | Ndiyo       | —            | `EngineNumber`       | Nambari ya injini                                      |
| `engine_capacity`     | `string`   | Ndiyo       | —            | `EngineCapacity`     | Uwezo wa injini kwa cc (mf. "2360")                    |
| `fuel_used`           | `string`   | Ndiyo       | —            | `FuelUsed`           | mf. "PETROL", "DIESEL"                                 |
| `number_of_axles`     | `number`   | Masharti    | `""`         | `NumberOfAxles`      | Inahitajika kwa Gari, si lazima kwa Pikipiki           |
| `axle_distance`       | `number`   | Masharti    | `0`          | `AxleDistance`       | Inahitajika kwa Gari, si lazima kwa Pikipiki           |
| `sitting_capacity`    | `number`   | Masharti    | `""`         | `SittingCapacity`    | Inahitajika kwa Gari, si lazima kwa Pikipiki           |
| `year_of_manufacture` | `number`   | Ndiyo       | —            | `YearOfManufacture`  | Lazima iwe kati ya 1900 na mwaka ujao                  |
| `tare_weight`         | `number`   | Ndiyo       | —            | `TareWeight`         | Uzito tupu kwa kg. Lazima iwe chanya.                  |
| `gross_weight`        | `number`   | Ndiyo       | —            | `GrossWeight`        | Uzito kamili kwa kg. Lazima iwe chanya.                |
| `motor_usage`         | `"1"\|"2"` | Ndiyo       | —            | `MotorUsage`         | 1=Binafsi, 2=Biashara                                  |
| `owner_name`          | `string`   | Hapana      | `""`         | `OwnerName`          | Jina la mmiliki wa gari                                |
| `owner_category`      | `"1"\|"2"` | Ndiyo       | —            | `OwnerCategory`      | 1=Mmiliki Binafsi, 2=Kampuni                           |
| `owner_address`       | `string`   | Ndiyo       | —            | `OwnerAddress`       | Anwani ya mmiliki wa gari                              |

### Hatari Zinazofunikwa

Angalau hatari moja inahitajika kwa kila gari. Kila kipengele katika safu ya `risks_covered` kinawekwa kwenye kipengele cha XML `<RiskCovered>`.

| Sehemu                             | Aina                | Inahitajika | XML Tag                         | Maelezo                                              |
| ---------------------------------- | ------------------- | ----------- | ------------------------------- | ---------------------------------------------------- |
| `risk_code`                        | `string`            | Ndiyo       | `RiskCode`                      | Msimbo wa hatari kutoka TIRA (mf. `SP014001000001`)  |
| `sum_insured`                      | `number`            | Ndiyo       | `SumInsured`                    | Kiasi kilichobimishwa. Desimali 2.                   |
| `sum_insured_equivalent`           | `number`            | Ndiyo       | `SumInsuredEquivalent`          | Kiasi sawa kwa TZS. Desimali 2.                      |
| `premium_rate`                     | `number`            | Ndiyo       | `PremiumRate`                   | Kiwango cha primi. Desimali 5.                       |
| `premium_before_discount`          | `number`            | Ndiyo       | `PremiumBeforeDiscount`         | Primi kabla ya punguzo. Desimali 2.                  |
| `premium_after_discount`           | `number`            | Ndiyo       | `PremiumAfterDiscount`          | Primi baada ya punguzo. Desimali 2.                  |
| `premium_excluding_tax_equivalent` | `number`            | Ndiyo       | `PremiumExcludingTaxEquivalent` | Primi kabla ya kodi kwa TZS. Desimali 2.             |
| `premium_including_tax`            | `number`            | Ndiyo       | `PremiumIncludingTax`           | Primi baada ya kodi. Desimali 2.                     |
| `discounts_offered`                | `DiscountOffered[]` | Hapana      | `DiscountsOffered`              | Tazama [Punguzo Zinazotolewa](#punguzo-zinazotolewa) |
| `taxes_charged`                    | `TaxCharged[]`      | Ndiyo       | `TaxesCharged`                  | Tazama [Kodi Zinazolipishwa](#kodi-zinazolipishwa)   |

### Kodi Zinazolipishwa

Kila hatari na nyongeza lazima ijumuishe maelezo ya kodi. Ikiwa hakuna kodi, weka `is_tax_exempted` kuwa `"Y"` na utoe maelezo ya msamaha.

| Sehemu                    | Aina       | Inahitajika | XML Tag                 | Maelezo                                                                            |
| ------------------------- | ---------- | ----------- | ----------------------- | ---------------------------------------------------------------------------------- |
| `tax_code`                | `string`   | Ndiyo       | `TaxCode`               | Msimbo wa kodi kutoka TIRA (mf. `VAT-MAINLAND`)                                    |
| `is_tax_exempted`         | `"Y"\|"N"` | Ndiyo       | `IsTaxExempted`         | Ikiwa kodi imesamehewa                                                             |
| `tax_exemption_type`      | `"1"\|"2"` | Masharti    | `TaxExemptionType`      | Inahitajika ikiwa imesamehewa. 1=Mmiliki wa Sera Amesamehewa, 2=Hatari Imesamehewa |
| `tax_exemption_reference` | `string`   | Masharti    | `TaxExemptionReference` | Inahitajika ikiwa imesamehewa. Nambari ya rejea ya msamaha.                        |
| `tax_rate`                | `number`   | Ndiyo       | `TaxRate`               | Kiwango cha kodi kama desimali (mf. `0.18` kwa 18%). Desimali 5.                   |
| `tax_amount`              | `number`   | Ndiyo       | `TaxAmount`             | Kiasi cha kodi. Desimali 2.                                                        |

### Punguzo Zinazotolewa

Si lazima. Zimejumuishwa ndani ya kila hatari.

| Sehemu            | Aina     | Inahitajika | XML Tag          | Maelezo                                |
| ----------------- | -------- | ----------- | ---------------- | -------------------------------------- |
| `discount_type`   | `"1"`    | Ndiyo       | `DiscountType`   | Kwa sasa `"1"` tu (Punguzo la Msafara) |
| `discount_rate`   | `number` | Ndiyo       | `DiscountRate`   | Kiwango cha punguzo. Desimali 5.       |
| `discount_amount` | `number` | Ndiyo       | `DiscountAmount` | Kiasi cha punguzo. Desimali 2.         |

### Mada za Bima

Angalau mada moja ya bima inahitajika kwa kila gari. Kila kipengele kinawekwa kwenye kipengele cha XML `<SubjectMatter>`.

| Sehemu                     | Aina     | Inahitajika | XML Tag                  | Maelezo                   |
| -------------------------- | -------- | ----------- | ------------------------ | ------------------------- |
| `subject_matter_reference` | `string` | Ndiyo       | `SubjectMatterReference` | Rejea yako (mf. "HSB001") |
| `subject_matter_desc`      | `string` | Ndiyo       | `SubjectMatterDesc`      | Maelezo (mf. "Vehicle")   |

### Nyongeza za Covernote

Si lazima kwa kila gari. Kila kipengele kinawekwa kwenye kipengele cha XML `<CoverNoteAddon>`.

| Sehemu                             | Aina           | Inahitajika | XML Tag                         | Maelezo                                                    |
| ---------------------------------- | -------------- | ----------- | ------------------------------- | ---------------------------------------------------------- |
| `addon_reference`                  | `string`       | Ndiyo       | `AddonReference`                | Rejea yako ya nyongeza                                     |
| `addon_description`                | `string`       | Ndiyo       | `AddonDesc`                     | Maelezo ya nyongeza                                        |
| `addon_amount`                     | `number`       | Ndiyo       | `AddonAmount`                   | Kiasi cha nyongeza. Desimali 2.                            |
| `addon_premium_rate`               | `number`       | Ndiyo       | `AddonPremiumRate`              | Kiwango cha primi. Desimali 5.                             |
| `premium_excluding_tax`            | `number`       | Ndiyo       | `PremiumExcludingTax`           | Primi kabla ya kodi. Desimali 2.                           |
| `premium_excluding_tax_equivalent` | `number`       | Ndiyo       | `PremiumExcludingTaxEquivalent` | Primi kabla ya kodi kwa TZS. Desimali 2.                   |
| `premium_including_tax`            | `number`       | Ndiyo       | `PremiumIncludingTax`           | Primi baada ya kodi. Desimali 2.                           |
| `taxes_charged`                    | `TaxCharged[]` | Ndiyo       | `TaxesCharged`                  | Muundo sawa na [Kodi Zinazolipishwa](#kodi-zinazolipishwa) |

### Wamiliki wa Sera

Angalau mmiliki mmoja wa sera anahitajika. Wamiliki wa sera wako katika **kiwango cha msafara** (si kwa kila gari). Kila kipengele kinawekwa kwenye kipengele cha XML `<PolicyHolder>`.

| Sehemu                   | Aina        | Inahitajika | Chaguomsingi | XML Tag                   | Maelezo                                           |
| ------------------------ | ----------- | ----------- | ------------ | ------------------------- | ------------------------------------------------- |
| `policyholder_name`      | `string`    | Ndiyo       | —            | `PolicyHolderName`        | Jina kamili                                       |
| `policyholder_birthdate` | `string`    | Ndiyo       | —            | `PolicyHolderBirthDate`   | Tarehe ya kuzaliwa (`YYYY-MM-DD`)                 |
| `policyholder_type`      | `"1"\|"2"`  | Ndiyo       | —            | `PolicyHolderType`        | 1=Mtu Binafsi, 2=Kampuni                          |
| `policyholder_id_type`   | `"1"`–`"7"` | Ndiyo       | —            | `PolicyHolderIdType`      | Tazama jedwali la aina za kitambulisho hapa chini |
| `policyholder_id_number` | `string`    | Ndiyo       | —            | `PolicyHolderIdNumber`    | Nambari ya kitambulisho                           |
| `gender`                 | `"M"\|"F"`  | Ndiyo       | —            | `Gender`                  | M=Me, F=Ke                                        |
| `country_code`           | `string`    | Hapana      | `"TZA"`      | `CountryCode`             | Msimbo wa nchi wa ISO (mf. `TZA`, `KEN`, `UGA`)   |
| `region`                 | `string`    | Ndiyo       | —            | `Region`                  | Msimbo wa mkoa kutoka TIRA                        |
| `district`               | `string`    | Ndiyo       | —            | `District`                | Wilaya kutoka TIRA                                |
| `street`                 | `string`    | Ndiyo       | —            | `Street`                  | Jina la mtaa                                      |
| `phone_number`           | `string`    | Ndiyo       | —            | `PolicyHolderPhoneNumber` | Muundo: `2557XXXXXXXX` (tarakimu 12)              |
| `fax_number`             | `string`    | Hapana      | `""`         | `PolicyHolderFax`         | Nambari ya faksi                                  |
| `postal_address`         | `string`    | Ndiyo       | —            | `PostalAddress`           | Anwani ya posta                                   |
| `email_address`          | `string`    | Hapana      | `""`         | `EmailAddress`            | Barua pepe (inathibitishwa ikitolewa)             |

#### Aina za Kitambulisho cha Mmiliki wa Sera

| Thamani | Maelezo                                 |
| ------- | --------------------------------------- |
| `"1"`   | NIDA                                    |
| `"2"`   | Kadi ya Mpiga Kura                      |
| `"3"`   | Pasipoti                                |
| `"4"`   | Leseni ya Udereva                       |
| `"5"`   | Kitambulisho cha Zanzibar               |
| `"6"`   | TIN                                     |
| `"7"`   | Nambari ya Cheti cha Usajili wa Kampuni |

### Usimamizi wa Tarehe

Kifurushi kinabadilisha tarehe kiotomatiki kwenda Saa ya Afrika Mashariki (UTC+3) na kuziumbiza kama `YYYY-MM-DDTHH:mm:ss` (bila kiambishi cha saa za eneo). Unaweza kutoa mfuatano wa ISO au kitu cha JavaScript `Date`.

::: tip Mfano
Ukitoa `"2025-05-31T21:00:00Z"` (saa 9 jioni UTC), kifurushi kinabadilisha kuwa `"2025-06-01T00:00:00"` (usiku wa manane EAT, Juni 1).

Hii inamaanisha ukitaka covernote ianze Juni 1 saa za Tanzania, toa `"2025-05-31T21:00:00Z"` au `new Date("2025-05-31T21:00:00Z")`.
:::

### Sheria za Uthibitishaji

Kifurushi kinathibitisha mzigo wako kabla ya kuutuma kwa TIRA. Uthibitishaji ukishindwa, kinatupa `TiraValidationError` na jina la sehemu na ujumbe wa maelezo.

- `callback_url` lazima iwe URL halali
- `fleet_id` inahitajika
- `fleet_type` lazima iwe `"1"` (Msafara Mpya) au `"2"` (Magari ya ziada)
- `fleet_size` lazima iwe nambari chanya
- `covernote_end_date` lazima iwe baada ya `covernote_start_date`
- `total_premium_including_tax` lazima iwe kubwa kuliko au sawa na `total_premium_excluding_tax`
- Angalau kipengele kimoja cha `fleet_details` kinahitajika
- Kila kipengele cha msafara kinahitaji `fleet_entry`, `covernote_number`, `covernote_desc`, na `operative_clause`
- `previous_covernote_reference_number` inahitajika kwa kila kipengele cha msafara wakati `covernote_type` ni `"2"` (Upyaji) au `"3"` (Marekebisho)
- `endorsement_type` na `endorsement_reason` zinahitajika kwa kila kipengele cha msafara wakati `covernote_type` ni `"3"` (Marekebisho)
- Kila kipengele cha msafara lazima kiwe na angalau kipengele kimoja katika `risks_covered` na `subject_matters_covered`
- `motor_details` ya kila kipengele cha msafara inathibitishwa (tazama uthibitishaji wa Maelezo ya Gari hapa chini)
- `registration_number` inahitajika wakati `motor_type` ni `"1"` (Limesajiliwa)
- `number_of_axles`, `axle_distance`, na `sitting_capacity` zinahitajika wakati `motor_category` ni `"1"` (Gari), si lazima kwa Pikipiki
- `year_of_manufacture` lazima iwe kati ya 1900 na mwaka ujao
- `tare_weight` na `gross_weight` lazima ziwe nambari chanya
- Angalau mmiliki mmoja wa sera anahitajika (kiwango cha msafara)
- `phone_number` lazima iwe tarakimu 12 zinazoanza na `2557`
- `policyholder_birthdate` lazima iwe tarehe ya ISO halali (`YYYY-MM-DD`)
- `email_address` inathibitishwa ikitolewa

### Rejea ya Haraka ya Sehemu za Masharti

**Kwa aina ya covernote (inatumika kwa kila kipengele cha msafara):**

| Hali                | `covernote_number` | `previous_covernote_reference_number` | `endorsement_type` | `endorsement_reason` |
| ------------------- | ------------------ | ------------------------------------- | ------------------ | -------------------- |
| Mpya (`"1"`)        | Inahitajika        | —                                     | —                  | —                    |
| Upyaji (`"2"`)      | Inahitajika        | Inahitajika                           | —                  | —                    |
| Marekebisho (`"3"`) | Inahitajika        | Inahitajika                           | Inahitajika        | Inahitajika          |

**Kwa aina ya gari na hali (kwa kila `motor_details` ya gari):**

| Hali                    | `registration_number` | `number_of_axles` | `axle_distance` | `sitting_capacity` |
| ----------------------- | --------------------- | ----------------- | --------------- | ------------------ |
| Gari + Limesajiliwa     | Inahitajika           | Inahitajika       | Inahitajika     | Inahitajika        |
| Gari + Safarini         | —                     | Inahitajika       | Inahitajika     | Inahitajika        |
| Pikipiki + Limesajiliwa | Inahitajika           | Si lazima         | Si lazima       | Si lazima          |
| Pikipiki + Safarini     | —                     | Si lazima         | Si lazima       | Si lazima          |

### Mfano — Msafara Mpya

```js
const result = await tira.motorFleet.submit({
  request_id: "FLEET-2025-001",
  callback_url: "https://your-server.com/tira/fleet-callback",
  insurer_company_code: "ICC103",
  covernote_type: "1", // Mpya
  fleet_id: "FLT-001",
  fleet_type: "1", // Msafara mpya
  fleet_size: 2,
  sales_point_code: "SP719",
  covernote_start_date: "2025-05-31T21:00:00Z", // Juni 1 EAT
  covernote_end_date: "2026-05-31T21:00:00Z", // Juni 1 mwaka ujao EAT
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
      policyholder_type: "2", // Kampuni
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

### Mfano — Upyaji

```js
const result = await tira.motorFleet.submit({
  // ...sehemu sawa za kichwa cha msafara, pamoja na:
  covernote_type: "2", // Upyaji
  fleet_type: "1",
  // ...
  fleet_details: [
    {
      fleet_entry: 1,
      covernote_number: "SPCPLBA000001",
      previous_covernote_reference_number: "CN-FLT-2024-001", // Kutoka mwaka uliopita
      covernote_desc: "Private Vehicles",
      operative_clause: "Comprehensive",
      // ...hatari, mada_za_bima, maelezo_ya_gari
    },
    // ...magari mengine
  ],
});
```

### Mfano — Marekebisho

```js
const result = await tira.motorFleet.submit({
  // ...sehemu sawa za kichwa cha msafara, lakini:
  covernote_type: "3", // Marekebisho
  // ...
  fleet_details: [
    {
      fleet_entry: 1,
      covernote_number: "SPCPLBA000001",
      previous_covernote_reference_number: "CN-FLT-2025-001",
      endorsement_type: "1", // Kuongeza Primi
      endorsement_reason: "Bima ya ziada kwa kioo cha mbele",
      endorsement_premium_earned: 25000,
      covernote_desc: "Private Vehicles",
      operative_clause: "Comprehensive",
      // ...hatari, mada_za_bima, maelezo_ya_gari
    },
    // ...magari mengine
  ],
});
```

## Jibu la .submit()

Unapoita `tira.motorFleet.submit()`, unapata `CoverNoteResponse` mara moja kutoka TIRA:

| Sehemu                     | Aina                      | Maelezo                                                    |
| -------------------------- | ------------------------- | ---------------------------------------------------------- |
| `acknowledgement_id`       | `string`                  | Kitambulisho cha uthibitisho cha TIRA                      |
| `request_id`               | `string`                  | Kitambulisho chako cha ombi (kinarudishwa)                 |
| `tira_status_code`         | `string`                  | Msimbo wa hali — `"TIRA001"` inamaanisha imepokewa         |
| `tira_status_desc`         | `string`                  | Maelezo yanayosomeka                                       |
| `requires_acknowledgement` | `boolean`                 | Daima `true`                                               |
| `acknowledgement_payload`  | `Record<string, unknown>` | Uthibitisho ghafi uliochambuliwa (mara chache unahitajika) |

::: tip "TIRA001" inamaanisha "imepokewa", si "imeidhinishwa"
Katika hatua hii, `"TIRA001"` inamaanisha TIRA imepokea ombi lako la msafara na linashughulikiwa. **Haimaanishi** covernote zako zimeidhinishwa. Matokeo halisi (imeidhinishwa au imekataliwa, kwa kila gari) yanakuja baadaye kupitia callback URL yako.

Ukipata msimbo tofauti na `"TIRA001"`, kitu kimekwenda vibaya na utumaji wenyewe. Angalia ukurasa wa [Misimbo ya Makosa](/sw/error-codes) kwa msimbo husika.
:::

## Jibu la Callback la .submit()

Baada ya TIRA kushughulikia utumaji wako wa msafara, inatuma matokeo kwa `callback_url` yako. Tofauti na callback ya gari moja, callback ya msafara ina **hali ya kiwango cha msafara** na **matokeo kwa kila gari**.

### Data Iliyotolewa ya Kiwango cha Msafara

| Sehemu              | Aina                         | Maelezo                                                                                |
| ------------------- | ---------------------------- | -------------------------------------------------------------------------------------- |
| `response_id`       | `string`                     | Kitambulisho cha jibu la TIRA                                                          |
| `request_id`        | `string`                     | Kitambulisho chako cha ombi                                                            |
| `fleet_id`          | `string`                     | Kitambulisho chako cha msafara (kinarudishwa)                                          |
| `fleet_status_code` | `string`                     | Hali ya kiwango cha msafara. `"TIRA001"` = magari yote yameshughulikiwa kwa mafanikio. |
| `fleet_status_desc` | `string`                     | Maelezo ya hali ya kiwango cha msafara                                                 |
| `fleet_details`     | `MotorFleetCallbackDetail[]` | Matokeo kwa kila gari. Tazama hapa chini.                                              |

### Data ya Callback kwa Kila Gari

Kila kipengele katika `fleet_details` kina:

| Sehemu                       | Aina     | Maelezo                                                                                      |
| ---------------------------- | -------- | -------------------------------------------------------------------------------------------- |
| `fleet_entry`                | `number` | Inalingana na nambari yako ya mfuatano ya `fleet_entry`                                      |
| `covernote_number`           | `string` | Nambari yako ya covernote ya gari hili                                                       |
| `covernote_reference_number` | `string` | Nambari ya rejea ya covernote ya TIRA (ikiwa imefanikiwa)                                    |
| `sticker_number`             | `string` | Nambari ya stika iliyotolewa na TIRA (ikiwa imefanikiwa)                                     |
| `response_status_code`       | `string` | Hali ya kila gari. `"TIRA001"` = imeidhinishwa. Tazama [Misimbo ya Makosa](/sw/error-codes). |
| `response_status_desc`       | `string` | Maelezo ya hali ya kila gari                                                                 |

### Ikiwa Imefanikiwa

Wakati `fleet_status_code` ni `"TIRA001"`, magari yote yameshughulikiwa kwa mafanikio. `covernote_reference_number` na `sticker_number` za kila gari zinapaswa kuhifadhiwa — ni vitambulisho rasmi vya TIRA.

```js
// fleet_status_code === "TIRA001"
for (const vehicle of result.extracted.fleet_details) {
  console.log(`Gari ${vehicle.fleet_entry}:`);
  console.log(`  Covernote: ${vehicle.covernote_reference_number}`);
  console.log(`  Stika: ${vehicle.sticker_number}`);
  console.log(`  Hali: ${vehicle.response_status_code}`);
}
```

### Ikiwa Imeshindwa

Wakati `response_status_code` ya gari si `"TIRA001"`, covernote ya gari hilo imekataliwa. Magari mengine katika msafara yanaweza bado kufanikiwa. Angalia ukurasa wa [Misimbo ya Makosa](/sw/error-codes) — makosa maalum ya magari yako katika sehemu za "Motor Vehicle & Fleet" na "Cover Note".

```js
for (const vehicle of result.extracted.fleet_details) {
  if (vehicle.response_status_code !== "TIRA001") {
    console.error(
      `Gari ${vehicle.fleet_entry} limekataliwa:`,
      vehicle.response_status_code,
      vehicle.response_status_desc,
    );
  }
}
```

### Mfano — Kushughulikia Callback

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
        `Gari ${vehicle.fleet_entry} limekataliwa: ${vehicle.response_status_code}`,
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

  // Thibitisha daima — tazama sehemu inayofuata
  const ackXml = tira.acknowledge(result.body, uuid());
  res.set("Content-Type", "application/xml").send(ackXml);
});
```

## Uthibitisho wa .submit()

TIRA inatarajia uthibitishe kila callback. Usipothibitisha, wataendelea kurudia callback bila kikomo. Kifurushi kinafanya hii kuwa rahisi kwa `tira.acknowledge()`.

### Jinsi Inavyofanya Kazi

Ita `tira.acknowledge(result.body, uniqueId)` na:

| Hoja          | Maelezo                                                                         |
| ------------- | ------------------------------------------------------------------------------- |
| `result.body` | `body` kutoka matokeo ya callback — XML kamili iliyochambuliwa kama kitu cha JS |
| `uniqueId`    | Mfuatano wa kipekee unaouzalisha (mf. UUID)                                     |

Kifurushi kiotomatiki:

1. Kinapata jina sahihi la tag ya uthibitisho (`MotorCoverNoteRefRes` → `MotorCoverNoteRefResAck`)
2. Kinajaza `AcknowledgementId`, `ResponseId`, `AcknowledgementStatusCode`, na `AcknowledgementStatusDesc`
3. Kinasaini XML kwa ufunguo wako wa siri
4. Kinafunga kwa `<TiraMsg>` na `<MsgSignature>`

### XML Inavyoonekana

Huhitaji kujenga hii mwenyewe — hii ndiyo kifurushi kinachozalisha:

```xml
<TiraMsg>
<MotorCoverNoteRefResAck>
  <AcknowledgementId>kitambulisho-chako-cha-kipekee</AcknowledgementId>
  <ResponseId>TIRA22424232355</ResponseId>
  <AcknowledgementStatusCode>TIRA001</AcknowledgementStatusCode>
  <AcknowledgementStatusDesc>Successful</AcknowledgementStatusDesc>
</MotorCoverNoteRefResAck>
<MsgSignature>base64-encoded-signature...</MsgSignature>
</TiraMsg>
```

### Mfano

```js
const { v4: uuid } = require("uuid");

app.post("/tira/fleet-callback", async (req, res) => {
  const result = await tira.motorFleet.handleCallback(req.body);

  // Shughulikia data ya callback...
  await saveFleetResults(result.extracted);

  // Jenga XML ya uthibitisho
  const ackXml = tira.acknowledge(result.body, uuid());

  // Itume kama jibu la HTTP
  res.set("Content-Type", "application/xml").send(ackXml);
});
```

::: warning Thibitisha daima
Hata ikiwa kushughulikia data ya callback kumeshindwa, bado unapaswa kuthibitisha. Funga tu mantiki yako ya biashara katika try-catch — uchambuzi wa callback na uthibitisho lazima uendelee daima:

```js
app.post("/tira/fleet-callback", async (req, res) => {
  const result = await tira.motorFleet.handleCallback(req.body);

  try {
    await saveFleetResults(result.extracted);
  } catch (err) {
    console.error("Kosa la kuhifadhi matokeo ya msafara:", err);
  }

  // Inafanya kazi daima, bila kujali kama usindikaji wako umefanikiwa
  const ackXml = tira.acknowledge(result.body, uuid());
  res.set("Content-Type", "application/xml").send(ackXml);
});
```

:::

::: danger Kutothibitisha mara kwa mara
TIRA inafuatilia majibu ya uthibitisho. Kushindwa kuthibitisha callback mara kwa mara kunaweza kusababisha TIRA kuchukua hatua dhidi ya muunganisho wako. Hakikisha daima endpoint yako ya callback inathibitisha kila callback inayoipokea.
:::

## Kazi ya .handleCallback()

```ts
await tira.motorFleet.handleCallback(input: string | Record<string, any>): Promise<CallbackResult<MotorFleetCallbackResponse>>
```

Kazi hii inachambua XML ya callback ambayo TIRA inatuma kwa callback URL yako na kutoa data ya kiwango cha msafara na matokeo ya kila gari. Unaweza pia kutumia `tira.handleCallback()` ya jumla ikiwa una endpoint moja kwa aina zote za callback.

### Inafanya Nini

1. **Inathibitisha sahihi** — inakagua kwamba `<MsgSignature>` ya callback inalingana na ufunguo wa umma wa TIRA (ikiwa uthibitishaji wa sahihi umesanidiwa)
2. **Inachambua XML** — inabadilisha XML ghafi kuwa kitu cha JavaScript
3. **Inatoa data** — inatoa sehemu za kiwango cha msafara (`fleet_id`, `fleet_status_code`) na matokeo ya kila gari (`covernote_reference_number`, `sticker_number`, n.k.) katika kitu safi cha `extracted`

### Ingizo

Unaweza kutoa:

- **Mfuatano wa XML ghafi** — `req.body` kutoka Express handler yako (inahitaji middleware ya `express.text({ type: "application/xml" })`)
- **Kitu kilichochambuliwa tayari** — ikiwa umeshachambua XML mwenyewe

### Inarudisha Nini

| Sehemu               | Aina                         | Maelezo                                                                              |
| -------------------- | ---------------------------- | ------------------------------------------------------------------------------------ |
| `type`               | `"motor_fleet"`              | Daima `"motor_fleet"` kwa mshughulikaji huu                                          |
| `extracted`          | `MotorFleetCallbackResponse` | Data ya msafara iliyotolewa (tazama [Jibu la Callback](#jibu-la-callback-la-submit)) |
| `body`               | `Record<string, any>`        | XML kamili iliyochambuliwa kama kitu cha JS — toa hii kwa `tira.acknowledge()`       |
| `signature_verified` | `boolean`                    | Ikiwa sahihi ya kidijitali ya TIRA ilithibitishwa                                    |
| `raw_xml`            | `string`                     | Mfuatano wa XML wa asili                                                             |

### Mshughulikaji wa Rasilimali Maalum dhidi ya wa Jumla

| Mbinu             | Mbinu                                   | Wakati wa Kutumia                                                                               |
| ----------------- | --------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Rasilimali maalum | `tira.motorFleet.handleCallback(input)` | Unapo na endpoint tofauti kwa kila aina ya rasilimali                                           |
| Jumla             | `tira.handleCallback(input)`            | Unapo na endpoint moja kwa callback zote za TIRA (inahitaji `enabled_callbacks` katika usanidi) |

Zote mbili zinarudisha data sawa. Mshughulikaji wa jumla unagundua aina ya callback kiotomatiki — kwa callback za msafara, unatambua kipengele cha `FleetResHdr` kutofautisha msafara na callback za gari moja. Tazama [Callback na Uthibitisho](/sw/callbacks-acknowledgements) kwa maelezo zaidi kuhusu mshughulikaji wa jumla.

## Mfano Kamili

Programu kamili ya Express.js inayotuma covernote ya msafara wa magari, kushughulikia callback, na kuithibitisha.

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

// Tuma covernote ya msafara wa magari
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
    message: "Msafara umetumwa kwa TIRA",
    acknowledgement_id: result.acknowledgement_id,
    status: result.tira_status_code,
  });
});

// Shughulikia callback ya msafara ya TIRA na uthibitishe
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
    console.error("Kosa la kuhifadhi matokeo ya msafara:", err);
  }

  // Thibitisha — daima, bila kujali kama usindikaji umefanikiwa
  const ackXml = tira.acknowledge(result.body, uuid());
  res.set("Content-Type", "application/xml").send(ackXml);
});

app.listen(3000);
```

## Hali Maalum

### Kufuta Marekebisho

Wakati `endorsement_type` ni `"4"` (Kufuta) kwenye kipengele cha msafara, lazima uweke `covernote_end_date` ya kiwango cha msafara kuwa tarehe ya mwisho ya **sera ya asili**, si tarehe ya sasa. Hii inaambia TIRA bima inaisha lini.

```js
const result = await tira.motorFleet.submit({
  covernote_type: "3",
  // Tumia tarehe ya mwisho ya sera ya ASILI, si tarehe ya leo
  covernote_start_date: "2025-05-31T21:00:00Z",
  covernote_end_date: "2026-05-31T21:00:00Z", // Tarehe ya mwisho ya asili
  // ...
  fleet_details: [
    {
      fleet_entry: 1,
      covernote_number: "SPCPLBA000001",
      previous_covernote_reference_number: "CN-FLT-2025-001",
      endorsement_type: "4", // Kufuta
      endorsement_reason: "Mteja ameomba kufuta msafara",
      covernote_desc: "Private Vehicles",
      operative_clause: "Comprehensive",
      // ...hatari, mada_za_bima, maelezo_ya_gari
    },
  ],
});
```

Ukiweka `covernote_end_date` kuwa tarehe ya leo badala yake, TIRA inaweza kukataa utumaji au kufuta kunaweza kutoshughulikiwa vizuri.

### Sehemu za Kila Gari dhidi ya Kiwango cha Msafara

Magari ya Msafara yanagawanya sehemu kati ya kiwango cha msafara na kiwango cha kila gari tofauti na Magari ya kawaida:

**Kiwango cha msafara** (zinashirikiwa na magari yote):

- `request_id`, `callback_url`, `insurer_company_code`, `covernote_type`
- `fleet_id`, `fleet_type`, `fleet_size`, `comprehensive_insured`
- `sales_point_code`, `covernote_start_date`, `covernote_end_date`
- `payment_mode`, `currency_code`, `exchange_rate`
- `total_premium_excluding_tax`, `total_premium_including_tax`
- `commission_paid`, `commission_rate`
- `officer_name`, `officer_title`, `product_code`
- `policy_holders`

**Kwa kila gari** (katika kila kipengele cha `fleet_details`):

- `fleet_entry`, `covernote_number`, `previous_covernote_reference_number`
- `covernote_desc`, `operative_clause`
- `endorsement_type`, `endorsement_reason`, `endorsement_premium_earned`
- `risks_covered`, `subject_matters_covered`, `covernote_addons`
- `motor_details`

Hii inamaanisha kila gari linaweza kuwa na hatari, maelezo ya bima, na maelezo ya gari tofauti, lakini yote yanashiriki wamiliki wa sera, tarehe, na masharti ya malipo sawa.

### Pikipiki dhidi ya Gari

Sehemu `number_of_axles`, `axle_distance`, na `sitting_capacity` **zinahitajika** kwa magari (`motor_category: "1"`) lakini **si lazima** kwa pikipiki (`motor_category: "2"`). Hii inatumika kwa `motor_details` ya kila gari pekee — unaweza kuchanganya magari na pikipiki katika msafara mmoja.

```js
fleet_details: [
  {
    fleet_entry: 1,
    motor_details: {
      motor_category: "1", // Gari — axle, umbali, uwezo zinahitajika
      number_of_axles: 2,
      axle_distance: 0,
      sitting_capacity: 5,
      // ...sehemu nyingine
    },
    // ...
  },
  {
    fleet_entry: 2,
    motor_details: {
      motor_category: "2", // Pikipiki — hizi tatu zinaweza kuachwa
      // number_of_axles, axle_distance, sitting_capacity si lazima
      // ...sehemu nyingine
    },
    // ...
  },
];
```

### Magari Safarini

Wakati `motor_type` ni `"2"` (Safarini) kwenye maelezo ya gari ya kipengele cha msafara, `registration_number` haihitajiki kwa sababu gari bado halijasajiliwa. Sehemu nyingine zote za maelezo ya gari bado zinahitajika.

```js
fleet_details: [
  {
    fleet_entry: 1,
    motor_details: {
      motor_category: "1",
      motor_type: "2", // Safarini
      // registration_number HAIHITAJIKI
      chassis_number: "1234567890", // Bado inahitajika
      // ...sehemu nyingine
    },
    // ...
  },
];
```

### Sarafu

Ukitumia sarafu ya kigeni (si TZS), toa `currency_code` na `exchange_rate` zote mbili kwenye kiwango cha msafara. Zikitolewa, zinawekwa chaguomsingi `"TZS"` na `1.0` mtawalia.

```js
// TZS (chaguomsingi) — hakuna haja ya kubainisha
{
  total_premium_excluding_tax: 1050000,
  total_premium_including_tax: 1239000,
}

// Sarafu ya kigeni — bainisha zote mbili
{
  currency_code: "USD",
  exchange_rate: 2500.00,
  total_premium_excluding_tax: 420,
  total_premium_including_tax: 495.60,
}
```

### Sehemu za Kamisheni

`commission_paid` na `commission_rate` ni **lazima kwa wasuluhishi** (madalali na mawakala) lakini si lazima kwa wabima wa moja kwa moja. Ukituma kupitia dalali, jumuisha hizi daima kwenye kiwango cha msafara. Zinawekwa chaguomsingi `"0.00"` zisipotolewa.

```js
// Utumaji wa dalali/wakala — kamisheni inahitajika
{
  commission_paid: 131250,
  commission_rate: 0.125, // 12.5%
}

// Mbima wa moja kwa moja — kamisheni inaweza kuachwa (chaguomsingi 0.00)
{
  // Hakuna commission_paid au commission_rate zinazohitajika
}
```

### Uandishi wa XML Tag

XML tags `CommisionPaid` na `CommisionRate` zinatumia "s" moja ("Commision" badala ya "Commission"). Hii inalingana na maelezo ya TIRA. Kifurushi kinashughulikia uwekaji huu kiotomatiki — unatumia tu `commission_paid` na `commission_rate` katika mzigo wako.

### Callback ya Msafara wa Gari Moja

Msafara unapokuwa na gari moja tu, jibu la XML la TIRA linarudisha `FleetResDtl` kama kitu kimoja badala ya safu. Kifurushi kinasawazisha hii kiotomatiki — `result.extracted.fleet_details` daima ni safu, hata kwa misafara ya gari moja. Huhitaji kushughulikia hali hii maalum mwenyewe.

## Makosa ya Kawaida

::: danger Kusahau kuthibitisha callback
TIRA inarudia callback bila kikomo hadi uthibitishe. Daima ita `tira.acknowledge(result.body, uuid())` na rudisha XML, hata ikiwa kushughulikia data ya callback kumeshindwa.
:::

::: danger Tarehe mbaya ya mwisho kwa marekebisho ya kufuta
Wakati wa kufuta covernote za msafara (`endorsement_type: "4"`), weka `covernote_end_date` kuwa tarehe ya mwisho ya sera ya asili — **si** tarehe ya sasa.
:::

::: danger Kukosa middleware ya XML
Bila `express.text({ type: "application/xml" })`, `req.body` ya callback yako itakuwa tupu na uchambuzi utashindwa. Ongeza middleware hii kabla ya njia yako ya callback.
:::

::: danger Kuchanganya uthibitisho wa utumaji na idhini
`"TIRA001"` katika jibu la utumaji inamaanisha "imepokewa", si "imeidhinishwa". Idhini au kukataliwa halisi kunakuja baadaye kupitia callback. Usiwaambie watumiaji wako covernote za msafara wao zimeidhinishwa wakati wa utumaji.
:::

::: danger Kukosa sehemu za marekebisho kwenye vipengele vya msafara
Wakati `covernote_type` ni `"3"`, kila kipengele cha msafara lazima kiwe na `endorsement_type` na `endorsement_reason`. Kuzisahau kutatupa `TiraValidationError`.
:::

::: danger Safu tupu ya fleet_details
Angalau kipengele kimoja cha msafara kinahitajika. Kutuma na safu tupu ya `fleet_details` kutatupa `TiraValidationError`.
:::

::: danger Muundo wa nambari ya simu
Nambari za simu lazima ziwe tarakimu 12 zinazoanza na `2557` (mf. `"255712345678"`). Miundo mingine itashindwa uthibitishaji.
:::

::: danger Kuangalia hali ya kiwango cha msafara tu
`fleet_status_code` ya kiwango cha msafara inaweza kuwa `"TIRA001"` hata wakati magari binafsi yana hali tofauti. Daima pitia `fleet_details` na uangalie `response_status_code` ya kila gari mmoja mmoja.
:::

## Kurasa Zinazohusiana

- [Magari](/sw/motor) — Covernote za gari moja
- [Callback na Uthibitisho](/sw/callbacks-acknowledgements) — Mzunguko kamili wa callback
- [Usainiaji na Uthibitishaji](/sw/signing-verification) — Jinsi sahihi za kidijitali zinavyofanya kazi
- [Misimbo ya Makosa](/sw/error-codes) — Misimbo yote ya hali ya TIRA na marekebisho
- [Uanzishaji](/sw/initialization) — Kuweka mteja wa Tira
