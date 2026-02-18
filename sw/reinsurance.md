# Bima ya Kurudisha

Rasilimali ya Bima ya Kurudisha inashughulikia utumaji wa maelezo ya bima ya kurudisha kwa TIRA kwa covernote zilizotumwa hapo awali. Tumia `tira.reinsurance` kutuma mipango ya bima ya kurudisha (facultative outward na inward) na kushughulikia majibu ya callback ya TIRA.

Kwa mtiririko wa jumla wa kutuma-callback-kuthibitisha, tazama [Callback na Uthibitisho](/sw/callbacks-acknowledgements).

## Mbinu Zinazopatikana

| Mbinu | Maelezo | Wakati wa Kutumia | Inarudisha |
|---|---|---|---|
| `tira.reinsurance.submit(payload)` | Tuma maelezo ya bima ya kurudisha kwa covernote iliyotumwa hapo awali | Unapotaka kuripoti mipango ya bima ya kurudisha kwa TIRA | `ReinsuranceResponse` |
| `tira.reinsurance.handleCallback(input)` | Chambua na kutoa data kutoka callback ya TIRA | TIRA inapotuma matokeo ya utumaji wako kwa callback URL yako | `CallbackResult<ReinsuranceCallbackResponse>` |

## Mzigo wa .submit()

```ts
await tira.reinsurance.submit(payload): Promise<ReinsuranceResponse>
```

Inatuma maelezo ya bima ya kurudisha kwa TIRA kwa covernote iliyotumwa hapo awali. Hii ni operesheni ya asynchronous — unapata uthibitisho mara moja, na matokeo halisi yanakuja baadaye kupitia callback URL yako.

**Endpoint:** `POST /ecovernote/api/reinsurance/v1/request`

### Aina za Bima ya Kurudisha

| Thamani | Aina | Maelezo |
|---|---|---|
| `"1"` | Facultative Outward | Kupeleka hatari kwa mwingine wa bima ya kurudisha |
| `"2"` | Facultative Inward | Kupokea hatari kutoka kwa mbima mwingine |

### Sehemu za Kichwa cha Bima ya Kurudisha

Hizi ni sehemu za kiwango cha juu katika mzigo wa utumaji.

