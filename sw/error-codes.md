# Misimbo ya Makosa

TIRA inarudisha msimbo wa hali katika kila jibu. Utaona misimbo hii katika sehemu mbili:

- `tira_status_code` — katika jibu la utumaji (unapoita `.submit()`)
- `response_status_code` — katika data ya callback (TIRA inapotuma matokeo kwa URL yako ya callback)

`TIRA001` inamaanisha mafanikio. Msimbo wowote mwingine unamaanisha kuna tatizo. Ukurasa huu unaorodhesha kila msimbo wa hali wa TIRA unaojulikana, maana yake, na unachoweza kujaribu kurekebisha.

## Ujumla na Mfumo

| Msimbo    | Maelezo                                                                   | Suluhisho Linalopendekezwa                                                                                                                                                                                        |
| --------- | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TIRA001` | Mafanikio                                                                 | Hakuna hatua inayohitajika — ombi lako limeshughulikiwa kwa mafanikio.                                                                                                                                            |
| `TIRA002` | Kushindwa                                                                 | Kushindwa kwa ujumla. Angalia mzigo wako na ujaribu tena. Ikiwa inaendelea, wasiliana na TIRA.                                                                                                                    |
| `TIRA003` | Ufunguo wa mteja si sahihi                                                | Angalia `client_key` katika usanidi wako inalingana na TIRA walikupa.                                                                                                                                             |
| `TIRA004` | Kosa limetokea wakati wa kushughulikia                                    | Tatizo la muda upande wa TIRA. Jaribu ombi lako tena. Ikiwa linaendelea, wasiliana na TIRA.                                                                                                                       |
| `TIRA005` | Data ya ombi si sahihi au haijakamilika                                   | Sehemu moja au zaidi zinazohitajika zinakosekana au zina thamani zisizo sahihi. Angalia sehemu zote za mzigo wako.                                                                                                |
| `TIRA006` | Ombi haliwezi kushughulikiwa. Jaribu tena baadaye                         | Tatizo la muda. Subiri kidogo na ujaribu tena.                                                                                                                                                                    |
| `TIRA007` | Data iliyoombwa haipatikani                                               | Rekodi haipo. Angalia vitambulisho na nambari za rejea zako.                                                                                                                                                      |
| `TIRA008` | Taarifa za kichwa cha ombi zinazohitajika hazijatolewa                    | Kifurushi kinatuma vichwa kiotomatiki. Hakikisha `client_code` na `client_key` zimewekwa kwa usahihi.                                                                                                             |
| `TIRA009` | Taarifa za kichwa cha ombi hazilingani na vigezo vya utambulisho wa mteja | `client_code` au `client_key` yako hailingani na rekodi za TIRA. Thibitisha stakabadhi zako na TIRA.                                                                                                              |
| `TIRA010` | Kushindwa kwa mawasiliano ya ndani ya seva                                | Tatizo la seva ya TIRA. Jaribu tena baadaye. Ikiwa linaendelea, wasiliana na TIRA.                                                                                                                                |
| `TIRA011` | Usanidi wa mfumo wa mteja haujapatikana                                   | Mfumo wako haujasanidiwa upande wa TIRA. Wasiliana na TIRA kuusanidi.                                                                                                                                             |
| `TIRA012` | Usanidi wa mfumo wa mteja hauko hai au umezimwa                           | Usanidi wa mfumo wako umezimwa. Wasiliana na TIRA kuuwezesha tena.                                                                                                                                                |
| `TIRA013` | Mteja hauko hai au si sahihi                                              | Akaunti yako ya mteja haiko hai au si sahihi. Wasiliana na TIRA.                                                                                                                                                  |
| `TIRA014` | Faili ya cheti cha PKI ya mteja haijapatikana katika njia iliyoainishwa   | TIRA haiwezi kupata cheti chako upande wao. Wasiliana na TIRA kuthibitisha usanidi wako wa PKI.                                                                                                                   |
| `TIRA015` | Usanidi wa PKI ya mteja ni mbaya au unakosekana                           | Tatizo la usanidi wa PKI upande wa TIRA. Wasiliana na TIRA.                                                                                                                                                       |
| `TIRA016` | Sahihi ya ombi si sahihi                                                  | Sahihi yako ya kidijitali si sahihi. Angalia faili yako ya PFX ya faragha (`client_private_pfx_path`) na nywila (`client_private_pfx_passphrase`). Tazama [Usainiaji na Uthibitishaji](/sw/signing-verification). |

## Mawasiliano na Callback

| Msimbo    | Maelezo                                              | Suluhisho Linalopendekezwa                                                                                                                                 |
| --------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TIRA017` | URL ya callback ya mfumo wa mteja si sahihi          | Angalia `callback_url` katika mzigo wako ni URL halali na inayopatikana hadharani.                                                                         |
| `TIRA048` | Kuandaa maudhui ya arifa kumeshindwa                 | TIRA haiwezi kuandaa arifa. Jaribu tena. Ikiwa inaendelea, wasiliana na TIRA.                                                                              |
| `TIRA049` | Hakuna maudhui yaliyorudishwa na mfumo wa mteja      | Endpoint yako ya callback ilirudisha jibu tupu. Hakikisha unarudisha XML ya uthibitisho. Tazama [Callback na Uthibitisho](/sw/callbacks-acknowledgements). |
| `TIRA050` | Kosa limetokea wakati wa kuunganisha na mfumo wa nje | TIRA haiwezi kufikia URL yako ya callback. Angalia seva yako inaendesha na inapatikana kutoka mtandaoni.                                                   |
| `TIRA051` | Mfumo wa mteja hauruhusiwi kwa mawasiliano ya ndani  | Mfumo wako haujasanidiwa kupokea data kutoka TIRA. Wasiliana na TIRA.                                                                                      |
| `TIRA052` | Mfumo wa mteja hauruhusiwi kwa mawasiliano ya nje    | Mfumo wako haujasanidiwa kutuma data kwa TIRA. Wasiliana na TIRA.                                                                                          |
| `TIRA088` | Uthibitisho si sahihi                                | XML yako ya uthibitisho ina dosari. Kifurushi kinajenga hii kiotomatiki — hakikisha unapitisha `result.body` sahihi kwa `tira.acknowledge()`.              |
| `TIRA089` | Muamala unasubiri kushughulikiwa                     | Muamala uliopita bado unashughulikiwa. Subiri na ujaribu tena baadaye.                                                                                     |

