export default function SidebarNav({ items, activeTab, onTabChange }) {
  return (
    <nav className="w-full md:w-64 glass-card p-4 h-fit space-y-1 shrink-0">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={`nav-tab flex items-center gap-3 ${activeTab === item.id ? 'nav-tab-active' : ''}`}
        >
          {item.icon && <item.icon size={18} />}
          {item.label}
        </button>
      ))}
    </nav>
  );
}
