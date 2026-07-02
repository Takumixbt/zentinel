export function GridOverlay() {
  const hLines = Array.from({ length: 8 }, (_, i) => 12.5 * (i + 1));
  const vLines = Array.from({ length: 12 }, (_, i) => 8.33 * (i + 1));

  return (
    <div className="grid-overlay">
      {hLines.map((top, i) => (
        <div key={`h-${i}`} className="h-line" style={{ top: `${top}%` }} />
      ))}
      {vLines.map((left, i) => (
        <div key={`v-${i}`} className="v-line" style={{ left: `${left}%` }} />
      ))}
    </div>
  );
}