## Bima (Cover Note)

| Msimbo    | Maelezo                                                      | Suluhisho Linalopendekezwa                                                                                        |
| --------- | ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| `TIRA018` | Msimbo wa kampuni si sahihi                                  | Angalia `transacting_company_code` katika usanidi wako. Lazima iwe msimbo halali wa kampuni uliosajiliwa na TIRA. |
| `TIRA019` | Aina ya bima si sahihi                                       | Angalia thamani ya aina ya bima.                                                                                  |
| `TIRA020` | Tarehe ya kuanza ya bima si sahihi                           | Angalia muundo na thamani ya tarehe ya kuanza.                                                                    |
| `TIRA021` | Tarehe ya mwisho ya bima si sahihi                           | Angalia muundo na thamani ya tarehe ya mwisho. Lazima iwe baada ya tarehe ya kuanza.                              |
| `TIRA022` | Kampuni ya bima si sahihi                                    | Msimbo wa kampuni ya bima hautambuliwi. Angalia na TIRA.                                                          |
| `TIRA023` | Kampuni ya muamala wa bima si sahihi                         | Msimbo wa kampuni inayofanya muamala si sahihi. Angalia `transacting_company_code`.                               |
| `TIRA024` | Nambari ya bima au kitambulisho cha bima kimejirudia         | Bima yenye nambari hii tayari ipo. Tumia kitambulisho cha kipekee.                                                |
| `TIRA025` | Kituo cha mauzo ya bima si sahihi au hakiko hai              | Msimbo wa kituo cha mauzo si sahihi au hauko hai. Angalia na TIRA.                                                |
| `TIRA026` | Bidhaa ya muamala wa bima si sahihi au haiko hai             | Msimbo wa bidhaa si sahihi au hauko hai. Angalia rejea ya misimbo ya bidhaa za TIRAMIS.                           |
| `TIRA027` | Sarafu ya muamala wa bima si sahihi au haiko hai             | Msimbo wa sarafu si sahihi. Tumia msimbo halali wa sarafu (mf. `"TZS"`).                                          |
| `TIRA028` | Kiwango cha kubadilisha sarafu si sahihi                     | Angalia thamani ya kiwango cha kubadilisha. Lazima iwe nambari halali chanya.                                     |
| `TIRA029` | Kiasi cha bima sawa si sahihi                                | Angalia kiasi cha bima sawa. Lazima iwe nambari halali chanya.                                                    |
| `TIRA030` | Kiwango cha malipo ya bima si sahihi                         | Angalia thamani ya kiwango cha malipo.                                                                            |
| `TIRA031` | Kiasi cha malipo ya bima si sahihi (malipo kabla ya punguzo) | Angalia kiasi cha malipo kabla ya punguzo.                                                                        |
| `TIRA032` | Msimbo wa kodi ya bima au aina ya kodi si sahihi             | Angalia misimbo yote ya kodi ni aina halali za kodi za TIRA.                                                      |
| `TIRA033` | Viwango vya aina ya kodi ya bima vilivyotumika si sahihi     | Angalia thamani za viwango vya kodi.                                                                              |
| `TIRA034` | Kiasi cha aina ya kodi ya bima si sahihi                     | Angalia hesabu ya kiasi cha kodi.                                                                                 |
| `TIRA035` | Jumla ya kodi au malipo pamoja na kodi si sahihi             | Angalia jumla (malipo + kodi) inajumlishwa kwa usahihi.                                                           |
| `TIRA036` | Nambari ya rejea ya bima si sahihi                           | Nambari ya rejea ya bima si halali. Angalia muundo wa nambari ya rejea.                                           |
| `TIRA054` | Hatari iliyofunikwa si sahihi                                | Angalia maelezo ya hatari iliyofunikwa katika mzigo wako.                                                         |
| `TIRA055` | Kiasi cha malipo baada ya punguzo sawa si sahihi             | Angalia hesabu ya malipo baada ya punguzo.                                                                        |
| `TIRA081` | Aina ya bima si sahihi                                       | Angalia thamani ya aina ya bima.                                                                                  |
| `TIRA082` | Nambari ya rejea ya bima ya awali si sahihi                  | Nambari ya rejea ya bima ya awali haipo au si sahihi.                                                             |
| `TIRA083` | Jumla ya malipo pamoja na kodi si sahihi                     | Angalia hesabu ya jumla ya malipo pamoja na kodi.                                                                 |
| `TIRA084` | Jumla ya malipo bila kodi si sahihi                          | Angalia hesabu ya jumla ya malipo bila kodi.                                                                      |
| `TIRA085` | Aina ya punguzo la malipo si sahihi                          | Angalia thamani ya aina ya punguzo.                                                                               |
| `TIRA086` | Kiasi cha punguzo la malipo si sahihi                        | Angalia kiasi cha punguzo.                                                                                        |
| `TIRA087` | Punguzo la malipo haliruhusiwi kwa aina hii ya bima          | Aina hii ya bima hairuhusu punguzo. Ondoa punguzo kutoka mzigo wako.                                              |
| `TIRA090` | Bima hai na bidhaa ya bima iliyoainishwa ipo kwa gari hili   | Bima hai tayari ipo kwa gari hili na bidhaa hii. Huwezi kuunda nakala.                                            |
| `TIRA091` | Thamani ya malipo baada ya punguzo si sahihi                 | Angalia hesabu ya malipo baada ya punguzo.                                                                        |
| `TIRA095` | Nambari ya utambulisho wa ombi si sahihi                     | Angalia `request_id` katika mzigo wako. Lazima iwe mfuatano wa kipekee na halali.                                 |
| `TIRA096` | Msimbo wa mfumo wa mteja si sahihi                           | Angalia `system_code` katika usanidi wako.                                                                        |
| `TIRA097` | Aina ya bima si sahihi                                       | Angalia thamani ya aina ya bima.                                                                                  |
| `TIRA098` | Nambari ya bima si sahihi                                    | Angalia muundo na thamani ya nambari ya bima.                                                                     |
| `TIRA099` | Maelezo ya bima si sahihi                                    | Angalia sehemu ya maelezo ya bima.                                                                                |
| `TIRA100` | Kifungu cha uendeshaji wa bima si sahihi                     | Angalia thamani ya kifungu cha uendeshaji.                                                                        |
| `TIRA101` | Njia ya malipo si sahihi                                     | Angalia thamani ya njia ya malipo.                                                                                |
| `TIRA102` | Kamisheni iliyolipwa si sahihi                               | Angalia thamani ya kamisheni iliyolipwa.                                                                          |
| `TIRA103` | Kiwango cha kamisheni si sahihi                              | Angalia thamani ya kiwango cha kamisheni.                                                                         |

