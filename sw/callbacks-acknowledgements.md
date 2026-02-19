# Callback na Uthibitisho

Baada ya kutuma data kwa TIRA, hupati matokeo mara moja. TIRA inashughulikia ombi lako kwa wakati wake na kutuma matokeo baadaye kwa URL yako ya callback. Kisha unahitaji kuthibitisha kuwa umeyapokea.

Ukurasa huu unaeleza mtiririko wote — kutoka kutuma hadi callback hadi uthibitisho. Kifurushi kinashughulikia sehemu ngumu (kujenga XML, kusaini, kuchambua) kiotomatiki.

## Mtiririko Kamili

Kila utumaji kwa TIRA unafuata muundo huu:

```
Hatua 1: Unatuma data
         tira.motor.submit({...})
         Mzigo wako unajumuisha callback_url.
               ↓
Hatua 2: TIRA inathibitisha utumaji wako
         Unapata acknowledgement_id na hali.
         Hii inamaanisha "tumepokea ombi lako" — si "limeidhinishwa".
               ↓
Hatua 3: TIRA inashughulikia ombi lako
         Hii inafanyika upande wa TIRA. Unasubiri callback.
               ↓
Hatua 4: TIRA inatuma matokeo kwa callback_url yako
               ↓
Hatua 5: Unashughulikia callback
         tira.motor.handleCallback(req.body)
               ↓
Hatua 6: Unathibitisha callback ya TIRA
         tira.acknowledge(result.body, ackId)
         Tuma XML ya majibu kwa TIRA.
```

::: warning Sheria za Kurudia

- **Hatua 2**: Ikiwa hupokei uthibitisho kutoka TIRA, rudia utumaji wako.
- **Hatua 6**: Ikiwa TIRA haipokei uthibitisho wako, wataendelea kurudia callback hadi uthibitishe.

Pande zote zinaendelea kurudia hadi upande mwingine uthibitishe kupokea.
:::

## Kutuma Data

Unapoita `.submit()`, unajumuisha `callback_url` katika mzigo wako. Hapa ndipo TIRA itatuma matokeo.

```js
const result = await tira.motor.submit({
  request_id: "REQ-001",
  callback_url: "https://your-server.com/tira/motor-callback",
  // ...sehemu nyingine ya mzigo wako
});

console.log(result.acknowledgement_id); // "ACK123456"
console.log(result.tira_status_code); // "TIRA001"
console.log(result.tira_status_desc); // "Successful"
```

Jibu linakuambia TIRA imepokea ombi lako:

| Sehemu                     | Maelezo                                         |
| -------------------------- | ----------------------------------------------- |
| `acknowledgement_id`       | Kitambulisho cha TIRA kwa uthibitisho huu       |
| `request_id`               | Kitambulisho chako cha ombi (kinarudishwa)      |
| `tira_status_code`         | `"TIRA001"` inamaanisha TIRA imepokea ombi lako |
| `tira_status_desc`         | Maelezo yanayosomeka                            |
| `requires_acknowledgement` | Daima `true`                                    |
| `acknowledgement_payload`  | Data ghafi ya uthibitisho (kawaida huitahitaji) |

::: tip "TIRA001" inamaanisha "imepokewa", si "imeidhinishwa"
Katika hatua hii, `"TIRA001"` inamaanisha tu TIRA imepata ombi lako. **Haimaanishi** bima yako imeidhinishwa au madai yako yamekubaliwa. Matokeo halisi yanakuja baadaye kupitia callback.
:::

## Kushughulikia Callback

TIRA inapomaliza kushughulikia ombi lako, inatuma matokeo kwa `callback_url` yako. Unashughulikia kwa njia moja ya mbili.

### Njia A: Kushughulikia kwa Rasilimali

Tumia hii unapokuwa na endpoint tofauti kwa kila aina ya callback. Hii ndiyo njia rahisi zaidi.

```js
app.post("/tira/motor-callback", async (req, res) => {
  const result = await tira.motor.handleCallback(req.body);

  console.log(result.extracted); // Data safi — tazama hapa chini kwa unachopata
  console.log(result.signature_verified); // true ikiwa sahihi ni halali

  // ...thibitisha (tazama sehemu inayofuata)
});
```

### Njia B: Kushughulikia kwa Ujumla

Tumia hii unapokuwa na endpoint moja kwa callback zote za TIRA. Inahitaji `enabled_callbacks` katika usanidi wako.

