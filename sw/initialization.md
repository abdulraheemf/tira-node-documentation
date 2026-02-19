# Uanzishaji

Ukurasa huu unashughulikia jinsi ya kusakinisha `tira-node`, kuisanidi, na kuanzisha kitu cha `Tira`. Mwishoni, utakuwa na mfano unaofanya kazi tayari kupiga simu za API.

## Usakinishaji

```bash
npm install tira-node
```

## Usanidi wa Msingi

Ingiza darasa la `Tira` na uunde mfano na vitambulisho na vyeti vyako:

::: code-group

```js [CommonJS]
const { Tira } = require("tira-node");

const tira = new Tira({
  base_url: "https://tiramis-test.tira.go.tz",
  client_code: "YOUR_CLIENT_CODE",
  client_key: "YOUR_CLIENT_KEY",
  system_code: "YOUR_SYSTEM_CODE",
  transacting_company_code: "YOUR_COMPANY_CODE",
  client_private_pfx_path: "./certs/tiramisclientprivate.pfx",
  client_private_pfx_passphrase: "your-pfx-password",
  tira_public_pfx_path: "./certs/tiramispublic.pfx",
  tira_public_pfx_passphrase: "tira-public-password",
});
```

```ts [ESM / TypeScript]
import { Tira } from "tira-node";

const tira = new Tira({
  base_url: "https://tiramis-test.tira.go.tz",
  client_code: "YOUR_CLIENT_CODE",
  client_key: "YOUR_CLIENT_KEY",
  system_code: "YOUR_SYSTEM_CODE",
  transacting_company_code: "YOUR_COMPANY_CODE",
  client_private_pfx_path: "./certs/tiramisclientprivate.pfx",
  client_private_pfx_passphrase: "your-pfx-password",
  tira_public_pfx_path: "./certs/tiramispublic.pfx",
  tira_public_pfx_passphrase: "tira-public-password",
});
```

:::

Hiyo ndiyo yote. Sasa unaweza kutumia `tira.motor.submit(...)`, `tira.policy.submit(...)`, na rasilimali zingine zote.

## Rejea ya Usanidi

Kila sehemu unayoweza kupitisha kwa mjenzi wa `Tira`:

### Sehemu Zinazohitajika

