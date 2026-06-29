import { useCurrentFrame, interpolate, interpolateColors, Easing } from "remotion";

const BG = "#0C0C0A";
const TEXT = "#D6D3D1";
const TEXT_MUTED = "#A8A29E";
const AMBER = "#F59E0B";
const GOLD = "#FBBF24";
const SURFACE = "rgba(28, 25, 23, 0.8)";
const BORDER = "rgba(41, 37, 36, 0.8)";

function FadeIn({ frame, start, duration, children }: { frame: number; start: number; duration: number; children: React.ReactNode }) {
  const opacity = interpolate(frame, [start, start + duration], [0, 1], { easing: Easing.out(Easing.ease) });
  const y = interpolate(frame, [start, start + duration], [20, 0], { easing: Easing.out(Easing.ease) });
  return <div style={{ opacity, transform: `translateY(${y}px)` }}>{children}</div>;
}

function SlideUp({ frame, start, duration, children }: { frame: number; start: number; duration: number; children: React.ReactNode }) {
  const progress = interpolate(frame, [start, start + duration], [0, 1], { easing: Easing.out(Easing.ease) });
  const y = interpolate(frame, [start, start + duration], [60, 0], { easing: Easing.out(Easing.ease) });
  return <div style={{ opacity: progress, transform: `translateY(${y}px)` }}>{children}</div>;
}

function Typewriter({ frame, start, text, duration = 30 }: { frame: number; start: number; text: string; duration?: number }) {
  const chars = Math.min(text.length, Math.floor(interpolate(frame, [start, start + duration], [0, text.length], {
    easing: Easing.out(Easing.ease),
    extrapolateRight: "clamp",
  })));
  return <span>{text.slice(0, chars)}</span>;
}

function Pulse({ frame, start }: { frame: number; start: number }) {
  const scale = interpolate(frame, [start, start + 15, start + 30], [1, 1.04, 1], {
    easing: Easing.inOut(Easing.ease),
    extrapolate: "loop",
  });
  return <span style={{ display: "inline-block", transform: `scale(${scale})` }}>&bull;</span>;
}

