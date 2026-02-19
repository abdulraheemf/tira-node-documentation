# Error Codes

TIRA returns a status code in every response. You'll see these codes in two places:

- `tira_status_code` — in the submission response (when you call `.submit()`)
- `response_status_code` — in the callback data (when TIRA sends results to your callback URL)

`TIRA001` means success. Anything else means something went wrong. This page lists every known TIRA status code, what it means, and what you can try to fix it.

## General & System

| Code      | Description                                                          | Possible Fix                                                                                                                                                                                                       |
| --------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `TIRA001` | Successful                                                           | No action needed — your request was processed successfully.                                                                                                                                                        |
| `TIRA002` | Failure                                                              | Generic failure. Check your payload for issues and retry. If persistent, contact TIRA.                                                                                                                             |
| `TIRA003` | Invalid client key                                                   | Check that `client_key` in your config matches what TIRA gave you.                                                                                                                                                 |
| `TIRA004` | An error occurred while processing                                   | Temporary issue on TIRA's side. Retry your request. If it keeps happening, contact TIRA.                                                                                                                           |
| `TIRA005` | Invalid or incomplete request data                                   | One or more required fields are missing or have invalid values. Double-check all fields in your payload.                                                                                                           |
| `TIRA006` | Request could not be processed. Try again later                      | Temporary issue. Wait a moment and retry.                                                                                                                                                                          |
| `TIRA007` | Requested data could not be found                                    | The record doesn't exist. Check your IDs and reference numbers.                                                                                                                                                    |
| `TIRA008` | Required request header information not provided                     | The package sends headers automatically. Make sure `client_code` and `client_key` are set correctly in your config.                                                                                                |
| `TIRA009` | Request header information mismatch client identification parameters | Your `client_code` or `client_key` doesn't match TIRA's records. Verify your credentials with TIRA.                                                                                                                |
| `TIRA010` | Server internal communication failure                                | TIRA server issue. Retry later. If persistent, contact TIRA.                                                                                                                                                       |
| `TIRA011` | Client system configuration not found                                | Your system hasn't been configured on TIRA's side. Contact TIRA to set it up.                                                                                                                                      |
| `TIRA012` | Inactive or disabled Client system configuration                     | Your system configuration has been disabled. Contact TIRA to reactivate.                                                                                                                                           |
| `TIRA013` | Inactive or invalid Client                                           | Your client account is inactive or invalid. Contact TIRA.                                                                                                                                                          |
| `TIRA014` | Client PKI certificate file not found in specified path              | TIRA can't find your certificate on their side. Contact TIRA to verify your PKI setup.                                                                                                                             |
| `TIRA015` | Bad or missing Client PKI configurations                             | PKI configuration issue on TIRA's side. Contact TIRA.                                                                                                                                                              |
| `TIRA016` | Invalid request signature                                            | Your digital signature is invalid. Check that your private PFX file (`client_private_pfx_path`) and passphrase (`client_private_pfx_passphrase`) are correct. See [Signing & Verification](/signing-verification). |

## Communication & Callbacks

