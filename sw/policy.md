# Sera

Rasilimali ya Sera inabadilisha covernote zilizoidhinishwa kuwa sera rasmi za bima. Tumia `tira.policy` kutuma maombi ya sera yanayorejelea covernote moja au zaidi zilizoidhinishwa hapo awali, na kushughulikia majibu ya callback ya TIRA.

Kwa mtiririko wa jumla wa kutuma-callback-kuthibitisha, tazama [Callback na Uthibitisho](/sw/callbacks-acknowledgements).

## Mbinu Zinazopatikana

| Mbinu                               | Maelezo                                                    | Wakati wa Kutumia                                            | Inarudisha                               |
| ----------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------- |
| `tira.policy.submit(payload)`       | Tuma ombi la sera linalorejelea covernote zilizoidhinishwa | Baada ya covernote zako kuidhinishwa na TIRA                 | `PolicyResponse`                         |
| `tira.policy.handleCallback(input)` | Chambua na kutoa data kutoka callback ya TIRA              | TIRA inapotuma matokeo ya utumaji wako kwa callback URL yako | `CallbackResult<PolicyCallbackResponse>` |

## Mzigo wa .submit()

```ts
await tira.policy.submit(payload): Promise<PolicyResponse>
```

Inatuma ombi la sera kwa TIRA. Hii ni operesheni ya asynchronous — unapata uthibitisho mara moja, na matokeo halisi yanakuja baadaye kupitia callback URL yako.

**Endpoint:** `POST /ecovernote/api/policy/v1/request`

### Sehemu za Mzigo