/* ─── Scene 1: Intro ─────────────────────────────────── */
function SceneIntro({ frame }: { frame: number }) {
  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
      <FadeIn frame={frame} start={10} duration={20}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 12, background: SURFACE,
            border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, color: AMBER,
          }}>
            <Pulse frame={frame} start={10} />
          </div>
          <span style={{ fontSize: 42, fontWeight: 300, letterSpacing: "-0.02em", color: TEXT }}>Jobacker</span>
        </div>
      </FadeIn>

      <SlideUp frame={frame} start={40} duration={25}>
        <span style={{ fontSize: 20, color: TEXT_MUTED, fontFamily: "monospace", letterSpacing: "0.1em" }}>
          AI-Powered Job Application Tracker
        </span>
      </SlideUp>

      <SlideUp frame={frame} start={75} duration={25}>
        <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
          {[
            { value: "87%", label: "Score lift" },
            { value: "4×", label: "Faster prep" },
            { value: "<30s", label: "Analysis" },
          ].map((s, i) => (
            <div key={i} style={{
              padding: "12px 20px", borderRadius: 10, background: SURFACE,
              border: `1px solid ${BORDER}`, textAlign: "center",
            }}>
              <div style={{ fontSize: 24, fontWeight: 300, color: GOLD }}>{s.value}</div>
              <div style={{ fontSize: 10, color: TEXT_MUTED, fontFamily: "monospace", marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </SlideUp>
    </div>
  );
}

/* ─── Scene 2: Resume Scoring ──────────────────────────── */
function SceneScoring({ frame }: { frame: number }) {
  const f = frame - 120;
  const score = interpolate(f, [50, 100], [0, 87], { easing: Easing.out(Easing.ease), extrapolateRight: "clamp" });
  const circumference = 2 * Math.PI * 60;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
      <FadeIn frame={f} start={10} duration={20}>
        <span style={{ fontSize: 12, color: AMBER, fontFamily: "monospace", letterSpacing: "0.15em" }}>
          // RESUME_SCORING
        </span>
      </FadeIn>

      <SlideUp frame={f} start={35} duration={25}>
        <span style={{ fontSize: 36, fontWeight: 300, color: TEXT, letterSpacing: "-0.02em" }}>
          Score your resume against
        </span>
      </SlideUp>
      <SlideUp frame={f} start={55} duration={25}>
        <span style={{ fontSize: 36, fontWeight: 300, color: TEXT_MUTED, letterSpacing: "-0.02em" }}>
          any job description
        </span>
      </SlideUp>

      <SlideUp frame={f} start={80} duration={30}>
        <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
          <div style={{ position: "relative", width: 140, height: 140 }}>
            <svg viewBox="0 0 140 140" width={140} height={140}>
              <circle cx="70" cy="70" r="60" fill="none" stroke={BORDER} strokeWidth="8" />
              <circle cx="70" cy="70" r="60" fill="none" stroke={AMBER} strokeWidth="8"
                strokeDasharray={`${circumference * score / 100} ${circumference}`}
                strokeLinecap="round" transform="rotate(-90 70 70)" />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 32, fontWeight: 300, color: GOLD }}>{Math.round(score)}</span>
              <span style={{ fontSize: 10, color: TEXT_MUTED, fontFamily: "monospace" }}>/100</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { label: "Keyword Match", val: 91 },
              { label: "ATS Format", val: 100 },
              { label: "Impact Phrases", val: 74 },
              { label: "Readability", val: 88 },
            ].map((item, i) => {
              const barW = interpolate(f, [90 + i * 5, 120 + i * 5], [0, item.val], { extrapolateRight: "clamp" });
              return (
                <div key={i} style={{ minWidth: 240 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontFamily: "monospace", color: TEXT_MUTED, marginBottom: 3 }}>
                    <span>{item.label}</span>
                    <span style={{ color: TEXT }}>{item.val}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 3, background: BORDER, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${barW}%`, borderRadius: 3, background: `linear-gradient(90deg, ${AMBER}, ${GOLD})` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SlideUp>
    </div>
  );
}

/* ─── Scene 3: Dashboard ──────────────────────────────── */
function SceneDashboard({ frame }: { frame: number }) {
  const f = frame - 270;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
      <FadeIn frame={f} start={10} duration={20}>
        <span style={{ fontSize: 12, color: AMBER, fontFamily: "monospace", letterSpacing: "0.15em" }}>
          // DASHBOARD_ANALYTICS
        </span>
      </FadeIn>

      <SlideUp frame={f} start={35} duration={25}>
        <span style={{ fontSize: 36, fontWeight: 300, color: TEXT, letterSpacing: "-0.02em" }}>
          Track everything at a glance
        </span>
      </SlideUp>

      <SlideUp frame={f} start={65} duration={30}>
        <div style={{ display: "flex", gap: 12 }}>
          {[
            { label: "Total Apps", val: "24" },
            { label: "Avg. Score", val: "83%" },
            { label: "Interviews", val: "8" },
            { label: "Offers", val: "3" },
          ].map((s, i) => (
            <div key={i} style={{
              padding: "16px 28px", borderRadius: 10, background: SURFACE,
              border: `1px solid ${BORDER}`, textAlign: "center",
            }}>
              <div style={{ fontSize: 24, fontWeight: 300, color: GOLD }}>{s.val}</div>
              <div style={{ fontSize: 9, color: TEXT_MUTED, fontFamily: "monospace", marginTop: 3, letterSpacing: "0.05em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </SlideUp>

      <SlideUp frame={f} start={95} duration={25}>
        <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
          {[30, 55, 45, 70, 60, 85, 75, 90, 65, 80, 50, 40].map((h, i) => {
            const barH = interpolate(f, [95 + i * 2, 125 + i * 2], [0, h], { extrapolateRight: "clamp" });
            return (
              <div key={i} style={{
                width: 24, height: `${barH}px`, borderRadius: "4px 4px 0 0",
                background: `linear-gradient(180deg, ${AMBER}, ${GOLD})`, opacity: 0.8,
              }} />
            );
          })}
        </div>
      </SlideUp>
    </div>
  );
}

/* ─── Scene 4: Pipeline ────────────────────────────────── */
function ScenePipeline({ frame }: { frame: number }) {
  const f = frame - 420;
  const cols = [
    { label: "Applied", count: 12, color: "#78716C" },
    { label: "Interviewing", count: 3, color: AMBER },
    { label: "Offer", count: 1, color: GOLD },
    { label: "Archived", count: 4, color: "#44403C" },
  ];

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 24 }}>
      <FadeIn frame={f} start={10} duration={20}>
        <span style={{ fontSize: 12, color: AMBER, fontFamily: "monospace", letterSpacing: "0.15em" }}>
          // PIPELINE_VIEW
        </span>
      </FadeIn>

      <SlideUp frame={f} start={35} duration={25}>
        <span style={{ fontSize: 36, fontWeight: 300, color: TEXT, letterSpacing: "-0.02em" }}>
          Visual Kanban pipeline
        </span>
      </SlideUp>

      <SlideUp frame={f} start={65} duration={30}>
        <div style={{ display: "flex", gap: 10 }}>
          {cols.map((col, ci) => {
            const colO = interpolate(f, [65 + ci * 10, 85 + ci * 10], [0, 1], { extrapolateRight: "clamp" });
            return (
              <div key={ci} style={{
                padding: "14px 18px", borderRadius: 10, background: SURFACE,
                border: `1px solid ${BORDER}`, opacity: colO, minWidth: 140,
              }}>
                <div style={{ fontSize: 10, color: col.color, fontFamily: "monospace", marginBottom: 8, letterSpacing: "0.05em" }}>
                  {col.label} ({col.count})
                </div>
                {[
                  { role: "Sr. Frontend Eng.", co: "Stripe", score: 87 },
                  { role: "Staff Engineer", co: "Linear", score: 92 },
                ].map((item, ii) => (
                  <div key={ii} style={{
                    padding: 8, borderRadius: 8, background: "rgba(0,0,0,0.2)",
                    marginBottom: 6, fontSize: 10,
                  }}>
                    <div style={{ fontWeight: 500, color: TEXT }}>{item.role}</div>
                    <div style={{ color: TEXT_MUTED, fontFamily: "monospace", fontSize: 9 }}>{item.co}</div>
                    <div style={{
                      width: 40, height: 3, borderRadius: 2, background: BORDER, marginTop: 4,
                    }}>
                      <div style={{
                        width: `${item.score}%`, height: "100%", borderRadius: 2,
                        background: col.color,
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </SlideUp>
    </div>
  );
}

/* ─── Scene 5: CTA ────────────────────────────────────── */
function SceneCTA({ frame }: { frame: number }) {
  const f = frame - 570;

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
      <FadeIn frame={f} start={10} duration={20}>
        <span style={{ fontSize: 12, color: AMBER, fontFamily: "monospace", letterSpacing: "0.15em" }}>
          // START_NOW
        </span>
      </FadeIn>

      <SlideUp frame={f} start={35} duration={25}>
        <span style={{ fontSize: 48, fontWeight: 300, color: TEXT, letterSpacing: "-0.025em" }}>
          Stop applying blind.
        </span>
      </SlideUp>

      <SlideUp frame={f} start={65} duration={25}>
        <span style={{ fontSize: 16, color: TEXT_MUTED, maxWidth: 500, textAlign: "center", lineHeight: 1.6 }}>
          Score your resume, generate cover letters, and track every application — all in one place.
        </span>
      </SlideUp>

      <SlideUp frame={f} start={95} duration={20}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          padding: "14px 32px", borderRadius: 10,
          background: "#F5F5F4", color: "#0C0C0A",
          fontSize: 14, fontFamily: "monospace", fontWeight: 500,
          marginTop: 10,
        }}>
          jobacker.app &rarr;
        </div>
      </SlideUp>

      <FadeIn frame={f} start={120} duration={30}>
        <div style={{ fontSize: 10, color: TEXT_MUTED, fontFamily: "monospace" }}>
          Built with React, TypeScript, Google Gemini AI &bull; Open source on GitHub
        </div>
      </FadeIn>
    </div>
  );
}

export function DemoVideo() {
  const frame = useCurrentFrame();

  return (
    <div style={{
      width: 1920, height: 1080,
      background: BG,
      color: TEXT,
      fontFamily: "'Inter', 'SF Pro', system-ui, sans-serif",
      overflow: "hidden",
    }}>
      {/* Ambient gradient */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse 600px 400px at 30% 50%, rgba(245,158,11,0.04) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Scenes */}
      <div style={{ position: "absolute", inset: 0, display: frame < 120 ? "flex" : "none", opacity: frame < 120 ? 1 : 0 }}>
        <SceneIntro frame={frame} />
      </div>
      <div style={{ position: "absolute", inset: 0, display: frame >= 120 && frame < 270 ? "flex" : "none", opacity: frame >= 120 && frame < 270 ? 1 : 0 }}>
        <SceneScoring frame={frame} />
      </div>
      <div style={{ position: "absolute", inset: 0, display: frame >= 270 && frame < 420 ? "flex" : "none", opacity: frame >= 270 && frame < 420 ? 1 : 0 }}>
        <SceneDashboard frame={frame} />
      </div>
      <div style={{ position: "absolute", inset: 0, display: frame >= 420 && frame < 570 ? "flex" : "none", opacity: frame >= 420 && frame < 570 ? 1 : 0 }}>
        <ScenePipeline frame={frame} />
      </div>
      <div style={{ position: "absolute", inset: 0, display: frame >= 570 ? "flex" : "none", opacity: frame >= 570 ? 1 : 0 }}>
        <SceneCTA frame={frame} />
      </div>

      {/* Progress bar */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: 2,
        background: "rgba(255,255,255,0.05)",
      }}>
        <div style={{
          height: "100%", width: `${(frame / 900) * 100}%`,
          background: `linear-gradient(90deg, ${AMBER}, ${GOLD})`,
          transition: "width 0.1s linear",
        }} />
      </div>
    </div>
  );
}