## Gari na Kundi (Fleet)

| Msimbo    | Maelezo                                                        | Suluhisho Linalopendekezwa                                                       |
| --------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `TIRA104` | Thamani ya kutambua muamala ni sehemu ya kundi au la si sahihi | Angalia thamani ya bendera ya kundi.                                             |
| `TIRA105` | Nambari ya utambulisho wa kundi si sahihi au imejirudia        | Kitambulisho cha kundi si sahihi au tayari kipo. Tumia kitambulisho cha kipekee. |
| `TIRA106` | Ukubwa wa kundi si sahihi                                      | Angalia thamani ya ukubwa wa kundi. Lazima ilingane na idadi halisi ya magari.   |
| `TIRA107` | Jumla ya thamani ya magari yaliyobimishwa si sahihi            | Angalia jumla ya thamani ya bima kwa kundi.                                      |
| `TIRA108` | Kiingilio cha kundi si sahihi                                  | Angalia nambari ya mfuatano wa kiingilio cha kundi.                              |
| `TIRA136` | Aina ya gari si sahihi                                         | Angalia `motor_category`. Lazima iwe `"1"` (Gari) au `"2"` (Pikipiki).           |
| `TIRA137` | Nambari ya usajili wa gari si sahihi                           | Angalia `registration_number`. Inahitajika kwa magari yaliyosajiliwa.            |
| `TIRA138` | Nambari ya chasi ya gari si sahihi                             | Angalia `chassis_number`. Lazima iwe nambari halali ya chasi/VIN.                |
| `TIRA139` | Mtengenezaji wa gari si sahihi                                 | Angalia `make` (mf. "Toyota", "Honda"). Lazima isiwe tupu.                       |
| `TIRA140` | Modeli ya gari si sahihi                                       | Angalia `model` (mf. "Corolla", "Civic"). Lazima isiwe tupu.                     |
| `TIRA141` | Nambari ya modeli ya gari si sahihi                            | Angalia `model_number`.                                                          |
| `TIRA142` | Aina ya mwili wa gari si sahihi                                | Angalia `body_type` (mf. "Sedan", "SUV").                                        |
| `TIRA143` | Rangi ya gari si sahihi                                        | Angalia `color`. Lazima isiwe tupu.                                              |
| `TIRA144` | Nambari ya injini ya gari si sahihi                            | Angalia `engine_number`.                                                         |
| `TIRA145` | Uwezo wa injini ya gari si sahihi                              | Angalia `engine_capacity`. Lazima iwe nambari halali (katika cc).                |
| `TIRA146` | Mafuta yanayotumika si sahihi                                  | Angalia `fuel_used` (mf. "Petrol", "Diesel").                                    |
| `TIRA147` | Idadi ya axle za gari si sahihi                                | Angalia `number_of_axles`.                                                       |
| `TIRA148` | Umbali wa axle za gari si sahihi                               | Angalia `axle_distance`.                                                         |
| `TIRA149` | Uwezo wa kukaa wa gari si sahihi                               | Angalia `sitting_capacity`.                                                      |
| `TIRA150` | Mwaka wa utengenezaji wa gari si sahihi                        | Angalia `year_of_manufacture`. Lazima iwe mwaka halali.                          |
| `TIRA151` | Uzito wa tare wa gari si sahihi                                | Angalia `tare_weight`. Lazima iwe nambari halali (katika kg).                    |
| `TIRA152` | Uzito wa jumla wa gari si sahihi                               | Angalia `gross_weight`. Lazima iwe nambari halali (katika kg).                   |
| `TIRA153` | Matumizi ya gari si sahihi                                     | Angalia `motor_usage`. Lazima iwe msimbo halali wa matumizi.                     |
| `TIRA154` | Jina la mmiliki wa gari si sahihi                              | Angalia `owner_name`.                                                            |
| `TIRA155` | Aina ya mmiliki wa gari si sahihi                              | Angalia `owner_category`.                                                        |
| `TIRA156` | Anwani ya mmiliki wa gari si sahihi                            | Angalia `owner_address`. Lazima isiwe tupu.                                      |
| `TIRA159` | Nambari ya stika ya bima si sahihi                             | Nambari ya stika si sahihi. Kawaida hupewa na TIRA.                              |
| `TIRA219` | Aina ya gari si sahihi                                         | Angalia `motor_type`. Lazima iwe `"1"` (Limesajiliwa) au `"2"` (Katika Usafiri). |
| `TIRA220` | Bima hai na maelezo ya gari yaliyoainishwa ipo                 | Bima hai tayari ipo kwa gari hili. Huwezi kuunda nakala.                         |
| `TIRA221` | Aina ya kundi si sahihi                                        | Angalia thamani ya aina ya kundi.                                                |

