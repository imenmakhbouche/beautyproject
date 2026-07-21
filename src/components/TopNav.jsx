export default function TopNav({ items, activeTab, onTabChange }) {
  return (
    <nav className="top-nav">
      {items.map((item) => (
        <button
          key={item.id}
          onClick={() => onTabChange(item.id)}
          className={`top-nav-tab ${activeTab === item.id ? 'top-nav-tab-active' : ''}`}
        >
          {item.icon && <item.icon size={16} />}
          {item.label}
        </button>
      ))}
    </nav>
  );
}
