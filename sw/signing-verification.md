# Usainiaji na Uthibitishaji

Kila ujumbe unaobadilishwa kati ya mfumo wako na TIRA umesainiwa kidijitali. Hii inamaanisha TIRA wanaweza kuhakikisha ombi linatoka kweli kwako, na wewe unaweza kuhakikisha jibu linatoka kweli kutoka TIRA. Kifurushi kinashughulikia haya yote kiotomatiki — huhitaji kuandika msimbo wowote wa kusaini au kuthibitisha mwenyewe.

Ukurasa huu unaeleza jinsi inavyofanya kazi nyuma ya pazia.

## Jinsi Inavyofanya Kazi (Picha Kubwa)

TIRA inatumia mfumo unaoitwa **PKI (Public Key Infrastructure)**. Wazo ni rahisi:

- **Wewe** una ufunguo wa faragha ambao wewe tu unajua. Unautumia kusaini ujumbe wako.
- **TIRA** wana ufunguo wa umma ambao unaweza kutumia kuthibitisha ujumbe wao.
- Kitu hicho hicho kinafanya kazi kinyume — TIRA wanatumia ufunguo wako wa umma kuthibitisha ujumbe wako.

Funguo hizi zinakuja katika faili za vyeti vya `.pfx` kwa kutumia kiwango cha **PKCS#12**. Algoriti ya usainiaji ni **SHA1withRSA**, na sahihi imeandikwa kwa **BASE64**.

Hii inakupa dhamana tatu:
1. **Uthibitishaji** — pande zote zinajua wanazungumza na nani
2. **Uadilifu** — ujumbe haujabadilishwa wakati wa usafiri
3. **Kutokukataa** — mtumaji hawezi kukataa kuwa alituma ujumbe

## Faili Zako Mbili za Vyeti

Ulipokea faili mbili za `.pfx` kutoka TIRA. Hizi ndizo kila moja inafanya:

### `tiramisclientprivate.pfx` — Cheti Chako cha Faragha

Hiki ni cheti **chako**. Kina ufunguo wako wa faragha na kinatumika kwa mambo mawili:

1. **Kusaini maombi yako** — kila wakati unatuma data kwa TIRA, kifurushi kinaisaini na ufunguo huu. TIRA kisha wanatumia ufunguo wako wa umma upande wao kuthibitisha ni kweli kutoka kwako.
2. **TLS ya pande zote** — kifurushi kinatumia cheti hiki kuthibitisha utambulisho wako katika kiwango cha mtandao pia.

### `tiramispublic.pfx` — Cheti cha Umma cha TIRA

Hiki ni cheti cha **TIRA**. Kina ufunguo wa umma wa TIRA na kinatumika kwa mambo mawili:

1. **Kuthibitisha callback** — TIRA inapotuma jibu kwa URL yako ya callback, kifurushi kinathibitisha sahihi kwa kutumia cheti hiki. Sahihi isipofanana, kifurushi kinatupa kosa.
2. **Uaminifu wa TLS** — kifurushi kinatumia cheti hiki kuamini seva ya TIRA wakati wa muunganisho wa HTTPS.

::: tip Kamwe hushughulikii hizi moja kwa moja
Unapitisha tu njia za faili na nywila kwa mjenzi wa `Tira`. Kifurushi kinasoma faili, kutoa funguo, na kuzitumia inapohitajika. Huhitaji kupiga simu za usainiaji au uthibitishaji mwenyewe.
:::

## Kinachoendelea Unapotuma Ombi

Unapopigia kitu kama `tira.motor.submit({...})`, hivi ndivyo kinachoendelea nyuma ya pazia:

```
Hatua 1: Data yako ya JSON inabadilishwa kuwa XML
         { motor_category: "1", ... }  →  <MotorCoverNoteRefReq>...</MotorCoverNoteRefReq>

Hatua 2: XML inasainiwa na ufunguo wako wa faragha (SHA1withRSA)
         Sahihi inaandikwa kwa BASE64

Hatua 3: Kila kitu kinafungwa katika bahasha ya TiraMsg
```

Ujumbe wa mwisho unaotumwa kwa TIRA unaonekana hivi:

```xml
<TiraMsg>
<MotorCoverNoteRefReq>
  <CoverNoteHdr>
    <RequestId>YOUR-REQUEST-ID</RequestId>
    <!-- ...data yako... -->
  </CoverNoteHdr>
  <CoverNoteDtl>
    <!-- ...data yako... -->
  </CoverNoteDtl>
</MotorCoverNoteRefReq>
<MsgSignature>U6vJ6jZYnrQQST5e/wBifETG9aiP...base64...</MsgSignature>
</TiraMsg>
```

`<MsgSignature>` ni sahihi ya kidijitali ya kila kitu juu yake. TIRA inatumia hii kuthibitisha ujumbe ulikuja kutoka kwako na haukubadilishwa.

**Huhitaji kufanya chochote kati ya hivi mwenyewe.** Piga tu `.submit()` na data yako ya JSON na kifurushi kinafanya mengine yote.

