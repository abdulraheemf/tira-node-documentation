# Kukataliwa kwa Madai (Claim Rejection)

Rasilimali ya Kukataliwa kwa Madai inashughulikia utumaji wa kukataliwa kwa madai kwa TIRA. Tumia `tira.claimRejection` kutuma maelezo ya kukataliwa kwa madai — ikijumuisha sababu ya kukataliwa, kiasi cha dai, hali ya kesi, na maelezo ya wadai — dhidi ya dai lilipo, na kushughulikia majibu ya callback ya TIRA.

Kwa mtiririko wa jumla wa kutuma-callback-kuthibitisha, tazama [Callback na Uthibitisho](/sw/callbacks-acknowledgements).

## Mbinu Zinazopatikana

| Mbinu                                         | Maelezo                                         | Wakati wa Kutumia                                                              | Inarudisha                                         |
| --------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------- |
| `tira.claimRejection.submit(payload)`         | Tuma kukataliwa kwa madai kwa TIRA              | Bima inapoamua kukataa dai na inahitaji kuripoti kwa TIRA                      | `ClaimRejectionResponse`                           |
| `tira.claimRejection.handleCallback(input)`   | Chambua na kutoa data kutoka callback ya TIRA   | TIRA inapotuma matokeo ya utumaji wako kwa callback URL yako                   | `CallbackResult<ClaimRejectionCallbackResponse>`   |

## Mzigo wa .submit()

```ts
await tira.claimRejection.submit(payload): Promise<ClaimRejectionResponse>
```

Inatuma kukataliwa kwa madai kwa TIRA. Hii ni operesheni ya **asynchronous** — unapata uthibitisho mara moja, na matokeo halisi yanakuja baadaye kupitia callback URL yako.

**Endpoint:** `POST /eclaim/api/claim/claim-rejection/v1/request`

### Sehemu za Kukataliwa kwa Madai

