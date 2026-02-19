# Tathmini ya Madai (Claim Assessment)

Rasilimali ya Tathmini ya Madai inashughulikia utumaji wa tathmini za madai kwa TIRA. Tumia `tira.claimAssessment` kutuma maelezo ya tathmini — ikijumuisha kiasi cha tathmini, taarifa za idhini, na maelezo ya wadai — dhidi ya kumbukumbu ya dai iliyopo, na kushughulikia majibu ya callback ya TIRA.

Kwa mtiririko wa jumla wa kutuma-callback-kuthibitisha, tazama [Callback na Uthibitisho](/sw/callbacks-acknowledgements).

## Mbinu Zinazopatikana

| Mbinu                                        | Maelezo                                       | Wakati wa Kutumia                                                  | Inarudisha                                        |
| -------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------- |
| `tira.claimAssessment.submit(payload)`       | Tuma tathmini ya madai kwa TIRA               | Baada ya madai ya awali kutumwa na matokeo ya tathmini yapo tayari | `ClaimAssessmentResponse`                         |
| `tira.claimAssessment.handleCallback(input)` | Chambua na kutoa data kutoka callback ya TIRA | TIRA inapotuma matokeo ya utumaji wako kwa callback URL yako       | `CallbackResult<ClaimAssessmentCallbackResponse>` |

## Mzigo wa .submit()

```ts
await tira.claimAssessment.submit(payload): Promise<ClaimAssessmentResponse>
```

Inatuma tathmini ya madai kwa TIRA. Hii ni operesheni ya **asynchronous** — unapata uthibitisho mara moja, na matokeo halisi yanakuja baadaye kupitia callback URL yako.

**Endpoint:** `POST /eclaim/api/claim/claim-assessment/v1/request`

### Sehemu za Tathmini ya Madai

