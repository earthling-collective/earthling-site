import {
  useEffect,
  useState,
  useSyncExternalStore,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { Button } from "earthling-ui/button";
import { Slider } from "earthling-ui/slider";
import { Switch } from "earthling-ui/switch";
import { SignalField } from "./components/SignalField";

const githubUrl = "https://github.com/earthling-collective";
const libraryUrl = "https://ui.earthling.dev";
const librarySourceUrl = "https://github.com/earthling-dev/earthling-ui";
const founderUrl = "https://stevenfrady.com";
const contactEmail = "contact@earthling.dev";
const contactMailto = `mailto:${contactEmail}?subject=${encodeURIComponent("New project")}`;
const agentsUrl = "/llms.txt";

const motionQuery = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (notify: () => void) => {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};

interface Service {
  index: string;
  title: string;
  copy: string;
  span: "wide" | "narrow" | "half";
  href?: string;
}

const services: Service[] = [
  {
    index: "01",
    title: "AI workflows & automation",
    copy: "We build with agents, not just for them. Research, prototyping, testing, and the long tail of production chores run through automated pipelines, so people spend their time on judgment and taste. The loop ships every day, not every sprint.",
    span: "wide",
  },
  {
    index: "02",
    title: "Product & web design",
    copy: "Interfaces, marketing sites, and design systems with a point of view. Designed in code from day one, with iteration measured in minutes rather than review cycles.",
    span: "narrow",
  },
  {
    index: "03",
    title: "Engineering",
    copy: "React, TypeScript, and the modern web platform. Fast, accessible, and structured so the next person, or the next agent, can pick it up without a handover call.",
    span: "narrow",
  },
  {
    index: "04",
    title: "Creative technology",
    copy: "WebGL, shaders, generative systems, and motion. The part of the web most teams leave on the table, used where it earns its place.",
    span: "wide",
  },
  {
    index: "05",
    title: "Brand & identity",
    copy: "Names, marks, and visual language that hold up on a favicon and a billboard, and stay coherent once they meet real product surfaces.",
    span: "half",
  },
  {
    index: "06",
    title: "Open source",
    copy: "We give tools back. Earthling UI and the rest of our stack are open to use, fork, and remix, and we build client work on the same foundations.",
    span: "half",
    href: libraryUrl,
  },
];

const process = [
  {
    step: "01",
    title: "Discover",
    copy: "A short, honest conversation about what you need, what you have, and what done looks like. No decks, and no discovery phase that lasts a quarter.",
  },
  {
    step: "02",
    title: "Design & prototype",
    copy: "Direction first, then detail. A working prototype in the first days, real screens every day after, and every decision comes with a reason.",
  },
  {
    step: "03",
    title: "Build",
    copy: "Production code from the first week. Agents handle the repetitive parts and people review everything that ships. Staging links you can share, performance budgets we actually keep.",
  },
  {
    step: "04",
    title: "Ship & evolve",
    copy: "Launch is a milestone, not the end. Automation keeps the product healthy, and we stay close so it keeps moving after the first release.",
  },
];

const shifts = [
  { from: "Quarterly roadmaps", to: "Releases every day" },
  { from: "Design handed off to engineering", to: "One loop, designed in code" },
  {
    from: "Ticket queues and status meetings",
    to: "Direct access to the people building",
  },
  { from: "Static deliverables", to: "Living systems that agents can maintain" },
];

const principles = [
  {
    title: "Small by design",
    copy: "You work directly with the person doing the work. Nothing gets lost between an account manager and a production line.",
  },
  {
    title: "Open by default",
    copy: "Our tools are public, our process is legible, and you own everything we make for you.",
  },
  {
    title: "AI-native, human-led",
    copy: "Agents do the heavy lifting and people make the calls. Speed without taste is just noise, so every detail still gets taken seriously.",
  },
  {
    title: "Built to grow",
    copy: "Earthling is structured as a collective. As the work grows, the right designers, engineers, and artists plug in.",
  },
];

const ticker = [
  "AI workflows",
  "Automation",
  "Product design",
  "Web engineering",
  "Creative technology",
  "Brand identity",
  "Design systems",
  "Open source",
  "Agentic tooling",
  "Motion",
  "Interactive art",
];

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      className="arrow"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={diagonal ? "M7 17 17 7M7 7h10v10" : "M4 12h16m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Mark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="28"
      height="28"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="1.25" />
      <path
        d="M7.3 32.7V7.3h25.4v25.4H7.3ZM20 2v36M2 20h36"
        stroke="currentColor"
        strokeWidth="1.25"
      />
    </svg>
  );
}