## Mshika Sera na Afisa

| Msimbo    | Maelezo                                                                      | Suluhisho Linalopendekezwa                                            |
| --------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `TIRA109` | Jina la afisa wa bima si sahihi                                              | Angalia sehemu ya jina la afisa wa bima. Lazima lisiwe tupu.          |
| `TIRA110` | Cheo cha afisa wa bima si sahihi                                             | Angalia sehemu ya cheo cha afisa wa bima.                             |
| `TIRA122` | Jina la mshika sera si sahihi                                                | Angalia jina la mshika sera. Lazima lisiwe tupu.                      |
| `TIRA123` | Tarehe ya kuzaliwa ya mshika sera au tarehe ya usajili wa kampuni si sahihi  | Angalia muundo na thamani ya tarehe.                                  |
| `TIRA124` | Aina ya mshika sera si sahihi                                                | Angalia aina ya mshika sera (mf. mtu binafsi au kampuni).             |
| `TIRA125` | Nambari ya kitambulisho au nambari ya cheti cha kuanzishwa kampuni si sahihi | Angalia nambari ya kitambulisho au cheti.                             |
| `TIRA126` | Aina ya kitambulisho si sahihi                                               | Angalia msimbo wa aina ya kitambulisho.                               |
| `TIRA127` | Jinsia si sahihi                                                             | Angalia thamani ya jinsia.                                            |
| `TIRA128` | Nchi au msimbo wa nchi si sahihi                                             | Angalia msimbo wa nchi. Tumia msimbo halali wa ISO (mf. `"TZA"`).     |
| `TIRA129` | Mkoa au jimbo si sahihi                                                      | Angalia msimbo wa mkoa. Tumia msimbo halali wa mkoa wa TIRA.          |
| `TIRA130` | Wilaya au kaunti si sahihi                                                   | Angalia msimbo wa wilaya. Tumia msimbo halali wa wilaya wa TIRA.      |
| `TIRA131` | Mtaa si sahihi                                                               | Angalia sehemu ya mtaa. Lazima isiwe tupu.                            |
| `TIRA132` | Nambari ya simu si sahihi                                                    | Angalia muundo wa nambari ya simu.                                    |
| `TIRA133` | Nambari ya faksi si sahihi                                                   | Angalia muundo wa nambari ya faksi.                                   |
| `TIRA134` | Anwani si sahihi                                                             | Angalia sehemu ya anwani. Lazima isiwe tupu.                          |
| `TIRA135` | Anwani ya barua pepe si sahihi                                               | Angalia muundo wa barua pepe. Lazima iwe anwani halali ya barua pepe. |

