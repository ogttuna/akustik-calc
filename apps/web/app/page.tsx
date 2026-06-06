import { ArrowRight, LockKeyhole, PanelTop, Ruler, Waves } from "lucide-react";
import Link from "next/link";

import { ThemeModeToggle } from "@/components/theme-mode-toggle";

const INTRO_FLOW = [
  {
    detail: "Choose wall or floor context, then enter only the inputs the route needs.",
    label: "Set the assembly"
  },
  {
    detail: "Build the layer stack with thickness, material, role, and required physical fields.",
    label: "Define layers"
  },
  {
    detail: "Review supported outputs, blockers, graph context, and report handoff.",
    label: "Read the result"
  }
] as const;

function IntroVisual() {
  return (
    <figure className="intro-visual" aria-label="DynEcho layer and response concept">
      <svg aria-labelledby="intro-visual-title" role="img" viewBox="0 0 920 560">
        <title id="intro-visual-title">Acoustic layer stack and frequency response concept</title>
        <rect fill="var(--surface-control)" height="560" width="920" />
        <g opacity="0.42" stroke="var(--border-default)" strokeWidth="1">
          {Array.from({ length: 11 }).map((_, index) => (
            <line key={`v-${index}`} x1={80 + index * 72} x2={80 + index * 72} y1="48" y2="506" />
          ))}
          {Array.from({ length: 7 }).map((_, index) => (
            <line key={`h-${index}`} x1="56" x2="864" y1={74 + index * 64} y2={74 + index * 64} />
          ))}
        </g>

        <g transform="translate(74 112)">
          <text fill="var(--text-muted)" fontSize="15" fontWeight="720" x="0" y="-28">
            Layer stack
          </text>
          <rect fill="var(--surface-inset)" height="284" rx="8" stroke="var(--border-default)" width="304" />
          <rect fill="color-mix(in oklch, var(--accent) 18%, var(--surface-control))" height="52" rx="4" x="38" y="46" width="228" />
          <rect fill="color-mix(in oklch, var(--warning) 18%, var(--surface-control))" height="78" rx="4" x="38" y="108" width="228" />
          <rect fill="color-mix(in oklch, var(--ink) 12%, var(--surface-control))" height="76" rx="4" x="38" y="196" width="228" />
          <g fill="var(--surface-control)" stroke="var(--border-strong)" strokeWidth="1">
            <circle cx="68" cy="72" r="14" />
            <circle cx="68" cy="147" r="14" />
            <circle cx="68" cy="233" r="14" />
          </g>
          <g fill="var(--text-primary)" fontSize="13" fontWeight="720" textAnchor="middle">
            <text x="68" y="77">1</text>
            <text x="68" y="152">2</text>
            <text x="68" y="238">3</text>
          </g>
          <g fill="var(--text-secondary)" fontSize="14" fontWeight="680">
            <text x="102" y="77">board layer</text>
            <text x="102" y="152">absorptive core</text>
            <text x="102" y="238">mass leaf</text>
          </g>
        </g>

        <g transform="translate(448 116)">
          <text fill="var(--text-muted)" fontSize="15" fontWeight="720" x="0" y="-32">
            Response curve
          </text>
          <rect fill="var(--surface-inset)" height="232" rx="8" stroke="var(--border-default)" width="364" />
          <g fill="color-mix(in oklch, var(--accent) 9%, transparent)">
            <rect height="176" rx="4" width="88" x="42" y="26" />
          </g>
          <g fill="color-mix(in oklch, var(--success) 9%, transparent)">
            <rect height="176" rx="4" width="76" x="176" y="26" />
          </g>
          <g fill="color-mix(in oklch, var(--warning) 11%, transparent)">
            <rect height="176" rx="4" width="92" x="272" y="26" />
          </g>
          <g stroke="var(--border-default)" strokeWidth="1">
            <line x1="42" x2="330" y1="202" y2="202" />
            <line x1="42" x2="42" y1="26" y2="202" />
            <line x1="42" x2="330" y1="70" y2="70" />
            <line x1="42" x2="330" y1="114" y2="114" />
            <line x1="42" x2="330" y1="158" y2="158" />
          </g>
          <path
            d="M42 168 C78 160 104 136 130 124 C160 110 182 102 208 86 C238 68 266 72 286 96 C306 120 318 148 330 138"
            fill="none"
            stroke="var(--accent)"
            strokeLinecap="round"
            strokeWidth="5"
          />
          {[42, 130, 208, 286, 330].map((x, index) => {
            const y = [168, 124, 86, 96, 138][index]!;
            return <circle cx={x} cy={y} fill="var(--surface-control)" key={x} r="6" stroke="var(--accent)" strokeWidth="4" />;
          })}
          <g fill="var(--text-muted)" fontSize="12" fontWeight="680">
            <text x="42" y="222">63</text>
            <text x="168" y="222">500</text>
            <text x="288" y="222">2k</text>
          </g>
        </g>

        <g transform="translate(448 384)">
          <rect fill="var(--surface-inset)" height="82" rx="8" stroke="var(--border-default)" width="364" />
          <text fill="var(--text-muted)" fontSize="13" fontWeight="720" x="20" y="30">
            Supported outputs
          </text>
          <g fill="var(--text-primary)" fontSize="24" fontWeight="760">
            <text x="20" y="62">Rw</text>
            <text x="92" y="62">R&apos;w</text>
            <text x="176" y="62">DnT,w</text>
            <text x="284" y="62">Ln,w</text>
          </g>
        </g>
      </svg>
      <figcaption className="intro-visual-caption">
        <span>Layer stack, response curve, and supported output families.</span>
        <span className="ui-badge ui-badge-accent ui-badge-compact">Engineering preview</span>
      </figcaption>
    </figure>
  );
}