| Sehemu                          | Aina     | Maelezo                                                                                                                          |
| ------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `base_url`                      | `string` | URL ya msingi ya TIRAMIS API. Hii ndiyo kitu pekee kinachobadilika kati ya mazingira ya majaribio na uzalishaji.                 |
| `client_code`                   | `string` | Kitambulisho chako cha kipekee cha mteja. Kinapewa na TIRA wakati wa usajili.                                                    |
| `client_key`                    | `string` | Ufunguo wako wa uthibitishaji. Unapewa na TIRA wakati wa usajili.                                                                |
| `system_code`                   | `string` | Kitambulisho cha mfumo kwa muunganisho wako. Kinapewa na TIRA wakati wa usajili.                                                 |
| `transacting_company_code`      | `string` | Msimbo wa kampuni kwa shughuli ya sasa. Tazama [Kuelewa transacting_company_code](#kuelewa-transacting-company-code) hapa chini. |
| `client_private_pfx_path`       | `string` | Njia ya faili ya cheti chako cha `tiramisclientprivate.pfx`. Kinatumika kusaini maombi na uthibitishaji wa TLS wa pande zote.    |
| `client_private_pfx_passphrase` | `string` | Nywila ya cheti chako cha PFX cha faragha.                                                                                       |
| `tira_public_pfx_path`          | `string` | Njia ya faili ya cheti cha TIRA `tiramispublic.pfx`. Kinatumika kuthibitisha sahihi za callback na kama cheti cha CA cha TLS.    |
| `tira_public_pfx_passphrase`    | `string` | Nywila ya cheti cha PFX cha umma cha TIRA.                                                                                       |

::: danger Sehemu zote zinazohitajika lazima zitolewe
Ikiwa sehemu yoyote inayohitajika inakosekana au ni tupu, mjenzi atatupa kosa mara moja. Kwa mfano:

```
Error: Tira: client_code is required
```

Hii ni makusudi — ni bora kushindwa haraka wakati wa kuanza kuliko kushindwa kimya kwenye simu yako ya kwanza ya API.
:::

### Sehemu za Hiari

| Sehemu              | Aina               | Chaguo-msingi | Maelezo                                                                                    |
| ------------------- | ------------------ | ------------- | ------------------------------------------------------------------------------------------ |
| `verify_signatures` | `boolean`          | `true`        | Kuthibitisha sahihi za callback za TIRA kwa kutumia cheti chao cha umma.                   |
| `enabled_callbacks` | `EnabledCallbacks` | `undefined`   | Aina zipi za callback ambazo njia ya kawaida ya `tira.handleCallback()` inapaswa kukubali. |

Hizi zinashughulikiwa kwa undani katika [Usanidi wa Hiari](#usanidi-wa-hiari).

## Kuelewa `transacting_company_code`

Tofauti na vitambulisho vingine ambavyo ni vya kudumu na vinapewa na TIRA, `transacting_company_code` inaweza kubadilika kulingana na hali yako.

### Ikiwa wewe ni dalali

Msimbo wako wa kampuni ni msimbo wako mwenyewe. Inabaki sawa kwa kila shughuli. Unaweza kuiweka mara moja wakati wa uanzishaji na kuisahau.

```js
const tira = new Tira({
  // ...usanidi mwingine...
  transacting_company_code: "MY_BROKER_CODE", // Daima sawa
});
```

### Ikiwa wewe ni bima

Msimbo wa kampuni unaweza kubadilika kulingana na dalali gani anayehusika katika shughuli. Kwa mfano, ikiwa dalali A anakutumia covernote ya gari, unatumia msimbo wa kampuni ya dalali A. Ikiwa dalali B anatuma moja, unatumia msimbo wa dalali B.

```js
// Shughuli ya Dalali A
const tiraForBrokerA = new Tira({
  // ...usanidi mwingine...
  transacting_company_code: "BROKER_A_CODE",
});

// Shughuli ya Dalali B
const tiraForBrokerB = new Tira({
  // ...usanidi mwingine...
  transacting_company_code: "BROKER_B_CODE",
});
```

### Ikiwa unahudumia wateja wengi

Unajenga jukwaa linalounganisha makampuni mengi ya bima au madalali. Kila mteja ana msimbo wake wa kampuni, kwa hivyo unaunda mfano wa `Tira` kwa kila mteja.

```js
function getTiraForClient(clientCompanyCode) {
  return new Tira({
    // ...usanidi mwingine...
    transacting_company_code: clientCompanyCode,
  });
}
```

## Mifumo ya Uanzishaji

### Mfumo wa 1: Anzisha Mara Moja, Tumia Kila Mahali

Bora wakati `transacting_company_code` yako haibadiliki kamwe. Huu ndio mtazamo rahisi zaidi — unda mfano mara moja na uitumie katika programu yako yote.

```js
const { Tira } = require("tira-node");

// Unda mara moja wakati wa kuanza
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

// Itumie popote katika programu yako
app.post("/submit-motor", async (req, res) => {
  const result = await tira.motor.submit(req.body);
  res.json(result);
});

app.post("/submit-policy", async (req, res) => {
  const result = await tira.policy.submit(req.body);
  res.json(result);
});

app.post("/tira-callback", async (req, res) => {
  const result = await tira.motor.handleCallback(req.body);
  // chakata matokeo...
  const ackXml = tira.acknowledge(result.body, "your-ack-id");
  res.set("Content-Type", "application/xml").send(ackXml);
});
```

### Mfumo wa 2: Anzisha kwa Kila Shughuli

Bora wakati `transacting_company_code` inabadilika kwa kila ombi. Unda mfano mpya wa `Tira` kwa kila shughuli.

```js
const { Tira } = require("tira-node");

function createTira(companyCode) {
  return new Tira({
    base_url: process.env.TIRA_BASE_URL,
    client_code: process.env.TIRA_CLIENT_CODE,
    client_key: process.env.TIRA_CLIENT_KEY,
    system_code: process.env.TIRA_SYSTEM_CODE,
    transacting_company_code: companyCode,
    client_private_pfx_path: "./certs/tiramisclientprivate.pfx",
    client_private_pfx_passphrase: process.env.TIRA_PFX_PASSPHRASE,
    tira_public_pfx_path: "./certs/tiramispublic.pfx",
    tira_public_pfx_passphrase: process.env.TIRA_PUBLIC_PFX_PASSPHRASE,
  });
}

app.post("/submit-motor", async (req, res) => {
  const { broker_code, ...payload } = req.body;

  // Unda mfano wa Tira kwa dalali huyu mahususi
  const tira = createTira(broker_code);
  const result = await tira.motor.submit(payload);
  res.json(result);
});
```

### Mfumo wa 3: Weka Usanidi Safi na Kitu cha Msingi

Ikiwa unaunda mifano mingi, epuka kurudia usanidi sawa kwa kutoa sehemu ya pamoja:

```js
const { Tira } = require("tira-node");

// Usanidi wa pamoja — kila kitu isipokuwa transacting_company_code
const baseConfig = {
  base_url: process.env.TIRA_BASE_URL,
  client_code: process.env.TIRA_CLIENT_CODE,
  client_key: process.env.TIRA_CLIENT_KEY,
  system_code: process.env.TIRA_SYSTEM_CODE,
  client_private_pfx_path: "./certs/tiramisclientprivate.pfx",
  client_private_pfx_passphrase: process.env.TIRA_PFX_PASSPHRASE,
  tira_public_pfx_path: "./certs/tiramispublic.pfx",
  tira_public_pfx_passphrase: process.env.TIRA_PUBLIC_PFX_PASSPHRASE,
};

// Unda mifano na misimbo tofauti ya kampuni
const tiraForBrokerA = new Tira({
  ...baseConfig,
  transacting_company_code: "BROKER_A",
});
const tiraForBrokerB = new Tira({
  ...baseConfig,
  transacting_company_code: "BROKER_B",
});

// Au tumia kazi
function createTira(companyCode) {
  return new Tira({ ...baseConfig, transacting_company_code: companyCode });
}
```

::: tip Tumia vigezo vya mazingira
Hifadhi thamani nyeti kama `client_key`, `client_private_pfx_passphrase`, na nywila za vyeti katika vigezo vya mazingira. Kamwe usiziweke moja kwa moja kwenye msimbo wako wa chanzo.
:::

## Usanidi wa Hiari

### `verify_signatures`

Kwa chaguo-msingi, `tira-node` inathibitisha sahihi ya kidijitali kwenye kila callback kutoka TIRA. Hii inahakikisha jibu ni kweli kutoka TIRA na halijaharibika.

```js
const tira = new Tira({
  // ...sehemu zinazohitajika...
  verify_signatures: true, // Hii ni chaguo-msingi
});
```

Unaweza kuzima hii wakati wa maendeleo ikiwa unajaribu na callback bandia ambazo hazijasainiwa:

```js
const tira = new Tira({
  // ...sehemu zinazohitajika...
  verify_signatures: false, // Kwa maendeleo tu!
});
```

::: danger Kamwe usizime katika uzalishaji
Kuweka `verify_signatures: false` katika uzalishaji inamaanisha unaamini callback yoyote bila kuthibitisha inatoka TIRA. Hii ni hatari ya usalama. Izime tu wakati wa maendeleo ya ndani au majaribio.
:::

### `enabled_callbacks`

Chaguo hili linahitajika tu ikiwa unatumia njia ya **kawaida** ya `tira.handleCallback()`. Hii ni njia kwenye kitu kikuu cha `tira` ambayo inagundua kiotomatiki aina ya callback (motor, policy, claim, nk.) na kuielekeza ipasavyo.

Ikiwa unatumia washughulikiaji wa **rasilimali mahususi** kama `tira.motor.handleCallback()`, huhitaji kuweka hii.

```js
const tira = new Tira({
  // ...sehemu zinazohitajika...
  enabled_callbacks: {
    motor: true,
    motor_fleet: true,
    non_life_other: true,
    policy: true,
    // Wezesha tu unachohitaji
  },
});

// Sasa unaweza kutumia mshughulikiaji wa kawaida
app.post("/tira-callback", async (req, res) => {
  // Inagundua kiotomatiki kama ni callback ya motor, policy, claim, nk.
  const result = await tira.handleCallback(req.body);
  console.log(result.type); // "motor", "policy", nk.
});
```

Ikiwa aina ya callback haijawezeshwa, mshughulikiaji wa kawaida atatupa kosa:

```
Error: Callback type 'motor' is not enabled.
Add { enabled_callbacks: { motor: true } } to your Tira config.
```

Hizi ndizo aina zote za callback zinazopatikana:

| Aina ya Callback     | Maelezo                                         |
| -------------------- | ----------------------------------------------- |
| `motor`              | Callback za covernote ya gari                   |
| `motor_fleet`        | Callback za covernote ya msafara wa magari      |
| `non_life_other`     | Callback za covernote zisizo za maisha nyingine |
| `reinsurance`        | Callback za uwasilishaji wa bima-tena           |
| `policy`             | Callback za uwasilishaji wa sera                |
| `claim_notification` | Callback za taarifa ya madai                    |
| `claim_intimation`   | Callback za uarifu wa madai                     |
| `claim_assessment`   | Callback za tathmini ya madai                   |
| `discharge_voucher`  | Callback za hati ya malipo                      |
| `claim_payment`      | Callback za malipo ya madai                     |
| `claim_rejection`    | Callback za kukataliwa kwa madai                |

## Kubadilisha Kati ya Majaribio na Uzalishaji

Msimbo wako hauhitaji kubadilika kati ya mazingira. Sasisha tu `base_url` na utumie vitambulisho husika:

```js
// .env kwa majaribio
TIRA_BASE_URL=https://tiramis-test.tira.go.tz

// .env kwa uzalishaji
TIRA_BASE_URL=https://tiramis.tira.go.tz
```

```js
const tira = new Tira({
  base_url: process.env.TIRA_BASE_URL, // Inaelekeza majaribio au uzalishaji kulingana na env
  client_code: process.env.TIRA_CLIENT_CODE,
  client_key: process.env.TIRA_CLIENT_KEY,
  system_code: process.env.TIRA_SYSTEM_CODE,
  transacting_company_code: process.env.TIRA_COMPANY_CODE,
  client_private_pfx_path: process.env.TIRA_PFX_PATH,
  client_private_pfx_passphrase: process.env.TIRA_PFX_PASSPHRASE,
  tira_public_pfx_path: process.env.TIRA_PUBLIC_PFX_PATH,
  tira_public_pfx_passphrase: process.env.TIRA_PUBLIC_PFX_PASSPHRASE,
});
```

::: info
Kumbuka kuwa mazingira ya majaribio na uzalishaji yanatumia **vyeti na vitambulisho tofauti**. Ukibadilisha kwenda uzalishaji, hakikisha unasasisha faili zako za PFX na thamani zote za vitambulisho — si tu `base_url`.
:::

## Rasilimali Zinazopatikana

Baada ya uanzishaji, kitu cha `tira` kinakupa ufikiaji wa rasilimali zote za TIRAMIS:

### Covernote

| Rasilimali          | Maelezo                                                 | Njia                                          |
| ------------------- | ------------------------------------------------------- | --------------------------------------------- |
| `tira.motor`        | Covernote za magari                                     | `.submit()`, `.handleCallback()`, `.verify()` |
| `tira.motorFleet`   | Covernote za msafara wa magari (magari mengi)           | `.submit()`, `.handleCallback()`              |
| `tira.nonLifeOther` | Covernote zisizo za maisha nyingine (moto, bahari, nk.) | `.submit()`, `.handleCallback()`              |

### Uthibitishaji

| Rasilimali                   | Maelezo                              | Njia        |
| ---------------------------- | ------------------------------------ | ----------- |
| `tira.coverNoteVerification` | Thibitisha hali ya covernote na TIRA | `.submit()` |

### Sera na Bima-tena

| Rasilimali         | Maelezo                   | Njia                             |
| ------------------ | ------------------------- | -------------------------------- |
| `tira.policy`      | Uwasilishaji wa sera      | `.submit()`, `.handleCallback()` |
| `tira.reinsurance` | Uwasilishaji wa bima-tena | `.submit()`, `.handleCallback()` |

### Madai

| Rasilimali               | Maelezo                            | Njia                             |
| ------------------------ | ---------------------------------- | -------------------------------- |
| `tira.claimNotification` | Arifu TIRA kuhusu dai jipya        | `.submit()`, `.handleCallback()` |
| `tira.claimIntimation`   | Wasilisha maelezo ya uarifu wa dai | `.submit()`, `.handleCallback()` |
| `tira.claimAssessment`   | Wasilisha tathmini ya dai          | `.submit()`, `.handleCallback()` |
| `tira.dischargeVoucher`  | Wasilisha hati ya malipo           | `.submit()`, `.handleCallback()` |
| `tira.claimPayment`      | Wasilisha malipo ya dai            | `.submit()`, `.handleCallback()` |
| `tira.claimRejection`    | Wasilisha kukataliwa kwa dai       | `.submit()`, `.handleCallback()` |

### Njia za Kiwango cha Juu

| Njia                            | Maelezo                                                                                                                                    |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `tira.handleCallback(input)`    | Mshughulikiaji wa callback wa kawaida. Inagundua kiotomatiki aina ya callback na kutoa data. Inahitaji `enabled_callbacks` katika usanidi. |
| `tira.acknowledge(body, ackId)` | Inajenga XML ya kukubalika iliyosainiwa kutuma kwa TIRA baada ya kupokea callback.                                                         |

## Nini Kinafuata

- [Usainiaji na Uthibitishaji](/sw/signing-verification) — jinsi usainiaji wa maombi na uthibitishaji wa majibu unavyofanya kazi nyuma ya pazia
