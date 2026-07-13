import { Link } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function DashboardLayout({ title, subtitle, children, variant = 'light' }) {
  const { logout } = useApp();
  const isDark = variant === 'dark';

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-beige' : 'bg-blanc-casse'}`}>
      <header className={`px-6 py-4 flex justify-between items-center shadow-sm ${isDark ? 'bg-charcoal text-white' : 'bg-white/80 backdrop-blur-md border-b border-beige-dark/30'}`}>
        <div>
          <h1 className={`text-2xl font-serif ${isDark ? 'text-gold' : 'text-gold-dark'}`}>{title}</h1>
          {subtitle && <p className={`text-sm mt-0.5 ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>{subtitle}</p>}
        </div>
        <Link
          to="/"
          onClick={logout}
          className={`flex items-center gap-2 text-sm px-4 py-2 rounded-lg transition-all duration-200 ${
            isDark ? 'text-gray-300 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-charcoal hover:bg-beige-light'
          }`}
        >
          <LogOut size={16} />
          Déconnexion
        </Link>
      </header>
      <main className="p-6 md:p-8 flex-1 animate-fade-in">{children}</main>
    </div>
  );
}
