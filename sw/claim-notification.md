# Taarifa ya Madai

Rasilimali ya Taarifa ya Madai inashughulikia utumaji wa taarifa za madai kwa TIRA. Tumia `tira.claimNotification` kutaarifu TIRA kuhusu dai la bima dhidi ya covernote iliyopo, na kushughulikia majibu ya callback ya TIRA.

Kwa mtiririko wa jumla wa kutuma-callback-kuthibitisha, tazama [Callback na Uthibitisho](/sw/callbacks-acknowledgements).

## Mbinu Zinazopatikana

| Mbinu                                          | Maelezo                                       | Wakati wa Kutumia                                            | Inarudisha                                          |
| ---------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------- |
| `tira.claimNotification.submit(payload)`       | Tuma taarifa ya madai kwa TIRA                | Mteja wa bima anaporipoti dai dhidi ya covernote iliyopo     | `ClaimNotificationResponse`                         |
| `tira.claimNotification.handleCallback(input)` | Chambua na kutoa data kutoka callback ya TIRA | TIRA inapotuma matokeo ya utumaji wako kwa callback URL yako | `CallbackResult<ClaimNotificationCallbackResponse>` |

## Mzigo wa .submit()

```ts
await tira.claimNotification.submit(payload): Promise<ClaimNotificationResponse>
```

Inatuma taarifa ya madai kwa TIRA. Hii ni operesheni ya **asynchronous** — unapata uthibitisho mara moja, na matokeo halisi (ikiwa ni pamoja na `claim_reference_number`) yanakuja baadaye kupitia callback URL yako.

**Endpoint:** `POST /eclaim/api/claim/claim-notification/v1/request`

### Sehemu za Mzigo

