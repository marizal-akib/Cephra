export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 md:px-8">
        <div>
          <p className="text-sm font-semibold tracking-tight">Cephra</p>
          <p className="text-xs text-muted-foreground">Headache Evaluation Tool</p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/docs/user-guide"
            className="rounded-md border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-xs hover:bg-slate-50"
          >
            Download User Guide
          </a>
          <a
            href="/login"
            className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Clinician Login
          </a>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 pb-10 pt-8 md:grid-cols-2 md:px-8 md:pt-14">
        <div className="space-y-5">
          <p className="inline-flex rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            Clinician-facing prototype
          </p>
          <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Structured headache assessments, designed for clinical consultations.
          </h1>
          <p className="max-w-xl text-base text-muted-foreground">
            Cephra helps clinicians run consistent headache evaluations with intake
            review, red-flag-first triage, phenotype suggestions, and editable note
            output in one calm workflow.
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href="/login"
              className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Start Assessment
            </a>
            <a
              href="/docs/user-guide"
              className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Read Quick Start
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Core Workflow</p>
          <ol className="mt-4 space-y-3">
            {[
              "Doctor creates an assessment and sends a secure intake link.",
              "Patient completes questionnaire before the visit on phone.",
              "Doctor reviews intake and completes structured red-flag-first assessment.",
              "Cephra ranks phenotype suggestions and generates an editable clinic note.",
            ].map((step, index) => (
              <li
                key={step}
                className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3"
              >
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-semibold text-slate-700">
                  {index + 1}
                </span>
                <span className="text-sm text-slate-700">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-10 md:px-8">
        <div className="grid gap-4 md:grid-cols-4">
          {[
            {
              title: "Patient intake first",
              detail: "Send a secure link and collect history before the consultation.",
            },
            {
              title: "Safety-first triage",
              detail: "Run red flag logic before phenotype suggestion and output.",
            },
            {
              title: "Structured assessment",
              detail: "Capture pattern, pain, symptoms, and medication context consistently.",
            },
            {
              title: "Explainable output",
              detail: "Review supporting and contradicting features before signing notes.",
            },
          ].map((item) => (
            <article
              key={item.title}
              className="rounded-xl border border-border bg-card p-4 shadow-sm"
            >
              <h2 className="text-sm font-semibold">{item.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-white/70">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-6 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="text-sm font-medium">Getting Started</p>
            <p className="text-sm text-muted-foreground">
              Use the quick guide for setup and first clinician walkthrough.
            </p>
          </div>
          <div className="flex gap-2">
            <a
              href="/docs/user-guide"
              className="rounded-md border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-slate-50"
            >
              Download PDF Guide
            </a>
            <a
              href="/login"
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Login
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