function SectionHead({
  index,
  label,
  title,
  children,
  id,
}: {
  index: string;
  label: string;
  title: ReactNode;
  children?: ReactNode;
  id: string;
}) {
  return (
    <div className="section-head">
      <p className="section-label mono" data-reveal>
        <span className="section-index">{index}</span>
        <span>{label}</span>
      </p>
      <h2 id={id} data-reveal style={{ "--delay": "80ms" } as CSSProperties}>
        {title}
      </h2>
      {children ? (
        <div
          className="section-intro"
          data-reveal
          style={{ "--delay": "160ms" } as CSSProperties}
        >
          {children}
        </div>
      ) : null}
    </div>
  );
}

function useSpotlight() {
  return (event: ReactPointerEvent<HTMLElement>) => {
    const target = event.currentTarget;
    const bounds = target.getBoundingClientRect();
    target.style.setProperty("--mx", `${event.clientX - bounds.left}px`);
    target.style.setProperty("--my", `${event.clientY - bounds.top}px`);
  };
}

function ServiceCard({
  index,
  title,
  copy,
  span,
  href,
  delay,
}: Service & { delay: number }) {
  const onPointerMove = useSpotlight();
  const content = (
    <>
      <span className="card-index mono">{index}</span>
      <h3>
        {title}
        {href ? <Arrow diagonal /> : null}
      </h3>
      <p>{copy}</p>
    </>
  );
  const style = { "--delay": `${delay}ms` } as CSSProperties;
  if (href) {
    return (
      <a
        className={`card card-${span} card-link`}
        href={href}
        onPointerMove={onPointerMove}
        data-reveal
        style={style}
      >
        {content}
      </a>
    );
  }
  return (
    <article
      className={`card card-${span}`}
      onPointerMove={onPointerMove}
      data-reveal
      style={style}
    >
      {content}
    </article>
  );
}

function LibrarySpecimen() {
  const [radius, setRadius] = useState([24]);
  const [filled, setFilled] = useState(true);
  return (
    <div className="specimen" data-reveal>
      <div className="specimen-heading mono">
        <span>Earthling UI</span>
        <span>
          <span className="status-dot" aria-hidden="true" />
          Live specimen
        </span>
      </div>
      <div
        className="specimen-stage"
        style={{ "--radius-control": radius[0] + "px" } as CSSProperties}
      >
        <Button asChild size="lg" material={filled ? "paper" : "outline"}>
          <a href={libraryUrl}>
            Make it yours <Arrow diagonal />
          </a>
        </Button>
      </div>
      <div className="specimen-controls">
        <div className="radius-label mono">
          <span id="radius-label">Radius</span>
          <output>{radius[0]} px</output>
        </div>
        <Slider
          className="radius-slider"
          value={radius}
          onValueChange={setRadius}
          min={0}
          max={32}
          step={1}
          thumbLabels={["Button corner radius"]}
        />
        <label className="fill-control">
          <span className="mono">Solid fill</span>
          <Switch
            aria-label="Solid fill"
            checked={filled}
            onCheckedChange={setFilled}
            scheme="primary"
            className="specimen-switch"
          />
        </label>
      </div>
    </div>
  );
}

