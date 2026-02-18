# Kuanza

Kabla ya kutumia `tira-node`, unahitaji kupitia mchakato wa usanidi na TIRA. Ukurasa huu unakuongoza kupitia kila kitu unachohitaji kabla ya kuandika mstari wowote wa msimbo.

## Kabla ya Kuanza

`tira-node` inaunganisha na mfumo wa TIRAMIS wa TIRA. TIRAMIS hairuhusu mtu yeyote kuunganisha — unahitaji kupitia mchakato wa usajili na TIRA kwanza.

**Hakuna kazi yoyote ya kifurushi hiki itakayofanya kazi** hadi TIRA:

1. Wameidhinisha ombi lako la muunganisho
2. Wamekupa vitambulisho na vyeti vyako
3. Wameruhusu anwani ya IP ya seva yako

Ikiwa bado hujaanza mchakato huu, wasiliana na TIRA kuanza.

## Utakachopokea kutoka TIRA

TIRA watakapoidhinisha muunganisho wako, watakupa faili na vitambulisho kadhaa. Hivi ndivyo unavyopaswa kutarajia:

### Nyaraka za Rejea

TIRA wanapaswa kukupa nyaraka hizi. Ikiwa hukuzipokea, unaweza kuzipakua kutoka viungo hapa chini:

| Nyaraka | Kiungo cha Kupakua |
|---|---|
| Nyaraka za TIRAMIS API V1.0 | [Pakua PDF](https://storage.labedan.solutions/Tira%20Files/TIRAMIS%20API%20OFFICIAL%20DOCUMENTATION%20V1.0.pdf) |
| Nyaraka za TIRAMIS API V1.3 | [Pakua PDF](https://storage.labedan.solutions/Tira%20Files/TIRAMIS%20API%20OFFICIAL%20DOCUMENTATION%20V1.3.pdf) |
| Orodha ya Nchi | [Pakua XLSX](https://storage.labedan.solutions/Tira%20Files/COUNTRIES.xlsx) |
| Orodha ya Sarafu | [Pakua XLSX](https://storage.labedan.solutions/Tira%20Files/CURRENCIES.xlsx) |
| Mikoa na Wilaya | [Pakua XLSX](https://storage.labedan.solutions/Tira%20Files/REGIONS%20AND%20DISTRICTS.xlsx) |
| Misimbo ya Bidhaa na Hatari | [Pakua XLSX](https://storage.labedan.solutions/Tira%20Files/TIRAMIS%20PRODUCT%20&%20RISK%20CODES.xlsx) |

Faili zote za rejea za umma zinapatikana kwenye: [storage.labedan.solutions/Tira Files/](https://storage.labedan.solutions/Tira%20Files/)

### Vituo vya API

Huhitaji kukumbuka au kuweka moja kwa moja vituo vyovyote vya TIRAMIS API. Kifurushi kinajumuisha vyote:

```js
const { ENDPOINTS } = require("tira-node");
// au: import { ENDPOINTS } from "tira-node";

console.log(ENDPOINTS.covernote_motor);
// "/ecovernote/api/covernote/non-life/motor/v2/request"
```

Hivi ndivyo vituo vyote vinavyopatikana:

| Ufunguo | Kituo |
|---|---|
| `covernote_motor` | `/ecovernote/api/covernote/non-life/motor/v2/request` |
| `covernote_motor_fleet` | `/ecovernote/api/covernote/non-life/motor-fleet/v2/request` |
| `motor_verification` | `/dispatch/api/motor/verification/v1/request` |
| `covernote_other` | `/ecovernote/api/covernote/non-life/other/v2/request` |
| `shortterm_covernote` | `/ecovernote/api/covernote/non-life/other/v2/request` |
| `longterm_covernote` | `/ecovernote/api/covernote/non-life/other/v2/request` |
| `covernote_verification` | `/ecovernote/api/covernote/verification/v1/request` |
| `policy_submission` | `/ecovernote/api/policy/v1/request` |
| `reinsurance_submission` | `/ecovernote/api/reinsurance/v1/request` |
| `claim_notification` | `/eclaim/api/claim/claim-notification/v1/request` |
| `claim_intimation` | `/eclaim/api/claim/claim-intimation/v1/request` |
| `claim_assessment` | `/eclaim/api/claim/claim-assessment/v1/request` |
| `discharge_voucher` | `/eclaim/api/claim/claim-dischargevoucher/v1/request` |
| `claim_payment` | `/eclaim/api/claim/claim-payment/v1/request` |
| `claim_rejection` | `/eclaim/api/claim/claim-rejection/v1/request` |

### Data za Rejea Zilizojengwa Ndani

Kifurushi pia kinajumuisha nchi, sarafu, na mikoa ndani yake, kwa hivyo huhitaji kuzipakia kutoka faili za nje:

```js
import { COUNTRIES, CURRENCIES, REGIONS } from "tira-node";

console.log(COUNTRIES["Tanzania, United Republic of"]); // "TZA"
console.log(CURRENCIES["Tanzanian Shilling"]);          // "TZS"
```

## Vyeti

Hii ndiyo sehemu muhimu zaidi. TIRA inatoa faili za vyeti vya PFX ambazo zinatumika kwa mambo mawili:

1. **Kusaini maombi yako** — ili TIRA iweze kuthibitisha kuwa ombi linatoka kweli kwako
2. **Kuthibitisha majibu ya TIRA** — ili uweze kuthibitisha kuwa jibu linatoka kweli kutoka TIRA

Utahitaji vitu hivi 4:

| Kipengee | Maelezo |
|---|---|
| `tiramisclientprivate.pfx` | Faili yako ya cheti cha faragha kwa ajili ya kusaini maombi |
| Nywila ya PFX ya mteja | Nywila ya cheti chako cha faragha |
| `tiramispublic.pfx` | Cheti cha umma cha TIRA kwa ajili ya kuthibitisha majibu yao |
| Nywila ya PFX ya umma ya TIRA | Nywila ya cheti cha umma cha TIRA |

::: tip Majaribio dhidi ya Uzalishaji
Wakati wa **majaribio**, TIRA inatoa vyeti vyote vya mteja na seva. Unapoingia **uzalishaji**, unatoa vitambulisho vyako mwenyewe na TIRA inatoa vyeti vyao vya uzalishaji.
:::

[Jifunze zaidi kuhusu usainiaji na uthibitishaji](/sw/signing-verification)

## Vitambulisho Vyako

TIRA watakupa **vitambulisho hivi vya kudumu** kabla ya kuanza:

| Kitambulisho | Maelezo |
|---|---|
| `client_code` | Kitambulisho chako cha kipekee cha mteja |
| `client_key` | Ufunguo wako wa uthibitishaji |
| `system_code` | Kitambulisho cha mfumo kwa muunganisho wako |

### Kuhusu `transacting_company_code`

`transacting_company_code` **si** kitambulisho cha kudumu kutoka TIRA. Inawakilisha msimbo wa kampuni ya mtu anayefanya shughuli. Inategemea hali yako:

- **Ikiwa wewe ni dalali**: `transacting_company_code` yako kwa kawaida ni msimbo wako wa kampuni — inabaki sawa
- **Ikiwa wewe ni bima**: msimbo unaweza kubadilika kulingana na dalali anayehusika katika shughuli hiyo
- **Ikiwa unaunganisha wateja wengi**: kila mteja ana msimbo wake wa kampuni

Hii inakupa njia mbili za kusanidi `Tira`:

1. **Tuli** — unda mfano mara moja na uitumie kila mahali. Bora wakati msimbo wako wa kampuni haubadiliki (mfano, wewe ni dalali)
2. **Inayobadilika** — unda mfano mpya kwa kila shughuli. Bora wakati msimbo wa kampuni unabadilika (mfano, wewe ni bima unaofanya kazi na madalali tofauti)

[Tazama mifano ya uanzishaji](/sw/initialization)

## Orodha ya Ukaguzi wa Muunganisho

Kabla ya kuanza kupiga simu za API, hakikisha umekamilisha yote:

- [ ] Wasiliana na TIRA kuanza mchakato wa muunganisho
- [ ] Pokea nyaraka za TIRAMIS API
- [ ] Pokea faili za data za rejea (nchi, sarafu, mikoa, misimbo ya bidhaa)
- [ ] Pokea vyeti vya PFX (`tiramisclientprivate.pfx` + `tiramispublic.pfx`) na nywila zao
- [ ] Pokea vitambulisho vyako (`client_code`, `client_key`, `system_code`)
- [ ] Ruhusu anwani ya IP ya seva yako na TIRA
- [ ] Sakinisha kifurushi: `npm install tira-node`
- [ ] Anzisha kitu cha `Tira` na vitambulisho na vyeti vyako — [tazama jinsi gani](/sw/initialization)

## Jaribio, UAT, kisha Uzalishaji

Mchakato wa muunganisho una hatua 3:

### 1. Mazingira ya Majaribio

Unaendeleza na kujaribu muunganisho wako dhidi ya seva ya majaribio ya TIRA. Hapa ndipo unahakikisha kila kitu kinafanya kazi — kutuma covernote, kushughulikia callback, kuchakata majibu. Tumia vitambulisho vya majaribio na kituo cha majaribio ambacho TIRA walikupa.

### 2. UAT (Upimaji wa Kukubalika kwa Mtumiaji)

Ukiwa na uhakika kila kitu kinafanya kazi, unapanga kikao cha UAT na timu ya TIRA. Watajaribu muunganisho wako pamoja nawe kuhakikisha kila kitu kinakidhi mahitaji yao.

### 3. Uzalishaji

Baada ya kupita UAT, unabadilisha hadi vitambulisho vya uzalishaji na kituo cha uzalishaji. Muunganisho wako sasa uko katika uzalishaji.

::: info Kubadilisha mazingira
Kubadilisha kati ya majaribio na uzalishaji, badilisha tu `base_url` na utumie vitambulisho husika. Msimbo wako wengine unabaki sawa.
:::

## Jinsi Mawasiliano ya TIRAMIS Yanavyofanya Kazi

Huhitaji kujishughulisha na yoyote ya haya — kifurushi kinashughulikia yote kiotomatiki. Lakini ni vizuri kuelewa kinachoendelea nyuma ya pazia.

### Muundo wa Ujumbe

Kila ombi kwa TIRA linatumwa kama **ombi la XML POST**. Kifurushi kinakubali data yako kama **JSON** na kuibadilisha kuwa muundo sahihi wa XML kiotomatiki.

### Usimbaji

TIRA inasaidia usimbaji wa UTF-8 na UTF-16. Kifurushi kinatumia **UTF-8** — hii inashughulikiwa kiotomatiki.

### Uondoaji wa Herufi Maalum

TIRA inahitaji herufi zote maalum za XML ziondolewe. Kifurushi kinafanya hivi kwako kiotomatiki. Hivi ndivyo vinavyoondolewa:

| Herufi | Maelezo | Inaondolewa Kama |
|---|---|---|
| `&` | Ampersand | `&amp;` |
| `<` | Chini ya | `&lt;` |
| `>` | Zaidi ya | `&gt;` |
| `"` | Alama za kunukuu | `&quot;` |
| `'` | Apostrofi | `&apos;` |

### Vichwa vya Ombi

Kila ombi kwa TIRA linajumuisha vichwa hivi — vinashughulikiwa kiotomatiki:

```
Content-Type: application/xml
ClientCode: <msimbo wako wa mteja>
ClientKey: <ufunguo wako wa mteja>
```

### Muundo wa Ombi

Kila ombi linalotumwa kwa TIRA linafungwa katika muundo huu wa XML:

```xml
<TiraMsg>
  <Content><!-- data yako hapa --></Content>
  <MsgSignature><!-- sahihi ya kidijitali --></MsgSignature>
</TiraMsg>
```

Kifurushi kinajenga XML ya `<Content>` kutoka data yako ya JSON, kinaisaini na cheti chako cha PFX kuunda `<MsgSignature>`, na kufunga kila kitu pamoja. Wewe unapitisha tu data yako ya JSON.

### Muundo wa Jibu

TIRA inajibu na kifungashio hicho hicho cha `<TiraMsg>`:

```xml
<TiraMsg>
  <Content><!-- data ya jibu --></Content>
  <MsgSignature><!-- sahihi ya TIRA --></MsgSignature>
</TiraMsg>
```

Kifurushi kinachambua XML, kinathibitisha sahihi ya TIRA kwa kutumia cheti chao cha umma, na kinarudisha JSON safi kwako.

## Mtiririko wa Uwasilishaji wa Data

Hivi ndivyo data inavyotiririka kati ya mfumo wako na TIRA. Kila uwasilishaji unafuata muundo huu:

```
Hatua 1: Unawasilisha data
         tira.motor.submit({...})
         Data yako inajumuisha callback_url ambapo TIRA itatuma matokeo.
              ↓
Hatua 2: TIRA inakubali ombi lako
         Unapata acknowledgement_id na msimbo wa hali.
              ↓
Hatua 3: TIRA inachakata ombi lako
         Hii inafanyika upande wa TIRA. Unasubiri callback.
              ↓
Hatua 4: TIRA inatuma matokeo kwa callback_url yako
         Unashughulikia kwa:
         tira.motor.handleCallback(req.body)
         au: tira.handleCallback(req.body)
              ↓
Hatua 5: Unakubali jibu la TIRA
         tira.acknowledge(parsedBody, acknowledgementId)
```

::: warning Sheria za Kujaribu Tena
- **Hatua 2**: Ikiwa hupokei kukubalika kutoka TIRA, endelea kujaribu tena uwasilishaji wako hadi upokee (isipokuwa kuna tatizo la mtandao).
- **Hatua 5**: Ikiwa TIRA haipokei kukubalika kwako, wataendelea kujaribu tena callback hadi ukubali.

Pande zote mbili zinaendelea kujaribu tena hadi upande mwingine uthibitishe kupokea.
:::

## Nini Kinafuata

Sasa unaelewa mahitaji ya awali na jinsi mawasiliano ya TIRAMIS yanavyofanya kazi, uko tayari kuanza kujenga:

- [Anzisha kitu cha Tira](/sw/initialization) — sanidi vitambulisho na vyeti vyako
- [Usainiaji na Uthibitishaji](/sw/signing-verification) — elewa jinsi usainiaji wa maombi na uthibitishaji wa majibu unavyofanya kazi