| Sehemu                       | Aina           | Inahitajika | Chaguomsingi | XML Tag                    | Maelezo                                                                            |
| ---------------------------- | -------------- | ----------- | ------------ | -------------------------- | ---------------------------------------------------------------------------------- |
| `request_id`                 | `string`       | Ndiyo       | —            | `RequestId`                | Kitambulisho cha kipekee cha ombi                                                  |
| `callback_url`               | `string`       | Ndiyo       | —            | `CallBackUrl`              | TIRA inapotuma matokeo                                                             |
| `insurer_company_code`       | `string`       | Ndiyo       | —            | `InsurerCompanyCode`       | Nambari ya kampuni ya bima                                                         |
| `claim_notification_number`  | `string`       | Ndiyo       | —            | `ClaimNotificationNumber`  | Nambari ya taarifa ya madai kwa mujibu wa bima. String(50).                        |
| `covernote_reference_number` | `string`       | Ndiyo       | —            | `CoverNoteReferenceNumber` | Nambari ya kumbukumbu ya covernote ya TIRA ambayo dai linapinga. String(50).       |
| `claim_report_date`          | `string\|Date` | Ndiyo       | —            | `ClaimReportDate`          | Tarehe na muda dai liliporipotiwa. Tazama [Utumaji wa Tarehe](#utumaji-wa-tarehe). |
| `claim_form_duly_filled`     | `"Y"\|"N"`     | Ndiyo       | —            | `ClaimFormDullyFilled`     | Kama fomu ya dai imejazwa na kuwasilishwa. Y=Ndiyo, N=Hapana.                      |
| `loss_date`                  | `string\|Date` | Ndiyo       | —            | `LossDate`                 | Tarehe na muda hasara ilipotokea. Tazama [Utumaji wa Tarehe](#utumaji-wa-tarehe).  |
| `loss_nature`                | `string`       | Ndiyo       | —            | `LossNature`               | Asili ya hasara (mf. "Fire and Allied Perils"). String(100).                       |
| `loss_type`                  | `string`       | Ndiyo       | —            | `LossType`                 | Aina ya hasara (mf. "Bodily Injury"). String(100).                                 |
| `loss_location`              | `string`       | Ndiyo       | —            | `LossLocation`             | Mahali hasara ilipotokea (mf. "Morogoro"). String(100).                            |
| `officer_name`               | `string`       | Ndiyo       | —            | `OfficerName`              | Jina la afisa anayeidhinisha. String(100).                                         |
| `officer_title`              | `string`       | Ndiyo       | —            | `OfficerTitle`             | Cheo cha afisa anayeidhinisha (mf. "Underwriter"). String(100).                    |

::: info Sehemu za kichwa zinazojazwa kiotomatiki
Sehemu za kichwa cha XML `CompanyCode`, `SystemCode`, na `TranCompanyCode` zinajazwa kiotomatiki kutoka kwenye usanidi wako wa Tira — huhitaji kuzijumuisha kwenye mzigo.
:::

### Utumaji wa Tarehe

Kifurushi kinabadilisha tarehe kiotomatiki kuwa Saa za Afrika Mashariki (UTC+3) na kuzifomati kama `YYYY-MM-DDTHH:mm:ss` (bila kiambishi cha eneo la saa). Unaweza kutuma string ya ISO au kitu cha JavaScript `Date`.

::: tip Mfano
Ukituma `"2020-09-15T10:55:22Z"` (10:55 asubuhi UTC), kifurushi kinabadilisha kuwa `"2020-09-15T13:55:22"` (1:55 alasiri EAT).
:::

### Sheria za Uthibitishaji

Kifurushi kinathibitisha mzigo wako kabla ya kuutuma kwa TIRA. Uthibitishaji ukishindikana, kinatupa `TiraValidationError` na jina la sehemu na ujumbe wa maelezo.

- Sehemu zote zinahitajika — hakuna sehemu za hiari au masharti
- `callback_url` lazima iwe URL halali
- `claim_report_date` lazima iwe string ya tarehe halali (fomati ya ISO)
- `loss_date` lazima iwe string ya tarehe halali (fomati ya ISO)
- `claim_form_duly_filled` lazima iwe `"Y"` au `"N"`

### Mfano — Kutuma Taarifa ya Madai

```js
const result = await tira.claimNotification.submit({
  request_id: "NIC22424232355",
  callback_url: "https://your-server.com/tira/claim-notification-callback",
  insurer_company_code: "IC001",
  claim_notification_number: "NIC00004",
  covernote_reference_number: "3252-5252",
  claim_report_date: "2020-09-15T13:55:22",
  claim_form_duly_filled: "Y",
  loss_date: "2020-09-15T13:55:22",
  loss_nature: "Fire and Allied Perils",
  loss_type: "Bodily Injury",
  loss_location: "Morogoro",
  officer_name: "John Doe",
  officer_title: "Underwriter",
});

console.log(result.acknowledgement_id); // "ACK123456"
console.log(result.tira_status_code); // "TIRA001"
```

## Jibu la .submit()

Unapoita `tira.claimNotification.submit()`, unapata `ClaimNotificationResponse` mara moja kutoka TIRA:

| Sehemu                     | Aina                      | Maelezo                                                         |
| -------------------------- | ------------------------- | --------------------------------------------------------------- |
| `acknowledgement_id`       | `string`                  | Kitambulisho cha uthibitisho cha TIRA                           |
| `request_id`               | `string`                  | Kitambulisho chako cha ombi (kinarudishwa)                      |
| `tira_status_code`         | `string`                  | Msimbo wa hali — `"TIRA001"` inamaanisha imepokelewa            |
| `tira_status_desc`         | `string`                  | Maelezo yanayosomeka                                            |
| `requires_acknowledgement` | `boolean`                 | Daima `true`                                                    |
| `acknowledgement_payload`  | `Record<string, unknown>` | Mzigo wa uthibitisho uliochanganuliwa (mara chache unahitajika) |

::: tip "TIRA001" inamaanisha "imepokelewa", si "imekubaliwa"
Katika hatua hii, `"TIRA001"` inamaanisha TIRA imepokea ombi lako na linashughulikiwa. **Haimaanishi** taarifa yako ya madai imekubaliwa. Matokeo halisi (ikiwa ni pamoja na `claim_reference_number`) yanakuja baadaye kupitia callback URL yako.

Ukipata msimbo tofauti na `"TIRA001"`, kuna kosa limetokea kwenye utumaji wenyewe. Angalia ukurasa wa [Misimbo ya Makosa](/sw/error-codes) kwa msimbo husika.
:::

## Jibu la Callback la .submit()

Baada ya TIRA kushughulikia utumaji wako, inatuma matokeo kwa `callback_url` yako. Callback ina matokeo halisi — kama taarifa yako ya madai imekubaliwa au imekataliwa, na `claim_reference_number` iliyotolewa ikiwa imefanikiwa.

### Data Iliyotolewa

Sehemu ya `extracted` ina data ya callback iliyochanganuliwa:

| Sehemu                   | Aina     | Maelezo                                                                                     |
| ------------------------ | -------- | ------------------------------------------------------------------------------------------- |
| `response_id`            | `string` | Kitambulisho cha jibu la TIRA                                                               |
| `request_id`             | `string` | Kitambulisho chako cha ombi                                                                 |
| `response_status_code`   | `string` | `"TIRA001"` = imekubaliwa. Tazama [Misimbo ya Makosa](/sw/error-codes) kwa misimbo mingine. |
| `response_status_desc`   | `string` | Maelezo ya hali yanayosomeka                                                                |
| `claim_reference_number` | `string` | Nambari ya kumbukumbu ya madai iliyotolewa na TIRA (ikiwa imefanikiwa)                      |

### Ikiwa Imefanikiwa

Wakati `response_status_code` ni `"TIRA001"`, taarifa ya madai imekubaliwa. Utapokea `claim_reference_number` — ihifadhi, ni kitambulisho rasmi cha TIRA utakachohitaji kwa hatua zinazofuata za mzunguko wa madai (intimation, assessment, n.k.).

```js
// response_status_code === "TIRA001"
console.log(result.extracted.claim_reference_number); // "3325253254"
console.log(result.extracted.request_id); // "NIC22424232355"
```

### Ikiwa Kuna Kosa

Wakati `response_status_code` ni kitu kingine tofauti na `"TIRA001"`, taarifa ya madai imekataliwa. `claim_reference_number` itakuwa tupu. Angalia ukurasa wa [Misimbo ya Makosa](/sw/error-codes) kwa msimbo husika.

```js
// response_status_code !== "TIRA001"
console.log(result.extracted.response_status_code); // mf. "TIRA020"
console.log(result.extracted.response_status_desc); // mf. "Invalid request"
```

### Mfano — Kushughulikia Callback

```js
app.post("/tira/claim-notification-callback", async (req, res) => {
  const result = await tira.claimNotification.handleCallback(req.body);

  if (result.extracted.response_status_code === "TIRA001") {
    await db.claimNotifications.update({
      where: { request_id: result.extracted.request_id },
      data: {
        status: "accepted",
        claim_reference_number: result.extracted.claim_reference_number,
      },
    });
  } else {
    console.error(
      `Taarifa ya madai imekataliwa: ${result.extracted.response_status_code}`,
      result.extracted.response_status_desc,
    );

    await db.claimNotifications.update({
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

1. Kinapata jina sahihi la tag ya uthibitisho (`ClaimNotificationRefRes` → `ClaimNotificationRefResAck`)
2. Kinajaza `AcknowledgementId`, `ResponseId`, `AcknowledgementStatusCode`, na `AcknowledgementStatusDesc`
3. Kinasaini XML kwa ufunguo wako wa faragha
4. Kinafunga kwenye `<TiraMsg>` na `<MsgSignature>`

### XML Inavyoonekana

Huhitaji kujenga hii mwenyewe — hii ndiyo kifurushi kinachozalisha:

```xml
<TiraMsg>
<ClaimNotificationRefResAck>
  <AcknowledgementId>kitambulisho-chako-cha-kipekee</AcknowledgementId>
  <ResponseId>TIRA22424232355</ResponseId>
  <AcknowledgementStatusCode>TIRA001</AcknowledgementStatusCode>
  <AcknowledgementStatusDesc>Successful</AcknowledgementStatusDesc>
</ClaimNotificationRefResAck>
<MsgSignature>sahihi-iliyosimbwa-base64...</MsgSignature>
</TiraMsg>
```

### Mfano

```js
const { v4: uuid } = require("uuid");

app.post("/tira/claim-notification-callback", async (req, res) => {
  const result = await tira.claimNotification.handleCallback(req.body);

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
app.post("/tira/claim-notification-callback", async (req, res) => {
  const result = await tira.claimNotification.handleCallback(req.body);

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
await tira.claimNotification.handleCallback(input: string | Record<string, any>): Promise<CallbackResult<ClaimNotificationCallbackResponse>>
```

Kazi hii inachanganua XML ya callback ambayo TIRA inatuma kwa callback URL yako na kutoa data husika. Unaweza pia kutumia `tira.handleCallback()` ya jumla ikiwa una endpoint moja kwa aina zote za callback.

### Inachofanya

1. **Inathibitisha sahihi** — inaangalia kama `<MsgSignature>` ya callback inalingana na ufunguo wa umma wa TIRA (ikiwa uthibitishaji wa sahihi umesanidiwa)
2. **Inachanganua XML** — inabadilisha XML ghafi kuwa kitu cha JavaScript
3. **Inatoa data** — inachota sehemu unazozihitaji (`claim_reference_number`, `response_status_code`, n.k.) kuwa kitu safi cha `extracted`

### Ingizo

Unaweza kutuma ama:

- **String ya XML ghafi** — `req.body` kutoka kwa handler yako ya Express (inahitaji middleware ya `express.text({ type: "application/xml" })`)
- **Kitu kilichochanganuliwa** — ikiwa tayari umechanganua XML mwenyewe

### Inarudisha Nini

| Sehemu               | Aina                                | Maelezo                                                                           |
| -------------------- | ----------------------------------- | --------------------------------------------------------------------------------- |
| `type`               | `"claim_notification"`              | Daima `"claim_notification"` kwa handler hii                                      |
| `extracted`          | `ClaimNotificationCallbackResponse` | Data iliyotolewa (tazama [Jibu la Callback](#jibu-la-callback-la-submit))         |
| `body`               | `Record<string, any>`               | XML iliyochanganuliwa kamili kama kitu cha JS — ipitishe kwa `tira.acknowledge()` |
| `signature_verified` | `boolean`                           | Kama sahihi ya kidijitali ya TIRA ilithibitishwa                                  |
| `raw_xml`            | `string`                            | String ya XML ya asili                                                            |

### Handler ya Rasilimali Maalum vs ya Jumla

| Njia                 | Mbinu                                          | Wakati wa Kutumia                                                                              |
| -------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Ya rasilimali maalum | `tira.claimNotification.handleCallback(input)` | Ukiwa na endpoint tofauti kwa kila aina ya rasilimali                                          |
| Ya jumla             | `tira.handleCallback(input)`                   | Ukiwa na endpoint moja kwa callback zote za TIRA (inahitaji `enabled_callbacks` kwenye config) |

Zote mbili zinarudisha data sawa. Handler ya jumla inagundua aina ya callback kiotomatiki. Tazama [Callback na Uthibitisho](/sw/callbacks-acknowledgements) kwa maelezo ya handler ya jumla.

## Mfano Kamili

Programu kamili ya Express.js inayotuma taarifa ya madai, kushughulikia callback, na kuthibitisha.

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

// Tuma taarifa ya madai
app.post("/submit-claim-notification", async (req, res) => {
  const result = await tira.claimNotification.submit({
    request_id: uuid(),
    callback_url: "https://your-server.com/tira/claim-notification-callback",
    insurer_company_code: "IC001",
    claim_notification_number: req.body.claim_notification_number,
    covernote_reference_number: req.body.covernote_reference_number,
    claim_report_date: req.body.claim_report_date,
    claim_form_duly_filled: req.body.claim_form_duly_filled,
    loss_date: req.body.loss_date,
    loss_nature: req.body.loss_nature,
    loss_type: req.body.loss_type,
    loss_location: req.body.loss_location,
    officer_name: req.body.officer_name,
    officer_title: req.body.officer_title,
  });

  res.json({
    message: "Imetumwa kwa TIRA",
    acknowledgement_id: result.acknowledgement_id,
    status: result.tira_status_code,
  });
});

// Shughulikia callback ya TIRA na uthibitishe
app.post("/tira/claim-notification-callback", async (req, res) => {
  const result = await tira.claimNotification.handleCallback(req.body);

  try {
    await db.claimNotifications.update({
      where: { request_id: result.extracted.request_id },
      data: {
        status: result.extracted.response_status_code,
        claim_reference_number: result.extracted.claim_reference_number,
      },
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

### Tarehe ya Kuripoti Dai vs Tarehe ya Hasara

Sehemu hizi mbili za tarehe zina madhumuni tofauti:

- `claim_report_date` — dai **liliporipotiwa** kwa bima (yaani, mteja alipokuja ofisini kwako)
- `loss_date` — hasara **ilipotokea** kweli (yaani, tarehe ya ajali, moto, wizi, n.k.)

Zinaweza kuwa tarehe moja (ikiwa dai limeripotiwa siku ya hasara) au tarehe tofauti (ikiwa limeripotiwa baadaye). Zote mbili zinahitajika.

## Makosa ya Kuzingatia

::: danger Kusahau kuthibitisha callback
TIRA inarudia callback bila kikomo hadi uthibitishe. Daima ita `tira.acknowledge(result.body, uuid())` na rudisha XML, hata kama kushughulikia data ya callback kumeshindikana.
:::

::: danger Kukosa middleware ya XML
Bila `express.text({ type: "application/xml" })`, `req.body` ya callback yako itakuwa tupu na uchambuzi utashindikana. Ongeza middleware hii kabla ya route yako ya callback.
:::

::: danger Kuchanganya uthibitisho wa utumaji na idhini
`"TIRA001"` kwenye jibu la utumaji inamaanisha "imepokelewa", si "imekubaliwa". Idhini au kukataliwa halisi kunakuja baadaye kupitia callback. Usiwaambie watumiaji wako taarifa ya madai imekubaliwa wakati wa utumaji.
:::

::: danger URL ya callback isiyo sahihi
`callback_url` lazima iwe URL halali inayopatikana kwa umma. Kifurushi kinathibitisha fomati ya URL kabla ya kutuma. Ikiwa URL imeundwa vibaya, utapata `TiraValidationError`. Ikiwa ni halali lakini haifikiswi na TIRA, hutapokea callback kamwe.
:::

::: danger Kuhifadhi nambari ya kumbukumbu ya madai
`claim_reference_number` inayorudishwa kwenye callback inahitajika kwa hatua zinazofuata za mzunguko wa madai — claim intimation, assessment, discharge voucher, payment, na rejection zote zinatumia nambari hii. Hakikisha unaihifadhi.
:::

## Kurasa Zinazohusiana

- [Callback na Uthibitisho](/sw/callbacks-acknowledgements) — Mzunguko kamili wa callback
- [Usainiaji na Uthibitishaji](/sw/signing-verification) — Jinsi sahihi za kidijitali zinavyofanya kazi
- [Misimbo ya Makosa](/sw/error-codes) — Misimbo yote ya hali ya TIRA na marekebisho
- [Uanzishaji](/sw/initialization) — Kuweka mteja wa Tira
