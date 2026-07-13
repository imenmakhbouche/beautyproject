import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import LandingPage from './pages/LandingPage';
import PatientAuth from './pages/patient/PatientAuth';
import PatientDashboard from './pages/patient/PatientDashboard';
import ProAuth from './pages/pro/ProAuth';
import SecretaryDashboard from './pages/pro/SecretaryDashboard';
import DoctorDashboard from './pages/pro/DoctorDashboard';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-blanc-casse font-sans text-charcoal">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/patient/login" element={<PatientAuth />} />
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/pro/login" element={<ProAuth />} />
            <Route path="/pro/secretary/dashboard" element={<SecretaryDashboard />} />
            <Route path="/pro/doctor/dashboard" element={<DoctorDashboard />} />
            {/* Route 404 - Page non trouvée */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

// Composant pour la page 404 (à ajouter si nécessaire)
const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center bg-beige-light">
    <div className="text-center">
      <h1 className="text-6xl font-serif text-gold-dark mb-4">404</h1>
      <p className="text-xl text-charcoal mb-6">Page non trouvée</p>
      <Link to="/" className="btn-gold inline-flex items-center gap-2">
        Retour à l'accueil
      </Link>
    </div>
  </div>
);

export default App;