## Hatari, Nyongeza na Mada

| Msimbo    | Maelezo                                               | Suluhisho Linalopendekezwa                                                                    |
| --------- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `TIRA111` | Msimbo wa hatari ya bima si sahihi                    | Angalia msimbo wa hatari. Lazima iwe msimbo halali wa hatari wa TIRAMIS kutoka data ya rejea. |
| `TIRA112` | Kiasi cha bima si sahihi                              | Angalia kiasi cha bima. Lazima iwe nambari halali chanya.                                     |
| `TIRA113` | Rejea ya mada iliyofunikwa si sahihi                  | Angalia sehemu ya rejea ya mada.                                                              |
| `TIRA114` | Maelezo ya mada iliyofunikwa si sahihi                | Angalia sehemu ya maelezo ya mada. Lazima isiwe tupu.                                         |
| `TIRA115` | Rejea ya nyongeza ya bima si sahihi                   | Angalia sehemu ya rejea ya nyongeza.                                                          |
| `TIRA116` | Maelezo ya nyongeza ya bima si sahihi                 | Angalia sehemu ya maelezo ya nyongeza.                                                        |
| `TIRA117` | Kiasi cha malipo ya nyongeza ya bima si sahihi        | Angalia kiasi cha malipo ya nyongeza.                                                         |
| `TIRA118` | Kiwango cha malipo ya nyongeza ya bima si sahihi      | Angalia kiwango cha malipo ya nyongeza.                                                       |
| `TIRA119` | Kiasi cha malipo ya nyongeza bila kodi si sahihi      | Angalia hesabu ya malipo ya nyongeza bila kodi.                                               |
| `TIRA120` | Kiasi sawa cha malipo ya nyongeza bila kodi si sahihi | Angalia hesabu ya kiasi sawa cha malipo bila kodi.                                            |
| `TIRA121` | Kiasi cha malipo ya nyongeza pamoja na kodi si sahihi | Angalia hesabu ya malipo ya nyongeza pamoja na kodi.                                          |

## Bima ya Bima Tena (Reinsurance)

| Msimbo    | Maelezo                                                       | Suluhisho Linalopendekezwa                                                              |
| --------- | ------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `TIRA037` | Tamko la bima tena limejirudia                                | Tamko la bima tena lenye kitambulisho hiki tayari lipo. Tumia kitambulisho cha kipekee. |
| `TIRA038` | Mshiriki wa bima tena si sahihi                               | Angalia maelezo ya mshiriki wa bima tena.                                               |
| `TIRA039` | Kiasi cha malipo ya bima shirikishi si sahihi                 | Angalia kiasi cha malipo ya bima shirikishi.                                            |
| `TIRA040` | Thamani ya hisa ya ushiriki wa bima tena si sahihi            | Angalia asilimia ya hisa ya ushiriki.                                                   |
| `TIRA041` | Aina ya ushiriki wa bima tena si sahihi                       | Angalia thamani ya aina ya ushiriki.                                                    |
| `TIRA080` | Dalali wa bima tena si sahihi                                 | Angalia msimbo wa dalali wa bima tena.                                                  |
| `TIRA160` | Aina ya bima tena si sahihi                                   | Angalia thamani ya aina ya bima tena.                                                   |
| `TIRA161` | Mshiriki wa bima tena au msimbo wa mshiriki si sahihi         | Angalia msimbo wa mshiriki. Lazima iwe mshiriki halali aliyesajiliwa.                   |
| `TIRA162` | Aina ya mshiriki wa bima tena si sahihi                       | Angalia thamani ya aina ya mshiriki.                                                    |
| `TIRA163` | Fomu ya bima tena si sahihi                                   | Angalia thamani ya fomu ya bima tena.                                                   |
| `TIRA164` | Aina ya bima tena si sahihi                                   | Angalia thamani ya aina ya bima tena.                                                   |
| `TIRA165` | Mdalali-mpya au msimbo wa mdalali-mpya wa bima tena si sahihi | Angalia msimbo wa mdalali-mpya.                                                         |
| `TIRA166` | Thamani ya kamisheni ya udalali-mpya wa bima tena si sahihi   | Angalia thamani ya kamisheni ya udalali-mpya.                                           |
| `TIRA167` | Thamani ya kamisheni ya bima tena si sahihi                   | Angalia thamani ya kamisheni.                                                           |
| `TIRA168` | Thamani ya hisa ya malipo ya bima tena si sahihi              | Angalia thamani ya hisa ya malipo.                                                      |
| `TIRA169` | Tarehe ya ushiriki wa bima tena si sahihi                     | Angalia muundo na thamani ya tarehe ya ushiriki.                                        |

## Sera (Policy)

