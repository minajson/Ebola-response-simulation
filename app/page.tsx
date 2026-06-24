import Link from "next/link";

export default function Home() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)" }}
    >
      {/* Biohazard icon */}
      <div className="text-7xl mb-6 select-none">☣</div>

      <h1 className="text-center text-4xl sm:text-5xl font-extrabold text-white mb-3 leading-tight">
        Ebola Response:
        <br />
        <span className="text-amber-400">Contain or Collapse</span>
      </h1>

      <p className="text-slate-400 text-center text-base max-w-md mb-10 leading-relaxed">
        Occupational Health Ebola preparedness training simulation for industrial sites.
        Make the right call — before the clock runs out.
      </p>

      <Link
        href="/game"
        className="rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-900 font-extrabold text-lg px-14 py-4 transition-colors shadow-xl shadow-amber-900/50"
      >
        Launch Simulation →
      </Link>

      <p className="mt-6 text-xs text-slate-600 text-center max-w-xs">
        This simulation is for training purposes only. All scenarios are based on established
        Ebola response protocols.
      </p>
    </main>
  );
}
