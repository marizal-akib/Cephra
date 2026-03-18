export interface QuestionDef {
  id: string;
  group: string;
  type: "boolean" | "select" | "multiselect" | "number" | "text" | "scale";
  label: string;
  helpText?: string;
  options?: { value: string; label: string }[];
  required: boolean;
}

export const QUESTION_GROUPS = [
  { key: "basics", label: "About You" },
  { key: "burden", label: "Headache Burden" },
  { key: "symptoms", label: "Symptoms" },
  { key: "warnings", label: "Warning Signs" },
  { key: "medications", label: "Medications" },
] as const;

export const QUESTIONS: QuestionDef[] = [
  // Basics
  { id: "age", group: "basics", type: "number", label: "What is your age?", required: true },
  {
    id: "sex",
    group: "basics",
    type: "select",
    label: "Sex at birth",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "other", label: "Other" },
    ],
    required: true,
  },
  {
    id: "pregnancy_status",
    group: "basics",
    type: "select",
    label: "Are you currently pregnant or have you given birth in the last 6 weeks?",
    options: [
      { value: "not_applicable", label: "Not applicable" },
      { value: "pregnant", label: "Currently pregnant" },
      { value: "postpartum", label: "Gave birth in last 6 weeks" },
      { value: "no", label: "No" },
    ],
    required: false,
  },

  // Burden
  {
    id: "headache_days_per_month",
    group: "burden",
    type: "number",
    label: "How many days per month do you have a headache?",
    required: true,
  },
  {
    id: "severe_days_per_month",
    group: "burden",
    type: "number",
    label: "How many of those days are severe?",
    required: false,
  },
  {
    id: "headache_duration",
    group: "burden",
    type: "select",
    label: "How long does a typical headache last (untreated)?",
    options: [
      { value: "seconds", label: "Seconds" },
      { value: "minutes", label: "Minutes (under 1 hour)" },
      { value: "1-4hours", label: "1-4 hours" },
      { value: "4-72hours", label: "4-72 hours" },
      { value: "more_than_3_days", label: "More than 3 days" },
      { value: "continuous", label: "Continuous" },
    ],
    required: true,
  },
  {
    id: "pain_severity",
    group: "burden",
    type: "scale",
    label: "On a scale of 0-10, how severe is your worst headache?",
    required: true,
  },

  // Symptoms
  { id: "nausea", group: "symptoms", type: "boolean", label: "Do you feel nauseous during headaches?", required: false },
  { id: "vomiting", group: "symptoms", type: "boolean", label: "Do you vomit during headaches?", required: false },
  { id: "light_sensitivity", group: "symptoms", type: "boolean", label: "Does light bother you during headaches?", required: false },
  { id: "sound_sensitivity", group: "symptoms", type: "boolean", label: "Does sound bother you during headaches?", required: false },
  { id: "visual_disturbances", group: "symptoms", type: "boolean", label: "Do you see flashing lights, zigzag lines, or blind spots before or during headaches?", required: false },
  { id: "numbness_tingling", group: "symptoms", type: "boolean", label: "Do you experience numbness or tingling before or during headaches?", required: false },
  { id: "worse_with_activity", group: "symptoms", type: "boolean", label: "Do headaches get worse with physical activity?", required: false },
  { id: "eye_tearing", group: "symptoms", type: "boolean", label: "Does your eye tear or become red on the side of the headache?", required: false },
  { id: "nasal_congestion", group: "symptoms", type: "boolean", label: "Do you get a blocked or runny nose on the side of the headache?", required: false },

  // Warnings
  {
    id: "sudden_worst_headache",
    group: "warnings",
    type: "boolean",
    label: "Have you ever had a sudden, explosive headache that reached maximum intensity within one minute?",
    helpText: "This is sometimes called a thunderclap headache.",
    required: false,
  },
  { id: "new_weakness", group: "warnings", type: "boolean", label: "Have you developed any new weakness, numbness, or difficulty speaking?", required: false },
  { id: "fever_with_headache", group: "warnings", type: "boolean", label: "Have you had fever or unexplained weight loss with your headaches?", required: false },
  { id: "recent_head_injury", group: "warnings", type: "boolean", label: "Have you had a head injury recently?", required: false },
  { id: "headache_pattern_change", group: "warnings", type: "boolean", label: "Has your headache pattern changed significantly recently?", required: false },

  // Medications
  {
    id: "pain_relief_frequency",
    group: "medications",
    type: "select",
    label: "How often do you take pain relief for headaches?",
    options: [
      { value: "rarely", label: "Rarely (few times a month)" },
      { value: "1-2_per_week", label: "1-2 times per week" },
      { value: "3-4_per_week", label: "3-4 times per week" },
      { value: "daily", label: "Daily or near-daily" },
    ],
    required: false,
  },
  {
    id: "current_medications",
    group: "medications",
    type: "text",
    label: "List any medications you currently take for headaches (both acute and preventive)",
    helpText: "Include name and how often you take it.",
    required: false,
  },
];