function useReveal() {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    if (!("IntersectionObserver" in window)) {
      elements.forEach((element) => element.setAttribute("data-reveal", "in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).setAttribute("data-reveal", "in");
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );
    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}

function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 12);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return scrolled;
}

export default function App() {
  const reducedMotion = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia(motionQuery).matches,
    () => true,
  );
  const [motionOverride, setMotionOverride] = useState<boolean | null>(null);
  const [fieldStatus, setFieldStatus] = useState<"ready" | "unavailable">(
    "unavailable",
  );
  const paused = motionOverride ?? reducedMotion;
  const scrolled = useScrolled();
  useReveal();

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="frame-lines" aria-hidden="true">
        <div className="container" />
      </div>
      <header className="site-header" data-scrolled={scrolled || undefined}>
        <div className="container header-inner">
          <a className="identity" href="#top" aria-label="Earthling Digital home">
            <Mark />
            <span className="identity-name">
              earthling<span className="identity-sub">digital</span>
            </span>
          </a>
          <nav aria-label="Main navigation">
            <a href="#services">Services</a>
            <a href="#work">Work</a>
            <a href="#studio">Studio</a>
          </nav>
          <div className="header-actions">
            <a className="header-github" href={githubUrl} aria-label="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="currentColor"
                  d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.3 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z"
                />
              </svg>
            </a>
            <Button asChild size="sm" className="header-cta">
              <a href="#contact">
                Start a project <Arrow />
              </a>
            </Button>
          </div>
        </div>
      </header>

      <main id="main">
        <section
          className="hero"
          id="top"
          aria-labelledby="hero-title"
        >
          <div className="hero-art" aria-hidden="true">
            <SignalField paused={paused} onStatusChange={setFieldStatus} />
          </div>
          <div className="container hero-content">
            <p className="eyebrow mono hero-in" style={{ "--i": 0 } as CSSProperties}>
              <span className="status-dot" aria-hidden="true" />
              AI-native creative agency
            </p>
            <h1
              id="hero-title"
              className="hero-in"
              style={{ "--i": 1 } as CSSProperties}
            >
              Digital products
              <br />
              <span>with a pulse.</span>
            </h1>
            <p
              className="hero-description hero-in"
              style={{ "--i": 2 } as CSSProperties}
            >
              Earthling is a creative agency working across brand, product
              design, and engineering. We pair human taste with fast,
              agent-driven workflows to ship websites, interfaces, and
              interactive experiences that feel considered, fast, and alive.
            </p>
            <div className="hero-actions hero-in" style={{ "--i": 3 } as CSSProperties}>
              <Button asChild size="lg" className="cta-primary">
                <a href="#contact">
                  Start a project <Arrow />
                </a>
              </Button>
              <a href="#work" className="text-link">
                See the work <Arrow diagonal />
              </a>
            </div>
          </div>
          <div className="container hero-bottom">
            <a className="scroll-cue mono" href="#services">
              <span className="scroll-icon" aria-hidden="true">
                <span />
              </span>
              <span>Scroll</span>
            </a>
            <div className="hero-meta mono">
              <span className="hero-status">
                <span className="status-dot status-live" aria-hidden="true" />
                Open for new projects
              </span>
              {fieldStatus === "ready" ? (
                <button
                  type="button"
                  className="motion-control"
                  onClick={() => setMotionOverride(!paused)}
                  aria-pressed={!paused}
                  aria-label={
                    paused
                      ? "Play background animation"
                      : "Pause background animation"
                  }
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                  >
                    {paused ? (
                      <path d="m5 3 7 5-7 5V3Z" fill="currentColor" />
                    ) : (
                      <path
                        d="M5 3v10M11 3v10"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      />
                    )}
                  </svg>
                  <span>Motion {paused ? "off" : "on"}</span>
                </button>
              ) : null}
            </div>
          </div>
        </section>

        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            {[0, 1].map((copy) => (
              <ul key={copy}>
                {ticker.map((item) => (
                  <li key={item}>
                    <span className="ticker-dot" />
                    {item}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>

        <section
          className="section services"
          id="services"
          aria-labelledby="services-title"
        >
          <div className="container">
            <SectionHead
              index="01"
              label="Services"
              id="services-title"
              title={
                <>
                  Everything from the first sketch
                  <br />
                  <span>to the last deploy.</span>
                </>
              }
            >
              <p>
                One team across design and engineering, with agents in the
                loop, so nothing gets lost in translation and nothing waits in
                a queue.
              </p>
            </SectionHead>
            <div className="bento">
              {services.map((service, index) => (
                <ServiceCard
                  key={service.index}
                  {...service}
                  delay={index * 70}
                />
              ))}
            </div>
          </div>
        </section>

        <section
          className="section shift"
          id="approach"
          aria-labelledby="shift-title"
        >
          <div className="container">
            <SectionHead
              index="02"
              label="Approach"
              id="shift-title"
              title={
                <>
                  The old way of building
                  <br />
                  <span>software is optional now.</span>
                </>
              }
            >
              <p>
                Most of what made software slow was process, not work. With
                agents in the loop, a small team can skip the parts that only
                existed to coordinate a large one.
              </p>
            </SectionHead>
            <ul className="shift-list">
              {shifts.map((shift, index) => (
                <li
                  key={shift.to}
                  data-reveal
                  style={{ "--delay": `${index * 70}ms` } as CSSProperties}
                >
                  <span className="shift-from">
                    <span className="mono">Before</span>
                    {shift.from}
                  </span>
                  <Arrow />
                  <span className="shift-to">
                    <span className="mono">Now</span>
                    {shift.to}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section work" id="work" aria-labelledby="work-title">
          <div className="container">
            <SectionHead
              index="03"
              label="Work"
              id="work-title"
              title={
                <>
                  Built in the open,
                  <br />
                  <span>used in production.</span>
                </>
              }
            >
              <p>
                Earthling is a new studio, and the client roster is growing.
                Here is what we have shipped so far, built the same way we
                build for clients.
              </p>
            </SectionHead>
            <div className="project">
              <div className="project-copy">
                <div className="project-meta mono" data-reveal>
                  <span>001</span>
                  <span>Design system</span>
                  <span>Open source</span>
                </div>
                <h3 data-reveal style={{ "--delay": "60ms" } as CSSProperties}>
                  Earthling UI
                </h3>
                <p data-reveal style={{ "--delay": "120ms" } as CSSProperties}>
                  A component library and design system for React. Accessible
                  primitives, a real theming model, and source you can take and
                  make your own. It is the foundation under this site and
                  everything we build for clients.
                </p>
                <div
                  className="project-links"
                  data-reveal
                  style={{ "--delay": "180ms" } as CSSProperties}
                >
                  <Button asChild material="outline" size="lg">
                    <a href={libraryUrl}>
                      Explore the library <Arrow diagonal />
                    </a>
                  </Button>
                  <a className="text-link" href={librarySourceUrl}>
                    Source <Arrow diagonal />
                  </a>
                </div>
                <dl
                  className="project-facts mono"
                  data-reveal
                  style={{ "--delay": "240ms" } as CSSProperties}
                >
                  <div>
                    <dt>Stack</dt>
                    <dd>React, Tailwind, Radix</dd>
                  </div>
                  <div>
                    <dt>License</dt>
                    <dd>MIT</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>Active</dd>
                  </div>
                </dl>
              </div>
              <LibrarySpecimen />
            </div>
            <div className="work-note" data-reveal>
              <span className="mono">002 — Your project</span>
              <p>
                The next case study on this page could be yours.{" "}
                <a href="#contact" className="inline-link">
                  Let&rsquo;s talk
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        <section
          className="section process"
          id="process"
          aria-labelledby="process-title"
        >
          <div className="container">
            <SectionHead
              index="04"
              label="Process"
              id="process-title"
              title={
                <>
                  Clear steps,
                  <br />
                  <span>no ceremony.</span>
                </>
              }
            />
            <ol className="steps">
              {process.map((item, index) => (
                <li
                  key={item.step}
                  data-reveal
                  style={{ "--delay": `${index * 80}ms` } as CSSProperties}
                >
                  <span className="mono step-index">{item.step}</span>
                  <h3>{item.title}</h3>
                  <p>{item.copy}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          className="section studio"
          id="studio"
          aria-labelledby="studio-title"
        >
          <div className="container">
            <SectionHead
              index="05"
              label="Studio"
              id="studio-title"
              title={
                <>
                  Independent
                  <br />
                  <span>by nature.</span>
                </>
              }
            />
            <div className="studio-grid">
              <div className="studio-copy" data-reveal>
                <p>
                  Earthling Digital is an independent creative agency founded
                  by Steven Frady, a designer and engineer who works across the
                  whole stack, from the first sketch to the last deploy.
                </p>
                <p>
                  It runs on a simple premise: a small team with the right
                  tools now moves faster than a large one with the old process.
                  No ticket queues, no quarter-long roadmaps, no waiting for a
                  handoff. Tight loops, real feedback, and work that ships.
                </p>
                <p>
                  It is built as a collective. Today that is one person. The
                  structure exists so that the right collaborators, human and
                  otherwise, can plug in as the work grows, without the overhead
                  of a traditional agency.
                </p>
                <a className="text-link" href={founderUrl}>
                  Meet the founder <Arrow diagonal />
                </a>
              </div>
              <ul className="principles">
                {principles.map((principle, index) => (
                  <li
                    key={principle.title}
                    data-reveal
                    style={{ "--delay": `${index * 70}ms` } as CSSProperties}
                  >
                    <h3>{principle.title}</h3>
                    <p>{principle.copy}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section
          className="section contact"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="container contact-inner">
            <p className="section-label mono" data-reveal>
              <span className="section-index">06</span>
              <span>Contact</span>
            </p>
            <h2
              id="contact-title"
              data-reveal
              style={{ "--delay": "80ms" } as CSSProperties}
            >
              Let&rsquo;s make something
              <br />
              <span>worth remembering.</span>
            </h2>
            <div
              className="contact-actions"
              data-reveal
              style={{ "--delay": "160ms" } as CSSProperties}
            >
              <div className="contact-buttons">
                <Button asChild size="lg" className="cta-primary">
                  <a href={contactMailto}>
                    Email {contactEmail} <Arrow />
                  </a>
                </Button>
                <a className="text-link" href={githubUrl}>
                  GitHub <Arrow diagonal />
                </a>
              </div>
              <p>
                Clients, collaborators, and people who don&rsquo;t fit neatly
                into one box. If you are drawn to open tools, fast loops, and
                unusual interactions, there is probably something here to make
                together.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <a href="#top" className="identity" aria-label="Back to top">
              <Mark />
              <span className="identity-name">
                earthling<span className="identity-sub">digital</span>
              </span>
            </a>
            <p className="mono">Independent by nature.</p>
          </div>
          <nav className="footer-nav" aria-label="Footer">
            <div>
              <span className="mono footer-heading">Site</span>
              <a href="#services">Services</a>
              <a href="#work">Work</a>
              <a href="#studio">Studio</a>
              <a href="#contact">Contact</a>
            </div>
            <div>
              <span className="mono footer-heading">Elsewhere</span>
              <a href={`mailto:${contactEmail}`}>{contactEmail}</a>
              <a href={githubUrl}>GitHub</a>
              <a href={libraryUrl}>Earthling UI</a>
            </div>
          </nav>
          <p className="footer-legal mono">
            <span>&copy; {new Date().getFullYear()} Earthling Digital</span>
            <a href={agentsUrl}>Agents: read /llms.txt</a>
            <span>Made with Earthling UI</span>
          </p>
        </div>
      </footer>
    </>
  );
}
