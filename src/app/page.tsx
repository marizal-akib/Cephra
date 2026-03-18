import Link from "next/link";

export default function Home() {
  const featureLabels = [
    "Patient Intake",
    "Red Flag Review",
    "Structured Assessment",
    "Clinical Notes",
  ];

  return (
    <main className="min-h-screen bg-[#f5f7fb] text-foreground">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 md:px-8 md:py-6">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-blue-500 text-xs font-semibold text-white shadow-sm">
            C
          </span>
          <span className="text-sm font-semibold tracking-tight">Cephra</span>
        </Link>
      </header>

      <section className="relative isolate overflow-hidden">
        <div className="hero-neuro-bg" aria-hidden="true">
          <div className="hero-neuro-gradient" />
          <div className="hero-neuro-grid" />
          <div className="hero-neuro-flow hero-neuro-flow-a" />
          <div className="hero-neuro-flow hero-neuro-flow-b" />
          <div className="hero-neuro-pulse hero-neuro-pulse-a" />
          <div className="hero-neuro-pulse hero-neuro-pulse-b" />
          <div className="hero-neuro-nodes" />
        </div>

        <div className="mx-auto flex w-full max-w-6xl justify-center px-4 pb-14 pt-8 sm:pb-20 sm:pt-10 md:px-8 md:pb-28 md:pt-24">
          <div className="w-full max-w-3xl rounded-3xl border border-white/50 bg-white/70 px-4 py-8 text-center shadow-[0_20px_65px_-40px_rgba(15,23,42,0.45)] backdrop-blur-md sm:px-6 sm:py-9 md:px-10 md:py-12">
            <h1 className="text-balance text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl md:text-6xl">
              Structured Headache Evaluation
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-pretty text-sm text-slate-600 sm:mt-4 md:text-base">
              A clinician-focused workflow for headache intake, assessment, and note
              generation.
            </p>
            <div className="mt-6 flex flex-col items-stretch justify-center gap-2.5 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
              <Link
                href="/login"
                className="w-full rounded-full bg-slate-900 px-6 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-slate-700 sm:w-auto"
              >
                Login
              </Link>
              <Link
                href="/docs/user-guide"
                className="w-full rounded-full border border-slate-300 bg-white/80 px-6 py-2.5 text-center text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900 sm:w-auto"
              >
                Download User Guide
              </Link>
            </div>
            <p className="mx-auto mt-4 max-w-2xl text-xs leading-relaxed text-slate-500 sm:mt-5">
              Patients access Cephra through a secure questionnaire link sent by their
              clinician.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-8 sm:pb-10 md:px-8">
        <div className="grid grid-cols-1 gap-2.5 rounded-2xl border border-slate-200/80 bg-white/80 p-3 shadow-sm backdrop-blur-sm sm:grid-cols-2 sm:gap-3 sm:p-4 md:grid-cols-4 md:gap-4 md:p-6">
          {featureLabels.map((label) => (
            <p
              key={label}
              className="rounded-xl border border-slate-200/75 bg-white px-3 py-2.5 text-center text-sm font-medium text-slate-700 sm:py-3"
            >
              {label}
            </p>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-8 sm:pb-10 md:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm sm:p-6 md:p-8">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">User Guide</h2>
          <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
            Need full guidance? Download the user guide for setup and workflow details.
          </p>
          <Link
            href="/docs/user-guide"
            className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-400 hover:text-slate-900 sm:mt-5 sm:w-auto"
          >
            Download PDF
          </Link>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 pb-10 sm:pb-12 md:px-8">
        <div className="rounded-2xl border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(241,245,249,0.9))] p-5 text-center shadow-sm sm:p-6 md:p-8">
          <p className="text-sm text-slate-600">Ready to continue?</p>
          <Link
            href="/login"
            className="mt-3 inline-flex text-lg font-semibold tracking-tight text-slate-900 underline decoration-slate-300 underline-offset-4 transition-colors hover:text-slate-700"
          >
            Login
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200/80 bg-white/85">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 px-4 py-6 text-sm text-slate-600 md:flex-row md:items-center md:justify-between md:px-8">
          <div>
            <p className="font-medium text-slate-900">Cephra</p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/login" className="transition-colors hover:text-slate-900">
              Login
            </Link>
            <Link href="/docs/user-guide" className="transition-colors hover:text-slate-900">
              User Guide
            </Link>
            <span>Prototype version</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