| Msimbo    | Maelezo                                   | Suluhisho Linalopendekezwa                                                     |
| --------- | ----------------------------------------- | ------------------------------------------------------------------------------ |
| `TIRA042` | Nambari ya sera ya bima si sahihi         | Angalia nambari ya sera. Lazima iwe kitambulisho cha kipekee na halali.        |
| `TIRA043` | Kifungu cha uendeshaji wa sera si sahihi  | Angalia thamani ya kifungu cha uendeshaji.                                     |
| `TIRA044` | Bima zilizotumika katika sera hazipo      | Bima zilizorejelewa katika sera hazipo. Tuma bima kwanza.                      |
| `TIRA045` | Sera imejirudia                           | Sera yenye kitambulisho hiki tayari ipo. Tumia nambari ya kipekee ya sera.     |
| `TIRA046` | Bima zilizotumika zina sera               | Bima tayari zina sera iliyoambatishwa. Huwezi kuziambatisha kwa sera nyingine. |
| `TIRA047` | Bima zilizotumika katika sera zimejirudia | Bima moja inaorodheshwa zaidi ya mara moja katika sera. Ondoa marudio.         |
| `TIRA157` | Masharti maalum ya sera si sahihi         | Angalia sehemu ya masharti maalum.                                             |
| `TIRA158` | Kutengwa kwa sera si sahihi               | Angalia sehemu ya kutengwa.                                                    |

## Madai — Arifa

| Msimbo    | Maelezo                                                    | Suluhisho Linalopendekezwa                                                 |
| --------- | ---------------------------------------------------------- | -------------------------------------------------------------------------- |
| `TIRA053` | Tarehe ya ripoti ya arifa ya madai si sahihi               | Angalia muundo na thamani ya tarehe ya ripoti.                             |
| `TIRA056` | Nambari ya arifa ya madai imejirudia                       | Arifa ya madai yenye nambari hii tayari ipo. Tumia nambari ya kipekee.     |
| `TIRA057` | Nambari ya arifa ya madai si sahihi                        | Angalia muundo wa nambari ya arifa ya madai.                               |
| `TIRA058` | Mdai apo kwa bima iliyoainishwa                            | Madai tayari yametolewa kwa bima hii na mdai huyu.                         |
| `TIRA059` | Nambari ya rejea ya madai si sahihi                        | Angalia nambari ya rejea ya madai. Inaweza kuwa haipo au muundo si sahihi. |
| `TIRA079` | Tarehe ya hasara ya madai si sahihi                        | Angalia muundo na thamani ya tarehe ya hasara.                             |
| `TIRA092` | Maelezo ya mdai si sahihi                                  | Angalia sehemu zote za mdai (jina, kitambulisho, aina, n.k.).              |
| `TIRA170` | Thamani ya kutambua fomu ya madai imejazwa au la si sahihi | Angalia thamani ya bendera ya kukamilisha fomu ya madai.                   |
| `TIRA171` | Asili ya hasara ya madai si sahihi                         | Angalia thamani ya asili ya hasara.                                        |
| `TIRA172` | Aina ya hasara ya madai si sahihi                          | Angalia thamani ya aina ya hasara.                                         |
| `TIRA173` | Mahali pa hasara ya madai si sahihi                        | Angalia sehemu ya mahali pa hasara. Lazima isiwe tupu.                     |
| `TIRA174` | Kiasi cha makadirio ya madai si sahihi                     | Angalia kiasi cha makadirio ya madai. Lazima iwe nambari halali chanya.    |
| `TIRA175` | Kiasi kilichohifadhiwa cha madai si sahihi                 | Angalia kiasi kilichohifadhiwa. Lazima iwe nambari halali chanya.          |
| `TIRA176` | Njia ya kuhifadhi madai si sahihi                          | Angalia thamani ya njia ya kuhifadhi.                                      |

## Madai — Intimation

| Msimbo    | Maelezo                                  | Suluhisho Linalopendekezwa                                                              |
| --------- | ---------------------------------------- | --------------------------------------------------------------------------------------- |
| `TIRA060` | Intimation ya madai imejirudia           | Intimation ya madai yenye kitambulisho hiki tayari ipo. Tumia kitambulisho cha kipekee. |
| `TIRA061` | Tarehe ya intimation ya madai si sahihi  | Angalia muundo na thamani ya tarehe ya intimation.                                      |
| `TIRA062` | Nambari ya intimation ya madai si sahihi | Angalia muundo wa nambari ya intimation ya madai.                                       |

## Madai — Tathmini (Assessment)