| Sehemu | Aina | Inahitajika | Chaguomsingi | XML Tag | Maelezo |
|---|---|---|---|---|---|
| `request_id` | `string` | Ndiyo | — | `RequestId` | Kitambulisho cha kipekee cha ombi |
| `callback_url` | `string` | Ndiyo | — | `CallBackUrl` | Mahali TIRA inatuma matokeo |
| `insurer_company_code` | `string` | Ndiyo | — | `InsurerCompanyCode` | Msimbo wa kampuni ya bima |
| `covernote_reference_number` | `string` | Ndiyo | — | `CoverNoteReferenceNumber` | Nambari ya rejea kutoka covernote iliyotumwa hapo awali |
| `premium_including_tax` | `number` | Ndiyo | — | `PremiumIncludingTax` | Primi jumla ikiwa na kodi. Desimali 2. |
| `currency_code` | `string` | Hapana | `"TZS"` | `CurrencyCode` | Msimbo wa sarafu ya ISO |
| `exchange_rate` | `number` | Hapana | `1.0` | `ExchangeRate` | Kiwango cha ubadilishaji kwa TZS. Desimali 2. |
| `authorizing_officer_name` | `string` | Ndiyo | — | `AuthorizingOfficerName` | Jina la afisa anayeidhinisha |
| `authorizing_officer_title` | `string` | Ndiyo | — | `AuthorizingOfficerTitle` | Cheo cha afisa anayeidhinisha |
| `reinsurance_category` | `"1"\|"2"` | Ndiyo | — | `ReinsuranceCategory` | 1=Facultative Outward, 2=Facultative Inward |
| `reinsurance_details` | `ReinsuranceDetail[]` | Ndiyo | — | `ReinsuranceDtl` | Angalau moja inahitajika. Tazama [Sehemu za Maelezo ya Bima ya Kurudisha](#sehemu-za-maelezo-ya-bima-ya-kurudisha). |

### Sehemu za Maelezo ya Bima ya Kurudisha

Kila kipengele katika safu ya `reinsurance_details` kinawekwa kwenye kipengele cha XML `<ReinsuranceDtl>`. Angalau kimoja kinahitajika.

| Sehemu | Aina | Inahitajika | XML Tag | Maelezo |
|---|---|---|---|---|
| `participant_code` | `string` | Ndiyo | `ParticipantCode` | Msimbo wa mshiriki uliotolewa na TIRA |
| `participant_type` | `"1"`–`"7"` | Ndiyo | `ParticipantType` | Tazama [Aina za Washiriki](#aina-za-washiriki) |
| `reinsurance_form` | `"1"`–`"3"` | Ndiyo | `ReinsuranceForm` | Tazama [Aina za Fomu za Bima ya Kurudisha](#aina-za-fomu-za-bima-ya-kurudisha) |
| `reinsurance_type` | `"1"`–`"8"` | Ndiyo | `ReinsuranceType` | Tazama [Aina za Bima ya Kurudisha](#aina-za-bima-ya-kurudisha-1) |
| `re_broker_code` | `string` | Ndiyo | `ReBrokerCode` | Msimbo wa dalali wa bima ya kurudisha. Hutolewa na TIRA. |
| `brokerage_commission` | `number` | Ndiyo | `BrokerageCommission` | Kiasi cha kamisheni ya udalalishi. Desimali 2. |
| `reinsurance_commission` | `number` | Ndiyo | `ReinsuranceCommission` | Kiasi cha kamisheni ya bima ya kurudisha. Desimali 2. |
| `premium_share` | `number` | Ndiyo | `PremiumShare` | Kiasi cha mgao wa primi. Desimali 2. |
| `participation_date` | `string\|Date` | Ndiyo | `ParticipationDate` | Tarehe ya ushiriki katika muundo wa ISO au kitu cha Date. Tazama [Usimamizi wa Tarehe](#usimamizi-wa-tarehe). |

### Aina za Washiriki

| Thamani | Maelezo |
|---|---|
| `"1"` | Leader |
| `"2"` | Treaty Cession |
| `"3"` | Policy Cession Outward |
| `"4"` | Facultative Outward Local |
| `"5"` | Facultative Outward Foreign |
| `"6"` | Facultative Inward Local |
| `"7"` | Facultative Inward Foreign |

### Aina za Fomu za Bima ya Kurudisha

| Thamani | Maelezo |
|---|---|
| `"1"` | Policy Cession |
| `"2"` | Treaty Cession |
| `"3"` | Facultative |

### Aina za Bima ya Kurudisha

| Thamani | Maelezo |
|---|---|
| `"1"` | Fac Proportion — Quota Share |
| `"2"` | Fac Non Proportion — Excess of Loss |
| `"3"` | Fac Proportion — Surplus Treaty |
| `"4"` | Fac Obligatory |
| `"5"` | Treaty Proportion — Quota Share |
| `"6"` | Treaty Proportion — Surplus Treaty |
| `"7"` | Treaty Non Proportion — Excess of Loss |
| `"8"` | Treaty Non Proportion — Stop Loss |

### Usimamizi wa Tarehe

Kifurushi kinabadilisha tarehe kiotomatiki kwenda Saa ya Afrika Mashariki (UTC+3) na kuziumbiza kama `YYYY-MM-DDTHH:mm:ss` (bila kiambishi cha saa za eneo). Unaweza kutoa mfuatano wa ISO au kitu cha JavaScript `Date`.

::: tip Mfano
Ukitoa `"2025-05-31T21:00:00Z"` (saa 9 jioni UTC), kifurushi kinabadilisha kuwa `"2025-06-01T00:00:00"` (usiku wa manane EAT, Juni 1).

Hii inamaanisha ukitaka tarehe ya ushiriki iwe Juni 1 saa za Tanzania, toa `"2025-05-31T21:00:00Z"` au `new Date("2025-05-31T21:00:00Z")`.
:::

### Sheria za Uthibitishaji

Kifurushi kinathibitisha mzigo wako kabla ya kuutuma kwa TIRA. Uthibitishaji ukishindwa, kinatupa `TiraValidationError` na jina la sehemu na ujumbe wa maelezo.

- `request_id` inahitajika
- `callback_url` lazima iwe URL halali
- `insurer_company_code` inahitajika
- `covernote_reference_number` inahitajika
- `premium_including_tax` lazima iwe nambari chanya
- `authorizing_officer_name` inahitajika
- `authorizing_officer_title` inahitajika
- `reinsurance_category` lazima iwe `"1"` au `"2"`
- `reinsurance_details` lazima iwe safu isiyokuwa tupu
- Kwa kila kipengele katika `reinsurance_details`:
  - `participant_code` inahitajika
  - `re_broker_code` inahitajika
  - `participant_type` lazima iwe `"1"` hadi `"7"`
  - `reinsurance_form` lazima iwe `"1"` hadi `"3"`
  - `reinsurance_type` lazima iwe `"1"` hadi `"8"`
  - `brokerage_commission` lazima iwe nambari
  - `reinsurance_commission` lazima iwe nambari
  - `premium_share` lazima iwe nambari
  - `participation_date` lazima iwe mfuatano wa tarehe halali

### Mfano — Bima ya Kurudisha ya Facultative Outward

```js
const result = await tira.reinsurance.submit({
  request_id: "NIC22424232355",
  callback_url: "https://your-server.com/tira/reinsurance-callback",
  insurer_company_code: "ICC103",
  covernote_reference_number: "CN-2025-001",
  premium_including_tax: 619500,
  authorizing_officer_name: "Johnson Abraham",
  authorizing_officer_title: "Manager",
  reinsurance_category: "1", // Facultative Outward
  reinsurance_details: [
    {
      participant_code: "RE001",
      participant_type: "1",  // Leader
      reinsurance_form: "3",  // Facultative
      reinsurance_type: "1",  // Fac Proportion — Quota Share
      re_broker_code: "BRK001",
      brokerage_commission: 5000,
      reinsurance_commission: 10000,
      premium_share: 250000,
      participation_date: "2025-05-31T21:00:00Z",
    },
    {
      participant_code: "RE002",
      participant_type: "4",  // Facultative Outward Local
      reinsurance_form: "3",  // Facultative
      reinsurance_type: "1",  // Fac Proportion — Quota Share
      re_broker_code: "BRK002",
      brokerage_commission: 5000,
      reinsurance_commission: 10000,
      premium_share: 150000,
      participation_date: "2025-05-31T21:00:00Z",
    },
  ],
});

console.log(result.acknowledgement_id); // "ACK123456"
console.log(result.tira_status_code);   // "TIRA001"
```

### Mfano — Bima ya Kurudisha ya Facultative Inward

```js
const result = await tira.reinsurance.submit({
  request_id: "NIC22424232356",
  callback_url: "https://your-server.com/tira/reinsurance-callback",
  insurer_company_code: "ICC103",
  covernote_reference_number: "CN-2025-002",
  premium_including_tax: 450000,
  currency_code: "USD",
  exchange_rate: 2500.00,
  authorizing_officer_name: "Johnson Abraham",
  authorizing_officer_title: "Manager",
  reinsurance_category: "2", // Facultative Inward
  reinsurance_details: [
    {
      participant_code: "RE003",
      participant_type: "6",  // Facultative Inward Local
      reinsurance_form: "3",  // Facultative
      reinsurance_type: "1",  // Fac Proportion — Quota Share
      re_broker_code: "BRK003",
      brokerage_commission: 3000,
      reinsurance_commission: 8000,
      premium_share: 200000,
      participation_date: "2025-06-15T00:00:00Z",
    },
  ],
});
```

## Jibu la .submit()

Unapoita `tira.reinsurance.submit()`, unapata `ReinsuranceResponse` mara moja kutoka TIRA:

| Sehemu | Aina | Maelezo |
|---|---|---|
| `acknowledgement_id` | `string` | Kitambulisho cha uthibitisho cha TIRA |
| `request_id` | `string` | Kitambulisho chako cha ombi (kinarudishwa) |
| `tira_status_code` | `string` | Msimbo wa hali — `"TIRA001"` inamaanisha imepokewa |
| `tira_status_desc` | `string` | Maelezo yanayosomeka |
| `requires_acknowledgement` | `boolean` | Daima `true` |
| `acknowledgement_payload` | `Record<string, unknown>` | Uthibitisho ghafi uliochambuliwa (mara chache unahitajika) |

::: tip "TIRA001" inamaanisha "imepokewa", si "imeidhinishwa"
Katika hatua hii, `"TIRA001"` inamaanisha TIRA imepokea ombi lako na linashughulikiwa. **Haimaanishi** utumaji wako wa bima ya kurudisha umeidhinishwa. Matokeo halisi (imeidhinishwa au imekataliwa) yanakuja baadaye kupitia callback URL yako.

Ukipata msimbo tofauti na `"TIRA001"`, kitu kimekwenda vibaya na utumaji wenyewe. Angalia ukurasa wa [Misimbo ya Makosa](/sw/error-codes) kwa msimbo husika.
:::

## Jibu la Callback la .submit()

Baada ya TIRA kushughulikia utumaji wako, inatuma matokeo kwa `callback_url` yako. Callback ina matokeo halisi — ikiwa utumaji wako wa bima ya kurudisha umeidhinishwa au umekataliwa.

### Data Iliyotolewa

Sehemu ya `extracted` ina data ya callback iliyochambuliwa:

| Sehemu | Aina | Maelezo |
|---|---|---|
| `response_id` | `string` | Kitambulisho cha jibu la TIRA |
| `request_id` | `string` | Kitambulisho chako cha ombi |
| `response_status_code` | `string` | `"TIRA001"` = imeidhinishwa. Tazama [Misimbo ya Makosa](/sw/error-codes) kwa misimbo mingine. |
| `response_status_desc` | `string` | Maelezo ya hali yanayosomeka |

### Ikiwa Imefanikiwa

Wakati `response_status_code` ni `"TIRA001"`, utumaji wa bima ya kurudisha umeidhinishwa.

```js
// response_status_code === "TIRA001"
console.log(result.extracted.response_status_code); // "TIRA001"
console.log(result.extracted.response_status_desc); // "Successful"
```

### Ikiwa Imeshindwa

Wakati `response_status_code` ni kitu chochote kingine isipokuwa `"TIRA001"`, utumaji umekataliwa. Angalia ukurasa wa [Misimbo ya Makosa](/sw/error-codes) kwa msimbo husika.

```js
// response_status_code !== "TIRA001"
console.log(result.extracted.response_status_code); // mf. "TIRA020"
console.log(result.extracted.response_status_desc); // mf. "Invalid request"
```

### Mfano — Kushughulikia Callback

```js
app.post("/tira/reinsurance-callback", async (req, res) => {
  const result = await tira.reinsurance.handleCallback(req.body);

  if (result.extracted.response_status_code === "TIRA001") {
    await db.reinsurance.update({
      where: { request_id: result.extracted.request_id },
      data: { status: "approved" },
    });
  } else {
    console.error(
      `Bima ya kurudisha imekataliwa: ${result.extracted.response_status_code}`,
      result.extracted.response_status_desc
    );

    await db.reinsurance.update({
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

TIRA inatarajia uthibitishe kila callback. Usipothibitisha, wataendelea kurudia callback bila kikomo. Kifurushi kinafanya hii kuwa rahisi kwa `tira.acknowledge()`.

### Jinsi Inavyofanya Kazi

Ita `tira.acknowledge(result.body, uniqueId)` na:

| Hoja | Maelezo |
|---|---|
| `result.body` | `body` kutoka matokeo ya callback — XML kamili iliyochambuliwa kama kitu cha JS |
| `uniqueId` | Mfuatano wa kipekee unaouzalisha (mf. UUID) |

Kifurushi kiotomatiki:
1. Kinapata jina sahihi la tag ya uthibitisho (`ReinsuranceRes` → `ReinsuranceResAck`)
2. Kinajaza `AcknowledgementId`, `ResponseId`, `AcknowledgementStatusCode`, na `AcknowledgementStatusDesc`
3. Kinasaini XML kwa ufunguo wako wa siri
4. Kinafunga kwa `<TiraMsg>` na `<MsgSignature>`

### XML Inavyoonekana

Huhitaji kujenga hii mwenyewe — hii ndiyo kifurushi kinachozalisha:

```xml
<TiraMsg>
<ReinsuranceResAck>
  <AcknowledgementId>kitambulisho-chako-cha-kipekee</AcknowledgementId>
  <ResponseId>TIRA22424232355</ResponseId>
  <AcknowledgementStatusCode>TIRA001</AcknowledgementStatusCode>
  <AcknowledgementStatusDesc>Successful</AcknowledgementStatusDesc>
</ReinsuranceResAck>
<MsgSignature>base64-encoded-signature...</MsgSignature>
</TiraMsg>
```

### Mfano

```js
const { v4: uuid } = require("uuid");

app.post("/tira/reinsurance-callback", async (req, res) => {
  const result = await tira.reinsurance.handleCallback(req.body);

  // Shughulikia data ya callback...
  await saveToDatabase(result.extracted);

  // Jenga XML ya uthibitisho
  const ackXml = tira.acknowledge(result.body, uuid());

  // Itume kama jibu la HTTP
  res.set("Content-Type", "application/xml").send(ackXml);
});
```

::: warning Thibitisha daima
Hata ikiwa kushughulikia data ya callback kumeshindwa, bado unapaswa kuthibitisha. Funga tu mantiki yako ya biashara katika try-catch — uchambuzi wa callback na uthibitisho lazima uendelee daima:

```js
app.post("/tira/reinsurance-callback", async (req, res) => {
  const result = await tira.reinsurance.handleCallback(req.body);

  try {
    await saveToDatabase(result.extracted);
  } catch (err) {
    console.error("Kosa la kuhifadhi kwenye hifadhidata:", err);
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
await tira.reinsurance.handleCallback(input: string | Record<string, any>): Promise<CallbackResult<ReinsuranceCallbackResponse>>
```

Kazi hii inachambua XML ya callback ambayo TIRA inatuma kwa callback URL yako na kutoa data husika. Unaweza pia kutumia `tira.handleCallback()` ya jumla ikiwa una endpoint moja kwa aina zote za callback.

### Inafanya Nini

1. **Inathibitisha sahihi** — inakagua kwamba `<MsgSignature>` ya callback inalingana na ufunguo wa umma wa TIRA (ikiwa uthibitishaji wa sahihi umesanidiwa)
2. **Inachambua XML** — inabadilisha XML ghafi kuwa kitu cha JavaScript
3. **Inatoa data** — inatoa sehemu unazozihitaji (`response_status_code`, `response_status_desc`, n.k.) katika kitu safi cha `extracted`

### Ingizo

Unaweza kutoa:
- **Mfuatano wa XML ghafi** — `req.body` kutoka Express handler yako (inahitaji middleware ya `express.text({ type: "application/xml" })`)
- **Kitu kilichochambuliwa tayari** — ikiwa umeshachambua XML mwenyewe

### Inarudisha Nini

| Sehemu | Aina | Maelezo |
|---|---|---|
| `type` | `"reinsurance"` | Daima `"reinsurance"` kwa mshughulikaji huu |
| `extracted` | `ReinsuranceCallbackResponse` | Data iliyotolewa (tazama [Jibu la Callback](#jibu-la-callback-la-submit)) |
| `body` | `Record<string, any>` | XML kamili iliyochambuliwa kama kitu cha JS — toa hii kwa `tira.acknowledge()` |
| `signature_verified` | `boolean` | Ikiwa sahihi ya kidijitali ya TIRA ilithibitishwa |
| `raw_xml` | `string` | Mfuatano wa XML wa asili |

### Mshughulikaji wa Rasilimali Maalum dhidi ya wa Jumla

| Mbinu | Mbinu | Wakati wa Kutumia |
|---|---|---|
| Rasilimali maalum | `tira.reinsurance.handleCallback(input)` | Unapo na endpoint tofauti kwa kila aina ya rasilimali |
| Jumla | `tira.handleCallback(input)` | Unapo na endpoint moja kwa callback zote za TIRA (inahitaji `enabled_callbacks` katika usanidi) |

Zote mbili zinarudisha data sawa. Mshughulikaji wa jumla unagundua aina ya callback kiotomatiki. Tazama [Callback na Uthibitisho](/sw/callbacks-acknowledgements) kwa maelezo zaidi kuhusu mshughulikaji wa jumla.

## Mfano Kamili

Programu kamili ya Express.js inayotuma maelezo ya bima ya kurudisha na kushughulikia callback.

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

// Tuma maelezo ya bima ya kurudisha
app.post("/submit-reinsurance", async (req, res) => {
  const result = await tira.reinsurance.submit({
    request_id: uuid(),
    callback_url: "https://your-server.com/tira/reinsurance-callback",
    insurer_company_code: "ICC103",
    covernote_reference_number: req.body.covernote_reference_number,
    premium_including_tax: req.body.premium_including_tax,
    authorizing_officer_name: "Johnson Abraham",
    authorizing_officer_title: "Manager",
    reinsurance_category: req.body.reinsurance_category,
    reinsurance_details: req.body.reinsurance_details,
  });

  res.json({
    message: "Imetumwa kwa TIRA",
    acknowledgement_id: result.acknowledgement_id,
    status: result.tira_status_code,
  });
});

// Shughulikia callback ya TIRA na uthibitishe
app.post("/tira/reinsurance-callback", async (req, res) => {
  const result = await tira.reinsurance.handleCallback(req.body);

  try {
    await db.reinsurance.update({
      where: { request_id: result.extracted.request_id },
      data: { status: result.extracted.response_status_code },
    });
  } catch (err) {
    console.error("Kosa la kuhifadhi kwenye hifadhidata:", err);
  }

  // Thibitisha — daima, bila kujali kama usindikaji umefanikiwa
  const ackXml = tira.acknowledge(result.body, uuid());
  res.set("Content-Type", "application/xml").send(ackXml);
});

app.listen(3000);
```

## Hali Maalum

### Sarafu

Ukitumia sarafu ya kigeni (si TZS), toa `currency_code` na `exchange_rate` zote mbili. Zikitolewa, zinawekwa chaguomsingi `"TZS"` na `1.0` mtawalia.

```js
// TZS (chaguomsingi) — hakuna haja ya kubainisha
{
  premium_including_tax: 619500,
}

// Sarafu ya kigeni — bainisha zote mbili
{
  currency_code: "USD",
  exchange_rate: 2500.00,
  premium_including_tax: 247.80,
}
```

### Washiriki Wengi

Mpango wa bima ya kurudisha kwa kawaida unahusisha washiriki wengi. Angalau kipengele kimoja cha `reinsurance_details` kinahitajika, lakini utumaji mwingi wa ulimwengu halisi unajumuisha kadhaa — kiongozi na wabima wa kurudisha wa ndani au wa nje.

Kila mshiriki ana `premium_share`, `brokerage_commission`, `reinsurance_commission`, na `participation_date` yake mwenyewe.

```js
reinsurance_details: [
  {
    participant_code: "RE001",
    participant_type: "1",  // Leader
    reinsurance_form: "3",
    reinsurance_type: "1",
    re_broker_code: "BRK001",
    brokerage_commission: 5000,
    reinsurance_commission: 10000,
    premium_share: 250000,
    participation_date: "2025-05-31T21:00:00Z",
  },
  {
    participant_code: "RE002",
    participant_type: "4",  // Facultative Outward Local
    reinsurance_form: "3",
    reinsurance_type: "1",
    re_broker_code: "BRK002",
    brokerage_commission: 3000,
    reinsurance_commission: 8000,
    premium_share: 150000,
    participation_date: "2025-05-31T21:00:00Z",
  },
  {
    participant_code: "RE003",
    participant_type: "5",  // Facultative Outward Foreign
    reinsurance_form: "3",
    reinsurance_type: "1",
    re_broker_code: "BRK003",
    brokerage_commission: 2000,
    reinsurance_commission: 6000,
    premium_share: 100000,
    participation_date: "2025-05-31T21:00:00Z",
  },
]
```

## Makosa ya Kawaida

::: danger Kusahau kuthibitisha callback
TIRA inarudia callback bila kikomo hadi uthibitishe. Daima ita `tira.acknowledge(result.body, uuid())` na rudisha XML, hata ikiwa kushughulikia data ya callback kumeshindwa.
:::

::: danger Nambari batili ya rejea ya covernote
`covernote_reference_number` lazima iwe kutoka covernote iliyotumwa na kuidhinishwa hapo awali. Kutumia rejea inayosubiri au iliyokataliwa kutasababisha TIRA kukataa utumaji wako wa bima ya kurudisha.
:::

::: danger Safu tupu ya maelezo ya bima ya kurudisha
Angalau kipengele kimoja cha `ReinsuranceDetail` kinahitajika. Safu tupu itatupa `TiraValidationError`.
:::

::: danger Kukosa middleware ya XML
Bila `express.text({ type: "application/xml" })`, `req.body` ya callback yako itakuwa tupu na uchambuzi utashindwa. Ongeza middleware hii kabla ya njia yako ya callback.
:::

::: danger Kuchanganya uthibitisho wa utumaji na idhini
`"TIRA001"` katika jibu la utumaji inamaanisha "imepokewa", si "imeidhinishwa". Idhini au kukataliwa halisi kunakuja baadaye kupitia callback. Usiwaambie watumiaji wako bima yao ya kurudisha imeidhinishwa wakati wa utumaji.
:::

## Kurasa Zinazohusiana

- [Callback na Uthibitisho](/sw/callbacks-acknowledgements) — Mzunguko kamili wa callback
- [Usainiaji na Uthibitishaji](/sw/signing-verification) — Jinsi sahihi za kidijitali zinavyofanya kazi
- [Misimbo ya Makosa](/sw/error-codes) — Misimbo yote ya hali ya TIRA na marekebisho
- [Uanzishaji](/sw/initialization) — Kuweka mteja wa Tira
