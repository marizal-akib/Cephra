// Non-clinical demo catalogue of headache-clinic-relevant medicines.
// Field shape mirrors §9.3/§9.6 of the Headache Evaluation Tool — Developer Implementation Pack
// so a future Phase 2 (decision-support) and Phase 3 (lifecycle/transmission) can read the same
// objects without renaming. Production deployment requires licensed dm+d content, formulary
// ownership and a DCB0129/0160 safety case — none of which this file is.

import {
  CATEGORY_OPTIONS,
  DURATION_UNIT_OPTIONS,
  FREQUENCY_OPTIONS,
  ROUTE_OPTIONS,
} from "@/lib/schemas/prescription";

type FrequencyOption = (typeof FREQUENCY_OPTIONS)[number];
type RouteOption = (typeof ROUTE_OPTIONS)[number];
type DurationUnitOption = (typeof DURATION_UNIT_OPTIONS)[number];
type CategoryOption = (typeof CATEGORY_OPTIONS)[number];

export type AcuteOrPreventive = "acute" | "preventive" | "bridge" | "supportive";

export type IndicationDefaults = {
  indication_key: string;
  indication_label: string;
  category: CategoryOption;
  acute_or_preventive: AcuteOrPreventive;
  default_strength: string;
  default_route: RouteOption;
  default_frequency: FrequencyOption;
  default_frequency_custom?: string;
  default_duration_value?: number;
  default_duration_unit?: DurationUnitOption;
  default_quantity?: string;
  max_daily_dose?: string;
  default_special_instructions?: string;
};

export type MedicineEntry = {
  name: string;
  aliases?: string[];
  therapeutic_class: string;
  dmd_code?: string;
  formulary_status?: "in" | "restricted" | "out";
  high_risk_flag?: boolean;
  pregnancy_restricted?: boolean;
  strength_options: string[];
  formulation_options?: string[];
  route_options: RouteOption[];
  indications: IndicationDefaults[];
};

