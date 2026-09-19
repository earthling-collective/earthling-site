import { useState, useSyncExternalStore, type CSSProperties } from "react";
import { Button } from "earthling-ui/button";
import { Slider } from "earthling-ui/slider";
import { Switch } from "earthling-ui/switch";
import { SignalField } from "./components/SignalField";

const contactUrl = "https://github.com/sfrady20";
const motionQuery = "(prefers-reduced-motion: reduce)";
const subscribeMotion = (notify: () => void) => {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", notify);
  return () => query.removeEventListener("change", notify);
};

function Arrow({ diagonal = false }: { diagonal?: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={diagonal ? "M6 18 18 6M6 6h12v12" : "M4 12h16m-6-6 6 6-6 6"}
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function Mark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="32"
      height="32"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="20" cy="20" r="18" stroke="currentColor" />
      <path
        d="M7.3 32.7V7.3h25.4v25.4H7.3ZM20 2v36M2 20h36"
        stroke="currentColor"
      />
    </svg>
  );
}

function LibrarySpecimen() {
  const [radius, setRadius] = useState([24]);
  const [filled, setFilled] = useState(true);
  return (
    <div className="specimen">
      <div className="specimen-heading mono">
        <span>EARTHLING UI</span>
        <span>LIVE SPECIMEN</span>
      </div>
      <div
        className="specimen-stage"
        style={{ "--radius-control": radius[0] + "px" } as CSSProperties}
      >
        <span className="specimen-cross cross-a" aria-hidden="true">
          +
        </span>
        <span className="specimen-cross cross-b" aria-hidden="true">
          +
        </span>
        <Button asChild size="lg" material={filled ? "paper" : "outline"}>
          <a href="https://ui.earthling.dev">
            Make it yours <Arrow diagonal />
          </a>
        </Button>
      </div>
      <div className="specimen-controls">
        <div className="radius-label mono">
          <span id="radius-label">RADIUS</span>
          <output>{radius[0]} PX</output>
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
          <span className="mono">SOLID FILL</span>
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

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header page-gutter">
        <a className="identity" href="#top" aria-label="Earthling Digital home">
          <Mark />
          <span className="identity-name">
            earthling<span className="identity-sub">digital</span>
          </span>
        </a>
        <span className="header-note mono">INDEPENDENT BY NATURE.</span>
        <nav aria-label="Main navigation">
          <a href="#work">Open work</a>
          <a href="#about">Our orbit</a>
          <Button asChild material="outline" className="header-contact">
            <a href="#contact">
              Get in touch <Arrow diagonal />
            </a>
          </Button>
        </nav>
      </header>
      <main id="main">
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-art">
            <SignalField paused={paused} onStatusChange={setFieldStatus} />
          </div>
          <div className="hero-heading page-gutter">
            <p className="hero-eyebrow mono">
              <span className="signal-dot" />
              AN INDEPENDENT DIGITAL COLLECTIVE
            </p>
            <h1 id="hero-title">
              A different
              <br />
              <span>kind of signal.</span>
            </h1>
            <p className="hero-description">
              Open tools. Uncommon ideas.
              <br />
              At the edges of design, technology, and art.
            </p>
            <div className="hero-actions">
              <Button asChild size="lg">
                <a href="#work">
                  Explore our work <Arrow />
                </a>
              </Button>
              <a href="#about" className="text-link">
                Step inside <Arrow diagonal />
              </a>
            </div>
          </div>
          <div className="hero-bottom page-gutter">
            <a className="scroll-cue mono" href="#about">
              <span className="scroll-icon" aria-hidden="true">
                ↓
              </span>
              <span>SCROLL TO EXPLORE</span>
            </a>
            <div className="field-caption">
              <div>
                <span className="mono">FIELD STUDY — 001</span>
                <p>Interference</p>
              </div>
              {fieldStatus === "ready" ? (
                <Button
                  material="outline"
                  shape="icon"
                  className="motion-control"
                  onClick={() => setMotionOverride(!paused)}
                  aria-label={
                    paused
                      ? "Play artwork animation"
                      : "Pause artwork animation"
                  }
                >
                  <svg
                    width="14"
                    height="14"
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
                        strokeWidth="1.5"
                      />
                    )}
                  </svg>
                </Button>
              ) : (
                <span className="motion-fallback mono">STILL</span>
              )}
            </div>
          </div>
        </section>
        <section
          className="about section page-gutter"
          id="about"
          aria-labelledby="about-title"
        >
          <div className="section-label mono">
            <span>01 / OUR ORBIT</span>
            <span className="status-dot" aria-hidden="true" />
          </div>
          <div className="about-content">
            <h2 id="about-title">
              Serious about craft.
              <br />
              <span>Curious about everything.</span>
            </h2>
            <div className="about-copy">
              <p>
                Earthling Digital is an independent collective taking shape at
                the intersection of open source, design, and technical artistry.
              </p>
              <p>
                We make tools to build with and experiments to get lost in.
                Starting on the web. Curious about what happens beyond the
                screen.
              </p>
            </div>
            <div className="directions mono" aria-label="Areas of interest">
              <span>OPEN SOURCE</span>
              <span>CREATIVE TECHNOLOGY</span>
              <span>ART & INSTALLATION</span>
            </div>
          </div>
        </section>
        <section
          className="work section page-gutter"
          id="work"
          aria-labelledby="work-title"
        >
          <div className="section-label mono">
            <span>02 / OPEN WORK</span>
            <span>AN ONGOING PRACTICE</span>
          </div>
          <div className="project">
            <div className="project-copy">
              <div className="project-meta mono">
                <span>001</span>
                <span>TOOLS / OPEN SOURCE</span>
              </div>
              <h2 id="work-title">
                Earthling UI<span aria-hidden="true">↗</span>
              </h2>
              <p>
                A considered foundation for building interfaces. Import the
                components or take the source and make them your own.
              </p>
              <div className="project-links">
                <Button asChild material="outline" size="lg">
                  <a href="https://ui.earthling.dev">
                    Explore the library <Arrow diagonal />
                  </a>
                </Button>
                <a
                  className="text-link"
                  href="https://github.com/earthling-dev/earthling-ui"
                >
                  Source <Arrow diagonal />
                </a>
              </div>
              <span className="project-footnote mono">
                BUILT TO BE USED. MADE TO BE CHANGED.
              </span>
            </div>
            <LibrarySpecimen />
          </div>
          <a className="study-row" href="#top">
            <span className="mono">002</span>
            <div>
              <h3>Interference</h3>
              <p>An ongoing exploration of light, frequency, and form.</p>
            </div>
            <span className="mono study-type">WEBGL / FIELD STUDY</span>
            <Arrow />
          </a>
        </section>
        <section
          className="contact section page-gutter"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="section-label mono">
            <span>03 / A SHARED FREQUENCY</span>
            <span>GOOD THINGS START SMALL.</span>
          </div>
          <div className="contact-content">
            <Mark className="contact-mark" />
            <h2 id="contact-title">
              For the ones
              <br />
              who feel it, too.
            </h2>
            <div className="contact-copy">
              <p>
                Designers, developers, artists, and people who don’t fit neatly
                into one box.
              </p>
              <p>
                If you’re drawn to open tools, unusual interactions, or ideas
                that deserve a physical space, there may be something here to
                make together.
              </p>
              <Button asChild size="lg">
                <a href={contactUrl}>
                  Find me on GitHub <Arrow diagonal />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer page-gutter">
        <a href="#top" className="footer-brand">
          earthling digital <span aria-hidden="true">↗</span>
        </a>
        <p className="mono">AN INDEPENDENT COLLECTIVE, IN FORMATION.</p>
        <a
          href="https://github.com/earthling-dev/earthling-ui"
          className="text-link"
        >
          Made with Earthling UI <Arrow diagonal />
        </a>
      </footer>
    </>
  );
}