export default function HomePage() {
  const calculatorLoginHref = "/login?next=/workbench-v2";

  return (
    <main className="intro-page">
      <header className="intro-nav">
        <div className="intro-nav-inner">
          <Link className="intro-wordmark focus-ring" href="/">
            <span className="intro-mark">DAC</span>
            <span>DynEcho</span>
          </Link>
          <nav className="intro-nav-actions" aria-label="Public navigation">
            <ThemeModeToggle />
            <Link className="focus-ring ui-button ui-button-ghost" href={calculatorLoginHref}>
              Login
            </Link>
            <Link className="focus-ring ui-button ui-button-primary" href={calculatorLoginHref}>
              Open calculator
              <ArrowRight className="h-4 w-4" />
            </Link>
          </nav>
        </div>
      </header>

      <section className="intro-hero">
        <div className="intro-hero-inner">
          <div className="intro-hero-copy">
            <div className="intro-kicker">
              <Waves className="h-4 w-4" />
              Acoustic calculator
            </div>
            <h1 className="intro-title">DynEcho Acoustic Calculator</h1>
            <p className="intro-lede">
              Build wall and floor assemblies from physical layers, request acoustic outputs, and prepare the result for report review.
            </p>
            <div className="intro-actions">
              <Link className="focus-ring ui-button ui-button-primary h-11 px-4" href={calculatorLoginHref}>
                Start calculation
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link className="focus-ring ui-button h-11 px-4" href={calculatorLoginHref}>
                <LockKeyhole className="h-4 w-4" />
                Sign in
              </Link>
            </div>
            <div className="intro-proof-row" aria-label="Product scope">
              <span className="ui-badge">Wall</span>
              <span className="ui-badge">Floor</span>
              <span className="ui-badge">Rw / R&apos;w</span>
              <span className="ui-badge">Ln,w / DnT,w</span>
            </div>
          </div>

          <IntroVisual />
        </div>
      </section>

      <section className="intro-section">
        <div className="intro-section-header">
          <div className="intro-kicker">
            <PanelTop className="h-4 w-4" />
            Workflow
          </div>
          <h2 className="intro-section-title">The public page stops here. Calculation starts after login.</h2>
          <p className="intro-section-text">
            The calculator workspace is a tool surface: inputs, layer stack, blockers, graph, and report handoff. No marketing copy belongs there.
          </p>
        </div>

        <div className="intro-flow">
          {INTRO_FLOW.map((step, index) => (
            <section className="intro-flow-step" key={step.label}>
              <span className="intro-flow-index">{index + 1}</span>
              <div>
                <h3>{step.label}</h3>
                <p>{step.detail}</p>
              </div>
            </section>
          ))}
        </div>
      </section>

      <section className="intro-final">
        <div className="intro-final-inner">
          <div>
            <div className="intro-kicker">
              <Ruler className="h-4 w-4" />
              Authenticated workspace
            </div>
            <p className="intro-section-text">
              PDF output stays downstream from a packaged workbench result.
            </p>
          </div>
          <Link className="focus-ring ui-button ui-button-primary h-11 px-4" href={calculatorLoginHref}>
            Continue to calculator
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}