```js
const tira = new Tira({
  // ...usanidi wako
  enabled_callbacks: {
    motor: true,
    policy: true,
    // wezesha unachohitaji tu
  },
});

app.post("/tira-callback", async (req, res) => {
  const result = await tira.handleCallback(req.body);

  console.log(result.type); // "motor", "policy", n.k.
  console.log(result.extracted); // Data safi

  // ...thibitisha (tazama sehemu inayofuata)
});
```

### Matokeo ya Callback

Njia zote mbili zinarudisha `CallbackResult` na sehemu hizi:

| Sehemu               | Maelezo                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------- |
| `type`               | Aina ya callback iliyogunduliwa (`"motor"`, `"policy"`, `"motor_fleet"`, n.k.)                          |
| `extracted`          | JSON safi na data ya majibu. Tazama ukurasa wa nyaraka wa kila rasilimali kwa sehemu halisi unazopokea. |
| `body`               | XML kamili iliyochambuliwa kama kitu cha JS (utahitaji hii kwa uthibitisho)                             |
| `signature_verified` | `true` ikiwa sahihi ya kidijitali ilithibitishwa                                                        |
| `raw_xml`            | Mfuatano wa XML wa asili                                                                                |

## Kuthibitisha Callback

Hii ndiyo hatua muhimu zaidi. TIRA inatarajia uthibitishe kila callback. Usipofanya, wataendelea kurudia.

```js
app.post("/tira/motor-callback", async (req, res) => {
  const result = await tira.motor.handleCallback(req.body);

  // Hifadhi matokeo kwenye database yako
  await saveToDatabase(result.extracted);

  // Jenga XML ya uthibitisho
  const ackXml = tira.acknowledge(
    result.body,
    "kitambulisho-chako-cha-kipekee",
  );

  // Itume kama jibu la HTTP
  res.set("Content-Type", "application/xml").send(ackXml);
});
```

### Jinsi `tira.acknowledge()` Inavyofanya Kazi

Inachukua hoja mbili:

| Hoja                | Maelezo                                                                   |
| ------------------- | ------------------------------------------------------------------------- |
| `result.body`       | `body` kutoka matokeo ya callback (kitu kamili cha XML kilichochambuliwa) |
| `acknowledgementId` | Mfuatano wa kipekee unaozalisha (mf. UUID)                                |

Inarudisha mfuatano wa XML uliosainiwa tayari kutumwa kama jibu la HTTP. Kifurushi kinafanya kiotomatiki:

- Kuamua jina sahihi la tag ya uthibitisho (mf. `MotorCoverNoteRefRes` inakuwa `MotorCoverNoteRefResAck`)
- Kujaza `AcknowledgementId`, `ResponseId`, `AcknowledgementStatusCode`, na `AcknowledgementStatusDesc`
- Kusaini XML na ufunguo wako wa faragha
- Kuifunga katika `<TiraMsg>` na `<MsgSignature>`

### XML ya Uthibitisho Inavyoonekana

Huhitaji kujenga hii mwenyewe — hivi ndivyo kifurushi kinazalisha:

```xml
<TiraMsg>
<MotorCoverNoteRefResAck>
  <AcknowledgementId>kitambulisho-chako-cha-kipekee</AcknowledgementId>
  <ResponseId>TIRA22424232355</ResponseId>
  <AcknowledgementStatusCode>TIRA001</AcknowledgementStatusCode>
  <AcknowledgementStatusDesc>Successful</AcknowledgementStatusDesc>
</MotorCoverNoteRefResAck>
<MsgSignature>sahihi-iliyosimbwa-kwa-base64...</MsgSignature>
</TiraMsg>
```

## Mfano Kamili

Hapa kuna mfano kamili wa Express.js unaounganisha yote pamoja — kutuma data, kushughulikia callback, na kuthibitisha.

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

// Hatua 1: Tuma bima ya gari
app.post("/submit", async (req, res) => {
  const result = await tira.motor.submit({
    request_id: uuid(),
    callback_url: "https://your-server.com/tira/motor-callback",
    // ...sehemu nyingine ya mzigo wako
  });

  // Hatua 2: TIRA inathibitisha utumaji wako
  res.json({
    message: "Imetumwa kwa TIRA",
    acknowledgement_id: result.acknowledgement_id,
    status: result.tira_status_code,
  });
});