| Sehemu                       | Aina               | Inahitajika | Chaguomsingi | XML Tag                    | Maelezo                                                                              |
| ---------------------------- | ------------------ | ----------- | ------------ | -------------------------- | ------------------------------------------------------------------------------------ |
| `request_id`                 | `string`           | Ndiyo       | —            | `RequestId`                | Kitambulisho cha kipekee cha ombi                                                    |
| `callback_url`               | `string`           | Ndiyo       | —            | `CallBackUrl`              | TIRA inapotuma matokeo                                                               |
| `insurer_company_code`       | `string`           | Ndiyo       | —            | `InsurerCompanyCode`       | Nambari ya kampuni ya bima                                                           |
| `claim_assessment_number`    | `string`           | Ndiyo       | —            | `ClaimAssessmentNumber`    | Nambari ya tathmini ya madai kwa mujibu wa bima. String(50).                         |
| `claim_intimation_number`    | `string`           | Ndiyo       | —            | `ClaimIntimationNumber`    | Nambari ya madai ya awali ambayo tathmini hii inahusiana nayo. String(50).           |
| `claim_reference_number`     | `string`           | Ndiyo       | —            | `ClaimReferenceNumber`     | Nambari ya kumbukumbu ya madai ya TIRA kutoka taarifa ya madai. String(50).          |
| `covernote_reference_number` | `string`           | Ndiyo       | —            | `CoverNoteReferenceNumber` | Nambari ya kumbukumbu ya covernote ya TIRA ambayo dai linapinga. String(50).         |
| `assessment_received_date`   | `string\|Date`     | Ndiyo       | —            | `AssessmentReceivedDate`   | Tarehe tathmini ilipokelewa. Tazama [Utumaji wa Tarehe](#utumaji-wa-tarehe).         |
| `assessment_report_summary`  | `string`           | Ndiyo       | —            | `AssessmentReportSummary`  | Muhtasari wa ripoti ya tathmini. String(1000).                                       |
| `currency_code`              | `string`           | Hapana      | `"TZS"`      | `CurrencyCode`             | Msimbo wa fedha wa ISO 4217.                                                         |
| `exchange_rate`              | `number`           | Hapana      | `1.0`        | `ExchangeRate`             | Kiwango cha ubadilishaji hadi TZS. Kinafomatiwa kwa desimali 2.                      |
| `assessment_amount`          | `number`           | Ndiyo       | —            | `AssessmentAmount`         | Kiasi cha jumla cha tathmini. Numeric(36,2).                                         |
| `approved_claim_amount`      | `number`           | Ndiyo       | —            | `ApprovedClaimAmount`      | Kiasi cha dai kilichoidhinishwa. Numeric(36,2).                                      |
| `claim_approval_date`        | `string\|Date`     | Ndiyo       | —            | `ClaimApprovalDate`        | Tarehe na muda dai lilipoidhinishwa. Tazama [Utumaji wa Tarehe](#utumaji-wa-tarehe). |
| `claim_approval_authority`   | `string`           | Ndiyo       | —            | `ClaimApprovalAuthority`   | Mamlaka iliyoidhinisha dai (mf. "CEO"). String(100).                                 |
| `is_re_assessment`           | `"Y"\|"N"`         | Ndiyo       | —            | `IsReAssessment`           | Kama hii ni tathmini ya kurudia. Y=Ndiyo, N=Hapana.                                  |
| `claimants`                  | `SimpleClaimant[]` | Ndiyo       | —            | `Claimants > Claimant`     | Angalau mdai mmoja anahitajika. Tazama [Wadai](#wadai).                              |

::: info Sehemu za kichwa zinazojazwa kiotomatiki
Sehemu za kichwa cha XML `CompanyCode` na `SystemCode` zinajazwa kiotomatiki kutoka kwenye usanidi wako wa Tira — huhitaji kuzijumuisha kwenye mzigo.
:::

### Wadai

Kila mdai kwenye safu ya `claimants` ana sehemu zifuatazo:

| Sehemu               | Aina          | Inahitajika | Chaguomsingi | XML Tag            | Maelezo                                                                     |
| -------------------- | ------------- | ----------- | ------------ | ------------------ | --------------------------------------------------------------------------- |
| `claimant_category`  | `"1"\|"2"`    | Ndiyo       | —            | `ClaimantCategory` | 1=Mwenye bima, 2=Upande wa Tatu.                                            |
| `claimant_type`      | `"1"\|"2"`    | Ndiyo       | —            | `ClaimantType`     | 1=Mtu binafsi, 2=Kampuni.                                                   |
| `claimant_id_number` | `string`      | Ndiyo       | —            | `ClaimantIdNumber` | Nambari ya kitambulisho. String(50).                                        |
| `claimant_id_type`   | `"1"\|…\|"7"` | Ndiyo       | —            | `ClaimantIdType`   | Aina ya kitambulisho. Tazama [Aina za Kitambulisho](#aina-za-kitambulisho). |

::: info Wadai waliorahisishwa
Tathmini ya madai inatumia muundo rahisi wa wadai (`SimpleClaimant`) wenye sehemu 4 tu. Hii ni tofauti na [Madai ya Awali](/sw/claim-intimation), ambayo inahitaji maelezo kamili ya wadai (jina, tarehe ya kuzaliwa, anwani, simu, n.k.).
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

### Utumaji wa Tarehe

Kifurushi kinabadilisha tarehe kiotomatiki kuwa Saa za Afrika Mashariki (UTC+3) na kuzifomati kama `YYYY-MM-DDTHH:mm:ss` (bila kiambishi cha eneo la saa). Unaweza kutuma string ya ISO au kitu cha JavaScript `Date`.

::: tip Mfano
Ukituma `"2020-09-10T10:55:22Z"` (10:55 asubuhi UTC), kifurushi kinabadilisha kuwa `"2020-09-10T13:55:22"` (1:55 alasiri EAT).
:::

### Sheria za Uthibitishaji

Kifurushi kinathibitisha mzigo wako kabla ya kuutuma kwa TIRA. Uthibitishaji ukishindikana, kinatupa `TiraValidationError` na jina la sehemu na ujumbe wa maelezo.

- `request_id`, `insurer_company_code`, `claim_assessment_number`, `claim_intimation_number`, `claim_reference_number`, `covernote_reference_number`, `assessment_report_summary`, `claim_approval_authority` — zote ni string zinazohitajika
- `callback_url` — inahitajika na lazima iwe URL halali
- `assessment_received_date`, `claim_approval_date` — lazima ziwe string za tarehe halali (fomati ya ISO) au vitu vya `Date`
- `assessment_amount`, `approved_claim_amount` — lazima ziwe nambari halali
- `is_re_assessment` — lazima iwe `"Y"` au `"N"`
- `claimants` — angalau mdai mmoja anahitajika
- Kwa kila mdai: `claimant_id_number` inahitajika; `claimant_category` lazima iwe `"1"` au `"2"`; `claimant_type` lazima iwe `"1"` au `"2"`; `claimant_id_type` lazima iwe aina halali ya kitambulisho (`"1"` hadi `"7"`)

### Mfano — Kutuma Tathmini ya Madai

```js
const result = await tira.claimAssessment.submit({
  request_id: "AB3232532523344",
  callback_url: "https://your-server.com/tira/claim-assessment-callback",
  insurer_company_code: "IC100",
  claim_assessment_number: "322WQ25234234",
  claim_intimation_number: "35234234",
  claim_reference_number: "10020-25400-07720",
  covernote_reference_number: "10020-25400-07720",
  assessment_received_date: "2020-09-10T13:55:22",
  assessment_report_summary:
    "Tathmini ya uharibifu wa gari imekamilika. Kichungi cha mbele na taa zinahitaji kubadilishwa.",
  currency_code: "USD",
  exchange_rate: 2000.0,
  assessment_amount: 20000.0,
  approved_claim_amount: 20000.0,
  claim_approval_date: "2020-09-10T13:55:22",
  claim_approval_authority: "CEO",
  is_re_assessment: "Y",
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

Unapoita `tira.claimAssessment.submit()`, unapata `ClaimAssessmentResponse` mara moja kutoka TIRA:

| Sehemu                     | Aina                      | Maelezo                                                         |
| -------------------------- | ------------------------- | --------------------------------------------------------------- |
| `acknowledgement_id`       | `string`                  | Kitambulisho cha uthibitisho cha TIRA                           |
| `request_id`               | `string`                  | Kitambulisho chako cha ombi (kinarudishwa)                      |
| `tira_status_code`         | `string`                  | Msimbo wa hali — `"TIRA001"` inamaanisha imepokelewa            |
| `tira_status_desc`         | `string`                  | Maelezo yanayosomeka                                            |
| `requires_acknowledgement` | `boolean`                 | Daima `true`                                                    |
| `acknowledgement_payload`  | `Record<string, unknown>` | Mzigo wa uthibitisho uliochanganuliwa (mara chache unahitajika) |

::: tip "TIRA001" inamaanisha "imepokelewa", si "imekubaliwa"
Katika hatua hii, `"TIRA001"` inamaanisha TIRA imepokea ombi lako na linashughulikiwa. **Haimaanishi** tathmini yako ya madai imekubaliwa. Matokeo halisi yanakuja baadaye kupitia callback URL yako.

Ukipata msimbo tofauti na `"TIRA001"`, kuna kosa limetokea kwenye utumaji wenyewe. Angalia ukurasa wa [Misimbo ya Makosa](/sw/error-codes) kwa msimbo husika.
:::

## Jibu la Callback la .submit()

Baada ya TIRA kushughulikia utumaji wako, inatuma matokeo kwa `callback_url` yako. Callback ina matokeo halisi — kama tathmini yako ya madai imekubaliwa au imekataliwa.

### Data Iliyotolewa

Sehemu ya `extracted` ina data ya callback iliyochanganuliwa:

| Sehemu                 | Aina     | Maelezo                                                                                     |
| ---------------------- | -------- | ------------------------------------------------------------------------------------------- |
| `response_id`          | `string` | Kitambulisho cha jibu la TIRA                                                               |
| `request_id`           | `string` | Kitambulisho chako cha ombi                                                                 |
| `response_status_code` | `string` | `"TIRA001"` = imekubaliwa. Tazama [Misimbo ya Makosa](/sw/error-codes) kwa misimbo mingine. |
| `response_status_desc` | `string` | Maelezo ya hali yanayosomeka                                                                |

### Ikiwa Imefanikiwa

Wakati `response_status_code` ni `"TIRA001"`, tathmini ya madai imekubaliwa.

```js
// response_status_code === "TIRA001"
console.log(result.extracted.response_status_code); // "TIRA001"
console.log(result.extracted.response_status_desc); // "Successful"
console.log(result.extracted.request_id); // "AB3232532523344"
```

### Ikiwa Kuna Kosa

Wakati `response_status_code` ni kitu kingine tofauti na `"TIRA001"`, tathmini ya madai imekataliwa. Angalia ukurasa wa [Misimbo ya Makosa](/sw/error-codes) kwa msimbo husika.

```js
// response_status_code !== "TIRA001"
console.log(result.extracted.response_status_code); // mf. "TIRA020"
console.log(result.extracted.response_status_desc); // mf. "Invalid request"
```

### Mfano — Kushughulikia Callback

```js
app.post("/tira/claim-assessment-callback", async (req, res) => {
  const result = await tira.claimAssessment.handleCallback(req.body);

  if (result.extracted.response_status_code === "TIRA001") {
    await db.claimAssessments.update({
      where: { request_id: result.extracted.request_id },
      data: { status: "accepted" },
    });
  } else {
    console.error(
      `Tathmini ya madai imekataliwa: ${result.extracted.response_status_code}`,
      result.extracted.response_status_desc,
    );

    await db.claimAssessments.update({
      where: { request_id: result.extracted.request_id },
      data: {
        status: "rejected",
        rejection_code: result.extracted.response_status_code,
        rejection_reason: result.extracted.response_status_desc,
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

1. Kinapata jina sahihi la tag ya uthibitisho (`ClaimAssessmentRes` → `ClaimAssessmentResAck`)
2. Kinajaza `AcknowledgementId`, `ResponseId`, `AcknowledgementStatusCode`, na `AcknowledgementStatusDesc`
3. Kinasaini XML kwa ufunguo wako wa faragha
4. Kinafunga kwenye `<TiraMsg>` na `<MsgSignature>`

### XML Inavyoonekana

Huhitaji kujenga hii mwenyewe — hii ndiyo kifurushi kinachozalisha:

```xml
<TiraMsg>
<ClaimAssessmentResAck>
  <AcknowledgementId>kitambulisho-chako-cha-kipekee</AcknowledgementId>
  <ResponseId>TIRA22424232355</ResponseId>
  <AcknowledgementStatusCode>TIRA001</AcknowledgementStatusCode>
  <AcknowledgementStatusDesc>Successful</AcknowledgementStatusDesc>
</ClaimAssessmentResAck>
<MsgSignature>sahihi-iliyosimbwa-base64...</MsgSignature>
</TiraMsg>
```

### Mfano

```js
const { v4: uuid } = require("uuid");

app.post("/tira/claim-assessment-callback", async (req, res) => {
  const result = await tira.claimAssessment.handleCallback(req.body);

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
app.post("/tira/claim-assessment-callback", async (req, res) => {
  const result = await tira.claimAssessment.handleCallback(req.body);

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
await tira.claimAssessment.handleCallback(input: string | Record<string, any>): Promise<CallbackResult<ClaimAssessmentCallbackResponse>>
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

| Sehemu               | Aina                              | Maelezo                                                                           |
| -------------------- | --------------------------------- | --------------------------------------------------------------------------------- |
| `type`               | `"claim_assessment"`              | Daima `"claim_assessment"` kwa handler hii                                        |
| `extracted`          | `ClaimAssessmentCallbackResponse` | Data iliyotolewa (tazama [Jibu la Callback](#jibu-la-callback-la-submit))         |
| `body`               | `Record<string, any>`             | XML iliyochanganuliwa kamili kama kitu cha JS — ipitishe kwa `tira.acknowledge()` |
| `signature_verified` | `boolean`                         | Kama sahihi ya kidijitali ya TIRA ilithibitishwa                                  |
| `raw_xml`            | `string`                          | String ya XML ya asili                                                            |

### Handler ya Rasilimali Maalum vs ya Jumla

| Njia                 | Mbinu                                        | Wakati wa Kutumia                                                                              |
| -------------------- | -------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Ya rasilimali maalum | `tira.claimAssessment.handleCallback(input)` | Ukiwa na endpoint tofauti kwa kila aina ya rasilimali                                          |
| Ya jumla             | `tira.handleCallback(input)`                 | Ukiwa na endpoint moja kwa callback zote za TIRA (inahitaji `enabled_callbacks` kwenye config) |

Zote mbili zinarudisha data sawa. Handler ya jumla inagundua aina ya callback kiotomatiki. Tazama [Callback na Uthibitisho](/sw/callbacks-acknowledgements) kwa maelezo ya handler ya jumla.

## Mfano Kamili

Programu kamili ya Express.js inayotuma tathmini ya madai, kushughulikia callback, na kuthibitisha.

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

// Tuma tathmini ya madai
app.post("/submit-claim-assessment", async (req, res) => {
  const result = await tira.claimAssessment.submit({
    request_id: uuid(),
    callback_url: "https://your-server.com/tira/claim-assessment-callback",
    insurer_company_code: "IC100",
    claim_assessment_number: req.body.claim_assessment_number,
    claim_intimation_number: req.body.claim_intimation_number,
    claim_reference_number: req.body.claim_reference_number,
    covernote_reference_number: req.body.covernote_reference_number,
    assessment_received_date: req.body.assessment_received_date,
    assessment_report_summary: req.body.assessment_report_summary,
    currency_code: req.body.currency_code,
    exchange_rate: req.body.exchange_rate,
    assessment_amount: req.body.assessment_amount,
    approved_claim_amount: req.body.approved_claim_amount,
    claim_approval_date: req.body.claim_approval_date,
    claim_approval_authority: req.body.claim_approval_authority,
    is_re_assessment: req.body.is_re_assessment,
    claimants: req.body.claimants,
  });

  res.json({
    message: "Imetumwa kwa TIRA",
    acknowledgement_id: result.acknowledgement_id,
    status: result.tira_status_code,
  });
});

// Shughulikia callback ya TIRA na uthibitishe
app.post("/tira/claim-assessment-callback", async (req, res) => {
  const result = await tira.claimAssessment.handleCallback(req.body);

  try {
    await db.claimAssessments.update({
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

### Tathmini ya Kurudia

Sehemu ya `is_re_assessment` inaonyesha kama tathmini hii inatumwa kwa mara ya kwanza au ni ufuatiliaji wa tathmini ya awali. Weka `"Y"` wakati wa kutuma tena tathmini (mf. baada ya uchunguzi wa ziada au mzozo), na `"N"` kwa tathmini ya mwanzo.

```js
{
  is_re_assessment: "Y", // Hii ni tathmini ya ufuatiliaji
  // ...sehemu nyingine
}
```

### Fedha na Kiwango cha Ubadilishaji

Kwa chaguomsingi, `currency_code` ni `"TZS"` na `exchange_rate` ni `1.0`. Ikiwa dai linahusisha fedha za kigeni:

```js
{
  currency_code: "USD",
  exchange_rate: 2000.0, // 1 USD = 2000 TZS
  assessment_amount: 20000.0,
  approved_claim_amount: 20000.0,
}
```

`assessment_amount` na `approved_claim_amount` zinapaswa kuwa katika fedha iliyoainishwa. Kiwango cha ubadilishaji kinafomatiwa kwa desimali 2 kwenye XML.

### Wadai Waliorahisishwa

Tofauti na [Madai ya Awali](/sw/claim-intimation) ambayo inahitaji maelezo kamili ya wadai (jina, tarehe ya kuzaliwa, anwani, nambari ya simu, n.k.), tathmini ya madai inatumia muundo rahisi wa wadai wenye sehemu 4 tu:

```js
claimants: [
  {
    claimant_category: "1", // Mwenye bima
    claimant_type: "1", // Mtu binafsi
    claimant_id_number: "24241241",
    claimant_id_type: "1", // NIN
  },
];
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
`"TIRA001"` kwenye jibu la utumaji inamaanisha "imepokelewa", si "imekubaliwa". Idhini au kukataliwa halisi kunakuja baadaye kupitia callback. Usiwaambie watumiaji wako tathmini ya madai imekubaliwa wakati wa utumaji.
:::

::: danger URL ya callback isiyo sahihi
`callback_url` lazima iwe URL halali inayopatikana kwa umma. Kifurushi kinathibitisha fomati ya URL kabla ya kutuma. Ikiwa URL imeundwa vibaya, utapata `TiraValidationError`. Ikiwa ni halali lakini haifikiswi na TIRA, hutapokea callback kamwe.
:::

::: danger Nambari za kumbukumbu za madai zinazokosekana
`claim_reference_number` lazima iwe ile iliyorudishwa na TIRA kwenye callback ya taarifa ya madai, na `claim_intimation_number` lazima ilingane na madai ya awali yaliyotumwa hapo awali. Kutumia nambari za kumbukumbu zisizo sahihi au zinazokosekana kutasababisha TIRA kukataa tathmini.
:::

::: danger Safu tupu ya wadai
Angalau mdai mmoja anahitajika. Kutuma safu tupu au kuacha `claimants` kutatupa `TiraValidationError`.
:::

## Kurasa Zinazohusiana

- [Callback na Uthibitisho](/sw/callbacks-acknowledgements) — Mzunguko kamili wa callback
- [Usainiaji na Uthibitishaji](/sw/signing-verification) — Jinsi sahihi za kidijitali zinavyofanya kazi
- [Misimbo ya Makosa](/sw/error-codes) — Misimbo yote ya hali ya TIRA na marekebisho
- [Uanzishaji](/sw/initialization) — Kuweka mteja wa Tira
