# Uthibitishaji wa Covernote

Rasilimali ya Uthibitishaji wa Covernote inakuruhusu kuthibitisha ikiwa covernote ipo katika daftari la TIRA. Tumia `tira.coverNoteVerification` kuangalia uhalali wa covernote kwa nambari ya rejea, na kuchuja kwa hiari kwa nambari ya stika, nambari ya usajili, au nambari ya chasi.

Hii ni operesheni ya **synchronous** — unapata matokeo mara moja, hakuna callback au uthibitisho unaohitajika.

## Mbinu Zinazopatikana

| Mbinu                                        | Maelezo                                     | Wakati wa Kutumia                                               | Inarudisha                      |
| -------------------------------------------- | ------------------------------------------- | --------------------------------------------------------------- | ------------------------------- |
| `tira.coverNoteVerification.verify(payload)` | Thibitisha covernote kwenye daftari la TIRA | Unapohitaji kuangalia kama covernote ipo na kupata maelezo yake | `CoverNoteVerificationResponse` |

## Mzigo wa .verify()

```ts
await tira.coverNoteVerification.verify(payload): Promise<CoverNoteVerificationResponse>
```

Inathibitisha covernote kwenye daftari la TIRA. Hii ni ombi la **synchronous** — unapata jibu mara moja, hakuna callback inayohitajika.

**Endpoint:** `POST /ecovernote/api/covernote/verification/v1/request`

### Sehemu za Mzigo

| Sehemu                       | Aina     | Inahitajika | Chaguomsingi | XML Tag                    | Maelezo                                               |
| ---------------------------- | -------- | ----------- | ------------ | -------------------------- | ----------------------------------------------------- |
| `request_id`                 | `string` | Ndiyo       | —            | `RequestId`                | Kitambulisho cha kipekee cha ombi                     |
| `covernote_reference_number` | `string` | Ndiyo       | —            | `CoverNoteReferenceNumber` | Nambari ya rejea ya covernote ya TIRA ya kuthibitisha |
| `sticker_number`             | `string` | Hapana      | `""`         | `StickerNumber`            | Nambari ya stika ya gari (kichujio cha hiari)         |
| `motor_registration_number`  | `string` | Hapana      | `""`         | `MotorRegistrationNumber`  | Nambari ya usajili wa gari (kichujio cha hiari)       |
| `motor_chassis_number`       | `string` | Hapana      | `""`         | `MotorChassisNumber`       | Nambari ya chasi ya gari (kichujio cha hiari)         |

### Sheria za Uthibitishaji

- `request_id` inahitajika
- `covernote_reference_number` inahitajika
- Sehemu zingine zote ni za hiari — zisipotolewa, zinakuwa mfuatano tupu

### Mfano — Kuthibitisha kwa Nambari ya Rejea Pekee

```js
const result = await tira.coverNoteVerification.verify({
  request_id: "VERIFY-CN-001",
  covernote_reference_number: "SPCPLBA1013070418136",
});

if (result.tira_status_code === "TIRA001") {
  console.log("Covernote ni halali");
  console.log(result.data); // Maelezo ya covernote kutoka TIRA
} else {
  console.log("Uthibitishaji umeshindwa:", result.tira_status_desc);
}
```

### Mfano — Kuthibitisha na Sehemu Zote za Hiari

```js
const result = await tira.coverNoteVerification.verify({
  request_id: "VERIFY-CN-002",
  covernote_reference_number: "SPCPLBA1013070418136",
  sticker_number: "1313-1414-124124",
  motor_registration_number: "T233SQA",
  motor_chassis_number: "4353646",
});

if (result.tira_status_code === "TIRA001") {
  console.log("Covernote ni halali");
  console.log(result.data);
} else {
  console.log("Uthibitishaji umeshindwa:", result.tira_status_desc);
}
```

## Jibu la .verify()

Unapoita `tira.coverNoteVerification.verify()`, unapata `CoverNoteVerificationResponse`:

| Sehemu             | Aina     | Maelezo                                                                                |
| ------------------ | -------- | -------------------------------------------------------------------------------------- |
| `response_id`      | `string` | Kitambulisho cha jibu la TIRA                                                          |
| `request_id`       | `string` | Kitambulisho chako cha ombi (kinarudishwa)                                             |
| `tira_status_code` | `string` | Msimbo wa hali — `"TIRA001"` inamaanisha covernote imepatikana                         |
| `tira_status_desc` | `string` | Maelezo yanayosomeka                                                                   |
| `data`             | `object` | Maelezo ya covernote kutoka TIRA. **Ipo tu wakati `tira_status_code` ni `"TIRA001"`**. |

### Sehemu za Data ya Jibu

Covernote ikipatikana, `data` ina maelezo kamili ya covernote (yamechambuliwa kutoka kipengele cha XML `CoverNoteDtl`):

#### Maelezo ya Jumla

| Sehemu                         | Aina     | Maelezo                                                            |
| ------------------------------ | -------- | ------------------------------------------------------------------ |
| `CoverNoteTypeDesc`            | `string` | Maelezo ya aina ya covernote (mf. "Endorsement", "New", "Renewal") |
| `CoverNoteNumber`              | `string` | Nambari ya covernote ya bima                                       |
| `CoverNoteReferenceNumber`     | `string` | Nambari ya rejea ya covernote ya TIRA                              |
| `PrevCoverNoteReferenceNumber` | `string` | Rejea ya covernote iliyopita (kwa upyaji/marekebisho)              |
| `InsurerCompanyCode`           | `string` | Msimbo wa kampuni ya bima                                          |
| `InsurerCompanyName`           | `string` | Jina la kampuni ya bima                                            |
| `TransactionCompanyCode`       | `string` | Msimbo wa kampuni inayoshughulika                                  |
| `TransactionCompanyName`       | `string` | Jina la kampuni inayoshughulika                                    |
| `BranchCode`                   | `string` | Msimbo wa tawi                                                     |
| `SalePointCode`                | `string` | Msimbo wa kituo cha mauzo                                          |
| `CoverNoteIssueDate`           | `string` | Tarehe covernote ilitolewa                                         |
| `CoverNoteStartDate`           | `string` | Tarehe ya kuanza bima                                              |
| `CoverNoteEndDate`             | `string` | Tarehe ya kuisha bima                                              |
| `AuthorizationDate`            | `string` | Tarehe covernote iliidhinishwa                                     |
| `CoverNoteDesc`                | `string` | Maelezo ya covernote (mf. "School Bus")                            |
| `OperativeClause`              | `string` | Kifungu cha uendeshaji (mf. "Fire and Allied Perils")              |
| `PaymentMode`                  | `string` | Njia ya malipo (1=Taslimu, 2=Hundi, 3=EFT)                         |
| `CurrencyCode`                 | `string` | Msimbo wa sarafu (mf. "USD", "TZS")                                |
| `ExchangeRate`                 | `string` | Kiwango cha kubadilisha kwa TZS                                    |
| `TotalPremiumExcludingTax`     | `string` | Jumla ya malipo kabla ya kodi                                      |
| `TotalPremiumIncludingTax`     | `string` | Jumla ya malipo baada ya kodi                                      |
| `CommissionPaid`               | `string` | Kiasi cha kamisheni                                                |
| `CommissionRate`               | `string` | Kiwango cha kamisheni                                              |
| `IsFleet`                      | `string` | Kama ni covernote ya msafara ("Y"/"N")                             |
| `FleetId`                      | `string` | Kitambulisho cha msafara (ikiwa msafara)                           |
| `FleetSize`                    | `string` | Idadi ya magari katika msafara (ikiwa msafara)                     |
| `ComprehensiveInsured`         | `string` | Idadi ya magari yenye bima kamili (ikiwa msafara)                  |
| `FleetEntry`                   | `string` | Nambari ya ingizo la msafara (ikiwa msafara)                       |
| `OfficerName`                  | `string` | Jina la afisa anayeshughulikia                                     |
| `OfficerTitle`                 | `string` | Cheo cha afisa anayeshughulikia                                    |
| `ProductCode`                  | `string` | Msimbo wa bidhaa                                                   |

#### Hatari Zilizofunikwa