| Code      | Description                                          | Possible Fix                                                                                                                                                      |
| --------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TIRA017` | Invalid client system call back url                  | Check that `callback_url` in your payload is a valid, publicly accessible URL.                                                                                    |
| `TIRA048` | Notification content preparation failed              | TIRA couldn't prepare the notification. Retry. If persistent, contact TIRA.                                                                                       |
| `TIRA049` | No content returned by client system                 | Your callback endpoint returned an empty response. Make sure you return the acknowledgement XML. See [Callbacks & Acknowledgements](/callbacks-acknowledgements). |
| `TIRA050` | Error occurred while connecting to external system   | TIRA couldn't reach your callback URL. Check that your server is running and accessible from the internet.                                                        |
| `TIRA051` | Client system not allowed for inbound communication  | Your system isn't configured to receive data from TIRA. Contact TIRA.                                                                                             |
| `TIRA052` | Client system not allowed for outbound communication | Your system isn't configured to send data to TIRA. Contact TIRA.                                                                                                  |
| `TIRA088` | Invalid acknowledgement                              | Your acknowledgement XML is malformed. The package builds this automatically — make sure you're passing the correct `result.body` to `tira.acknowledge()`.        |
| `TIRA089` | Pending transaction waiting for processing           | A previous transaction is still being processed. Wait and retry later.                                                                                            |

## Cover Note

| Code      | Description                                                             | Possible Fix                                                                                           |
| --------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `TIRA018` | Invalid company code                                                    | Check `transacting_company_code` in your config. It must be a valid company code registered with TIRA. |
| `TIRA019` | Invalid cover note type                                                 | Check the cover note type value. Must be a valid type recognized by TIRA.                              |
| `TIRA020` | Invalid covernote start date                                            | Check the start date format and value. Make sure it's a valid future or current date.                  |
| `TIRA021` | Invalid covernote end date                                              | Check the end date format and value. It must be after the start date.                                  |
| `TIRA022` | Invalid insurance company                                               | The insurance company code is not recognized. Check with TIRA.                                         |
| `TIRA023` | Invalid insurance transaction company                                   | The transacting company code is invalid. Check `transacting_company_code`.                             |
| `TIRA024` | Duplicate insurance covernote number or covernote identification number | A cover note with this number already exists. Use a unique identifier.                                 |
| `TIRA025` | Invalid or inactive insurance transaction sale point                    | The sale point code is invalid or inactive. Check with TIRA.                                           |
| `TIRA026` | Invalid or inactive insurance transaction product                       | The product code is invalid or inactive. Check the TIRAMIS product codes reference.                    |
| `TIRA027` | Invalid or inactive insurance transaction currency                      | The currency code is invalid. Use a valid currency code (e.g. `"TZS"`).                                |
| `TIRA028` | Invalid transaction exchange rate                                       | Check the exchange rate value. Must be a valid positive number.                                        |
| `TIRA029` | Invalid insurance sum insured equivalent amount                         | Check the sum insured equivalent amount. Must be a valid positive number.                              |
| `TIRA030` | Invalid insurance covernote risk covered premium rate                   | Check the premium rate value. Must be a valid number.                                                  |
| `TIRA031` | Invalid insurance premium amount (premium before discount)              | Check the premium amount before discount. Must be a valid positive number.                             |
| `TIRA032` | Invalid insurance tax code or tax type(s) charged                       | Check that all tax codes are valid TIRA tax types.                                                     |
| `TIRA033` | Invalid insurance tax type rates used                                   | Check the tax rate values. Must match TIRA's expected rates.                                           |
| `TIRA034` | Invalid insurance tax type amount                                       | Check the tax amount calculation. It should match rate × base amount.                                  |
| `TIRA035` | Invalid insurance total taxes or premium including tax value            | Check that the total (premium + taxes) adds up correctly.                                              |
| `TIRA036` | Invalid covernote reference number                                      | The cover note reference number is not valid. Check the reference number format.                       |
| `TIRA054` | Invalid risk covered                                                    | Check the risk covered details in your payload.                                                        |
| `TIRA055` | Invalid premium charged after discount equivalent amount                | Check the premium after discount calculation.                                                          |
| `TIRA081` | Invalid covernote type                                                  | Check the cover note type value.                                                                       |
| `TIRA082` | Invalid previous covernote reference number                             | The previous cover note reference number doesn't exist or is invalid. Check the reference.             |
| `TIRA083` | Invalid total premium including tax value                               | Check the total premium including tax calculation.                                                     |
| `TIRA084` | Invalid total premium excluding tax value                               | Check the total premium excluding tax calculation.                                                     |
| `TIRA085` | Invalid premium discount type                                           | Check the discount type value.                                                                         |
| `TIRA086` | Invalid premium discount amount                                         | Check the discount amount. Must be a valid number.                                                     |
| `TIRA087` | Premium discount is not allowed for this type of cover                  | This cover type doesn't allow premium discounts. Remove the discount from your payload.                |
| `TIRA090` | Active covernote with specified insurance product exists for this motor | An active cover note already exists for this vehicle with this product. You can't create a duplicate.  |
| `TIRA091` | Invalid risk covered premium after discount value                       | Check the premium after discount calculation.                                                          |
| `TIRA095` | Invalid request identification number                                   | Check `request_id` in your payload. Must be a unique, valid string.                                    |
| `TIRA096` | Invalid client system code                                              | Check `system_code` in your config. Must match what TIRA gave you.                                     |
| `TIRA097` | Invalid covernote type                                                  | Check the cover note type value.                                                                       |
| `TIRA098` | Invalid covernote number                                                | Check the cover note number format and value.                                                          |
| `TIRA099` | Invalid covernote description                                           | Check the cover note description field.                                                                |
| `TIRA100` | Invalid covernote operative clause                                      | Check the operative clause value.                                                                      |
| `TIRA101` | Invalid payment mode                                                    | Check the payment mode value. Must be a valid payment mode.                                            |
| `TIRA102` | Invalid commission paid                                                 | Check the commission paid value. Must be a valid number.                                               |
| `TIRA103` | Invalid commission rate                                                 | Check the commission rate value. Must be a valid percentage.                                           |

## Motor Vehicle & Fleet

| Code      | Description                                                      | Possible Fix                                                                        |
| --------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `TIRA104` | Invalid value identifying if transaction is part of fleet or not | Check the fleet flag value. Must indicate whether this is a fleet transaction.      |
| `TIRA105` | Invalid or duplicate fleet identification number                 | The fleet ID is invalid or already exists. Use a unique fleet identifier.           |
| `TIRA106` | Invalid fleet size                                               | Check the fleet size value. Must match the actual number of vehicles.               |
| `TIRA107` | Invalid total comprehensive insured motors value                 | Check the total insured value for the fleet.                                        |
| `TIRA108` | Invalid fleet entry                                              | Check the fleet entry sequence number. Must be valid and within fleet size.         |
| `TIRA136` | Invalid motor category                                           | Check `motor_category`. Must be `"1"` (Motor Vehicle) or `"2"` (Motor Cycle).       |
| `TIRA137` | Invalid motor registration number                                | Check `registration_number`. Required for registered vehicles.                      |
| `TIRA138` | Invalid motor chassis number                                     | Check `chassis_number`. Must be a valid chassis/VIN number.                         |
| `TIRA139` | Invalid motor make                                               | Check `make` (e.g. "Toyota", "Honda"). Must not be empty.                           |
| `TIRA140` | Invalid motor model                                              | Check `model` (e.g. "Corolla", "Civic"). Must not be empty.                         |
| `TIRA141` | Invalid motor model number                                       | Check `model_number`.                                                               |
| `TIRA142` | Invalid motor body type                                          | Check `body_type` (e.g. "Sedan", "SUV").                                            |
| `TIRA143` | Invalid motor color                                              | Check `color`. Must not be empty.                                                   |
| `TIRA144` | Invalid motor engine number                                      | Check `engine_number`. Must be a valid engine number.                               |
| `TIRA145` | Invalid motor engine capacity                                    | Check `engine_capacity`. Must be a valid number (in cc).                            |
| `TIRA146` | Invalid motor fuel used                                          | Check `fuel_used` (e.g. "Petrol", "Diesel").                                        |
| `TIRA147` | Invalid motor number of axles                                    | Check `number_of_axles`. Must be a valid number.                                    |
| `TIRA148` | Invalid motor axle distance                                      | Check `axle_distance`. Must be a valid number.                                      |
| `TIRA149` | Invalid motor sitting capacity                                   | Check `sitting_capacity`. Must be a valid number.                                   |
| `TIRA150` | Invalid motor year of manufacture                                | Check `year_of_manufacture`. Must be a valid year.                                  |
| `TIRA151` | Invalid motor tare weight                                        | Check `tare_weight`. Must be a valid number (in kg).                                |
| `TIRA152` | Invalid motor gross weight                                       | Check `gross_weight`. Must be a valid number (in kg).                               |
| `TIRA153` | Invalid motor usage                                              | Check `motor_usage`. Must be a valid usage code.                                    |
| `TIRA154` | Invalid motor owner name                                         | Check `owner_name`.                                                                 |
| `TIRA155` | Invalid motor owner category                                     | Check `owner_category`. Must be a valid category.                                   |
| `TIRA156` | Invalid motor owner address                                      | Check `owner_address`. Must not be empty.                                           |
| `TIRA159` | Invalid insurance sticker number                                 | The sticker number is invalid. This is usually assigned by TIRA.                    |
| `TIRA219` | Invalid motor type                                               | Check `motor_type`. Must be `"1"` (Registered) or `"2"` (In Transit).               |
| `TIRA220` | Active covernote with specified motor details exists             | An active cover note already exists for this vehicle. You can't create a duplicate. |
| `TIRA221` | Invalid fleet type                                               | Check the fleet type value.                                                         |

## Policyholder & Officer

| Code      | Description                                                            | Possible Fix                                                         |
| --------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `TIRA109` | Invalid insurance officer name                                         | Check the insurance officer name field. Must not be empty.           |
| `TIRA110` | Invalid insurance officer title                                        | Check the insurance officer title field.                             |
| `TIRA122` | Invalid insurance policyholder name                                    | Check the policyholder name. Must not be empty.                      |
| `TIRA123` | Invalid insurance policyholder birth date or company registration date | Check the date format and value.                                     |
| `TIRA124` | Invalid insurance policyholder type                                    | Check the policyholder type (e.g. individual vs company).            |
| `TIRA125` | Invalid identity number or company incorporation certificate number    | Check the ID number or certificate number.                           |
| `TIRA126` | Invalid identity type                                                  | Check the identity type code.                                        |
| `TIRA127` | Invalid gender                                                         | Check the gender value.                                              |
| `TIRA128` | Invalid country or country code                                        | Check the country code. Use a valid ISO country code (e.g. `"TZA"`). |
| `TIRA129` | Invalid region or state                                                | Check the region code. Use a valid TIRA region code.                 |
| `TIRA130` | Invalid district or county                                             | Check the district code. Use a valid TIRA district code.             |
| `TIRA131` | Invalid street                                                         | Check the street field. Must not be empty.                           |
| `TIRA132` | Invalid phone number                                                   | Check the phone number format.                                       |
| `TIRA133` | Invalid fax number                                                     | Check the fax number format.                                         |
| `TIRA134` | Invalid address                                                        | Check the address field. Must not be empty.                          |
| `TIRA135` | Invalid email address                                                  | Check the email format. Must be a valid email address.               |

## Risk, Addons & Subject Matter

| Code      | Description                                                     | Possible Fix                                                                    |
| --------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `TIRA111` | Invalid insurance risk code                                     | Check the risk code. Must be a valid TIRAMIS risk code from the reference data. |
| `TIRA112` | Invalid insurance sum insured amount                            | Check the sum insured amount. Must be a valid positive number.                  |
| `TIRA113` | Invalid subject matter covered reference                        | Check the subject matter reference field.                                       |
| `TIRA114` | Invalid subject matter covered description                      | Check the subject matter description field. Must not be empty.                  |
| `TIRA115` | Invalid insurance addon reference                               | Check the addon reference field.                                                |
| `TIRA116` | Invalid insurance addon description                             | Check the addon description field.                                              |
| `TIRA117` | Invalid insurance addon premium amount                          | Check the addon premium amount. Must be a valid number.                         |
| `TIRA118` | Invalid insurance addon premium rate                            | Check the addon premium rate. Must be a valid number.                           |
| `TIRA119` | Invalid insurance addon premium excluding tax amount            | Check the addon premium excluding tax calculation.                              |
| `TIRA120` | Invalid insurance addon premium excluding tax equivalent amount | Check the addon premium excluding tax equivalent calculation.                   |
| `TIRA121` | Invalid insurance addon premium including tax amount            | Check the addon premium including tax calculation.                              |

## Reinsurance

| Code      | Description                                         | Possible Fix                                                                            |
| --------- | --------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `TIRA037` | Duplicate reinsurance declaration                   | A reinsurance declaration with this identifier already exists. Use a unique identifier. |
| `TIRA038` | Invalid reinsurance participant                     | Check the reinsurance participant details.                                              |
| `TIRA039` | Invalid coinsurance premium amount value            | Check the coinsurance premium amount. Must be a valid number.                           |
| `TIRA040` | Invalid reinsurance participation share value       | Check the participation share percentage. Must be a valid number.                       |
| `TIRA041` | Invalid reinsurance participation type              | Check the participation type value.                                                     |
| `TIRA080` | Invalid reinsurance broker                          | Check the reinsurance broker code.                                                      |
| `TIRA160` | Invalid reinsurance category                        | Check the reinsurance category value.                                                   |
| `TIRA161` | Invalid reinsurance participant or participant code | Check the participant code. Must be a valid, registered participant.                    |
| `TIRA162` | Invalid reinsurance participant type                | Check the participant type value.                                                       |
| `TIRA163` | Invalid reinsurance form                            | Check the reinsurance form value.                                                       |
| `TIRA164` | Invalid reinsurance type                            | Check the reinsurance type value.                                                       |
| `TIRA165` | Invalid reinsurance rebroker or rebroker code       | Check the rebroker code.                                                                |
| `TIRA166` | Invalid reinsurance rebrokerage commission value    | Check the rebrokerage commission value. Must be a valid number.                         |
| `TIRA167` | Invalid reinsurance commission value                | Check the commission value. Must be a valid number.                                     |
| `TIRA168` | Invalid reinsurance premium share value             | Check the premium share value. Must be a valid number.                                  |
| `TIRA169` | Invalid reinsurance participation date              | Check the participation date format and value.                                          |

## Policy

| Code      | Description                                | Possible Fix                                                                               |
| --------- | ------------------------------------------ | ------------------------------------------------------------------------------------------ |
| `TIRA042` | Invalid insurer policy number              | Check the policy number. Must be a valid, unique identifier.                               |
| `TIRA043` | Invalid policy operative clause            | Check the operative clause value.                                                          |
| `TIRA044` | Policy applied covernote(s) does not exist | The cover note(s) referenced in the policy don't exist. Submit the cover notes first.      |
| `TIRA045` | Duplicate policy                           | A policy with this identifier already exists. Use a unique policy number.                  |
| `TIRA046` | Applied covernote(s) have policy           | The cover note(s) already have a policy attached. You can't attach them to another policy. |
| `TIRA047` | Duplicate policy applied covernote(s)      | The same cover note is listed more than once in the policy. Remove duplicates.             |
| `TIRA157` | Invalid policy special conditions          | Check the special conditions field.                                                        |
| `TIRA158` | Invalid policy exclusions                  | Check the exclusions field.                                                                |

## Claims — Notification

| Code      | Description                                                    | Possible Fix                                                                |
| --------- | -------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `TIRA053` | Invalid claim notification report date                         | Check the report date format and value.                                     |
| `TIRA056` | Duplicate claim notification number                            | A claim notification with this number already exists. Use a unique number.  |
| `TIRA057` | Invalid claim notification number                              | Check the claim notification number format.                                 |
| `TIRA058` | Claimant exists for the specified covernote                    | A claim has already been filed for this cover note by this claimant.        |
| `TIRA059` | Invalid claim reference number                                 | Check the claim reference number. It may not exist or the format is wrong.  |
| `TIRA079` | Invalid claim loss date                                        | Check the loss date format and value. Must be a valid past or current date. |
| `TIRA092` | Invalid claimant details                                       | Check all claimant fields (name, ID, type, etc.).                           |
| `TIRA170` | Invalid value identifying if claim form is dully filled or not | Check the claim form completion flag.                                       |
| `TIRA171` | Invalid claim loss nature                                      | Check the loss nature value.                                                |
| `TIRA172` | Invalid claim loss type                                        | Check the loss type value.                                                  |
| `TIRA173` | Invalid claim loss location                                    | Check the loss location field. Must not be empty.                           |
| `TIRA174` | Invalid claim estimated amount                                 | Check the estimated claim amount. Must be a valid positive number.          |
| `TIRA175` | Invalid claim reserved amount                                  | Check the reserved amount. Must be a valid positive number.                 |
| `TIRA176` | Invalid claim reserve method                                   | Check the reserve method value.                                             |

## Claims — Intimation

| Code      | Description                     | Possible Fix                                                                     |
| --------- | ------------------------------- | -------------------------------------------------------------------------------- |
| `TIRA060` | Duplicate claim intimation      | A claim intimation with this identifier already exists. Use a unique identifier. |
| `TIRA061` | Invalid claim intimation date   | Check the intimation date format and value.                                      |
| `TIRA062` | Invalid claim intimation number | Check the claim intimation number format.                                        |

## Claims — Assessment

| Code      | Description                                                | Possible Fix                                                        |
| --------- | ---------------------------------------------------------- | ------------------------------------------------------------------- |
| `TIRA063` | Duplicate claim assessment number                          | An assessment with this number already exists. Use a unique number. |
| `TIRA064` | Invalid claim assessment received date                     | Check the assessment received date format and value.                |
| `TIRA065` | Invalid claim approval date                                | Check the approval date format and value.                           |
| `TIRA066` | Invalid claim adjustment date                              | Check the adjustment date format and value.                         |
| `TIRA067` | Invalid claim offer communication date                     | Check the offer communication date format and value.                |
| `TIRA068` | Invalid claimant claim offer response date                 | Check the offer response date format and value.                     |
| `TIRA069` | Invalid offer reconciliation                               | Check the offer reconciliation details.                             |
| `TIRA093` | Invalid claim assessment number                            | Check the assessment number format.                                 |
| `TIRA094` | Invalid claim litigation reason                            | Check the litigation reason field.                                  |
| `TIRA177` | Invalid claim loss assessment option                       | Check the assessment option value.                                  |
| `TIRA178` | Invalid claim assessor name                                | Check the assessor name. Must not be empty.                         |
| `TIRA179` | Invalid claim assessor identity number                     | Check the assessor ID number.                                       |
| `TIRA180` | Invalid claim assessor identity type                       | Check the assessor identity type code.                              |
| `TIRA181` | Invalid claimant name                                      | Check the claimant name. Must not be empty.                         |
| `TIRA182` | Invalid claimant birth date                                | Check the claimant birth date format and value.                     |
| `TIRA183` | Invalid claimant category                                  | Check the claimant category value.                                  |
| `TIRA184` | Invalid claimant type                                      | Check the claimant type value.                                      |
| `TIRA185` | Invalid claimant identity number                           | Check the claimant ID number.                                       |
| `TIRA186` | Invalid claimant identity type                             | Check the claimant identity type code.                              |
| `TIRA187` | Invalid claim assessment report summary                    | Check the report summary field. Must not be empty.                  |
| `TIRA188` | Invalid claim assessment amount                            | Check the assessment amount. Must be a valid positive number.       |
| `TIRA189` | Invalid claim approved amount                              | Check the approved amount. Must be a valid positive number.         |
| `TIRA190` | Invalid claim approval date                                | Check the approval date format and value.                           |
| `TIRA191` | Invalid claim approval authority                           | Check the approval authority field.                                 |
| `TIRA192` | Invalid value identifying if its claim reassessment or not | Check the reassessment flag value.                                  |

## Claims — Discharge Voucher

| Code      | Description                                                 | Possible Fix                                                              |
| --------- | ----------------------------------------------------------- | ------------------------------------------------------------------------- |
| `TIRA193` | Invalid discharge voucher number                            | Check the discharge voucher number format.                                |
| `TIRA194` | Duplicate discharge voucher                                 | A discharge voucher with this number already exists. Use a unique number. |
| `TIRA195` | Invalid discharge voucher date                              | Check the voucher date format and value.                                  |
| `TIRA196` | Invalid claim discharge voucher offer communication date    | Check the offer communication date format and value.                      |
| `TIRA197` | Invalid claim discharge voucher offer communicated amount   | Check the communicated amount. Must be a valid positive number.           |
| `TIRA198` | Invalid claim discharge voucher offer response date         | Check the response date format and value.                                 |
| `TIRA199` | Invalid claim discharge voucher offer adjustment date       | Check the adjustment date format and value.                               |
| `TIRA200` | Invalid claim discharge voucher offer adjustment reason     | Check the adjustment reason field. Must not be empty.                     |
| `TIRA201` | Invalid claim discharge voucher offer adjustment amount     | Check the adjustment amount. Must be a valid number.                      |
| `TIRA202` | Invalid claim discharge voucher offer reconciliation date   | Check the reconciliation date format and value.                           |
| `TIRA203` | Invalid claim discharge voucher offer reconciliation reason | Check the reconciliation reason field.                                    |
| `TIRA204` | Invalid claim discharge voucher offer reconciliation amount | Check the reconciliation amount. Must be a valid number.                  |
| `TIRA205` | Invalid value identifying if offer was accepted or not      | Check the offer acceptance flag value.                                    |

## Claims — Payment

| Code      | Description                                                                         | Possible Fix                                                            |
| --------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `TIRA070` | Claim assessment for the payment not found                                          | Submit the claim assessment before submitting payment.                  |
| `TIRA071` | Duplicate claim payment number                                                      | A payment with this number already exists. Use a unique number.         |
| `TIRA072` | Claim has already been paid                                                         | This claim has already been paid. You can't submit a duplicate payment. |
| `TIRA073` | Invalid claim payment date                                                          | Check the payment date format and value.                                |
| `TIRA074` | Invalid claim payment currency                                                      | Check the currency code. Use a valid currency code (e.g. `"TZS"`).      |
| `TIRA075` | Invalid claim payment amount                                                        | Check the payment amount. Must be a valid positive number.              |
| `TIRA206` | Invalid claim payment number                                                        | Check the payment number format.                                        |
| `TIRA207` | Invalid value identifying if claim parties were notified about claim payment or not | Check the notification flag value.                                      |
| `TIRA208` | Invalid claim net premium earned                                                    | Check the net premium earned value. Must be a valid number.             |
| `TIRA209` | Invalid value identifying if claim resulted into litigation or not                  | Check the litigation flag value.                                        |

## Claims — Rejection

| Code      | Description                                 | Possible Fix                                                      |
| --------- | ------------------------------------------- | ----------------------------------------------------------------- |
| `TIRA076` | Duplicate claim rejection number            | A rejection with this number already exists. Use a unique number. |
| `TIRA077` | Invalid claim rejection date                | Check the rejection date format and value.                        |
| `TIRA078` | Invalid claim rejection. Claim already paid | You can't reject a claim that has already been paid.              |
| `TIRA210` | Invalid claim rejection number              | Check the rejection number format.                                |
| `TIRA211` | Invalid claim rejection reason              | Check the rejection reason field. Must not be empty.              |

## Endorsement & Tax Exemption

| Code      | Description                                              | Possible Fix                                             |
| --------- | -------------------------------------------------------- | -------------------------------------------------------- |
| `TIRA212` | Invalid endorsement type                                 | Check the endorsement type value.                        |
| `TIRA213` | Invalid endorsement reason                               | Check the endorsement reason field.                      |
| `TIRA214` | Invalid premium discount rate                            | Check the discount rate. Must be a valid percentage.     |
| `TIRA215` | Invalid endorsement premium earned amount                | Check the premium earned amount. Must be a valid number. |
| `TIRA216` | Invalid value identifying premium is tax exempted or not | Check the tax exemption flag value.                      |
| `TIRA217` | Invalid tax exemption type                               | Check the tax exemption type value.                      |
| `TIRA218` | Invalid tax exemption reference                          | Check the tax exemption reference field.                 |
