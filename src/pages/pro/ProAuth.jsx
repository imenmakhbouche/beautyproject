import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ProAuth() {
  const navigate = useNavigate();
  const { loginPro } = useApp();
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    const email = e.target.email.value;
    if (!email) {
      setError('Veuillez saisir votre email.');
      return;
    }
    loginPro(email);
    if (email.includes('secretaire')) {
      navigate('/pro/secretary/dashboard');
    } else {
      navigate('/pro/doctor/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-beige to-beige-light p-4">
      <div className="glass-card max-w-md w-full p-8 border-t-4 border-gold animate-fade-in">
        <Link to="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-charcoal mb-6 transition-colors">
          <ArrowLeft size={16} />
          Retour à l'accueil
        </Link>

        <h2 className="text-3xl font-serif text-charcoal mb-2 text-center">Portail Professionnel</h2>
        <p className="text-center text-gray-500 mb-6 text-sm">Accès réservé au médecin et à la secrétaire</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
            <input
              name="email"
              type="email"
              placeholder="medecin@clinique.com ou secretaire@clinique.com"
              required
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-1">Mot de passe</label>
            <input type="password" required className="input-field" placeholder="••••••••" />
          </div>

          {error && <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <button type="submit" className="btn-gold w-full mt-2">
            Accéder à l'espace
          </button>
        </form>

        <div className="mt-6 p-3 bg-beige-light rounded-lg text-xs text-gray-500 space-y-1">
          <p><strong>Médecin :</strong> medecin@clinique.com</p>
          <p><strong>Secrétaire :</strong> secretaire@clinique.com</p>
        </div>
      </div>
    </div>
  );
}
