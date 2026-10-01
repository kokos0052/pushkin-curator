type Props = {
  hue: number;
  title: string;
  className?: string;
};

export function ArtworkVisual({ hue, title, className = "" }: Props) {
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `
          radial-gradient(ellipse at 30% 20%, hsla(${hue}, 45%, 62%, 0.55), transparent 55%),
          radial-gradient(ellipse at 80% 70%, hsla(${(hue + 40) % 360}, 35%, 40%, 0.45), transparent 50%),
          linear-gradient(145deg, hsla(${hue}, 25%, 22%, 1), hsla(${(hue + 20) % 360}, 20%, 12%, 1))
        `,
      }}
      aria-hidden
    >
      <div className="absolute inset-0 opacity-30 mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E')]" />
      <div className="absolute bottom-3 left-3 right-3 text-[11px] uppercase tracking-[0.18em] text-white/55">
        {title}
      </div>
    </div>
  );
}
