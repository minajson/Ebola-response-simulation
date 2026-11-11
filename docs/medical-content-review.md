# Medical content review: corrections log

**Final pre-deployment version, 11 November 2026.**

Corrections were made in `data/questions.ts` against current WHO guidance, ECDC contact-management guidance, CDC's "Identify, Isolate, Inform" framework and NCDC (Nigeria Centre for Disease Control and Prevention) material. Sources are at the end. Three things did not change:

- **The answer key.** It is still `C A D B A D C · B C A D B A C`.
- **The scenario titles and order.**
- **The learning objective of every scenario.**

`tests/unit/logic.spec.ts` pins these, plus the approved option wording below, and fails if any of them changes.

Where each text appears in the app:

- **Play**: on screen during the round.
- **Monitor**: the live status column.
- **AAR**: the After-Action Review "Facilitator notes" panel.
- **Not shown**: kept in the data file but not displayed.

## Answer-option wording changes

| Q | Option | Original | Final | Basis |
|---|---|---|---|---|
| 6 | D ✓ | "…the **occupational health authority** for updates" | "…the **site Health team** for updates" | Approved. Occupational Health → Health rename. |
| 9 | C ✓ | "…**quarantine exposed kitchen staff**…" | "…**remove exposed kitchen staff from duty pending exposure assessment and appropriate 21-day monitoring**…" | Approved. Contacts are assessed and monitored for 21 days, per WHO and ECDC. |
| 12 | B ✓ | "…**isolate them** for 21-day monitoring…" | "…**assess exposure and apply appropriate work restrictions and 21-day monitoring**…" | Approved. Isolation is for symptomatic or suspected cases, not exposed contacts. |
| 13 | A ✓ | "Invoke public health emergency authority — contact disclosure is **legally mandatory** during Ebola alerts and overrides individual privacy objections" | "Escalate under public health emergency procedures — share the worker's contacts with the health authority for tracing, limited to what is necessary, despite the privacy objection" | Directed: remove the unsupported legal claim. Legal interpretation flagged below. |
| 7 | C ✓ | "…full **Ebola-rated** PPE (coverall, **N95/P100**, face shield, double gloves)" | "…EMS confirms full Ebola PPE (**fluid-resistant coverall, face shield or goggles, medical mask or respirator, double gloves**)" | Q7 terminology review. WHO's Ebola PPE ensemble uses a fluid-resistant medical mask, with a respirator for aerosol-generating procedures. P100 is an unusual specification. |

✓ marks the correct option; every one stays correct. Each revised option was checked against its distractors, and each question still has a single defensible correct answer.

## Status of the original 12 review items

| # | Item | Status | Final change |
|---|---|---|---|
| 1 | Q1 lesson implied that bleeding is required | **Corrected** (AAR) | Now fever or compatible symptoms plus travel or contact, and "Do not wait for bleeding: it is a late sign and is often absent." This matches the NCDC 2026 advisory. |
| 2 | Q4: "near-certain transmission" | **Corrected** (Not shown) | Now a high-risk exposure requiring first aid, reporting and 21-day monitoring. No quantitative needlestick risk for Ebola has been published. |
| 3 | Q4 glove wording | **Corrected** (AAR) | Examination gloves don't protect against splashes, no glove prevents a needlestick, and sharps use should be minimised. |
| 4 | Q7 "Level C/D PPE" | **Corrected** (AAR, Play) | The lesson lists the WHO ensemble. Option C is reworded as in the table above. |
| 5 | Q8 "endemic" region, and no fever in the case | **Corrected** (AAR) | The stem is unchanged (no fever added). The lesson now follows the Identify, Isolate, Inform approach: travel to an area with active transmission within 21 days plus compatible symptoms means isolate, PPE and alert, so public health can assess against the current case definition. Fever can be absent or masked by paracetamol. Case definition still needs verifying; see below. |
| 6 | Isolation, quarantine and monitoring used loosely | **Corrected** (Play, Monitor, AAR) | Options Q9 C and Q12 B (approved). The Q12 live status reads "High-risk contacts UNDER MONITORING". The Q9 and Q12 lessons and consequences are aligned. |
| 7 | Q10: surfaces "one of the most efficient" routes | **Corrected** (Not shown) | Surfaces soiled with body fluids transmit *indirectly*. Direct contact is the main route. |
| 8 | Q3: exposed nurse's duties | **Corrected** (AAR) | Stop clinical duties immediately. A return to patient care follows site policy and public health advice. |
| 9 | Q2: waiting-room contacts not listed | **Corrected** (AAR) | Everyone in the waiting area is recorded as a contact. |
| 10 | Q13: GDPR and "legally mandatory" | **Corrected; legal review pending** (Play, AAR) | GDPR is removed and option A has no legal-mandate claim. The lesson cites the NDPA 2023 public-health-emergency exemption and says to confirm the legal basis with a legal adviser. |
| 11 | Q11: "legal authority" of occupational health | **Corrected** (AAR, Not shown) | Authority comes from "site policy, backed by the public health authorities". The wording is now Health and infection-control. |
| 12 | Q14: "GP" | **No change** | It's regional wording in a wrong-answer option, not an inaccuracy. |

