const STARS = (() => {
  const out: { x: number; y: number; s: number; d: number }[] = [];
  let i = 0;
  while (out.length < 78 && i < 500) {
    const a = Math.sin(i * 127.1 + 311.7) * 43758.5453;
    const b = Math.sin(i * 269.5 + 183.3) * 23421.1963;
    const x = (a - Math.floor(a)) * 100;
    const y = (b - Math.floor(b)) * 100;
    i += 1;
    const dx = (x - 50) / 20;
    const dy = (y - 48) / 26;
    if (dx * dx + dy * dy < 1 && out.length % 4 !== 0) continue;
    out.push({
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
      s: out.length % 8 === 0 ? 2 : out.length % 3 === 0 ? 1.5 : 1,
      d: Number(((out.length % 14) * 0.38).toFixed(2)),
    });
  }
  return out;
})();

export function HeroStars() {
  return (
    <div aria-hidden="true" className="hero-stars">
      <span className="hero-fall" />
      {STARS.map((star, i) => (
        <span
          key={`${star.x}-${star.y}-${i}`}
          className="hero-star"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.s,
            height: star.s,
            animationDelay: `${star.d}s`,
          }}
        />
      ))}
    </div>
  );
}