`data.RisksCovered.RiskCovered` ina safu (au kitu kimoja) cha hatari:

| Sehemu                          | Aina     | Maelezo                                                          |
| ------------------------------- | -------- | ---------------------------------------------------------------- |
| `RiskCode`                      | `string` | Msimbo wa hatari                                                 |
| `SumInsured`                    | `string` | Jumla ya bima                                                    |
| `PremiumRate`                   | `string` | Kiwango cha malipo                                               |
| `PremiumBeforeDiscount`         | `string` | Malipo kabla ya punguzo                                          |
| `PremiumDiscount`               | `string` | Kiasi cha punguzo                                                |
| `DiscountType`                  | `string` | Aina ya punguzo                                                  |
| `PremiumAfterDiscount`          | `string` | Malipo baada ya punguzo                                          |
| `PremiumExcludingTaxEquivalent` | `string` | Malipo bila kodi kwa TZS                                         |
| `PremiumIncludingTax`           | `string` | Malipo pamoja na kodi                                            |
| `TaxesCharged`                  | `object` | Ina safu ya `TaxCharged` yenye `TaxCode`, `TaxRate`, `TaxAmount` |

#### Mambo Yaliyofunikwa

`data.SubjectMattersCovered.SubjectMatter` ina safu (au kitu kimoja):

| Sehemu                   | Aina     | Maelezo          |
| ------------------------ | -------- | ---------------- |
| `SubjectMatterReference` | `string` | Rejea ya jambo   |
| `SubjectMatterDesc`      | `string` | Maelezo ya jambo |

#### Nyongeza za Covernote

`data.CoverNoteAddons.CoverNoteAddon` ina safu (au kitu kimoja), ikiwa nyongeza zipo:

| Sehemu                          | Aina     | Maelezo                                                          |
| ------------------------------- | -------- | ---------------------------------------------------------------- |
| `AddonReference`                | `string` | Rejea ya nyongeza                                                |
| `AddonDesc`                     | `string` | Maelezo ya nyongeza                                              |
| `AddonAmount`                   | `string` | Kiasi cha nyongeza                                               |
| `AddonPremiumRate`              | `string` | Kiwango cha malipo ya nyongeza                                   |
| `PremiumExcludingTax`           | `string` | Malipo kabla ya kodi                                             |
| `PremiumExcludingTaxEquivalent` | `string` | Malipo kabla ya kodi kwa TZS                                     |
| `PremiumIncludingTax`           | `string` | Malipo baada ya kodi                                             |
| `TaxesCharged`                  | `object` | Ina safu ya `TaxCharged` yenye `TaxCode`, `TaxRate`, `TaxAmount` |

#### Wamiliki wa Sera

`data.PolicyHolders.PolicyHolder` ina safu (au kitu kimoja):

| Sehemu                    | Aina     | Maelezo                                                               |
| ------------------------- | -------- | --------------------------------------------------------------------- |
| `PolicyHolderName`        | `string` | Jina kamili                                                           |
| `PolicyHolderBirthDate`   | `string` | Tarehe ya kuzaliwa                                                    |
| `PolicyHolderType`        | `string` | 1=Mtu binafsi, 2=Kampuni                                              |
| `PolicyHolderIdNumber`    | `string` | Nambari ya kitambulisho                                               |
| `PolicyHolderIdType`      | `string` | Aina ya kitambulisho (1=NIDA, 2=Kadi ya Mpiga Kura, 3=Pasipoti, n.k.) |
| `Gender`                  | `string` | Jinsia (inaweza kuwa tupu)                                            |
| `CountryCode`             | `string` | Msimbo wa nchi (mf. "TZA")                                            |
| `Region`                  | `string` | Mkoa                                                                  |
| `District`                | `string` | Wilaya                                                                |
| `Street`                  | `string` | Mtaa (inaweza kuwa tupu)                                              |
| `PolicyHolderPhoneNumber` | `string` | Nambari ya simu                                                       |
| `PolicyHolderFax`         | `string` | Nambari ya faksi (inaweza kuwa tupu)                                  |
| `PostalAddress`           | `string` | Anwani ya posta (inaweza kuwa tupu)                                   |
| `EmailAddress`            | `string` | Anwani ya barua pepe (inaweza kuwa tupu)                              |

