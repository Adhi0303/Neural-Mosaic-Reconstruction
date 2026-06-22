import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useRef, useCallback, useEffect } from "react";
import heroPortrait from "@/assets/hero-portrait.jpg";
import referenceArt from "@/assets/reference-art.jpg";
import mosaicResult from "@/assets/mosaic-result.jpg";
import g1 from "@/assets/gallery-1.jpg";
import g2 from "@/assets/gallery-2.jpg";
import g3 from "@/assets/gallery-3.jpg";
import g4 from "@/assets/gallery-4.jpg";
import g5 from "@/assets/gallery-5.jpg";
import g6 from "@/assets/gallery-6.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Atelier — Neural Mosaic Reconstruction" },
      { name: "description", content: "An AI atelier where every image hides another. Upload a portrait, upload a world — watch one rebuild itself through the fragments of the other." },
      { property: "og:title", content: "The Atelier — Neural Mosaic Reconstruction" },
      { property: "og:description", content: "Every image hides another image." },
      { property: "og:image", content: mosaicResult },
    ],
  }),
  component: Atelier,
});

function Atelier() {
  return (
    <div className="min-h-screen text-foreground">
      <TopBar />
      <Hero />
      <Process />
      <Workspace />
      <Gallery />
      <Science />
      <Footer />
    </div>
  );
}

function TopBar() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-[2px]" style={{ background: "color-mix(in oklab, var(--sand) 88%, transparent)" }}>
      <div className="mx-auto flex max-w-[1400px] items-center justify-between border-b border-foreground/15 px-6 py-5 md:px-12">
        <div className="flex items-baseline gap-3">
          <span className="display text-2xl tracking-wide">The Atelier</span>
          <span className="hidden text-[0.65rem] uppercase tracking-[0.3em] text-foreground/60 md:inline">Est. MMXXV</span>
        </div>
        <nav className="hidden gap-10 small-caps text-foreground/70 md:flex">
          <a href="#process" className="hover:text-terracotta transition-colors">Process</a>
          <a href="#workspace" className="hover:text-terracotta transition-colors">Atelier</a>
          <a href="#gallery" className="hover:text-terracotta transition-colors">Gallery</a>
          <a href="#science" className="hover:text-terracotta transition-colors">Science</a>
        </nav>
        <a href="#workspace" className="small-caps hidden border-b border-terracotta pb-1 text-terracotta md:inline">Enter →</a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-16 px-6 py-8 md:grid-cols-12 md:px-12 md:py-12">
        <div className="md:col-span-6 md:pr-8">
          <div className="mb-10 flex items-center gap-4 small-caps text-foreground/60">
            <span className="h-px w-12 bg-foreground/40" />
            Volume I · Exhibit No. 001
          </div>
          <h1 className="display text-[clamp(3.5rem,9vw,8rem)] leading-[0.92] tracking-tight text-museum">
            The<br />
            <em className="not-italic text-terracotta">Atelier</em>
          </h1>
          <div className="mt-10 max-w-md border-l-2 border-terracotta/70 pl-6">
            <div className="small-caps mb-3 text-sage">Neural Mosaic Reconstruction</div>
            <p className="display text-2xl italic text-foreground/85 md:text-3xl">
              Every image hides another image.
            </p>
          </div>
          <p className="mt-10 max-w-md text-base leading-relaxed text-foreground/75">
            Upload a portrait. Upload a visual world. Watch a machine rebuild one through the fragments of the other —
            patiently, fragment by fragment, as a restorer would.
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-8">
            <a href="#workspace" className="museum-button">
              Enter the Atelier
            </a>
            <a href="#process" className="small-caps text-foreground/70 underline-offset-8 hover:text-terracotta hover:underline">
              Read the catalogue
            </a>
          </div>
        </div>

        <div className="md:col-span-6">
          <MosaicAssembly />
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] border-t border-foreground/15 px-6 py-6 md:px-12">
        <div className="flex flex-wrap items-center justify-between gap-4 small-caps text-foreground/55">
          <span>Oil on Algorithm · 2025</span>
          <span>Curated by The Atelier</span>
          <span>Plate I · Recto</span>
        </div>
      </div>
    </section>
  );
}