export const MEDICINES_CATALOGUE: MedicineEntry[] = [
  {
    name: "Sumatriptan",
    aliases: ["Imigran"],
    therapeutic_class: "Triptan (5-HT1B/1D agonist)",
    formulary_status: "in",
    pregnancy_restricted: true,
    strength_options: ["50mg", "100mg", "6mg/0.5mL"],
    formulation_options: ["tablet", "subcutaneous injection", "nasal spray"],
    route_options: ["oral", "subcutaneous", "nasal"],
    indications: [
      {
        indication_key: "migraine_acute",
        indication_label: "Migraine — acute",
        category: "acute",
        acute_or_preventive: "acute",
        default_strength: "50mg",
        default_route: "oral",
        default_frequency: "as required/PRN",
        default_quantity: "12 tablets",
        max_daily_dose: "300 mg/24h",
        default_special_instructions:
          "Take at first sign of migraine pain. May repeat after 2 hours if partial response. Do not exceed 10 days/month to avoid medication-overuse headache.",
      },
      {
        indication_key: "cluster_acute",
        indication_label: "Cluster headache — acute",
        category: "acute",
        acute_or_preventive: "acute",
        default_strength: "6mg/0.5mL",
        default_route: "subcutaneous",
        default_frequency: "as required/PRN",
        default_quantity: "6 prefilled syringes",
        max_daily_dose: "12 mg/24h subcutaneous",
        default_special_instructions:
          "Inject at attack onset. Maximum two injections in 24 hours, separated by ≥1 hour.",
      },
    ],
  },
  {
    name: "Rizatriptan",
    aliases: ["Maxalt"],
    therapeutic_class: "Triptan (5-HT1B/1D agonist)",
    formulary_status: "in",
    pregnancy_restricted: true,
    strength_options: ["5mg", "10mg"],
    formulation_options: ["tablet", "orodispersible wafer"],
    route_options: ["oral"],
    indications: [
      {
        indication_key: "migraine_acute",
        indication_label: "Migraine — acute",
        category: "acute",
        acute_or_preventive: "acute",
        default_strength: "10mg",
        default_route: "oral",
        default_frequency: "as required/PRN",
        default_quantity: "12 tablets",
        max_daily_dose: "20 mg/24h",
        default_special_instructions:
          "Take at first sign of migraine. May repeat after 2 hours. Reduce to 5 mg if on propranolol.",
      },
    ],
  },
  {
    name: "Zolmitriptan",
    aliases: ["Zomig"],
    therapeutic_class: "Triptan (5-HT1B/1D agonist)",
    formulary_status: "in",
    pregnancy_restricted: true,
    strength_options: ["2.5mg", "5mg"],
    formulation_options: ["tablet", "orodispersible", "nasal spray"],
    route_options: ["oral", "nasal"],
    indications: [
      {
        indication_key: "migraine_acute",
        indication_label: "Migraine — acute",
        category: "acute",
        acute_or_preventive: "acute",
        default_strength: "2.5mg",
        default_route: "oral",
        default_frequency: "as required/PRN",
        default_quantity: "12 tablets",
        max_daily_dose: "10 mg/24h",
        default_special_instructions:
          "Take at first sign of migraine. May repeat after 2 hours.",
      },
      {
        indication_key: "cluster_acute",
        indication_label: "Cluster headache — acute",
        category: "acute",
        acute_or_preventive: "acute",
        default_strength: "5mg",
        default_route: "nasal",
        default_frequency: "as required/PRN",
        default_quantity: "6 nasal spray doses",
        max_daily_dose: "10 mg/24h nasal",
        default_special_instructions:
          "Single spray into one nostril at attack onset. Repeat after 2 hours if needed.",
      },
    ],
  },
  {
    name: "Naproxen",
    aliases: ["Naprosyn"],
    therapeutic_class: "NSAID",
    formulary_status: "in",
    pregnancy_restricted: true,
    strength_options: ["250mg", "500mg"],
    formulation_options: ["tablet"],
    route_options: ["oral"],
    indications: [
      {
        indication_key: "migraine_acute",
        indication_label: "Migraine — acute",
        category: "acute",
        acute_or_preventive: "acute",
        default_strength: "500mg",
        default_route: "oral",
        default_frequency: "twice daily",
        default_duration_value: 3,
        default_duration_unit: "days",
        default_quantity: "12 tablets",
        max_daily_dose: "1000 mg/24h",
        default_special_instructions:
          "Take with food. Consider gastroprotection if prolonged use. Caution in renal impairment, asthma, peptic ulcer history.",
      },
      {
        indication_key: "menstrual_migraine_prevention",
        indication_label: "Menstrual migraine — short-term prevention",
        category: "preventive",
        acute_or_preventive: "preventive",
        default_strength: "500mg",
        default_route: "oral",
        default_frequency: "twice daily",
        default_duration_value: 7,
        default_duration_unit: "days",
        default_quantity: "14 tablets per cycle",
        max_daily_dose: "1000 mg/24h",
        default_special_instructions:
          "Start 2 days before expected onset of menstruation, continue for 5–7 days. Take with food.",
      },
    ],
  },
  {
    name: "Ibuprofen",
    aliases: ["Brufen", "Nurofen"],
    therapeutic_class: "NSAID",
    formulary_status: "in",
    pregnancy_restricted: true,
    strength_options: ["200mg", "400mg", "600mg"],
    formulation_options: ["tablet", "liquid"],
    route_options: ["oral"],
    indications: [
      {
        indication_key: "migraine_acute",
        indication_label: "Migraine — acute",
        category: "acute",
        acute_or_preventive: "acute",
        default_strength: "400mg",
        default_route: "oral",
        default_frequency: "three times daily",
        default_duration_value: 3,
        default_duration_unit: "days",
        default_quantity: "30 tablets",
        max_daily_dose: "2400 mg/24h",
        default_special_instructions:
          "Take with food. Avoid in active peptic ulcer or third-trimester pregnancy.",
      },
    ],
  },
  {
    name: "Paracetamol",
    aliases: ["Acetaminophen", "Panadol"],
    therapeutic_class: "Simple analgesic",
    formulary_status: "in",
    strength_options: ["500mg", "1g"],
    formulation_options: ["tablet", "soluble", "liquid"],
    route_options: ["oral"],
    indications: [
      {
        indication_key: "tension_type_headache_acute",
        indication_label: "Tension-type headache — acute",
        category: "acute",
        acute_or_preventive: "acute",
        default_strength: "1g",
        default_route: "oral",
        default_frequency: "four times daily",
        default_duration_value: 3,
        default_duration_unit: "days",
        default_quantity: "30 tablets",
        max_daily_dose: "4 g/24h",
        default_special_instructions:
          "Maximum 4 g per 24 hours. Reduce dose if weight <50 kg or hepatic impairment. Avoid use on >15 days/month.",
      },
      {
        indication_key: "migraine_acute",
        indication_label: "Migraine — acute",
        category: "acute",
        acute_or_preventive: "acute",
        default_strength: "1g",
        default_route: "oral",
        default_frequency: "as required/PRN",
        default_quantity: "30 tablets",
        max_daily_dose: "4 g/24h",
        default_special_instructions:
          "Take at first sign of headache. Maximum 4 g per 24 hours.",
      },
    ],
  },
  {
    name: "Propranolol",
    aliases: ["Inderal"],
    therapeutic_class: "Beta-blocker",
    formulary_status: "in",
    strength_options: ["10mg", "40mg", "80mg", "80mg MR", "160mg MR"],
    formulation_options: ["tablet", "modified-release capsule"],
    route_options: ["oral"],
    indications: [
      {
        indication_key: "migraine_prevention",
        indication_label: "Migraine — prevention",
        category: "preventive",
        acute_or_preventive: "preventive",
        default_strength: "40mg",
        default_route: "oral",
        default_frequency: "twice daily",
        default_duration_value: 3,
        default_duration_unit: "months",
        default_quantity: "1 month supply",
        max_daily_dose: "240 mg/24h",
        default_special_instructions:
          "Titrate from 40 mg twice daily up to 80–160 mg/day as tolerated over 2–4 weeks. Review at 8–12 weeks. Avoid in asthma, uncontrolled heart failure, second/third-degree AV block. Caution in diabetes (masks hypoglycaemia).",
      },
    ],
  },
  {
    name: "Topiramate",
    aliases: ["Topamax"],
    therapeutic_class: "Anticonvulsant",
    formulary_status: "in",
    high_risk_flag: true,
    pregnancy_restricted: true,
    strength_options: ["25mg", "50mg", "100mg"],
    formulation_options: ["tablet", "sprinkle capsule"],
    route_options: ["oral"],
    indications: [
      {
        indication_key: "migraine_prevention",
        indication_label: "Migraine — prevention",
        category: "preventive",
        acute_or_preventive: "preventive",
        default_strength: "25mg",
        default_route: "oral",
        default_frequency: "every night",
        default_duration_value: 3,
        default_duration_unit: "months",
        default_quantity: "1 month supply",
        max_daily_dose: "100 mg/24h (typical migraine target)",
        default_special_instructions:
          "Start 25 mg nightly, titrate by 25 mg/week to 50 mg twice daily. Pregnancy Prevention Programme MANDATORY for women of childbearing potential — teratogenic, contraindicated in pregnancy. Counsel re: paraesthesia, cognitive slowing, weight loss, renal stones, mood change, glaucoma.",
      },
    ],
  },
  {
    name: "Amitriptyline",
    therapeutic_class: "Tricyclic antidepressant",
    formulary_status: "in",
    strength_options: ["10mg", "25mg", "50mg"],
    formulation_options: ["tablet", "oral solution"],
    route_options: ["oral"],
    indications: [
      {
        indication_key: "chronic_migraine_prevention",
        indication_label: "Chronic migraine / mixed headache — prevention",
        category: "preventive",
        acute_or_preventive: "preventive",
        default_strength: "10mg",
        default_route: "oral",
        default_frequency: "every night",
        default_duration_value: 3,
        default_duration_unit: "months",
        default_quantity: "1 month supply",
        max_daily_dose: "75 mg nocte (typical headache target)",
        default_special_instructions:
          "Start 10 mg nocte, titrate weekly to 25–75 mg as tolerated. Take 2 hours before bedtime to reduce morning sedation. Caution in cardiac conduction disease, urinary retention, glaucoma, recent MI.",
      },
      {
        indication_key: "tension_type_headache_prevention",
        indication_label: "Chronic tension-type headache — prevention",
        category: "preventive",
        acute_or_preventive: "preventive",
        default_strength: "10mg",
        default_route: "oral",
        default_frequency: "every night",
        default_duration_value: 3,
        default_duration_unit: "months",
        default_quantity: "1 month supply",
        max_daily_dose: "75 mg nocte",
        default_special_instructions:
          "Start 10 mg nocte, titrate to 25–50 mg over 2–4 weeks.",
      },
    ],
  },
  {
    name: "Candesartan",
    aliases: ["Amias"],
    therapeutic_class: "Angiotensin-II receptor blocker",
    formulary_status: "in",
    pregnancy_restricted: true,
    strength_options: ["4mg", "8mg", "16mg"],
    formulation_options: ["tablet"],
    route_options: ["oral"],
    indications: [
      {
        indication_key: "migraine_prevention",
        indication_label: "Migraine — prevention",
        category: "preventive",
        acute_or_preventive: "preventive",
        default_strength: "8mg",
        default_route: "oral",
        default_frequency: "once daily",
        default_duration_value: 3,
        default_duration_unit: "months",
        default_quantity: "1 month supply",
        max_daily_dose: "16 mg/24h (off-label headache use)",
        default_special_instructions:
          "Start 8 mg daily, titrate to 16 mg after 2 weeks if tolerated. Off-label for migraine. Contraindicated in pregnancy. Check U&Es at 2–4 weeks; caution with renal artery stenosis, hyperkalaemia.",
      },
    ],
  },
  {
    name: "Indomethacin",
    therapeutic_class: "NSAID (indication-defining for hemicranias)",
    formulary_status: "in",
    pregnancy_restricted: true,
    strength_options: ["25mg", "50mg", "75mg MR"],
    formulation_options: ["capsule", "modified-release capsule"],
    route_options: ["oral"],
    indications: [
      {
        indication_key: "paroxysmal_hemicrania",
        indication_label: "Paroxysmal hemicrania / hemicrania continua",
        category: "preventive",
        acute_or_preventive: "preventive",
        default_strength: "25mg",
        default_route: "oral",
        default_frequency: "three times daily",
        default_duration_value: 2,
        default_duration_unit: "weeks",
        default_quantity: "Trial pack",
        max_daily_dose: "225 mg/24h",
        default_special_instructions:
          "Indomethacin trial: start 25 mg TDS for 3 days, increase to 50 mg TDS for 3 days, then 75 mg TDS if needed. Co-prescribe PPI for gastroprotection. Complete response confirms diagnosis.",
      },
    ],
  },
  {
    name: "Verapamil",
    therapeutic_class: "Calcium-channel blocker (non-dihydropyridine)",
    formulary_status: "in",
    high_risk_flag: true,
    strength_options: ["40mg", "80mg", "120mg", "240mg MR"],
    formulation_options: ["tablet", "modified-release tablet"],
    route_options: ["oral"],
    indications: [
      {
        indication_key: "cluster_prevention",
        indication_label: "Cluster headache — prevention",
        category: "preventive",
        acute_or_preventive: "preventive",
        default_strength: "80mg",
        default_route: "oral",
        default_frequency: "three times daily",
        default_duration_value: 3,
        default_duration_unit: "months",
        default_quantity: "1 month supply",
        max_daily_dose: "Up to 960 mg/24h under specialist care",
        default_special_instructions:
          "Baseline ECG MANDATORY before starting and before each dose increase. Start 80 mg TDS, titrate by 80 mg every 2 weeks. Watch PR interval (>0.22 s warrants pause). Avoid in second/third-degree AV block, severe LV dysfunction.",
      },
    ],
  },
  {
    name: "Prednisolone",
    therapeutic_class: "Corticosteroid",
    formulary_status: "in",
    strength_options: ["1mg", "5mg", "25mg"],
    formulation_options: ["tablet", "soluble"],
    route_options: ["oral"],
    indications: [
      {
        indication_key: "cluster_bridge",
        indication_label: "Cluster headache — bridging therapy",
        category: "acute",
        acute_or_preventive: "bridge",
        default_strength: "60mg",
        default_route: "oral",
        default_frequency: "every morning",
        default_duration_value: 3,
        default_duration_unit: "weeks",
        default_quantity: "Tapering supply",
        max_daily_dose: "60 mg/24h initial",
        default_special_instructions:
          "Bridging course: 60 mg OD x 5 days, then taper by 10 mg every 3 days. Co-prescribe PPI. Counsel re: insomnia, mood change, BP, glycaemic effect. Ensure preventive (e.g. verapamil) is in titration.",
      },
      {
        indication_key: "giant_cell_arteritis",
        indication_label: "Suspected giant-cell arteritis (urgent)",
        category: "acute",
        acute_or_preventive: "acute",
        default_strength: "60mg",
        default_route: "oral",
        default_frequency: "every morning",
        default_duration_value: 4,
        default_duration_unit: "weeks",
        default_quantity: "Initial supply pending specialist review",
        max_daily_dose: "60 mg/24h (uncomplicated); 1 g IV methylpred if visual involvement",
        default_special_instructions:
          "Do not delay for biopsy. Refer urgently to rheumatology / ophthalmology. PPI cover, bone protection, BP and glucose monitoring.",
      },
    ],
  },
  {
    name: "Oxygen",
    therapeutic_class: "Medical gas",
    formulary_status: "restricted",
    strength_options: ["100% via non-rebreather mask"],
    formulation_options: ["high-flow concentrator", "cylinder"],
    route_options: ["inhaled"],
    indications: [
      {
        indication_key: "cluster_acute",
        indication_label: "Cluster headache — acute",
        category: "acute",
        acute_or_preventive: "acute",
        default_strength: "100% via non-rebreather mask",
        default_route: "inhaled",
        default_frequency: "as required/PRN",
        default_quantity: "Home oxygen pathway",
        max_daily_dose: "12–15 L/min for up to 20 minutes per attack",
        default_special_instructions:
          "Home oxygen order form (HOOF) required. 12–15 L/min via non-rebreather mask, sitting forward, for up to 20 minutes per attack. Counsel patient: no smoking, no naked flames near oxygen.",
      },
    ],
  },
];

const CATALOGUE_INDEX = new Map<string, MedicineEntry>();
for (const entry of MEDICINES_CATALOGUE) {
  CATALOGUE_INDEX.set(entry.name.toLowerCase(), entry);
}

export function findMedicines(query: string, limit = 8): MedicineEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: MedicineEntry[] = [];
  for (const entry of MEDICINES_CATALOGUE) {
    const haystack = [entry.name, ...(entry.aliases ?? [])]
      .map((s) => s.toLowerCase());
    if (haystack.some((s) => s.includes(q))) {
      results.push(entry);
      if (results.length >= limit) break;
    }
  }
  return results;
}

export function getCatalogueEntry(name: string): MedicineEntry | undefined {
  if (!name) return undefined;
  return CATALOGUE_INDEX.get(name.trim().toLowerCase());
}