#### Maelezo ya Gari

`data.MotorDtl` ina maelezo ya gari (ipo kwa covernote za magari):

| Sehemu               | Aina     | Maelezo                                        |
| -------------------- | -------- | ---------------------------------------------- |
| `MotorCategory`      | `string` | 1=Gari, 2=Pikipiki                             |
| `RegistrationNumber` | `string` | Nambari ya usajili wa gari                     |
| `ChassisNumber`      | `string` | Nambari ya chasi                               |
| `Make`               | `string` | Aina ya gari (mf. "Toyota")                    |
| `Model`              | `string` | Modeli ya gari (mf. "IST")                     |
| `ModelNumber`        | `string` | Nambari ya modeli                              |
| `BodyType`           | `string` | Aina ya mwili (mf. "Station Wagon")            |
| `Color`              | `string` | Rangi ya gari                                  |
| `EngineNumber`       | `string` | Nambari ya injini                              |
| `EngineCapacity`     | `string` | Uwezo wa injini kwa cc                         |
| `FuelUsed`           | `string` | Aina ya mafuta (mf. "Petrol", "Diesel")        |
| `NumberOfAxles`      | `string` | Idadi ya axle                                  |
| `AxleDistance`       | `string` | Umbali wa axle (inaweza kuwa tupu)             |
| `SittingCapacity`    | `string` | Uwezo wa kukaa (inaweza kuwa tupu)             |
| `YearOfManufacture`  | `string` | Mwaka wa kutengenezwa                          |
| `TareWeight`         | `string` | Uzito tupu kwa kg                              |
| `GrossWeight`        | `string` | Uzito kamili kwa kg                            |
| `MotorUsage`         | `string` | Aina ya matumizi (mf. "Private", "Commercial") |
| `OwnerName`          | `string` | Jina la mmiliki aliyesajiliwa                  |
| `OwnerCategory`      | `string` | Aina ya mmiliki                                |
| `OwnerAddress`       | `string` | Anwani ya mmiliki (inaweza kuwa tupu)          |

::: info
Thamani zote katika `data` zinarudishwa kama mfuatano na TIRA, hata sehemu za nambari kama `SumInsured` na `ExchangeRate`. Sehemu zingine zinaweza kuwa mfuatano tupu zisipohusika. Wakati `tira_status_code` si `"TIRA001"`, `data` ni `undefined`.
:::

::: tip Maelezo ya Gari
Sehemu ya `MotorDtl` ipo kwa covernote zinazohusiana na magari. Kwa covernote zisizo za magari, sehemu hii inaweza kutokuwepo katika jibu.
:::

## Mfano Kamili

Programu kamili ya Express.js inayothibitisha covernote kwenye daftari la TIRA.

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

// Thibitisha covernote
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

## Makosa ya Kawaida

::: danger Kukosa sehemu zinazohitajika
`request_id` na `covernote_reference_number` zote zinahitajika. Kukosa yoyote kutatupa `TiraValidationError`.
:::

::: danger Kuchanganya na uthibitishaji wa gari
`tira.coverNoteVerification.verify()` inaangalia kama **covernote** ipo katika mfumo wa TIRA. Kuthibitisha **gari** kwenye daftari la TIRA, tumia `tira.motor.verify()` badala yake.
:::

::: danger Kutarajia callback
Uthibitishaji wa covernote ni synchronous — matokeo yanarudishwa mara moja. Hakuna callback URL, hakuna uthibitisho, na hakuna haja ya middleware ya `express.text({ type: "application/xml" })`.
:::

## Kurasa Zinazohusiana

- [Misimbo ya Makosa](/sw/error-codes) — Misimbo yote ya hali ya TIRA na marekebisho
- [Uanzishaji](/sw/initialization) — Kuweka mteja wa Tira
- [Magari](/sw/motor) — Covernote na uthibitishaji wa magari
- [Bima Nyinginezo](/sw/non-life-other) — Covernote za bima nyinginezo