// Hatua 4 na 5: TIRA inatuma matokeo, unashughulikia
app.post("/tira/motor-callback", async (req, res) => {
  const result = await tira.motor.handleCallback(req.body);

  // Hifadhi kwenye database yako
  await db.coverNotes.update({
    where: { request_id: result.extracted.request_id },
    data: {
      status: result.extracted.response_status_code,
      reference_number: result.extracted.covernote_reference_number,
      sticker_number: result.extracted.sticker_number,
    },
  });

  // Hatua 6: Thibitisha callback ya TIRA
  const ackXml = tira.acknowledge(result.body, uuid());
  res.set("Content-Type", "application/xml").send(ackXml);
});

app.listen(3000);
```

## Makosa Yanayowezekana

Hapa kuna makosa unayoweza kukutana nayo unaposhughulikia callback:

### `TiraSignatureError`

Sahihi ya kidijitali ya callback haifanani. Ujumbe unaweza kuwa si kutoka TIRA, au ulibadilishwa wakati wa usafiri.

```js
const { TiraSignatureError } = require("tira-node");

try {
  const result = await tira.motor.handleCallback(req.body);
} catch (err) {
  if (err instanceof TiraSignatureError) {
    console.error("Uthibitishaji wa sahihi umeshindwa:", err.message);
    // Usiamini callback hii
  }
}
```

Tazama [Usainiaji na Uthibitishaji](/sw/signing-verification) kwa maelezo zaidi kuhusu jinsi sahihi zinavyofanya kazi.

### `TiraApiError`

TIRA ilirudisha kosa la HTTP (msimbo wa hali si 2xx) ulipotuma ombi lako. Hii si suala la callback — inamaanisha kitu kimekwenda vibaya na utumaji wenyewe.

```js
const { TiraApiError } = require("tira-node");

try {
  const result = await tira.motor.submit(payload);
} catch (err) {
  if (err instanceof TiraApiError) {
    console.error("Msimbo wa HTTP:", err.status);
    console.error("Jibu:", err.bodyText);
  }
}
```

### Aina ya Callback Haijawezeshwa

Ikiwa unatumia `tira.handleCallback()` ya ujumla na aina ya callback haijawezeshwa katika usanidi wako, utapata kosa hili:

```
Error: Callback type 'motor' is not enabled.
Add { enabled_callbacks: { motor: true } } to your Tira config.
```

Rekebisha kwa kuongeza aina ya callback kwenye usanidi wako wa `enabled_callbacks`. Tazama [Uanzishaji](/sw/initialization#enabled-callbacks) kwa maelezo.

### Aina ya Callback Isiyojulikana

Ikiwa XML ya callback ina tag ya jibu ambayo kifurushi hakiitambui:

```
Error: Unknown callback type: unrecognized response tag 'SomeNewTag'.
```

Hii inaweza kumaanisha TIRA imeongeza aina mpya ya jibu ambayo kifurushi bado hakiitambui. Angalia masasisho ya kifurushi au ripoti kama suala.

Kwa orodha kamili ya misimbo ya hali ya TIRA na maana yake, tazama [Misimbo ya Makosa](/sw/error-codes).

## Maelezo Muhimu

::: tip Thibitisha daima
TIRA itaendelea kurudia callback ikiwa huithibitishi. Daima tuma XML ya uthibitisho, hata ukikutana na kosa wakati wa kushughulikia data.
:::

::: tip Vitambulisho vya kipekee vya uthibitisho
Kitambulisho cha uthibitisho kinapaswa kuwa cha kipekee kwa kila callback unayopokea. Kutumia UUID ndiyo njia rahisi zaidi.
:::

::: warning Aina ya maudhui ya XML
Hakikisha endpoint yako ya callback inakubali XML. Katika Express.js, ongeza middleware hii:

```js
app.use(express.text({ type: "application/xml" }));
```

Bila hii, `req.body` itakuwa tupu na kushughulikia callback kutashindwa.
:::

::: warning Kushughulikia makosa
Funga tu mantiki yako ya biashara (mf. kuhifadhi kwenye hifadhidata) katika try-catch — uchambuzi wa callback na uthibitisho lazima uendelee daima:

```js
app.post("/tira/motor-callback", async (req, res) => {
  const result = await tira.motor.handleCallback(req.body);

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