| Sehemu                       | Aina               | Inahitajika | Chaguomsingi | XML Tag                    | Maelezo                                                                                                                        |
| ---------------------------- | ------------------ | ----------- | ------------ | -------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `request_id`                 | `string`           | Ndiyo       | —            | `RequestId`                | Kitambulisho cha kipekee cha ombi                                                                                              |
| `callback_url`               | `string`           | Ndiyo       | —            | `CallBackUrl`              | TIRA inapotuma matokeo                                                                                                         |
| `insurer_company_code`       | `string`           | Ndiyo       | —            | `InsurerCompanyCode`       | Nambari ya kampuni ya bima                                                                                                     |
| `claim_rejection_number`     | `string`           | Ndiyo       | —            | `ClaimRejectionNumber`     | Nambari ya kukataliwa kwa madai kwa mujibu wa bima. String(50).                                                                |
| `claim_reference_number`     | `string`           | Ndiyo       | —            | `ClaimReferenceNumber`     | Nambari ya kumbukumbu ya madai ya TIRA kutoka taarifa ya madai. String(50).                                                    |
| `claim_intimation_number`    | `string`           | Ndiyo       | —            | `ClaimIntimationNumber`    | Nambari ya madai ya awali. String(50).                                                                                         |
| `covernote_reference_number` | `string`           | Ndiyo       | —            | `CoverNoteReferenceNumber` | Nambari ya kumbukumbu ya covernote ya TIRA ambayo dai linapinga. String(50).                                                   |
| `rejection_date`             | `string\|Date`     | Ndiyo       | —            | `RejectionDate`            | Tarehe ya kukataliwa. Tazama [Utumaji wa Tarehe](#utumaji-wa-tarehe).                                                          |
| `rejection_reason`           | `string`           | Ndiyo       | —            | `RejectionReason`          | Sababu ya kukataa dai. String(100).                                                                                            |
| `claim_resulted_litigation`  | `"Y"\|"N"`         | Ndiyo       | —            | `ClaimResultedLitigation`  | Kama dai lilisababisha kesi. Tazama [Thamani za Kesi](#thamani-za-kesi).                                                       |
| `claim_amount`               | `number`           | Ndiyo       | —            | `ClaimAmount`              | Kiasi cha dai. Numeric(36,2).                                                                                                  |
| `currency_code`              | `string`           | Ndiyo       | —            | `CurrencyCode`             | Msimbo wa fedha wa ISO 4217.                                                                                                   |
| `exchange_rate`              | `number`           | Ndiyo       | —            | `ExchangeRate`             | Kiwango cha ubadilishaji hadi TZS. Kinafomatiwa kwa desimali 2.                                                                |
| `claimants`                  | `SimpleClaimant[]` | Ndiyo       | —            | `Claimants > Claimant`     | Angalau mdai mmoja anahitajika. Tazama [Wadai](#wadai).                                                                        |

::: info Sehemu za kichwa zinazojazwa kiotomatiki
Sehemu za kichwa cha XML `CompanyCode` na `SystemCode` zinajazwa kiotomatiki kutoka kwenye usanidi wako wa Tira — huhitaji kuzijumuisha kwenye mzigo.
:::

### Wadai

Kila mdai kwenye safu ya `claimants` ana sehemu zifuatazo:

| Sehemu               | Aina           | Inahitajika | Chaguomsingi | XML Tag            | Maelezo                                                                     |
| -------------------- | -------------- | ----------- | ------------ | ------------------ | --------------------------------------------------------------------------- |
| `claimant_category`  | `"1"\|"2"`     | Ndiyo       | —            | `ClaimantCategory` | 1=Mwenye bima, 2=Upande wa Tatu.                                            |
| `claimant_type`      | `"1"\|"2"`     | Ndiyo       | —            | `ClaimantType`     | 1=Mtu binafsi, 2=Kampuni.                                                   |
| `claimant_id_number` | `string`       | Ndiyo       | —            | `ClaimantIdNumber` | Nambari ya kitambulisho. String(50).                                        |
| `claimant_id_type`   | `"1"\|…\|"7"` | Ndiyo       | —            | `ClaimantIdType`   | Aina ya kitambulisho. Tazama [Aina za Kitambulisho](#aina-za-kitambulisho). |

::: info Wadai waliorahisishwa
Kukataliwa kwa madai kunatumia muundo rahisi wa wadai (`SimpleClaimant`) wenye sehemu 4 tu. Hii ni tofauti na [Madai ya Awali](/sw/claim-intimation), ambayo inahitaji maelezo kamili ya wadai (jina, tarehe ya kuzaliwa, anwani, simu, n.k.).
:::

### Aina za Kitambulisho

| Thamani | Maelezo                                    |
| ------- | ------------------------------------------ |
| `"1"`   | NIN (Nambari ya Kitambulisho cha Kitaifa)  |
| `"2"`   | Nambari ya Usajili wa Wapigakura           |
| `"3"`   | Nambari ya Pasipoti                        |
| `"4"`   | Leseni ya Udereva                          |
| `"5"`   | Kitambulisho cha Mkazi wa Zanzibar (ZANID) |
| `"6"`   | TIN (Nambari ya Kitambulisho cha Kodi)     |
| `"7"`   | Nambari ya Cheti cha Usajili wa Kampuni    |

### Thamani za Kesi

| Thamani | Maelezo                          |
| ------- | -------------------------------- |
| `"Y"`   | Dai lilisababisha kesi           |
| `"N"`   | Dai halikusababisha kesi         |

### Utumaji wa Tarehe

Kifurushi kinabadilisha tarehe kiotomatiki kuwa Saa za Afrika Mashariki (UTC+3) na kuzifomati kama `YYYY-MM-DDTHH:mm:ss` (bila kiambishi cha eneo la saa). Unaweza kutuma string ya ISO au kitu cha JavaScript `Date`.

::: tip Mfano
Ukituma `"2020-09-10T10:55:22Z"` (10:55 asubuhi UTC), kifurushi kinabadilisha kuwa `"2020-09-10T13:55:22"` (1:55 alasiri EAT).
:::

### Sheria za Uthibitishaji

Kifurushi kinathibitisha mzigo wako kabla ya kuutuma kwa TIRA. Uthibitishaji ukishindikana, kinatupa `TiraValidationError` na jina la sehemu na ujumbe wa maelezo.

- `request_id`, `insurer_company_code`, `claim_rejection_number`, `claim_reference_number`, `claim_intimation_number`, `covernote_reference_number`, `rejection_reason`, `currency_code` — zote ni string zinazohitajika
- `callback_url` — inahitajika na lazima iwe URL halali
- `rejection_date` — lazima iwe string ya tarehe halali (fomati ya ISO) au kitu cha `Date`
- `claim_amount`, `exchange_rate` — lazima ziwe nambari halali
- `claim_resulted_litigation` — lazima iwe `"Y"` au `"N"`
- `claimants` — angalau mdai mmoja anahitajika
- Kwa kila mdai: `claimant_id_number` inahitajika; `claimant_category` lazima iwe `"1"` au `"2"`; `claimant_type` lazima iwe `"1"` au `"2"`; `claimant_id_type` lazima iwe aina halali ya kitambulisho (`"1"` hadi `"7"`)

### Mfano — Kutuma Kukataliwa kwa Madai

```js
const result = await tira.claimRejection.submit({
  request_id: "AB3232532523344",
  callback_url: "https://your-server.com/tira/claim-rejection-callback",
  insurer_company_code: "IC100",
  claim_rejection_number: "322WQ25234234",
  claim_reference_number: "10020-25400-07720",
  claim_intimation_number: "322WQ25234234",
  covernote_reference_number: "10020-25400-07720",
  rejection_date: "2020-09-10T13:55:22",
  rejection_reason: "Dai halishumuliwi chini ya masharti ya sera",
  claim_resulted_litigation: "Y",
  claim_amount: 20000,
  currency_code: "USD",
  exchange_rate: 2000.0,
  claimants: [
    {
      claimant_category: "2",
      claimant_type: "1",
      claimant_id_number: "24241241",
      claimant_id_type: "1",
    },
    {
      claimant_category: "2",
      claimant_type: "2",
      claimant_id_number: "3452525235525",
      claimant_id_type: "3",
    },
  ],
});

console.log(result.acknowledgement_id); // "ACK123456"
console.log(result.tira_status_code); // "TIRA001"
```

## Jibu la .submit()

Unapoita `tira.claimRejection.submit()`, unapata `ClaimRejectionResponse` mara moja kutoka TIRA:

| Sehemu                     | Aina                      | Maelezo                                                         |
| -------------------------- | ------------------------- | --------------------------------------------------------------- |
| `acknowledgement_id`       | `string`                  | Kitambulisho cha uthibitisho cha TIRA                           |
| `request_id`               | `string`                  | Kitambulisho chako cha ombi (kinarudishwa)                      |
| `tira_status_code`         | `string`                  | Msimbo wa hali — `"TIRA001"` inamaanisha imepokelewa            |
| `tira_status_desc`         | `string`                  | Maelezo yanayosomeka                                            |
| `requires_acknowledgement` | `boolean`                 | Daima `true`                                                    |
| `acknowledgement_payload`  | `Record<string, unknown>` | Mzigo wa uthibitisho uliochanganuliwa (mara chache unahitajika) |

::: tip "TIRA001" inamaanisha "imepokelewa", si "imekubaliwa"
Katika hatua hii, `"TIRA001"` inamaanisha TIRA imepokea ombi lako na linashughulikiwa. **Haimaanishi** kukataliwa kwa madai yako kumekubaliwa. Matokeo halisi yanakuja baadaye kupitia callback URL yako.

Ukipata msimbo tofauti na `"TIRA001"`, kuna kosa limetokea kwenye utumaji wenyewe. Angalia ukurasa wa [Misimbo ya Makosa](/sw/error-codes) kwa msimbo husika.
:::

## Jibu la Callback la .submit()

Baada ya TIRA kushughulikia utumaji wako, inatuma matokeo kwa `callback_url` yako. Callback ina matokeo halisi — kama kukataliwa kwa madai yako kumekubaliwa au la.

### Data Iliyotolewa

Sehemu ya `extracted` ina data ya callback iliyochanganuliwa:

| Sehemu                 | Aina     | Maelezo                                                                                     |
| ---------------------- | -------- | ------------------------------------------------------------------------------------------- |
| `response_id`          | `string` | Kitambulisho cha jibu la TIRA                                                               |
| `request_id`           | `string` | Kitambulisho chako cha ombi                                                                 |
| `response_status_code` | `string` | `"TIRA001"` = imekubaliwa. Tazama [Misimbo ya Makosa](/sw/error-codes) kwa misimbo mingine. |
| `response_status_desc` | `string` | Maelezo ya hali yanayosomeka                                                                |

### Ikiwa Imefanikiwa

Wakati `response_status_code` ni `"TIRA001"`, kukataliwa kwa madai kumekubaliwa.

```js
// response_status_code === "TIRA001"
console.log(result.extracted.response_status_code); // "TIRA001"
console.log(result.extracted.response_status_desc); // "Successful"
console.log(result.extracted.request_id); // "AB3232532523344"
```

### Ikiwa Kuna Kosa

Wakati `response_status_code` ni kitu kingine tofauti na `"TIRA001"`, kukataliwa kwa madai hakukukubaliwa. Angalia ukurasa wa [Misimbo ya Makosa](/sw/error-codes) kwa msimbo husika.

```js
// response_status_code !== "TIRA001"
console.log(result.extracted.response_status_code); // mf. "TIRA020"
console.log(result.extracted.response_status_desc); // mf. "Invalid request"
```

### Mfano — Kushughulikia Callback

```js
app.post("/tira/claim-rejection-callback", async (req, res) => {
  const result = await tira.claimRejection.handleCallback(req.body);

  if (result.extracted.response_status_code === "TIRA001") {
    await db.claimRejections.update({
      where: { request_id: result.extracted.request_id },
      data: { status: "accepted" },
    });
  } else {
    console.error(
      `Kukataliwa kwa madai kumeshindikana: ${result.extracted.response_status_code}`,
      result.extracted.response_status_desc,
    );

    await db.claimRejections.update({
      where: { request_id: result.extracted.request_id },
      data: {
        status: "failed",
        error_code: result.extracted.response_status_code,
        error_reason: result.extracted.response_status_desc,
      },
    });
  }

  // Thibitisha daima — tazama sehemu inayofuata
  const ackXml = tira.acknowledge(result.body, uuid());
  res.set("Content-Type", "application/xml").send(ackXml);
});
```

## Uthibitisho wa .submit()

TIRA inatarajia uthibitishe kila callback. Usipofanya hivyo, wataendelea kurudia callback bila kikomo. Kifurushi kinafanya hii kuwa rahisi na `tira.acknowledge()`.

### Jinsi Inavyofanya Kazi

Ita `tira.acknowledge(result.body, uniqueId)` na:

| Hoja          | Maelezo                                                                           |
| ------------- | --------------------------------------------------------------------------------- |
| `result.body` | `body` kutoka matokeo ya callback — XML iliyochanganuliwa kamili kama kitu cha JS |
| `uniqueId`    | String ya kipekee unayoizalisha (mf. UUID)                                        |

Kifurushi kiotomatiki:

1. Kinapata jina sahihi la tag ya uthibitisho (`ClaimRejectionRes` → `ClaimRejectionResAck`)
2. Kinajaza `AcknowledgementId`, `ResponseId`, `AcknowledgementStatusCode`, na `AcknowledgementStatusDesc`
3. Kinasaini XML kwa ufunguo wako wa faragha
4. Kinafunga kwenye `<TiraMsg>` na `<MsgSignature>`

### XML Inavyoonekana

Huhitaji kujenga hii mwenyewe — hii ndiyo kifurushi kinachozalisha:

```xml
<TiraMsg>
<ClaimRejectionResAck>
  <AcknowledgementId>kitambulisho-chako-cha-kipekee</AcknowledgementId>
  <ResponseId>TIRA22424232355</ResponseId>
  <AcknowledgementStatusCode>TIRA001</AcknowledgementStatusCode>
  <AcknowledgementStatusDesc>Successful</AcknowledgementStatusDesc>
</ClaimRejectionResAck>
<MsgSignature>sahihi-iliyosimbwa-base64...</MsgSignature>
</TiraMsg>
```

### Mfano

```js
const { v4: uuid } = require("uuid");

app.post("/tira/claim-rejection-callback", async (req, res) => {
  const result = await tira.claimRejection.handleCallback(req.body);

  // Shughulikia data ya callback...
  await saveToDatabase(result.extracted);

  // Jenga XML ya uthibitisho
  const ackXml = tira.acknowledge(result.body, uuid());

  // Itume kama jibu la HTTP
  res.set("Content-Type", "application/xml").send(ackXml);
});
```

::: warning Thibitisha daima
Hata kama kushughulikia data ya callback kumeshindikana, bado unapaswa kuthibitisha. Funga tu mantiki yako ya biashara kwenye try-catch — uchambuzi wa callback na uthibitisho lazima uendeshe daima:

```js
app.post("/tira/claim-rejection-callback", async (req, res) => {
  const result = await tira.claimRejection.handleCallback(req.body);

  try {
    await saveToDatabase(result.extracted);
  } catch (err) {
    console.error("Kosa la kuhifadhi kwenye database:", err);
  }

  // Inaendesha daima, bila kujali kama usindikaji wako umefanikiwa
  const ackXml = tira.acknowledge(result.body, uuid());
  res.set("Content-Type", "application/xml").send(ackXml);
});
```

:::

::: danger Kutothibitisha mara kwa mara
TIRA inafuatilia majibu ya uthibitisho. Kushindwa kuthibitisha callback mara kwa mara kunaweza kusababisha TIRA kuchukua hatua dhidi ya ujumuishaji wako. Hakikisha daima endpoint yako ya callback inathibitisha kila callback inayoipokea.
:::

## Kazi ya .handleCallback()

```ts
await tira.claimRejection.handleCallback(input: string | Record<string, any>): Promise<CallbackResult<ClaimRejectionCallbackResponse>>
```

Kazi hii inachanganua XML ya callback ambayo TIRA inatuma kwa callback URL yako na kutoa data husika. Unaweza pia kutumia `tira.handleCallback()` ya jumla ikiwa una endpoint moja kwa aina zote za callback.

### Inachofanya

1. **Inathibitisha sahihi** — inaangalia kama `<MsgSignature>` ya callback inalingana na ufunguo wa umma wa TIRA (ikiwa uthibitishaji wa sahihi umesanidiwa)
2. **Inachanganua XML** — inabadilisha XML ghafi kuwa kitu cha JavaScript
3. **Inatoa data** — inachota sehemu unazozihitaji (`response_status_code`, `response_id`, n.k.) kuwa kitu safi cha `extracted`

### Ingizo

Unaweza kutuma ama:

- **String ya XML ghafi** — `req.body` kutoka kwa handler yako ya Express (inahitaji middleware ya `express.text({ type: "application/xml" })`)
- **Kitu kilichochanganuliwa** — ikiwa tayari umechanganua XML mwenyewe

### Inarudisha Nini

| Sehemu               | Aina                               | Maelezo                                                                             |
| -------------------- | ---------------------------------- | ----------------------------------------------------------------------------------- |
| `type`               | `"claim_rejection"`                | Daima `"claim_rejection"` kwa handler hii                                           |
| `extracted`          | `ClaimRejectionCallbackResponse`   | Data iliyotolewa (tazama [Jibu la Callback](#jibu-la-callback-la-submit))           |
| `body`               | `Record<string, any>`              | XML iliyochanganuliwa kamili kama kitu cha JS — ipitishe kwa `tira.acknowledge()`   |
| `signature_verified` | `boolean`                          | Kama sahihi ya kidijitali ya TIRA ilithibitishwa                                    |
| `raw_xml`            | `string`                           | String ya XML ya asili                                                              |

### Handler ya Rasilimali Maalum vs ya Jumla

| Njia                 | Mbinu                                         | Wakati wa Kutumia                                                                              |
| -------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Ya rasilimali maalum | `tira.claimRejection.handleCallback(input)`   | Ukiwa na endpoint tofauti kwa kila aina ya rasilimali                                          |
| Ya jumla             | `tira.handleCallback(input)`                  | Ukiwa na endpoint moja kwa callback zote za TIRA (inahitaji `enabled_callbacks` kwenye config) |

Zote mbili zinarudisha data sawa. Handler ya jumla inagundua aina ya callback kiotomatiki. Tazama [Callback na Uthibitisho](/sw/callbacks-acknowledgements) kwa maelezo ya handler ya jumla.

## Mfano Kamili

Programu kamili ya Express.js inayotuma kukataliwa kwa madai, kushughulikia callback, na kuthibitisha.

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

// Tuma kukataliwa kwa madai
app.post("/submit-claim-rejection", async (req, res) => {
  const result = await tira.claimRejection.submit({
    request_id: uuid(),
    callback_url: "https://your-server.com/tira/claim-rejection-callback",
    insurer_company_code: "IC100",
    claim_rejection_number: req.body.claim_rejection_number,
    claim_reference_number: req.body.claim_reference_number,
    claim_intimation_number: req.body.claim_intimation_number,
    covernote_reference_number: req.body.covernote_reference_number,
    rejection_date: req.body.rejection_date,
    rejection_reason: req.body.rejection_reason,
    claim_resulted_litigation: req.body.claim_resulted_litigation,
    claim_amount: req.body.claim_amount,
    currency_code: req.body.currency_code,
    exchange_rate: req.body.exchange_rate,
    claimants: req.body.claimants,
  });

  res.json({
    message: "Imetumwa kwa TIRA",
    acknowledgement_id: result.acknowledgement_id,
    status: result.tira_status_code,
  });
});

// Shughulikia callback ya TIRA na uthibitishe
app.post("/tira/claim-rejection-callback", async (req, res) => {
  const result = await tira.claimRejection.handleCallback(req.body);

  try {
    await db.claimRejections.update({
      where: { request_id: result.extracted.request_id },
      data: { status: result.extracted.response_status_code },
    });
  } catch (err) {
    console.error("Kosa la kuhifadhi kwenye database:", err);
  }

  // Thibitisha — daima, bila kujali kama usindikaji umefanikiwa
  const ackXml = tira.acknowledge(result.body, uuid());
  res.set("Content-Type", "application/xml").send(ackXml);
});

app.listen(3000);
```

## Hali Maalum

### Fedha na Kiwango cha Ubadilishaji

Tofauti na rasilimali nyingine za madai, `currency_code` na `exchange_rate` zote ni sehemu zinazohitajika kwa kukataliwa kwa madai — hakuna chaguomsingi. Lazima uzitoe daima.

```js
// TZS (fedha ya ndani)
{
  currency_code: "TZS",
  exchange_rate: 1.0,
  claim_amount: 20000000,
}

// Fedha ya kigeni
{
  currency_code: "USD",
  exchange_rate: 2000.0, // 1 USD = 2000 TZS
  claim_amount: 20000,
}
```

`claim_amount` inapaswa kuwa katika fedha iliyoainishwa. Kiwango cha ubadilishaji kinafomatiwa kwa desimali 2 kwenye XML.

### Wadai Waliorahisishwa

Tofauti na [Madai ya Awali](/sw/claim-intimation) ambayo inahitaji maelezo kamili ya wadai (jina, tarehe ya kuzaliwa, anwani, nambari ya simu, n.k.), kukataliwa kwa madai kunatumia muundo rahisi wa wadai wenye sehemu 4 tu:

```js
claimants: [
  {
    claimant_category: "1", // Mwenye bima
    claimant_type: "1",     // Mtu binafsi
    claimant_id_number: "24241241",
    claimant_id_type: "1",  // NIN
  },
]
```

Hii ni kwa sababu maelezo ya wadai yalishachukuliwa wakati wa hatua ya madai ya awali.

## Makosa ya Kuzingatia

::: danger Kusahau kuthibitisha callback
TIRA inarudia callback bila kikomo hadi uthibitishe. Daima ita `tira.acknowledge(result.body, uuid())` na rudisha XML, hata kama kushughulikia data ya callback kumeshindikana.
:::

::: danger Kukosa middleware ya XML
Bila `express.text({ type: "application/xml" })`, `req.body` ya callback yako itakuwa tupu na uchambuzi utashindikana. Ongeza middleware hii kabla ya route yako ya callback.
:::

::: danger Kuchanganya uthibitisho wa utumaji na idhini
`"TIRA001"` kwenye jibu la utumaji inamaanisha "imepokelewa", si "imekubaliwa". Idhini au kukataliwa halisi kunakuja baadaye kupitia callback. Usifanye utumaji uliofanikiwa kama uthibitisho kwamba kukataliwa kumerekodiwa.
:::

::: danger URL ya callback isiyo sahihi
`callback_url` lazima iwe URL halali inayopatikana kwa umma. Kifurushi kinathibitisha fomati ya URL kabla ya kutuma. Ikiwa URL imeundwa vibaya, utapata `TiraValidationError`. Ikiwa ni halali lakini haifikiswi na TIRA, hutapokea callback kamwe.
:::

::: danger Nambari za kumbukumbu za madai zinazokosekana
`claim_reference_number` lazima iwe ile iliyorudishwa na TIRA kwenye callback ya taarifa ya madai, `claim_intimation_number` lazima ilingane na madai ya awali yaliyotumwa, na `covernote_reference_number` lazima irejelee covernote halali. Kutumia nambari za kumbukumbu zisizo sahihi au zinazokosekana kutasababisha TIRA kukataa utumaji.
:::

::: danger Safu tupu ya wadai
Angalau mdai mmoja anahitajika. Kutuma safu tupu au kuacha `claimants` kutatupa `TiraValidationError`.
:::

## Kurasa Zinazohusiana

- [Callback na Uthibitisho](/sw/callbacks-acknowledgements) — Mzunguko kamili wa callback
- [Usainiaji na Uthibitishaji](/sw/signing-verification) — Jinsi sahihi za kidijitali zinavyofanya kazi
- [Misimbo ya Makosa](/sw/error-codes) — Misimbo yote ya hali ya TIRA na marekebisho
- [Uanzishaji](/sw/initialization) — Kuweka mteja wa Tira
