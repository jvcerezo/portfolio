import { useState } from "react";
import { Send, Copy, Check, Briefcase } from "lucide-react";

const ROLES = [
  { id: "fullstack", label: "Full-Stack Engineer", defaultSalary: 110000 },
  { id: "qa", label: "QA / Automation Engineer", defaultSalary: 95000 },
  { id: "mobile", label: "Mobile Engineer (Flutter)", defaultSalary: 120000 },
];

const SETUPS = [
  { id: "remote-us", label: "Remote · US Hours (Night Shift)" },
  { id: "remote-ph", label: "Remote · PH Hours (UTC+8)" },
  { id: "hybrid", label: "Hybrid · Manila / Laguna" },
];

const PERKS = [
  "M3/M4 Max MacBook",
  "HMO + Dependents",
  "Flexible PTO",
  "Specialty Coffee Budget",
  "Annual Bonus / Equity",
];

export function OfferCalculator() {
  const [role, setRole] = useState(ROLES[0].id);
  const [setup, setSetup] = useState(SETUPS[0].id);
  const [salary, setSalary] = useState(120000);
  const [selectedPerks, setSelectedPerks] = useState<string[]>([
    "M3/M4 Max MacBook",
    "HMO + Dependents",
    "Flexible PTO",
  ]);
  const [company, setCompany] = useState("");
  const [copied, setCopied] = useState(false);

  const activeRole = ROLES.find((r) => r.id === role) || ROLES[0];
  const activeSetup = SETUPS.find((s) => s.id === setup) || SETUPS[0];

  const togglePerk = (p: string) => {
    setSelectedPerks((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
    );
  };

  const handleCopy = () => {
    const text = `Job Offer Proposal for Jet Timothy Cerezo\nRole: ${activeRole.label}\nSalary: ₱${salary.toLocaleString()} / month (₱${(salary * 12).toLocaleString()} / year)\nWork Setup: ${activeSetup.label}\nCompany: ${company.trim() || "Hiring Team"}\nPerks: ${selectedPerks.join(", ") || "Standard"}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendEmail = () => {
    const subject = encodeURIComponent(
      `[Job Offer] ${activeRole.label} — ${company.trim() || "Hiring Team"}`
    );
    const body = encodeURIComponent(
      `Hi Jet,\n\nWe'd like to discuss an offer for the ${activeRole.label} role:\n\n- Base Salary: ₱${salary.toLocaleString()} / month (₱${(salary * 12).toLocaleString()} / year)\n- Setup: ${activeSetup.label}\n- Company: ${company.trim() || "Hiring Team"}\n- Perks: ${selectedPerks.join(", ") || "Standard"}\n\nLooking forward to speaking with you!\n\nBest,\n${company.trim() || "Hiring Team"}`
    );
    window.open(`mailto:jetjetcerezo@gmail.com?subject=${subject}&body=${body}`, "_blank");
  };

  return (
    <div className="overflow-hidden rounded-xl border border-edge bg-fg/[0.02]">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-edge bg-fg/[0.02] px-4 py-2.5">
        <div className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-4">
          <Briefcase className="h-3.5 w-3.5 text-brand" />
          <span>Quick Offer & Compensation Builder</span>
        </div>
        <span className="font-mono text-[10.5px] text-ink-4">PHP (₱)</span>
      </div>

      <div className="p-5 sm:p-6 space-y-5">
        {/* Role & Work Setup in single row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-mono text-[10.5px] uppercase tracking-wider text-ink-4 mb-1.5">
              Select Role
            </label>
            <div className="flex flex-wrap gap-1.5">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    setRole(r.id);
                    setSalary(r.defaultSalary);
                  }}
                  className={`rounded-md px-2.5 py-1 font-mono text-[11px] transition-all ${
                    role === r.id
                      ? "bg-fg text-bg font-medium shadow-sm"
                      : "border border-edge bg-bg text-ink-3 hover:border-edge-strong hover:text-ink-1"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-mono text-[10.5px] uppercase tracking-wider text-ink-4 mb-1.5">
              Work Arrangement
            </label>
            <div className="flex flex-wrap gap-1.5">
              {SETUPS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSetup(s.id)}
                  className={`rounded-md px-2.5 py-1 font-mono text-[11px] transition-all ${
                    setup === s.id
                      ? "bg-fg text-bg font-medium shadow-sm"
                      : "border border-edge bg-bg text-ink-3 hover:border-edge-strong hover:text-ink-1"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Salary Slider (PHP) */}
        <div className="rounded-lg border border-edge bg-bg p-4 space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-[10.5px] uppercase tracking-wider text-ink-4">
              Monthly Base Salary (PHP)
            </span>
            <span className="font-mono text-[11px] text-ink-4">
              ₱{(salary * 12).toLocaleString()} / year
            </span>
          </div>

          <div className="font-mono text-[24px] font-bold text-ink-1">
            ₱{salary.toLocaleString()} <span className="text-[13px] font-normal text-ink-4">/ month</span>
          </div>

          <input
            type="range"
            min={50000}
            max={250000}
            step={5000}
            value={salary}
            onChange={(e) => setSalary(Number(e.target.value))}
            className="w-full h-1.5 bg-edge-strong rounded-lg appearance-none cursor-pointer accent-brand"
          />

          <div className="flex justify-between font-mono text-[10px] text-ink-4">
            <span>₱50,000 / mo</span>
            <span>₱150,000 / mo</span>
            <span>₱250,000+ / mo</span>
          </div>
        </div>

        {/* Perks selection */}
        <div>
          <label className="block font-mono text-[10.5px] uppercase tracking-wider text-ink-4 mb-1.5">
            Perks & Equipment
          </label>
          <div className="flex flex-wrap gap-1.5">
            {PERKS.map((p) => {
              const active = selectedPerks.includes(p);
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePerk(p)}
                  className={`rounded-md px-2.5 py-1 font-mono text-[11px] transition-all ${
                    active
                      ? "border border-brand/50 bg-brand/10 text-ink-1 font-medium"
                      : "border border-edge bg-bg text-ink-4 hover:border-edge-strong hover:text-ink-2"
                  }`}
                >
                  <span className={active ? "text-brand mr-1 font-bold" : "text-ink-4 mr-1"}>
                    {active ? "•" : "+"}
                  </span>
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Company Name & Action Button in one clean bar */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          <input
            type="text"
            placeholder="Your Company / Team Name (optional)"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full sm:flex-1 rounded-md border border-edge bg-bg px-3 py-2 text-[13px] text-ink-1 placeholder:text-ink-4 focus:border-brand focus:outline-none"
          />

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleSendEmail}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-md bg-fg px-4 py-2 text-[13px] font-medium text-bg hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Email Jet This Offer</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center justify-center gap-1.5 rounded-md border border-edge-strong bg-bg px-3 py-2 text-[13px] text-ink-2 hover:border-fg/40 hover:text-ink-1 transition-colors whitespace-nowrap"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-brand" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? "Copied!" : "Copy"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