All "Occupational Health" wording has been replaced with "Health" (Q6 D, Q8, Q11). A regression test prevents it from returning.

## Outstanding concerns before or after deployment

| # | Concern | Recommended action |
|---|---|---|
| 1 | **Q13 legal basis.** The NDPA 2023 exemption is framed around preventing or controlling a *national public health emergency*. Whether an Ebola alert at a site qualifies, and what disclosure duties apply under the NCDC Act 2018 and quarantine legislation, is unconfirmed. | Legal adviser or NCDC to confirm. Option A no longer makes a legal claim. |
| 2 | **Q8 case definition.** NCDC's latest EVD case definition was attached to its May 2026 advisory and could not be retrieved. The stem has fatigue and diarrhoea without fever. | Clinical lead to verify Q1 and Q8 against the current NCDC case definition. Adding "fever" to the Q8 stem needs your approval. |
| 3 | **Travel origins are dated.** Q1 (Sierra Leone) and Q8 (Guinea) reflect the 2014–2016 West Africa outbreak. The 2026 WHO and NCDC advisories concern Bundibugyo virus disease in DRC and Uganda. Participants may say there is no current transmission in those countries. | Consider stating "during an active outbreak" or naming currently affected areas. This is a scenario change that needs approval. |
| 4 | **Q7 respirator policy.** WHO accepts a fluid-resistant medical mask for routine care; CDC uses N95 or PAPR for all care. | Confirm against the current NCDC ambulance and transport SOP. |
| 5 | **Q6 option B (glass-partition visit).** Some treatment centres now allow visual contact through barriers, so a reviewer could argue B is partly defensible. This predates the current changes. D (refuse at the site clinic) remains the best answer. | Optional: add "at the site clinic" to the lesson or stem. |
| 6 | **Answer-length cue.** The correct option is now the longest in Q6, Q7, Q9, Q12 and Q13. Test-wise players can exploit this. | A future content pass could add comparable detail to the distractors. |
| 7 | **Q3 exposure category** (unprotected skin contact while taking a temperature). | Confirm against NCDC exposure-risk categories. |
| 8 | **"Ebola-rated PPE"** is still informal shorthand in the Q4 stem. | Acceptable for training. |

## Sources

- WHO, *Ebola disease* fact sheet (transmission routes): https://www.who.int/news-room/fact-sheets/detail/ebola-disease
- WHO, *Ebola and Marburg virus outbreak toolbox* (21-day follow-up): https://who.int/emergencies/outbreak-toolkit/disease-outbreak-toolboxes/ebola-and-marburg-virus-outbreak-toolbox
- WHO, temporary recommendations on Bundibugyo virus disease, DRC and Uganda (2026): https://cdn.who.int/media/docs/default-source/searo/bangladesh/temporary-recommendations_bvd-drc-uganda_260522_dg_260522-(002).pdf
- NCDC, *National Public Health Advisory on State Preparedness for Bundibugyo EVD* (May 2026): https://ftp.ncdc.gov.ng/news/537/national-public-health-advisory-on-state-preparedness-for-bundibugyo-ebola-virus-disease-%28evd%29
- NCDC, *Case Definitions for Ebola Virus Disease* (October 2022): https://Ncdc.Gov.Ng/themes/common/docs/protocols/288_1630509239.pdf
- CIDRAP, *WHO updates Ebola PPE guidance for health providers*: https://www.cidrap.umn.edu/ebola/who-updates-ebola-ppe-guidance-health-providers
- ECDC, *Public health management of contacts of Ebola cases*: https://ecdc.europa.eu/en/publications/Publications/ebola-public-health-contact-management-update-10-November.pdf
- Emerging Infectious Diseases (CDC), suspected-case criteria and absence of fever: https://wwwnc.cdc.gov/eid/article/24/1/pdfs/16-1678.pdf
- *From Clinician to Suspect Case* (needlestick; no quantitative risk data): https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4347316/
- Future of Privacy Forum, *Nigeria's New Data Protection Act, Explained*: https://fpf.org/blog/nigerias-new-data-protection-act-explained/
- NCDC (Establishment) Act 2018 (FAOLEX): https://faolex.fao.org/docs/pdf/nig195227.pdf
