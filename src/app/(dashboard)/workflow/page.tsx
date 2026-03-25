import { createClient } from "@/lib/supabase/server";
import { AssessmentWorkflowList } from "@/components/workflow/assessment-workflow-list";
import { type WorkflowEncounter } from "@/components/workflow/types";

export default async function AssessmentWorkflowPage() {
  const supabase = await createClient();

  const { data: encountersData, error } = await supabase
    .from("encounters")
    .select(
      `
        id,
        status,
        encounter_type,
        current_step,
        created_at,
        updated_at,
        referred_by_clinician_id,
        patient:patients(
          id,
          first_name,
          last_name,
          mrn
        ),
        questionnaire_tokens(
          token,
          created_at,
          used_at,
          expires_at
        )
      `
    )
    .order("updated_at", { ascending: false })
    .limit(100);

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <div className="rounded-lg border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          Unable to load assessment workflow data right now. Please refresh and try again.
        </div>
      </div>
    );
  }

  const encounters = (encountersData ?? []) as unknown as WorkflowEncounter[];

  return (
    <div className="p-4 md:p-6 lg:p-8">
      <AssessmentWorkflowList encounters={encounters} />
    </div>
  );
}
