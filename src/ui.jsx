import { statusColors } from "./data";

export function Badge({ children }) {
  const cls = statusColors[children] || "bg-cream-deep text-muted border border-line";
  return <span className={`px-3 py-0.5 rounded-full text-[11px] font-medium tracking-wide uppercase ${cls}`}>{children}</span>;
}

export function Card({ children, className = "" }) {
  return <div className={`bg-cream-card rounded-3xl border border-line shadow-soft ${className}`}>{children}</div>;
}

export function Stat({ label, value, tone = "ink" }) {
  const tones = { ink: "text-ink", gold: "text-gold", muted: "text-muted" };
  return (
    <div className="text-center px-4 py-4">
      <div className={`font-serif text-4xl font-semibold ${tones[tone]}`}>{value}</div>
      <div className="text-[11px] text-muted mt-1 tracking-[0.12em] uppercase">{label}</div>
    </div>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(51,50,45,0.35)" }} onClick={onClose}>
      <div className="bg-cream-card rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-lift border border-line fade-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-line">
          <h3 className="font-serif text-2xl font-semibold text-ink">{title}</h3>
          <button onClick={onClose} className="text-muted hover:text-gold text-2xl leading-none">×</button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

export function Field({ label, children }) {
  return (
    <label className="block mb-4">
      <span className="text-[11px] font-medium text-muted mb-1.5 block tracking-[0.1em] uppercase">{label}</span>
      {children}
    </label>
  );
}

export const inputCls = "w-full bg-cream border border-line rounded-xl px-4 py-2.5 text-sm text-ink placeholder-muted/60 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/40 transition";

export function Btn({ children, onClick, variant = "gold", type = "button", className = "" }) {
  const variants = {
    gold: "bg-gold-grad text-white shadow-soft hover:shadow-lift hover:brightness-105",
    outline: "bg-transparent text-gold-dark border border-gold/50 hover:bg-gold-pale/40",
    ghost: "bg-cream-deep text-muted hover:text-ink",
  };
  return (
    <button type={type} onClick={onClick}
      className={`font-medium rounded-xl px-5 py-2.5 text-sm tracking-wide transition ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
}

export function Empty({ children }) {
  return <div className="text-center text-muted py-12 text-sm font-light italic">{children}</div>;
}

// Título de seção com eyebrow dourado
export function SectionTitle({ eyebrow, children }) {
  return (
    <div className="mb-6">
      {eyebrow && <div className="text-[11px] text-gold tracking-[0.2em] uppercase mb-1">{eyebrow}</div>}
      <h2 className="font-serif text-3xl font-semibold text-ink">{children}</h2>
    </div>
  );
}

// Divisória ornamental dourada
export function GoldRule() {
  return (
    <div className="flex items-center justify-center gap-2 my-2">
      <span className="h-px w-10 bg-gradient-to-r from-transparent to-gold/60" />
      <span className="w-1.5 h-1.5 rotate-45 bg-gold" />
      <span className="h-px w-10 bg-gradient-to-l from-transparent to-gold/60" />
    </div>
  );
}
