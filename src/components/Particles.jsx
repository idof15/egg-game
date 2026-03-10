export default function Particles({ particles }) {
  return (
    <>
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          left: p.x, top: p.y,
          width: p.size, height: p.size,
          borderRadius: p.square ? "2px" : "50%",
          background: p.color,
          pointerEvents: "none",
          transform: "translate(-50%,-50%)",
          animation: `pflyAnim${p.dir} ${p.dur}ms ease-out forwards`,
          zIndex: 60,
        }} />
      ))}
    </>
  );
}
