// ─────────────────────────────────────────────────────────────────────────────
// QUESTIONS DATA
// To add or edit questions: update the array below.
// Each question needs id, team, scenario, question, options A-D,
// correctAnswer (which letter is correct), consequences, lesson, and impacts.
// ─────────────────────────────────────────────────────────────────────────────

export type OptionKey = "A" | "B" | "C" | "D";
export type Team = "A" | "B";

export interface Consequence {
  patientOutcome: string;
  exposureRisk: string;
  containmentImpact: string;
}

export interface Question {
  id: number;
  team: Team;
  /** Short title shown above the scenario text */
  scenario: string;
  question: string;
  options: Record<OptionKey, string>;
  /** Which option letter is correct */
  correctAnswer: OptionKey;
  consequenceCorrect: Consequence;
  consequenceWrong: Consequence;
  lesson: string;
  /** Exposure delta: negative = reduction (reward), positive = increase (penalty) */
  exposureImpact: { correct: number; wrong: number };
  patientImpact: { correct: string; wrong: string };
  containmentImpact: { correct: string; wrong: string };
}

// ─────────────────────────────────────────────────────────────────────────────
// TEAM A — Clinic Walk-In Scenario
// ─────────────────────────────────────────────────────────────────────────────
const teamAQuestions: Question[] = [
  {
    id: 1,
    team: "A",
    scenario: "Initial Triage — Suspected Ebola Presentation",
    question:
      "A worker walks into the clinic with high fever (39.8 °C), severe headache, muscle pain, and reports returning from Sierra Leone 10 days ago. What is your FIRST priority action?",
    options: {
      A: "Take vital signs and draw blood immediately without PPE",
      B: "Send the worker home to rest and monitor symptoms",
      C: "Don full PPE and isolate the worker in a separate area immediately",
      D: "Call the worker's supervisor to verify travel details",
    },
    correctAnswer: "C",
    consequenceCorrect: {
      patientOutcome: "Patient is isolated safely. Clinical assessment can begin under controlled conditions.",
      exposureRisk: "Your PPE use prevents direct exposure. Health worker risk remains LOW.",
      containmentImpact: "Immediate isolation stops potential viral spread in the waiting area.",
    },
    consequenceWrong: {
      patientOutcome: "Delayed isolation exposes clinic staff and other patients to risk.",
      exposureRisk: "Direct contact without PPE creates HIGH exposure risk for clinical staff.",
      containmentImpact: "Viral spread in the waiting area may have already occurred.",
    },
    lesson:
      "Any patient with fever or other symptoms compatible with Ebola AND recent travel to an affected area or contact with a case must be isolated and assessed using full PPE BEFORE any clinical contact. Do not wait for bleeding: it is a late sign and is often absent.",
    exposureImpact: { correct: -5, wrong: 20 },
    patientImpact: { correct: "Safely isolated — assessment underway", wrong: "Exposed to unprotected staff — risk escalating" },
    containmentImpact: { correct: "Containment INITIATED", wrong: "Containment COMPROMISED" },
  },
  {
    id: 2,
    team: "A",
    scenario: "No Isolation Room — Crowded Waiting Area",
    question:
      "Your clinic has no dedicated isolation room. The suspected Ebola patient is sitting in the general waiting area with 5 other workers. What is the MOST appropriate immediate action?",
    options: {
      A: "Clear the waiting area — move all other workers out and create an ad-hoc isolation space",
      B: "Continue regular clinic flow and wait for lab results before disrupting operations",
      C: "Ask the patient to sit at least 2 metres away from others",
      D: "Call the referral hospital and wait on hold for instructions",
    },
    correctAnswer: "A",
    consequenceCorrect: {
      patientOutcome: "Patient is effectively separated. Exposure to other workers is cut short.",
      exposureRisk: "Clearing the area minimises secondary contact exposure. Risk contained to initial contact window.",
      containmentImpact: "Improvised isolation reduces viral spread risk significantly.",
    },
    consequenceWrong: {
      patientOutcome: "Continued co-mingling means up to 5 additional workers may have been exposed.",
      exposureRisk: "Unprotected workers in close proximity face MODERATE to HIGH exposure risk.",
      containmentImpact: "Containment is DELAYED — contact tracing scope widens.",
    },
    lesson:
      "When no isolation room exists, immediately remove non-essential personnel from the area. Create physical distance using any available space. Improvised isolation is always better than no isolation. Record everyone who shared the waiting area as a contact for follow-up.",
    exposureImpact: { correct: -5, wrong: 15 },
    patientImpact: { correct: "Isolated in ad-hoc space — stable", wrong: "Exposed to 5+ co-workers — risk growing" },
    containmentImpact: { correct: "Spread LIMITED", wrong: "Spread RISK INCREASING" },
  },
  {
    id: 3,
    team: "A",
    scenario: "Accidental Unprotected Contact",
    question:
      "A nurse accidentally took the suspected patient's temperature without wearing gloves. The nurse now has skin contact contamination risk. What should happen immediately?",
    options: {
      A: "The nurse should wash hands with soap and continue working their shift",
      B: "The nurse should self-monitor at home for 21 days but remain on shift for now",
      C: "Send the nurse home only if they develop symptoms within 48 hours",
      D: "The nurse must wash thoroughly, report the incident immediately, and enter formal exposure monitoring protocol",
    },
    correctAnswer: "D",
    consequenceCorrect: {
      patientOutcome: "Proper protocols protect both the nurse and future patients from secondary exposure.",
      exposureRisk: "Immediate decontamination and removal from clinical duties reduces onward risk.",
      containmentImpact: "Exposure event is formally documented — contact chain remains traceable.",
    },
    consequenceWrong: {
      patientOutcome: "If the nurse is infected and continues working, further healthcare-worker infections may follow.",
      exposureRisk: "An unmonitored exposed worker is the most dangerous containment gap in Ebola response.",
      containmentImpact: "Untracked exposure event widens the silent transmission chain.",
    },
    lesson:
      "Any unprotected skin contact with a suspected Ebola patient triggers immediate decontamination, incident reporting, and 21-day monitoring under Ebola exposure protocol. The nurse must stop clinical duties immediately; any return to patient care during the monitoring period follows site policy and public health advice.",
    exposureImpact: { correct: -5, wrong: 20 },
    patientImpact: { correct: "Exposure event contained", wrong: "Secondary healthcare worker exposure likely" },
    containmentImpact: { correct: "Chain TRACED and CONTROLLED", wrong: "Silent exposure chain GROWING" },
  },
  {
    id: 4,
    team: "A",
    scenario: "IV Access Without Proper PPE",
    question:
      "The patient needs IV access for fluid support. The clinic only has standard examination gloves — no Ebola-rated PPE is available. What is the correct action?",
    options: {
      A: "Proceed with IV using standard gloves and a surgical mask — any protection is better than none",
      B: "Do NOT attempt IV access — provide oral fluids if safe, and wait for specialist team with proper PPE",
      C: "Ask a coworker to restrain the patient while you insert IV with standard gloves",
      D: "Refer the patient immediately to hospital without any clinical intervention",
    },
    correctAnswer: "B",
    consequenceCorrect: {
      patientOutcome: "Patient receives safe supportive care. IV delay is clinically preferable to creating a new exposure event.",
      exposureRisk: "Health worker is protected. No sharps-related Ebola exposure risk.",
      containmentImpact: "Specialist team arrival maintains proper PPE chain for all invasive procedures.",
    },
    consequenceWrong: {
      patientOutcome: "IV access may benefit the patient short-term but risks a needle-stick incident with Ebola-positive blood.",
      exposureRisk: "A needle-stick with blood from a suspected Ebola patient is a HIGH-RISK exposure requiring immediate first aid, reporting and 21-day monitoring.",
      containmentImpact: "Additional exposed healthcare workers expand the contact network significantly.",
    },
    lesson:
      "NEVER perform invasive procedures on a suspected Ebola patient without full Ebola-level PPE. Examination gloves alone do not protect against blood splashes, and no glove prevents a needle-stick injury. Minimise sharps use and wait for proper PPE or the specialist team.",
    exposureImpact: { correct: -5, wrong: 25 },
    patientImpact: { correct: "Stabilising on oral fluids — IV pending specialist", wrong: "IV placed but nurse at extreme exposure risk" },
    containmentImpact: { correct: "Invasive exposure AVOIDED", wrong: "Sharps exposure event CREATED" },
  },
  {
    id: 5,
    team: "A",
    scenario: "Workplace Contact Tracing — Lunchroom",
    question:
      "Contact tracing reveals 3 coworkers had lunch with the suspected Ebola patient yesterday for 45 minutes. What is the immediate containment action?",
    options: {
      A: "Identify, separate all 3 workers from the workplace immediately and begin 21-day monitoring",
      B: "Ask the 3 workers to self-monitor symptoms from home without formal quarantine",
      C: "Wait for lab confirmation of Ebola before taking any action on contacts",
      D: "Disinfect the lunchroom only and advise the 3 workers to avoid sharing utensils",
    },
    correctAnswer: "A",
    consequenceCorrect: {
      patientOutcome: "Exposed contacts are removed from the workforce — preventing silent community spread.",
      exposureRisk: "Proactive separation protects other workers and the wider facility.",
      containmentImpact: "Contact chain is CLOSED before secondary exposure can propagate.",
    },
    consequenceWrong: {
      patientOutcome: "Contacts continue working — if infected, they expose dozens more workers.",
      exposureRisk: "Each unmonitored exposed worker is a potential new index case.",
      containmentImpact: "Facility-wide outbreak becomes probable within 48–72 hours.",
    },
    lesson:
      "Contact tracing and separation must begin IMMEDIATELY on suspicion — do not wait for laboratory confirmation. The 21-day incubation window requires monitoring from the date of last exposure.",
    exposureImpact: { correct: -10, wrong: 20 },
    patientImpact: { correct: "Contact chain CONTAINED", wrong: "3 potential carriers still on site" },
    containmentImpact: { correct: "Outbreak risk REDUCED", wrong: "Outbreak risk CRITICAL" },
  },
  {
    id: 6,
    team: "A",
    scenario: "Family Visit Request During Isolation",
    question:
      "The patient's spouse calls the clinic demanding to come in and see the patient. They are very distressed and threatening to call the media if refused. What is the correct response?",
    options: {
      A: "Allow the visit if the spouse wears a surgical mask — it reduces transmission risk",
      B: "Allow a brief supervised visit through a glass partition to prevent escalation",
      C: "Ask the patient whether they consent to the visit and defer to their wishes",
      D: "Refuse visitation firmly, compassionately explain the infection control protocol, and direct the family to the site Health team for updates",
    },
    correctAnswer: "D",
    consequenceCorrect: {
      patientOutcome: "Patient remains in strict isolation. Family receives structured communication through proper channels.",
      exposureRisk: "No new visitor exposure is created. Isolation integrity is maintained.",
      containmentImpact: "Containment perimeter HOLDS. Media escalation is handled through authority.",
    },
    consequenceWrong: {
      patientOutcome: "Any family visit creates a new exposure event that extends the contact chain outside the facility.",
      exposureRisk: "Community transmission via family members is one of the primary Ebola spread vectors.",
      containmentImpact: "A single family visitor can carry Ebola into the community — collapsing containment.",
    },
    lesson:
      "During confirmed or suspected Ebola isolation, NO visitors are permitted under any circumstances. Social pressure, media threats, or patient consent do not override public health emergency protocols.",
    exposureImpact: { correct: -5, wrong: 20 },
    patientImpact: { correct: "Isolation MAINTAINED", wrong: "Isolation BREACHED — community exposure risk" },
    containmentImpact: { correct: "Perimeter SECURED", wrong: "Containment BREACH — community risk" },
  },
  {
    id: 7,
    team: "A",
    scenario: "EMS Transfer — Inadequate PPE",
    question:
      "EMS arrives to transport the patient but their crew only has surgical masks and standard nitrile gloves. They say 'we transport sick patients every day — this is fine.' What do you do?",
    options: {
      A: "Allow transport to proceed — any PPE is better than no PPE and the patient needs hospital care",
      B: "Transfer the patient in a private vehicle with a masked driver to avoid further delay",
      C: "STOP the transport — do not allow it until EMS confirms full Ebola PPE (fluid-resistant coverall, face shield or goggles, medical mask or respirator, double gloves)",
      D: "Give EMS your clinic's PPE stock and proceed with transport",
    },
    correctAnswer: "C",
    consequenceCorrect: {
      patientOutcome: "Transport is safely delayed until proper protection is confirmed — patient is secured in interim isolation.",
      exposureRisk: "EMS crew is protected. No new exposure event during transport.",
      containmentImpact: "Transport chain maintains biosafety. Hospital receives patient under controlled conditions.",
    },
    consequenceWrong: {
      patientOutcome: "Patient is transported but EMS crew faces extreme infection risk during the journey.",
      exposureRisk: "Inadequately protected EMS workers handling a suspected Ebola patient face HIGH exposure.",
      containmentImpact: "Infected EMS crew becomes a mobile exposure vector — spreading risk to hospital and community.",
    },
    lesson:
      "Ebola patient transport requires the full Ebola PPE ensemble: fluid-resistant coverall or gown with head and neck cover, apron, double gloves, boots, goggles or face shield, and a fluid-resistant medical mask (a respirator such as N95/FFP2 for aerosol-generating procedures). A surgical mask and single gloves alone are NOT sufficient. You have the authority and responsibility to halt transport until proper PPE is confirmed — even if EMS resists.",
    exposureImpact: { correct: -5, wrong: 20 },
    patientImpact: { correct: "Safe transfer — chain of custody maintained", wrong: "Transfer in progress — EMS crew exposed" },
    containmentImpact: { correct: "Transport BIOSAFE", wrong: "Mobile exposure event — risk spreading" },
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TEAM B — Hidden Exposure Chain in Catering Facility
// ─────────────────────────────────────────────────────────────────────────────
const teamBQuestions: Question[] = [
  {
    id: 8,
    team: "B",
    scenario: "Hidden Exposure — Catering Worker Presentation",
    question:
      "A catering worker reports severe fatigue and watery diarrhoea. A colleague privately mentions the worker returned from Guinea 8 days ago and has been handling food since. What is your FIRST action?",
    options: {
      A: "Advise the worker to take paracetamol and rest in the break room until symptoms resolve",
      B: "Immediately isolate the worker, don PPE, and activate the Ebola alert protocol",
      C: "Ask the worker to go home and self-monitor — call back if symptoms worsen",
      D: "Monitor the worker for 24 hours in the clinic before escalating",
    },
    correctAnswer: "B",
    consequenceCorrect: {
      patientOutcome: "Worker is isolated before further food handling. Exposure chain is paused.",
      exposureRisk: "Immediate PPE use protects Health staff during assessment.",
      containmentImpact: "Early alert activation triggers the full response — facility-wide exposure risk mapped.",
    },
    consequenceWrong: {
      patientOutcome: "Worker remains in the facility, handling food or near colleagues — exposure chain deepens.",
      exposureRisk: "Delayed action means more workers and consumers are potentially exposed.",
      containmentImpact: "Every hour of delay multiplies the number of potential contacts.",
    },
    lesson:
      "Travel to an area with active Ebola transmission within the past 21 days, combined with symptoms compatible with Ebola (such as fever, fatigue, diarrhoea or vomiting), calls for immediate isolation, full PPE and activation of the Ebola alert so the public health team can assess the case against the current case definition — however mild the symptoms appear. Fever can be absent at presentation or masked by paracetamol, so its absence does not rule Ebola out.",
    exposureImpact: { correct: -5, wrong: 20 },
    patientImpact: { correct: "Isolated — no further food contact", wrong: "Still handling food — exposure widening" },
    containmentImpact: { correct: "Alert ACTIVATED", wrong: "Exposure chain CONTINUING" },
  },
  {
    id: 9,
    team: "B",
    scenario: "Food Service Contamination Risk — 200 Employees",
    question:
      "The ill worker has been handling food served to 200 employees across 3 days while symptomatic. What is the containment priority?",
    options: {
      A: "Disinfect the kitchen surfaces and resume catering operations after a deep clean",
      B: "Test a sample of today's food for Ebola virus to confirm risk level",
      C: "Halt ALL food services, remove exposed kitchen staff from duty pending exposure assessment and appropriate 21-day monitoring, and formally notify all 200 potentially exposed employees",
      D: "Inform senior management only and wait for official health authority confirmation before notifying workers",
    },
    correctAnswer: "C",
    consequenceCorrect: {
      patientOutcome: "All exposed parties are notified. Kitchen operations halted — no new food-route exposure.",
      exposureRisk: "Exposed kitchen staff are off duty pending exposure assessment and monitoring. 200 employees are informed and can report symptoms.",
      containmentImpact: "Scope of exposure is defined and communicated — response can be calibrated accurately.",
    },
    consequenceWrong: {
      patientOutcome: "200 uninformed employees continue daily activities — potential community spread accelerates.",
      exposureRisk: "Continued catering operations add new exposure events each meal service.",
      containmentImpact: "Hidden exposure chain expands beyond the facility boundary.",
    },
    lesson:
      "When food service is the exposure route, ALL recipients must be notified, in coordination with the public health authority, and kitchen operations halted immediately. Exposed kitchen staff are removed from duty pending exposure assessment, with appropriate 21-day monitoring. Ebola is not transmitted via food, but the worker's body fluids may have contaminated surfaces or utensils during symptomatic handling.",
    exposureImpact: { correct: -10, wrong: 20 },
    patientImpact: { correct: "Exposure chain MAPPED", wrong: "200 uninformed contacts — chain EXPANDING" },
    containmentImpact: { correct: "Food route CLOSED", wrong: "Facility-wide spread risk CRITICAL" },
  },
  {
    id: 10,
    team: "B",
    scenario: "Shared Restroom Contamination",
    question:
      "The ill worker has used shared restrooms on two floors, frequented by 50+ employees daily. What is the correct protocol?",
    options: {
      A: "Seal off and decontaminate all shared restrooms — restrict all access until cleared by infection control",
      B: "Post warning signs on the restroom doors but keep them open for essential use",
      C: "Increase cleaning frequency to hourly disinfection and monitor for complaints",
      D: "Wait for test results before applying any restroom restrictions to avoid operational disruption",
    },
    correctAnswer: "A",
    consequenceCorrect: {
      patientOutcome: "Restrooms are closed — indirect contact via environmental surfaces is eliminated.",
      exposureRisk: "No worker encounters contaminated high-touch surfaces. Risk of indirect transmission removed.",
      containmentImpact: "Environmental route CLOSED. Decontamination can proceed systematically.",
    },
    consequenceWrong: {
      patientOutcome: "Workers continue using potentially contaminated restrooms, creating new exposure events.",
      exposureRisk: "Surfaces soiled with a symptomatic patient's body fluids (vomit, diarrhoea, blood) can transmit Ebola indirectly.",
      containmentImpact: "Indirect contact chain continues — scope of exposure widens beyond direct contacts.",
    },
    lesson:
      "Any surface or facility used by a suspected Ebola patient must be treated as contaminated. Shared restrooms represent a high-risk indirect contact environment and must be sealed and decontaminated before reopening.",
    exposureImpact: { correct: -5, wrong: 15 },
    patientImpact: { correct: "Environmental route SEALED", wrong: "50+ workers at indirect exposure risk" },
    containmentImpact: { correct: "Contamination CONTAINED", wrong: "Environmental spread ACTIVE" },
  },
  {
    id: 11,
    team: "B",
    scenario: "Supervisor Overrides Infection Control Decision",
    question:
      "The catering supervisor insists the worker is 'just stressed and tired from overtime' and orders them back to the food preparation station. What do you do?",
    options: {
      A: "Defer to the supervisor — they have direct line authority over the worker's duties",
      B: "Ask the worker what they prefer and let them decide whether to return",
      C: "Compromise: allow the worker to do non-food-contact duties in the kitchen area",
      D: "Override the supervisor — invoke infection control authority and immediately remove the worker from any food handling area",
    },
    correctAnswer: "D",
    consequenceCorrect: {
      patientOutcome: "Worker is removed from food contact duties. No further contamination of food service.",
      exposureRisk: "Health and infection-control authority supersedes line management in infectious disease situations.",
      containmentImpact: "Food service contamination route is CLOSED before additional meals are affected.",
    },
    consequenceWrong: {
      patientOutcome: "Worker returns to food prep — potentially contaminating food for hundreds more workers.",
      exposureRisk: "A symptomatic possible Ebola patient handling communal food creates mass exposure risk.",
      containmentImpact: "A facility-wide outbreak becomes highly probable if this worker continues food service.",
    },
    lesson:
      "Health and infection-control professionals must be empowered by site policy, backed by the public health authorities, to override line management decisions during public health emergencies. 'Management authority' does not extend to overruling infection control protocols during a potential Ebola incident.",
    exposureImpact: { correct: -5, wrong: 25 },
    patientImpact: { correct: "Food contamination STOPPED", wrong: "Food contamination CONTINUING — mass exposure" },
    containmentImpact: { correct: "Authority ASSERTED — risk controlled", wrong: "Authority UNDERMINED — risk critical" },
  },
  {
    id: 12,
    team: "B",
    scenario: "Shared Personal Items — Locker Room",
    question:
      "Investigation reveals the ill worker shared towels and personal items in the locker room with 2 coworkers over the past 4 days. What is the risk assessment and correct action?",
    options: {
      A: "Shared personal items pose negligible Ebola transmission risk — no additional action required",
      B: "Classify the 2 coworkers as HIGH-RISK contacts, assess exposure and apply appropriate work restrictions and 21-day monitoring, and decontaminate the locker room",
      C: "Ask the 2 coworkers to shower and return to work — personal hygiene addresses the risk",
      D: "Monitor the coworkers only if they develop fever within 72 hours",
    },
    correctAnswer: "B",
    consequenceCorrect: {
      patientOutcome: "High-risk contacts are assessed, placed under appropriate work restrictions and monitored before potential symptom onset and secondary spread.",
      exposureRisk: "Locker room decontamination prevents further indirect contact exposures.",
      containmentImpact: "Contact chain mapped accurately — all known high-risk individuals are accounted for.",
    },
    consequenceWrong: {
      patientOutcome: "Unmonitored high-risk contacts may develop Ebola and create a new outbreak cluster.",
      exposureRisk: "Direct contact with body-fluid contaminated personal items is HIGH-RISK exposure by definition.",
      containmentImpact: "Two potential new index cases are loose in the facility and community.",
    },
    lesson:
      "Sharing towels, clothing, or personal hygiene items with a symptomatic Ebola patient constitutes HIGH-RISK exposure (direct contact with potentially infected secretions). Both coworkers require an immediate exposure assessment, appropriate work restrictions and 21-day monitoring.",
    exposureImpact: { correct: -5, wrong: 20 },
    patientImpact: { correct: "High-risk contacts UNDER MONITORING", wrong: "2 potential cases still at large" },
    containmentImpact: { correct: "Locker room DECONTAMINATED", wrong: "Secondary cluster risk HIGH" },
  },
  {
    id: 13,
    team: "B",
    scenario: "Contact List Refusal — Privacy Objection",
    question:
      "Health authorities request a full list of all workplace contacts. The ill worker refuses to cooperate, citing personal privacy and fear of stigma. What is the correct response?",
    options: {
      A: "Escalate under public health emergency procedures — share the worker's contacts with the health authority for tracing, limited to what is necessary, despite the privacy objection",
      B: "Fully respect the worker's privacy rights — do not share any names with health authorities",
      C: "Share only the names of individuals the worker verbally consents to share",
      D: "Wait for a formal court order before releasing any worker identities",
    },
    correctAnswer: "A",
    consequenceCorrect: {
      patientOutcome: "Full contact list enables complete tracing — all exposed persons are identified and monitored.",
      exposureRisk: "Complete contact network is visible — no silent exposure chains remain undetected.",
      containmentImpact: "Response team can act on full data — containment becomes achievable.",
    },
    consequenceWrong: {
      patientOutcome: "Incomplete contact list leaves unknown exposed workers unmonitored — invisible transmission chain.",
      exposureRisk: "Every uncontacted exposed person is a potential new source of community spread.",
      containmentImpact: "Containment is IMPOSSIBLE without a complete contact network.",
    },
    lesson:
      "Complete contact information is essential for Ebola contact tracing and should be shared with the public health authorities (NCDC and the State Ministry of Health). Nigeria's Data Protection Act 2023 includes an exemption for processing needed to prevent or control a national public health emergency; confirm the legal basis for your site with your legal adviser. Share only what is necessary, only with the health authority, and address stigma concerns compassionately — they must not stop life-saving contact tracing.",
    exposureImpact: { correct: -10, wrong: 15 },
    patientImpact: { correct: "Full contact map ESTABLISHED", wrong: "Partial map — gaps in exposure chain" },
    containmentImpact: { correct: "Tracing COMPLETE", wrong: "Tracing INCOMPLETE — outbreak risk remains" },
  },
  {
    id: 14,
    team: "B",
    scenario: "Household Secondary Case — Spouse Symptomatic",
    question:
      "The ill worker's spouse calls to report they also have fever (39.5 °C) and diarrhoea developing overnight. They ask if they should come to the industrial clinic for assessment. What is your response?",
    options: {
      A: "Advise the spouse to see their regular GP and report findings back to you",
      B: "Tell the spouse to come directly to the industrial clinic for immediate clinical assessment",
      C: "Alert public health authorities immediately, coordinate an emergency home assessment for the spouse, and expand contact tracing to the full household",
      D: "Advise the spouse to stay home, self-medicate with oral rehydration, and wait for the index worker's test results",
    },
    correctAnswer: "C",
    consequenceCorrect: {
      patientOutcome: "Potential secondary case is assessed safely at home — no community transit risk.",
      exposureRisk: "Household is treated as a containment unit. Home assessment prevents clinic exposure.",
      containmentImpact: "Contact tracing expands to include household — all co-residents are assessed.",
    },
    consequenceWrong: {
      patientOutcome: "The spouse travelling to a clinic or GP exposes transport, waiting rooms, and clinical staff.",
      exposureRisk: "A symptomatic household contact using public transport or visiting clinics is a mass-exposure event.",
      containmentImpact: "Community spread via secondary case transport is one of the most common Ebola amplification events.",
    },
    lesson:
      "Household contacts of suspected Ebola patients who develop symptoms MUST be assessed at home by a rapid response team — NEVER directed to travel to clinic independently. Movement of symptomatic suspected cases in public spaces is a critical containment failure.",
    exposureImpact: { correct: -10, wrong: 25 },
    patientImpact: { correct: "Secondary case CONTAINED at home", wrong: "Secondary case travelling — community exposure" },
    containmentImpact: { correct: "Household ring CLOSED", wrong: "Community transmission event TRIGGERED" },
  },
];

// Exported combined list — all questions
export const ALL_QUESTIONS: Question[] = [...teamAQuestions, ...teamBQuestions];

export function getQuestionsForTeam(team: Team): Question[] {
  return ALL_QUESTIONS.filter((q) => q.team === team);
}