## Kinachoendelea TIRA Inapotuma Callback

TIRA inapotuma matokeo kwa URL yako ya callback, ujumbe unaonekana sawa:

```xml
<TiraMsg>
<CoverNoteRefRes>
  <ResponseId>TIRA22424232355</ResponseId>
  <RequestId>NIC22424232355</RequestId>
  <CoverNoteReferenceNumber>3325253254</CoverNoteReferenceNumber>
  <ResponseStatusCode>TIRA001</ResponseStatusCode>
  <ResponseStatusDesc>Successful</ResponseStatusDesc>
</CoverNoteRefRes>
<MsgSignature>btrhrtigronoirengoienfionewif...base64...</MsgSignature>
</TiraMsg>
```

Unaposhughulikia callback hii, kifurushi:

1. Kinatoa maudhui na `<MsgSignature>` kutoka XML
2. Kinathibitisha sahihi kwa kutumia cheti cha umma cha TIRA (`tiramispublic.pfx`)
3. Sahihi ikiwa **halali** — kinachambua XML na kurudisha JSON safi kwako
4. Sahihi ikiwa **si halali** — kinatupa `TiraSignatureError` (ujumbe unaweza kuwa umeharibika au si kutoka TIRA)

```js
// Kifurushi kinathibitisha sahihi kiotomatiki
const result = await tira.motor.handleCallback(callbackData);

// result.signature_verified → true (sahihi ilikaguliwa na ni halali)
// result.extracted → data yako safi kama JSON
```

## Sehemu ya `signature_verified`

Kila matokeo ya callback yanajumuisha sehemu ya `signature_verified`:

| Thamani | Maana |
|---|---|
| `true` | Sahihi ilithibitishwa na ni halali — ujumbe unatoka kweli TIRA |
| `false` | Uthibitishaji ulirukwa (mfano, umeweka `verify_signatures: false` katika usanidi wako) |

```js
const result = await tira.motor.handleCallback(callbackData);

if (result.signature_verified) {
  console.log("Callback hii imethibitishwa — inatoka TIRA");
}
```

::: warning
Ikiwa `verify_signatures` imewekwa kuwa `false`, kifurushi hakitakagua sahihi kabisa. Fanya hivi tu wakati wa maendeleo. Katika uzalishaji, daima weka uthibitishaji wa sahihi ukiwa umewezeshwa.
:::

## TLS ya Pande Zote

Juu ya sahihi za kidijitali, kifurushi pia kinasanidi **TLS ya pande zote** (mTLS). Hii ni safu ya pili ya usalama katika kiwango cha mtandao.

HTTPS ya kawaida inathibitisha tu kuwa seva ni waliyosema. TLS ya pande zote inafanya pande zote:

- **PFX yako** inatoa cheti cha mteja — ili seva ya TIRA iweze kuthibitisha ni mfumo wako unaounganisha
- **PFX ya TIRA** inatoa cheti cha CA — ili mfumo wako uamini seva ya TIRA

Hii inasanidiwa mara moja unapounda mfano wa `Tira` na inatumika kwa kila ombi kiotomatiki. Huhitaji kusanidi chochote ziada.

## Kushughulikia Makosa

Kifurushi kinatoa darasa maalum za makosa kwa masuala ya usainiaji na uthibitishaji:

### `TiraSignatureError`

Inatupwa sahihi ya callback isipofanana. Hii inamaanisha ujumbe unaweza kuwa si kutoka TIRA, au ulibadilishwa wakati wa usafiri.

```js
const { TiraSignatureError } = require("tira-node");

try {
  const result = await tira.motor.handleCallback(callbackData);
} catch (err) {
  if (err instanceof TiraSignatureError) {
    console.error("Uthibitishaji wa sahihi umeshindwa:", err.message);
    // Usiamini callback hii — inaweza kuwa si kutoka TIRA
  }
}
```

### `TiraApiError`

Inatupwa TIRA inarudisha kosa la HTTP (msimbo wa hali si 2xx). Hii si suala la sahihi — inamaanisha kitu kimekwenda vibaya na ombi lenyewe.

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

## Muhtasari

| Nini | Jinsi | Inashughulikiwa Na |
|---|---|---|
| Kusaini maombi yako | RSA-SHA1 na PFX yako ya faragha, imeandikwa kwa BASE64 | Kiotomatiki |
| Kuthibitisha callback za TIRA | RSA-SHA1 na PFX ya umma ya TIRA | Kiotomatiki |
| TLS ya pande zote | Cheti cha mteja kutoka PFX yako, CA kutoka PFX ya TIRA | Kiotomatiki |
| Ufungaji wa XML (`<TiraMsg>`) | Maudhui + `<MsgSignature>` | Kiotomatiki |
| Ubadilishaji wa JSON ↔ XML | JSON yako ndani, JSON safi nje | Kiotomatiki |

Wewe unaandika JSON. Kifurushi kinashughulikia mengine yote.