function MosaicAssembly() {
  const [hovered, setHovered] = useState(false);
  const [epoch, setEpoch] = useState(0);

  const tiles = useMemo(() => {
    const out: { tx: number; ty: number; delay: number; size: number; left: number; top: number; rot: number }[] = [];
    for (let i = 0; i < 36; i++) {
      out.push({
        tx: (Math.random() - 0.5) * 520,
        ty: (Math.random() - 0.5) * 520,
        delay: Math.random() * 0.5,
        size: 16 + Math.random() * 40,
        left: Math.random() * 100,
        top: Math.random() * 100,
        rot: (Math.random() - 0.5) * 50,
      });
    }
    return out;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [epoch]);

  const handleMouseEnter = useCallback(() => {
    setEpoch(e => e + 1);
    setHovered(true);
  }, []);
  const handleMouseLeave = useCallback(() => setHovered(false), []);

  return (
    <figure className="relative mx-auto aspect-[4/5] w-full max-w-[520px]">
      <div
        className="frame absolute inset-0 cursor-crosshair"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="relative h-full w-full overflow-hidden">
          <img
            src={heroPortrait}
            alt="A Renaissance portrait dissolving into mosaic fragments"
            width={1024}
            height={1280}
            className="frame-inner transition-all duration-700"
            style={{
              filter: hovered
                ? "saturate(0.3) blur(2px) contrast(1.05)"
                : "saturate(0.95) contrast(1.02)",
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-40"
            style={{ backgroundImage: "var(--paper-grain), var(--canvas-noise)" }}
          />
          {tiles.map((t, i) => (
            <span
              key={`${epoch}-${i}`}
              aria-hidden
              className="absolute"
              style={{
                left: `${t.left}%`,
                top: `${t.top}%`,
                width: t.size,
                height: t.size,
                backgroundImage: `url(${heroPortrait})`,
                backgroundSize: "520px auto",
                backgroundPosition: `${-t.left * 4}px ${-t.top * 5}px`,
                boxShadow: "0 4px 14px -4px rgba(0,0,0,0.55)",
                ["--tx" as never]: `${t.tx}px`,
                ["--ty" as never]: `${t.ty}px`,
                ["--rot" as never]: `${t.rot}deg`,
                animation: hovered
                  ? `mosaic-scatter 0.65s ${t.delay * 0.35}s cubic-bezier(.4,0,.6,1) both`
                  : `mosaic-in 2.6s ${t.delay}s cubic-bezier(.2,.6,.2,1) both`,
              }}
            />
          ))}
        </div>
      </div>
      <figcaption className="mt-6 flex items-baseline justify-between small-caps text-foreground/60">
        <span>Plate I</span>
        <span className="display italic normal-case tracking-normal text-base text-foreground/70">
          “Reconstruction of a Gentleman”
        </span>
        <span>c. 2025</span>
      </figcaption>
    </figure>
  );
}

function Process() {
  const steps = [
    { n: "I", title: "Portrait", note: "The subject is offered to the machine." },
    { n: "II", title: "Feature Extraction", note: "Convolutions trace the bones of the face." },
    { n: "III", title: "Visual Embeddings", note: "The reference world is translated into vectors." },
    { n: "IV", title: "Semantic Matching", note: "Each region calls its nearest fragment." },
    { n: "V", title: "Mosaic Reconstruction", note: "The portrait is rebuilt from another image entirely." },
  ];

  return (
    <section id="process" className="relative paper-texture">
      <div className="mx-auto max-w-[1400px] px-6 py-28 md:px-12 md:py-40">
        <header className="mb-20 grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="small-caps text-sage md:col-span-3">Chapter I</div>
          <div className="md:col-span-9">
            <h2 className="display text-5xl leading-[1] text-museum md:text-7xl">
              How the<br /> <em className="not-italic text-terracotta">machine sees.</em>
            </h2>
            <p className="mt-8 max-w-xl text-foreground/75">
              A diagram, in the manner of a museum infographic — five movements that turn one image into the
              quiet vocabulary of another.
            </p>
          </div>
        </header>

        <ol className="relative grid grid-cols-1 gap-10 md:grid-cols-5">
          <svg
            aria-hidden
            className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
            preserveAspectRatio="none"
            viewBox="0 0 1000 200"
          >
            <path
              d="M 80 100 C 200 40, 300 160, 420 100 S 640 40, 760 100 S 940 160, 980 100"
              fill="none"
              stroke="var(--terracotta)"
              strokeWidth="1"
              strokeDasharray="4 6"
              opacity="0.55"
            />
          </svg>
          {steps.map((s) => (
            <li key={s.n} className="relative">
              <div className="small-caps mb-3 text-terracotta">Step {s.n}</div>
              <div className="display text-3xl text-museum">{s.title}</div>
              <p className="mt-3 text-sm text-foreground/70">{s.note}</p>
              <div className="mt-6 h-px w-10 bg-foreground/30" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Workspace() {
  const [contentFile, setContentFile] = useState<File | null>(null);
  const [contentPreview, setContentPreview] = useState<string | null>(null);
  const [styleFile, setStyleFile] = useState<File | null>(null);
  const [stylePreview, setStylePreview] = useState<string | null>(null);
  const [engine, setEngine] = useState("block_sorter");
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [artworkTitle, setArtworkTitle] = useState<string | null>(null);
  const [isNaming, setIsNaming] = useState(false);
  const [animPhase, setAnimPhase] = useState<"idle" | "generating" | "revealing">("idle");

  // Fire /name as soon as both images are uploaded
  useEffect(() => {
    if (!contentFile || !styleFile) return;
    setIsNaming(true);
    setArtworkTitle(null);
    const form = new FormData();
    form.append("content_image", contentFile);
    form.append("style_image", styleFile);
    fetch("http://localhost:8000/name", { method: "POST", body: form })
      .then(r => r.json())
      .then(d => setArtworkTitle(d.title))
      .catch(() => setArtworkTitle("Untitled Composition"))
      .finally(() => setIsNaming(false));
  }, [contentFile, styleFile]);

  const handleGenerate = async () => {
    if (!contentFile || !styleFile) return;
    setIsGenerating(true);
    setAnimPhase("generating");
    setResultImage(null);

    const formData = new FormData();
    formData.append("content_image", contentFile);
    formData.append("style_image", styleFile);
    formData.append("engine", engine);

    try {
      const response = await fetch("http://localhost:8000/generate", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) throw new Error("Network response was not ok");
      const blob = await response.blob();
      setResultImage(URL.createObjectURL(blob));
      setAnimPhase("revealing");
    } catch {
      alert("Failed to generate image. Ensure the backend is running.");
      setAnimPhase("idle");
    } finally {
      setIsGenerating(false);
    }
  };

  const plateNumber = useRef(Math.floor(Math.random() * 900) + 100);

  return (
    <section id="workspace" className="relative bg-museum text-paper">
      <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-12 md:py-28">

        {/* Header */}
        <header className="mb-14 flex flex-wrap items-end justify-between gap-8 border-b border-paper/20 pb-10">
          <div>
            <div className="small-caps text-paper/60">Chapter II</div>
            <h2 className="display mt-4 text-5xl text-paper md:text-7xl">
              Create an <em className="not-italic" style={{ color: "#d6a98c" }}>artwork.</em>
            </h2>
          </div>
          <p className="max-w-sm text-paper/70">
            Two frames await. Place a subject on the left, a visual world on the right,
            and ask the atelier to begin.
          </p>
        </header>

        {/* Main two-column layout */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-start">

          {/* LEFT — stacked inputs + controls */}
          <div className="flex flex-col gap-6 md:col-span-4">

            <FrameSlot
              label="I · The Subject"
              caption="Original Portrait"
              image={contentPreview || heroPortrait}
              onFileSelect={(file, preview) => { setContentFile(file); setContentPreview(preview); }}
            />

            <FrameSlot
              label="II · The World"
              caption="Reference Artwork"
              image={stylePreview || referenceArt}
              onFileSelect={(file, preview) => { setStyleFile(file); setStylePreview(preview); }}
            />

            {/* Engine selector */}
            <div className="border-t border-paper/15 pt-5">
              <div className="small-caps mb-2 text-paper/50">Technique</div>
              <select
                value={engine}
                onChange={e => setEngine(e.target.value)}
                className="w-full bg-transparent border border-paper/25 text-paper px-3 py-2 small-caps outline-none focus:border-terracotta transition-colors"
              >
                <option value="mosaic">Patch Mosaic (KD-Tree)</option>
                <option value="pixel_sorter">Exact Pixel Sorter</option>
                <option value="block_sorter">1-to-1 Block Sorter</option>
                <option value="neural">Neural Style Transfer</option>
              </select>
            </div>

            {/* Generate button */}
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || !contentFile || !styleFile}
              className="w-full inline-flex items-center justify-center gap-4 border border-paper/30 bg-terracotta px-8 py-4 text-paper transition-all hover:-translate-y-0.5 hover:bg-[color:var(--terracotta-glow)] hover:shadow-[0_20px_40px_-16px_rgba(117,68,55,0.7)] disabled:opacity-40 disabled:pointer-events-none"
            >
              <span className="small-caps">
                {isGenerating ? "Synthesizing..." : "Begin Reconstruction"}
              </span>
              {!isGenerating && <span aria-hidden>→</span>}
            </button>
          </div>

          {/* RIGHT — result frame */}
          <div className="md:col-span-8 flex flex-col">
            <div className="small-caps mb-4 text-paper/50">III · The Result</div>

            <div className="frame relative" style={{ background: "linear-gradient(135deg,#2e3d50,#1a2230)" }}>
              {/* Idle state — placeholder */}
              {animPhase === "idle" && (
                <div className="frame-inner flex flex-col items-center justify-center gap-4 min-h-[420px]">
                  <div className="display text-4xl italic text-paper/20">—</div>
                  <div className="small-caps text-paper/30">Awaiting the restorer's hand</div>
                </div>
              )}

              {/* Generating — tile shimmer animation */}
              {animPhase === "generating" && (
                <div className="frame-inner min-h-[420px] relative overflow-hidden">
                  {contentPreview && (
                    <img
                      src={contentPreview}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ filter: "saturate(0) brightness(0.35) blur(1px)" }}
                    />
                  )}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: "linear-gradient(0deg, rgba(117,68,55,0.0) 0%, rgba(117,68,55,0.18) 50%, rgba(117,68,55,0.0) 100%)",
                      backgroundSize: "100% 60px",
                      animation: "scanline 1.6s linear infinite",
                    }}
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
                    <div className="flex gap-1.5">
                      {[0,1,2,3,4].map(i => (
                        <span
                          key={i}
                          className="block w-2 h-2 bg-terracotta rounded-full"
                          style={{ animation: `dot-bounce 1.2s ${i * 0.18}s ease-in-out infinite` }}
                        />
                      ))}
                    </div>
                    <div className="small-caps text-paper/60">The machine is dreaming...</div>
                    <div className="display italic text-paper/30 text-lg">
                      {isNaming ? "Composing a title..." : (artworkTitle ?? "")}
                    </div>
                  </div>
                </div>
              )}

              {/* Result revealed */}
              {animPhase === "revealing" && resultImage && (
                <img
                  src={resultImage}
                  alt="Generated artwork"
                  className="frame-inner"
                  style={{ animation: "reveal-in 1.2s cubic-bezier(.2,.6,.2,1) both" }}
                />
              )}
            </div>

            {/* Title plate below result */}
            <div className="mt-5 flex items-baseline justify-between border-t border-paper/15 pt-4">
              <span className="small-caps text-paper/40">No. {plateNumber.current}</span>
              <span
                className="display italic text-lg text-paper/85 text-center flex-1 px-4 transition-opacity duration-700"
                style={{ opacity: artworkTitle ? 1 : 0.3 }}
              >
                {isNaming
                  ? "The atelier is composing a title..."
                  : (artworkTitle ?? "Upload both images to receive a title")}
              </span>
              <span className="small-caps text-paper/40">c. MMXXV</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FrameSlot({
  label, caption, image, onFileSelect
}: {
  label: string;
  caption: string;
  image: string;
  onFileSelect?: (file: File, preview: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onFileSelect) {
      onFileSelect(file, URL.createObjectURL(file));
    }
  };

  return (
    <figure>
      <div className="small-caps mb-2 text-paper/50">{label}</div>
      <div
        className="frame cursor-pointer transition-transform hover:scale-[1.015]"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
        <div className="relative aspect-[4/3] overflow-hidden">
          <img src={image} alt={caption} loading="lazy" className="frame-inner" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-20 mix-blend-multiply"
            style={{ backgroundImage: "var(--paper-grain)" }}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/40">
            <span className="small-caps text-paper border border-paper/40 px-4 py-2 backdrop-blur-sm">Click to Upload</span>
          </div>
        </div>
      </div>
      <figcaption className="mt-2 flex items-baseline justify-between">
        <span className="display italic text-sm text-paper/70">{caption}</span>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="small-caps text-paper/35 hover:text-paper transition-colors"
        >
          Upload
        </button>
      </figcaption>
    </figure>
  );
}

function Gallery() {
  const works = [
    { img: g1, title: "Girl with the Mosaic Veil", year: "MMXXV", w: 768, h: 1024, span: "md:col-span-4 md:row-span-2" },
    { img: g2, title: "Gentleman of Two Landscapes", year: "MMXXV", w: 1024, h: 768, span: "md:col-span-5" },
    { img: g3, title: "Profile in Bloom", year: "MMXXV", w: 768, h: 960, span: "md:col-span-3 md:row-span-2" },
    { img: g4, title: "The Apprentice", year: "MMXXV", w: 800, h: 800, span: "md:col-span-3" },
    { img: g5, title: "Allegory of Spring", year: "MMXXV", w: 768, h: 1120, span: "md:col-span-4 md:row-span-2" },
    { img: g6, title: "Vermeer, Recomposed", year: "MMXXV", w: 1024, h: 820, span: "md:col-span-5" },
  ];

  return (
    <section id="gallery" className="paper-texture">
      <div className="mx-auto max-w-[1400px] px-6 py-28 md:px-12 md:py-40">
        <header className="mb-16 grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <div className="small-caps mb-4 text-sage">Chapter III · East Wing</div>
            <h2 className="display text-5xl leading-[1] text-museum md:text-7xl">
              Gallery of <em className="not-italic text-terracotta">Reconstructions.</em>
            </h2>
          </div>
          <p className="self-end text-foreground/75 md:col-span-5">
            A rotating collection of portraits, each rebuilt from a foreign visual vocabulary.
            Hover to lift the canvas and read the wall label.
          </p>
        </header>

        <div className="grid auto-rows-[180px] grid-cols-2 gap-6 md:grid-cols-12 md:auto-rows-[200px]">
          {works.map((w) => (
            <GalleryPiece key={w.title} {...w} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryPiece({ img, title, year, span, w, h }: { img: string; title: string; year: string; span: string; w: number; h: number }) {
  return (
    <figure className={`group relative col-span-2 row-span-2 ${span}`}>
      <div className="frame h-full w-full transition-all duration-500 group-hover:-translate-y-1 group-hover:shadow-[0_40px_80px_-20px_rgba(117,68,55,0.45)]">
        <div className="relative h-full w-full overflow-hidden">
          <img
            src={img}
            alt={title}
            width={w}
            height={h}
            loading="lazy"
            className="frame-inner transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: "radial-gradient(120% 90% at 50% 100%, rgba(117,68,55,0.45), transparent 70%)" }}
          />
          <div className="absolute inset-x-0 bottom-0 translate-y-2 bg-museum/85 px-5 py-4 text-paper opacity-0 backdrop-blur-[1px] transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
            <div className="flex items-baseline justify-between gap-4">
              <span className="display italic text-lg leading-tight">{title}</span>
              <span className="small-caps text-paper/60">{year}</span>
            </div>
            <div className="mt-2 flex gap-4 small-caps text-paper/55">
              <span>Original</span><span>·</span><span>Reference</span><span>·</span><span>Generated</span>
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}

function Science() {
  const exhibits = [
    {
      no: "01",
      title: "CNN Feature Extraction",
      kicker: "Vision · Cortex",
      body:
        "Layered convolutions trace the architecture of a face — edges, planes, the soft mathematics of expression — and store them as a hierarchy of attention.",
    },
    {
      no: "02",
      title: "Visual Embeddings",
      kicker: "Translation",
      body:
        "Every region of the reference world is translated into a vector — a coordinate in a vast, silent space where likeness can be measured by distance.",
    },
    {
      no: "03",
      title: "Patch Matching",
      kicker: "Restoration",
      body:
        "For each fragment of the subject, the atelier calls forth its nearest neighbour from the reference — a careful pairing, repeated thousands of times.",
    },
    {
      no: "04",
      title: "Neural Reconstruction",
      kicker: "Composition",
      body:
        "A final synthesis blends colour, light, and stroke so that the mosaic is not merely assembled, but painted — one image inhabited by another.",
    },
  ];

  return (
    <section id="science" className="relative">
      <div className="mx-auto max-w-[1400px] px-6 py-28 md:px-12 md:py-40">
        <header className="mb-20 grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="small-caps mb-4 text-sage">Chapter IV · Salon des Études</div>
            <h2 className="display text-5xl leading-[1] text-museum md:text-7xl">
              The science<br />behind the <em className="not-italic text-terracotta">art.</em>
            </h2>
          </div>
          <p className="self-end text-foreground/75 md:col-span-6 md:col-start-7">
            Four exhibits, presented as one would present a curated study: the techniques behind the
            atelier, written for the visitor, not the engineer.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-x-12 gap-y-16 md:grid-cols-2">
          {exhibits.map((e, i) => (
            <article
              key={e.no}
              className={`relative border-t-2 border-museum/80 pt-8 ${i % 2 === 1 ? "md:translate-y-16" : ""}`}
            >
              <div className="absolute -top-7 left-0 bg-background pr-6">
                <span className="display text-6xl text-terracotta">{e.no}</span>
              </div>
              <div className="flex items-baseline justify-between">
                <div className="small-caps text-sage">{e.kicker}</div>
                <div className="small-caps text-foreground/40">Exhibit {e.no}</div>
              </div>
              <h3 className="display mt-4 text-3xl text-museum md:text-4xl">{e.title}</h3>
              <p className="mt-5 max-w-prose leading-relaxed text-foreground/75">{e.body}</p>
              <div className="mt-8 flex items-center gap-3 small-caps text-terracotta">
                Read the study
                <span aria-hidden>→</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-museum text-paper">
      <div className="mx-auto max-w-[1400px] px-6 py-24 md:px-12 md:py-32">
        <div className="grid grid-cols-1 items-end gap-12 md:grid-cols-12">
          <div className="md:col-span-8">
            <div className="small-caps mb-8 text-paper/55">Colophon</div>
            <blockquote className="display text-4xl italic leading-tight text-paper md:text-6xl">
              “Art is not reproduced.<br />
              It is <span className="text-[color:#d6a98c]">rediscovered.</span>”
            </blockquote>
          </div>
          <div className="md:col-span-4 md:text-right">
            <div className="display text-3xl">The Atelier</div>
            <div className="mt-2 small-caps text-paper/55">Neural Mosaic Reconstruction</div>
            <div className="mt-10 flex gap-6 small-caps text-paper/65 md:justify-end">
              <a href="#process" className="hover:text-paper">Process</a>
              <a href="#gallery" className="hover:text-paper">Gallery</a>
              <a href="#science" className="hover:text-paper">Science</a>
            </div>
          </div>
        </div>
        <div className="mt-20 flex flex-wrap items-center justify-between gap-4 border-t border-paper/15 pt-8 small-caps text-paper/45">
          <span>© MMXXV · The Atelier</span>
          <span>Plate XII · Verso</span>
          <span>Printed on Algorithm, in Oil</span>
        </div>
      </div>
    </footer>
  );
}