| Msimbo    | Maelezo                                                       | Suluhisho Linalopendekezwa                                         |
| --------- | ------------------------------------------------------------- | ------------------------------------------------------------------ |
| `TIRA063` | Nambari ya tathmini ya madai imejirudia                       | Tathmini yenye nambari hii tayari ipo. Tumia nambari ya kipekee.   |
| `TIRA064` | Tarehe ya kupokea tathmini ya madai si sahihi                 | Angalia muundo na thamani ya tarehe ya kupokea.                    |
| `TIRA065` | Tarehe ya kuidhinisha madai si sahihi                         | Angalia muundo na thamani ya tarehe ya kuidhinisha.                |
| `TIRA066` | Tarehe ya marekebisho ya madai si sahihi                      | Angalia muundo na thamani ya tarehe ya marekebisho.                |
| `TIRA067` | Tarehe ya mawasiliano ya ofa ya madai si sahihi               | Angalia muundo na thamani ya tarehe ya mawasiliano ya ofa.         |
| `TIRA068` | Tarehe ya jibu la ofa ya madai ya mdai si sahihi              | Angalia muundo na thamani ya tarehe ya jibu la ofa.                |
| `TIRA069` | Upatanisho wa ofa si sahihi                                   | Angalia maelezo ya upatanisho wa ofa.                              |
| `TIRA093` | Nambari ya tathmini ya madai si sahihi                        | Angalia muundo wa nambari ya tathmini.                             |
| `TIRA094` | Sababu ya kesi ya madai si sahihi                             | Angalia sehemu ya sababu ya kesi.                                  |
| `TIRA177` | Chaguo la tathmini ya hasara ya madai si sahihi               | Angalia thamani ya chaguo la tathmini.                             |
| `TIRA178` | Jina la mtathimini wa madai si sahihi                         | Angalia jina la mtathimini. Lazima lisiwe tupu.                    |
| `TIRA179` | Nambari ya kitambulisho cha mtathimini wa madai si sahihi     | Angalia nambari ya kitambulisho cha mtathimini.                    |
| `TIRA180` | Aina ya kitambulisho cha mtathimini wa madai si sahihi        | Angalia msimbo wa aina ya kitambulisho cha mtathimini.             |
| `TIRA181` | Jina la mdai si sahihi                                        | Angalia jina la mdai. Lazima lisiwe tupu.                          |
| `TIRA182` | Tarehe ya kuzaliwa ya mdai si sahihi                          | Angalia muundo na thamani ya tarehe ya kuzaliwa ya mdai.           |
| `TIRA183` | Aina ya mdai si sahihi                                        | Angalia thamani ya aina ya mdai.                                   |
| `TIRA184` | Aina ya mdai si sahihi                                        | Angalia thamani ya aina ya mdai.                                   |
| `TIRA185` | Nambari ya kitambulisho cha mdai si sahihi                    | Angalia nambari ya kitambulisho cha mdai.                          |
| `TIRA186` | Aina ya kitambulisho cha mdai si sahihi                       | Angalia msimbo wa aina ya kitambulisho cha mdai.                   |
| `TIRA187` | Muhtasari wa ripoti ya tathmini ya madai si sahihi            | Angalia sehemu ya muhtasari wa ripoti. Lazima isiwe tupu.          |
| `TIRA188` | Kiasi cha tathmini ya madai si sahihi                         | Angalia kiasi cha tathmini. Lazima iwe nambari halali chanya.      |
| `TIRA189` | Kiasi kilichoidhinishwa cha madai si sahihi                   | Angalia kiasi kilichoidhinishwa. Lazima iwe nambari halali chanya. |
| `TIRA190` | Tarehe ya kuidhinisha madai si sahihi                         | Angalia muundo na thamani ya tarehe ya kuidhinisha.                |
| `TIRA191` | Mamlaka ya kuidhinisha madai si sahihi                        | Angalia sehemu ya mamlaka ya kuidhinisha.                          |
| `TIRA192` | Thamani ya kutambua ni tathmini-mpya ya madai au la si sahihi | Angalia thamani ya bendera ya tathmini-mpya.                       |

## Madai — Hati ya Malipo (Discharge Voucher)

| Msimbo    | Maelezo                                                      | Suluhisho Linalopendekezwa                                             |
| --------- | ------------------------------------------------------------ | ---------------------------------------------------------------------- |
| `TIRA193` | Nambari ya hati ya malipo si sahihi                          | Angalia muundo wa nambari ya hati ya malipo.                           |
| `TIRA194` | Hati ya malipo imejirudia                                    | Hati ya malipo yenye nambari hii tayari ipo. Tumia nambari ya kipekee. |
| `TIRA195` | Tarehe ya hati ya malipo si sahihi                           | Angalia muundo na thamani ya tarehe ya hati.                           |
| `TIRA196` | Tarehe ya mawasiliano ya ofa ya hati ya malipo si sahihi     | Angalia muundo na thamani ya tarehe ya mawasiliano ya ofa.             |
| `TIRA197` | Kiasi cha ofa kilichowasilishwa cha hati ya malipo si sahihi | Angalia kiasi kilichowasilishwa. Lazima iwe nambari halali chanya.     |
| `TIRA198` | Tarehe ya jibu la ofa ya hati ya malipo si sahihi            | Angalia muundo na thamani ya tarehe ya jibu.                           |
| `TIRA199` | Tarehe ya marekebisho ya ofa ya hati ya malipo si sahihi     | Angalia muundo na thamani ya tarehe ya marekebisho.                    |
| `TIRA200` | Sababu ya marekebisho ya ofa ya hati ya malipo si sahihi     | Angalia sehemu ya sababu ya marekebisho. Lazima isiwe tupu.            |
| `TIRA201` | Kiasi cha marekebisho ya ofa ya hati ya malipo si sahihi     | Angalia kiasi cha marekebisho.                                         |
| `TIRA202` | Tarehe ya upatanisho wa ofa ya hati ya malipo si sahihi      | Angalia muundo na thamani ya tarehe ya upatanisho.                     |
| `TIRA203` | Sababu ya upatanisho wa ofa ya hati ya malipo si sahihi      | Angalia sehemu ya sababu ya upatanisho.                                |
| `TIRA204` | Kiasi cha upatanisho wa ofa ya hati ya malipo si sahihi      | Angalia kiasi cha upatanisho.                                          |
| `TIRA205` | Thamani ya kutambua ofa ilikubaliwa au la si sahihi          | Angalia thamani ya bendera ya kukubali ofa.                            |