| Sehemu                 | Aina           | Inahitajika | Chaguomsingi | XML Tag              | Maelezo                                                      |
| ---------------------- | -------------- | ----------- | ------------ | -------------------- | ------------------------------------------------------------ |
| `request_id`           | `string`       | Ndiyo       | —            | `RequestId`          | Kitambulisho cha kipekee cha ombi                            |
| `callback_url`         | `string`       | Ndiyo       | —            | `CallBackUrl`        | Mahali TIRA inatuma matokeo                                  |
| `insurer_company_code` | `string`       | Ndiyo       | —            | `InsurerCompanyCode` | Msimbo wa kampuni ya bima                                    |
| `policy_detail`        | `PolicyDetail` | Ndiyo       | —            | `PolicyDtl`          | Maelezo ya sera. Tazama [Maelezo ya Sera](#maelezo-ya-sera). |

### Maelezo ya Sera

Kitu cha `policy_detail` kinaelezea sera inayotumwa.

| Sehemu                    | Aina       | Inahitajika | Chaguomsingi | XML Tag                                        | Maelezo                                                                                               |
| ------------------------- | ---------- | ----------- | ------------ | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `policy_number`           | `string`   | Ndiyo       | —            | `PolicyNumber`                                 | Nambari ya sera kama ilivyo kwa mbima. Herufi 50.                                                     |
| `policy_operative_clause` | `string`   | Ndiyo       | —            | `PolicyOperativeClause`                        | Vifungu vya utekelezaji wa sera. Herufi 1000.                                                         |
| `special_conditions`      | `string`   | Ndiyo       | —            | `SpecialConditions`                            | Masharti maalum ya sera. Herufi 1000.                                                                 |
| `exclusions`              | `string`   | Hapana      | `""`         | `Exclusions`                                   | Vipengee vilivyotengwa kwa sera ikiwa vipo. Herufi 1000.                                              |
| `applied_cover_notes`     | `string[]` | Ndiyo       | —            | `AppliedCoverNotes > CoverNoteReferenceNumber` | Nambari za rejea za covernote kutoka covernote zilizoidhinishwa hapo awali. Angalau moja inahitajika. |

### Sheria za Uthibitishaji

Kifurushi kinathibitisha mzigo wako kabla ya kuutuma kwa TIRA. Uthibitishaji ukishindwa, kinatupa `TiraValidationError` na jina la sehemu na ujumbe wa maelezo.

- `request_id` inahitajika
- `callback_url` lazima iwe URL halali
- `insurer_company_code` inahitajika
- `policy_detail` inahitajika
- `policy_detail.policy_number` inahitajika
- `policy_detail.policy_operative_clause` inahitajika
- `policy_detail.special_conditions` inahitajika
- `policy_detail.applied_cover_notes` lazima iwe safu isiyokuwa tupu
- Kila kipengele katika `applied_cover_notes` lazima kiwe mfuatano usio tupu

### Mfano — Kutuma Sera

```js
const result = await tira.policy.submit({
  request_id: "NIC22424232355",
  callback_url: "https://example.com/policy/callback",
  insurer_company_code: "ICC103",
  policy_detail: {
    policy_number: "CV224223255",
    policy_operative_clause: "Full comprehensive coverage for all listed items",
    special_conditions: "Coverage applies only within Tanzania mainland",
    exclusions: "War and terrorism excluded",
    applied_cover_notes: ["4242424", "2323235"],
  },
});

console.log(result.acknowledgement_id); // "ACK123456"
console.log(result.tira_status_code); // "TIRA001"
```

### Mfano — Covernote Nyingi

Sera inaweza kurejelea covernote nyingi zilizoidhinishwa:

```js
const result = await tira.policy.submit({
  request_id: "NIC22424232356",
  callback_url: "https://example.com/policy/callback",
  insurer_company_code: "ICC103",
  policy_detail: {
    policy_number: "CV224223256",
    policy_operative_clause: "Comprehensive motor fleet coverage",
    special_conditions: "All vehicles must be registered in Tanzania",
    // exclusions imesahauliwa — chaguomsingi ni ""
    applied_cover_notes: ["CN-2025-001", "CN-2025-002", "CN-2025-003"],
  },
});
```

## Jibu la .submit()

Unapoita `tira.policy.submit()`, unapata `PolicyResponse` mara moja kutoka TIRA:

| Sehemu                     | Aina                      | Maelezo                                                    |
| -------------------------- | ------------------------- | ---------------------------------------------------------- |
| `acknowledgement_id`       | `string`                  | Kitambulisho cha uthibitisho cha TIRA                      |
| `request_id`               | `string`                  | Kitambulisho chako cha ombi (kinarudishwa)                 |
| `tira_status_code`         | `string`                  | Msimbo wa hali — `"TIRA001"` inamaanisha imepokewa         |
| `tira_status_desc`         | `string`                  | Maelezo yanayosomeka                                       |
| `requires_acknowledgement` | `boolean`                 | Daima `true`                                               |
| `acknowledgement_payload`  | `Record<string, unknown>` | Uthibitisho ghafi uliochambuliwa (mara chache unahitajika) |

::: tip "TIRA001" inamaanisha "imepokewa", si "imeidhinishwa"
Katika hatua hii, `"TIRA001"` inamaanisha TIRA imepokea ombi lako na linashughulikiwa. **Haimaanishi** sera yako imeidhinishwa. Matokeo halisi (imeidhinishwa au imekataliwa) yanakuja baadaye kupitia callback URL yako.

Ukipata msimbo tofauti na `"TIRA001"`, kitu kimekwenda vibaya na utumaji wenyewe. Angalia ukurasa wa [Misimbo ya Makosa](/sw/error-codes) kwa msimbo husika.
:::

## Jibu la Callback la .submit()

Baada ya TIRA kushughulikia utumaji wako, inatuma matokeo kwa `callback_url` yako. Callback ina matokeo halisi — ikiwa sera yako imeidhinishwa au imekataliwa.

### Data Iliyotolewa

Sehemu ya `extracted` ina data ya callback iliyochambuliwa:

| Sehemu                 | Aina     | Maelezo                                                                                       |
| ---------------------- | -------- | --------------------------------------------------------------------------------------------- |
| `response_id`          | `string` | Kitambulisho cha jibu la TIRA                                                                 |
| `request_id`           | `string` | Kitambulisho chako cha ombi                                                                   |
| `response_status_code` | `string` | `"TIRA001"` = imeidhinishwa. Tazama [Misimbo ya Makosa](/sw/error-codes) kwa misimbo mingine. |
| `response_status_desc` | `string` | Maelezo ya hali yanayosomeka                                                                  |

### Ikiwa Imefanikiwa

Wakati `response_status_code` ni `"TIRA001"`, sera imeidhinishwa.

```js
// response_status_code === "TIRA001"
console.log(result.extracted.response_status_code); // "TIRA001"
console.log(result.extracted.response_status_desc); // "Successful"
```

### Ikiwa Imeshindwa

Wakati `response_status_code` ni kitu chochote kingine isipokuwa `"TIRA001"`, sera imekataliwa. Angalia ukurasa wa [Misimbo ya Makosa](/sw/error-codes) kwa msimbo husika.

```js
// response_status_code !== "TIRA001"
console.log(result.extracted.response_status_code); // mf. "TIRA020"
console.log(result.extracted.response_status_desc); // mf. "Invalid policy details"
```

### Mfano — Kushughulikia Callback

```js
app.post("/tira/policy-callback", async (req, res) => {
  const result = await tira.policy.handleCallback(req.body);

  if (result.extracted.response_status_code === "TIRA001") {
    await db.policies.update({
      where: { request_id: result.extracted.request_id },
      data: { status: "approved" },
    });
  } else {
    console.error(
      `Sera imekataliwa: ${result.extracted.response_status_code}`,
      result.extracted.response_status_desc,
    );

    await db.policies.update({
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

| Hoja          | Maelezo                                                                         |
| ------------- | ------------------------------------------------------------------------------- |
| `result.body` | `body` kutoka matokeo ya callback — XML kamili iliyochambuliwa kama kitu cha JS |
| `uniqueId`    | Mfuatano wa kipekee unaouzalisha (mf. UUID)                                     |

Kifurushi kiotomatiki:

1. Kinapata jina sahihi la tag ya uthibitisho (`PolicyRes` → `PolicyResAck`)
2. Kinajaza `AcknowledgementId`, `ResponseId`, `AcknowledgementStatusCode`, na `AcknowledgementStatusDesc`
3. Kinasaini XML kwa ufunguo wako wa siri
4. Kinafunga kwa `<TiraMsg>` na `<MsgSignature>`

### XML Inavyoonekana

Huhitaji kujenga hii mwenyewe — hii ndiyo kifurushi kinachozalisha:

```xml
<TiraMsg>
<PolicyResAck>
  <AcknowledgementId>kitambulisho-chako-cha-kipekee</AcknowledgementId>
  <ResponseId>TIRA22424232355</ResponseId>
  <AcknowledgementStatusCode>TIRA001</AcknowledgementStatusCode>
  <AcknowledgementStatusDesc>Successful</AcknowledgementStatusDesc>
</PolicyResAck>
<MsgSignature>base64-encoded-signature...</MsgSignature>
</TiraMsg>
```

### Mfano

```js
const { v4: uuid } = require("uuid");

app.post("/tira/policy-callback", async (req, res) => {
  const result = await tira.policy.handleCallback(req.body);

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
app.post("/tira/policy-callback", async (req, res) => {
  const result = await tira.policy.handleCallback(req.body);

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
await tira.policy.handleCallback(input: string | Record<string, any>): Promise<CallbackResult<PolicyCallbackResponse>>
```

Kazi hii inachambua XML ya callback ambayo TIRA inatuma kwa callback URL yako na kutoa data husika. Unaweza pia kutumia `tira.handleCallback()` ya jumla ikiwa una endpoint moja kwa aina zote za callback.

### Inafanya Nini

1. **Inathibitisha sahihi** — inakagua kwamba `<MsgSignature>` ya callback inalingana na ufunguo wa umma wa TIRA (ikiwa uthibitishaji wa sahihi umesanidiwa)
2. **Inachambua XML** — inabadilisha XML ghafi kuwa kitu cha JavaScript
3. **Inatoa data** — inatoa sehemu unazozihitaji (`response_id`, `request_id`, `response_status_code`, `response_status_desc`) katika kitu safi cha `extracted`

### Ingizo

Unaweza kutoa:

- **Mfuatano wa XML ghafi** — `req.body` kutoka Express handler yako (inahitaji middleware ya `express.text({ type: "application/xml" })`)
- **Kitu kilichochambuliwa tayari** — ikiwa umeshachambua XML mwenyewe

### Inarudisha Nini

| Sehemu               | Aina                     | Maelezo                                                                        |
| -------------------- | ------------------------ | ------------------------------------------------------------------------------ |
| `type`               | `"policy"`               | Daima `"policy"` kwa mshughulikaji huu                                         |
| `extracted`          | `PolicyCallbackResponse` | Data iliyotolewa (tazama [Jibu la Callback](#jibu-la-callback-la-submit))      |
| `body`               | `Record<string, any>`    | XML kamili iliyochambuliwa kama kitu cha JS — toa hii kwa `tira.acknowledge()` |
| `signature_verified` | `boolean`                | Ikiwa sahihi ya kidijitali ya TIRA ilithibitishwa                              |
| `raw_xml`            | `string`                 | Mfuatano wa XML wa asili                                                       |

### Mshughulikaji wa Rasilimali Maalum dhidi ya wa Jumla

| Mbinu             | Mbinu                               | Wakati wa Kutumia                                                                               |
| ----------------- | ----------------------------------- | ----------------------------------------------------------------------------------------------- |
| Rasilimali maalum | `tira.policy.handleCallback(input)` | Unapo na endpoint tofauti kwa kila aina ya rasilimali                                           |
| Jumla             | `tira.handleCallback(input)`        | Unapo na endpoint moja kwa callback zote za TIRA (inahitaji `enabled_callbacks` katika usanidi) |

Zote mbili zinarudisha data sawa. Mshughulikaji wa jumla unagundua aina ya callback kiotomatiki. Tazama [Callback na Uthibitisho](/sw/callbacks-acknowledgements) kwa maelezo zaidi kuhusu mshughulikaji wa jumla.

## Mfano Kamili

Programu kamili ya Express.js inayotuma sera na kushughulikia callback.

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

// Tuma sera
app.post("/submit-policy", async (req, res) => {
  const result = await tira.policy.submit({
    request_id: uuid(),
    callback_url: "https://your-server.com/tira/policy-callback",
    insurer_company_code: "ICC103",
    policy_detail: {
      policy_number: req.body.policy_number,
      policy_operative_clause: req.body.operative_clause,
      special_conditions: req.body.special_conditions,
      exclusions: req.body.exclusions,
      applied_cover_notes: req.body.cover_note_references,
    },
  });

  res.json({
    message: "Imetumwa kwa TIRA",
    acknowledgement_id: result.acknowledgement_id,
    status: result.tira_status_code,
  });
});

// Shughulikia callback ya TIRA na uthibitishe
app.post("/tira/policy-callback", async (req, res) => {
  const result = await tira.policy.handleCallback(req.body);

  try {
    await db.policies.update({
      where: { request_id: result.extracted.request_id },
      data: {
        status:
          result.extracted.response_status_code === "TIRA001"
            ? "approved"
            : "rejected",
        tira_response_code: result.extracted.response_status_code,
        tira_response_desc: result.extracted.response_status_desc,
      },
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

### Sehemu ya Vipengee Vilivyotengwa

Sehemu ya `exclusions` si ya lazima na chaguomsingi yake ni mfuatano tupu `""` katika XML. Ikiwa huna vipengee vilivyotengwa, unaweza kuiacha kabisa:

```js
policy_detail: {
  policy_number: "CV224223255",
  policy_operative_clause: "Full comprehensive coverage",
  special_conditions: "Tanzania mainland only",
  // exclusions imeachwa — chaguomsingi ni ""
  applied_cover_notes: ["4242424"],
}
```

### Covernote Zilizotumika

Safu ya `applied_cover_notes` lazima iwe na angalau nambari moja ya rejea ya covernote, na kila kipengele lazima kiwe mfuatano usio tupu. Hizi ni nambari za rejea zilizotolewa na TIRA ambazo ulipokea katika jibu la callback wakati covernote zako zilipoidhinishwa.

```js
// Sahihi — angalau rejea moja
applied_cover_notes: ["4242424"];

// Sahihi — rejea nyingi
applied_cover_notes: ["4242424", "2323235", "5656789"];

// Si sahihi — safu tupu (inatupa TiraValidationError)
applied_cover_notes: [];

// Si sahihi — ina mfuatano tupu (inatupa TiraValidationError)
applied_cover_notes: ["4242424", ""];
```

## Makosa ya Kawaida

::: danger Kusahau kuthibitisha callback
TIRA inarudia callback bila kikomo hadi uthibitishe. Daima ita `tira.acknowledge(result.body, uuid())` na rudisha XML, hata ikiwa kushughulikia data ya callback kumeshindwa.
:::

::: danger URL batili ya callback
`callback_url` lazima iwe URL halali. URL batili itatupa `TiraValidationError` kabla ya ombi kutumwa kwa TIRA.
:::

::: danger applied_cover_notes tupu
Lazima utoe angalau nambari moja ya rejea ya covernote katika `applied_cover_notes`. Safu tupu au safu yenye mifuatano tupu itatupa `TiraValidationError`.
:::

::: danger Kuchanganya uthibitisho wa utumaji na idhini
`"TIRA001"` katika jibu la utumaji inamaanisha "imepokewa", si "imeidhinishwa". Idhini au kukataliwa halisi kunakuja baadaye kupitia callback. Usiwaambie watumiaji wako sera yao imeidhinishwa wakati wa utumaji.
:::

::: danger Kukosa middleware ya XML
Bila `express.text({ type: "application/xml" })`, `req.body` ya callback yako itakuwa tupu na uchambuzi utashindwa. Ongeza middleware hii kabla ya njia yako ya callback.
:::

## Kurasa Zinazohusiana

- [Callback na Uthibitisho](/sw/callbacks-acknowledgements) — Mzunguko kamili wa callback
- [Usainiaji na Uthibitishaji](/sw/signing-verification) — Jinsi sahihi za kidijitali zinavyofanya kazi
- [Misimbo ya Makosa](/sw/error-codes) — Misimbo yote ya hali ya TIRA na marekebisho
- [Uanzishaji](/sw/initialization) — Kuweka mteja wa Tira
