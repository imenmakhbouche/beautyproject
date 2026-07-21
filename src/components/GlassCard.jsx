export default function GlassCard({ children, className = '', hover = true }) {
  return (
    <div className={`glass-card p-6 ${hover ? 'hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300' : ''} ${className}`}>
      {children}
    </div>
  );
}