## Madai — Malipo

| Msimbo    | Maelezo                                                                         | Suluhisho Linalopendekezwa                                             |
| --------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `TIRA070` | Tathmini ya madai kwa malipo haijapatikana                                      | Tuma tathmini ya madai kabla ya kutuma malipo.                         |
| `TIRA071` | Nambari ya malipo ya madai imejirudia                                           | Malipo yenye nambari hii tayari yapo. Tumia nambari ya kipekee.        |
| `TIRA072` | Madai tayari yamelipwa                                                          | Madai haya tayari yamelipwa. Huwezi kutuma malipo ya nakala.           |
| `TIRA073` | Tarehe ya malipo ya madai si sahihi                                             | Angalia muundo na thamani ya tarehe ya malipo.                         |
| `TIRA074` | Sarafu ya malipo ya madai si sahihi                                             | Angalia msimbo wa sarafu. Tumia msimbo halali wa sarafu (mf. `"TZS"`). |
| `TIRA075` | Kiasi cha malipo ya madai si sahihi                                             | Angalia kiasi cha malipo. Lazima iwe nambari halali chanya.            |
| `TIRA206` | Nambari ya malipo ya madai si sahihi                                            | Angalia muundo wa nambari ya malipo.                                   |
| `TIRA207` | Thamani ya kutambua wahusika wa madai waliarifiwa kuhusu malipo au la si sahihi | Angalia thamani ya bendera ya arifa.                                   |
| `TIRA208` | Malipo halisi ya bima yaliyopatikana si sahihi                                  | Angalia thamani ya malipo halisi ya bima.                              |
| `TIRA209` | Thamani ya kutambua madai yalisababisha kesi au la si sahihi                    | Angalia thamani ya bendera ya kesi.                                    |

## Madai — Kukataliwa

| Msimbo    | Maelezo                                                | Suluhisho Linalopendekezwa                                        |
| --------- | ------------------------------------------------------ | ----------------------------------------------------------------- |
| `TIRA076` | Nambari ya kukataliwa kwa madai imejirudia             | Kukataliwa kwa nambari hii tayari kupo. Tumia nambari ya kipekee. |
| `TIRA077` | Tarehe ya kukataliwa kwa madai si sahihi               | Angalia muundo na thamani ya tarehe ya kukataliwa.                |
| `TIRA078` | Kukataliwa kwa madai si sahihi. Madai tayari yamelipwa | Huwezi kukataa madai ambayo tayari yamelipwa.                     |
| `TIRA210` | Nambari ya kukataliwa kwa madai si sahihi              | Angalia muundo wa nambari ya kukataliwa.                          |
| `TIRA211` | Sababu ya kukataliwa kwa madai si sahihi               | Angalia sehemu ya sababu ya kukataliwa. Lazima isiwe tupu.        |

## Marekebisho na Msamaha wa Kodi

| Msimbo    | Maelezo                                                         | Suluhisho Linalopendekezwa                               |
| --------- | --------------------------------------------------------------- | -------------------------------------------------------- |
| `TIRA212` | Aina ya marekebisho si sahihi                                   | Angalia thamani ya aina ya marekebisho.                  |
| `TIRA213` | Sababu ya marekebisho si sahihi                                 | Angalia sehemu ya sababu ya marekebisho.                 |
| `TIRA214` | Kiwango cha punguzo la malipo si sahihi                         | Angalia kiwango cha punguzo. Lazima iwe asilimia halali. |
| `TIRA215` | Kiasi cha malipo yaliyopatikana ya marekebisho si sahihi        | Angalia kiasi cha malipo yaliyopatikana.                 |
| `TIRA216` | Thamani ya kutambua malipo yana msamaha wa kodi au la si sahihi | Angalia thamani ya bendera ya msamaha wa kodi.           |
| `TIRA217` | Aina ya msamaha wa kodi si sahihi                               | Angalia thamani ya aina ya msamaha wa kodi.              |
| `TIRA218` | Rejea ya msamaha wa kodi si sahihi                              | Angalia sehemu ya rejea ya msamaha wa kodi.              |
