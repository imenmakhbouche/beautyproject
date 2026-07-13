import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, LogIn, ArrowLeft, Mail, Send, X, User, Calendar, Phone, Heart, FileText, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function PatientAuth() {
  const navigate = useNavigate();
  const { loginPatient, registerPatient } = useApp();
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [resetError, setResetError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // États pour le formulaire d'inscription en plusieurs étapes
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    phone: '',
    emergencyContact: '',
    emergencyPhone: '',
    allergies: '',
    antecedents: '',
    medications: '',
    bloodType: '',
    address: ''
  });

  const handleForgotPassword = (e) => {
    e.preventDefault();
    setResetError('');
    
    if (!resetEmail) {
      setResetError('Veuillez entrer votre adresse email');
      return;
    }

    if (!resetEmail.includes('@')) {
      setResetError('Veuillez entrer une adresse email valide');
      return;
    }

    setTimeout(() => {
      setResetSent(true);
      setTimeout(() => {
        setShowForgotPassword(false);
        setResetSent(false);
        setResetEmail('');
      }, 5000);
    }, 1000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Effacer l'erreur quand l'utilisateur tape
    if (error) setError('');
  };

  const handleRegistration = (e) => {
    e.preventDefault();
    setError('');

    // Validation de base
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Veuillez entrer une adresse email valide');
      return;
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    // Vérification que les mots de passe correspondent
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    // Passer à l'étape 2
    setStep(2);
  };

  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validation des champs supplémentaires
      if (!formData.birthDate || !formData.phone) {
        setError('Veuillez remplir les champs obligatoires (date de naissance et téléphone)');
        setIsLoading(false);
        return;
      }

      console.log('Tentative d\'inscription avec les données:', formData);

      // Appel à la fonction d'inscription
      const result = await registerPatient(formData);

      console.log('Résultat de l\'inscription:', result);

      if (result.success) {
        // Redirection vers le dashboard
        navigate('/patient/dashboard');
      } else {
        setError(result.error || 'Erreur lors de l\'inscription');
        setIsLoading(false);
      }
    } catch (err) {
      console.error('Erreur lors de l\'inscription:', err);
      setError('Une erreur est survenue. Veuillez réessayer.');
      setIsLoading(false);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    const result = loginPatient(email, password);
    if (result.success) {
      navigate('/patient/dashboard');
    } else {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-beige to-beige-light p-4">
      {/* Modal Mot de passe oublié */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            <button
              onClick={() => {
                setShowForgotPassword(false);
                setResetSent(false);
                setResetEmail('');
                setResetError('');
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-charcoal transition-colors"
            >
              <X size={24} />
            </button>

            <h3 className="text-2xl font-serif text-gold-dark mb-2">
              Mot de passe oublié
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              Entrez votre adresse email pour recevoir un lien de réinitialisation
            </p>

            {resetSent ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
                  <Mail size={32} className="text-green-600" />
                </div>
                <h4 className="text-lg font-semibold text-charcoal mb-2">Email envoyé !</h4>
                <p className="text-sm text-gray-500">
                  Un lien de réinitialisation a été envoyé à <br />
                  <span className="font-medium text-charcoal">{resetEmail}</span>
                </p>
                <p className="text-xs text-gray-400 mt-4">
                  Redirection automatique dans quelques secondes...
                </p>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Adresse email
                  </label>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="input-field"
                    placeholder="jean.dupont@email.com"
                    required
                  />
                </div>

                {resetError && (
                  <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                    {resetError}
                  </p>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetSent(false);
                      setResetEmail('');
                      setResetError('');
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary flex items-center justify-center gap-2"
                  >
                    <Send size={16} />
                    Envoyer
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Formulaire principal */}
      <div className="glass-card max-w-md w-full p-8 animate-fade-in max-h-[90vh] overflow-y-auto">
        {step === 2 && mode === 'register' ? (
          // Étape 2 - Formulaire complet des coordonnées
          <div>
            <button
              onClick={() => {
                setStep(1);
                setError('');
              }}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-charcoal mb-6 transition-colors"
            >
              <ArrowLeft size={16} />
              Retour
            </button>

            <h2 className="text-3xl font-serif text-gold-dark mb-2 text-center">
              Complétez votre profil
            </h2>
            <p className="text-center text-gray-500 mb-6 text-sm">
              Nous avons besoin de ces informations pour mieux vous accompagner
            </p>

            <form onSubmit={handleCompleteRegistration} className="space-y-4">
              {/* Informations personnelles */}
              <div className="bg-beige-light p-4 rounded-xl space-y-4">
                <h4 className="font-semibold text-charcoal flex items-center gap-2">
                  <User size={18} className="text-gold-dark" />
                  Informations personnelles
                </h4>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Date de naissance <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Téléphone <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="06 12 34 56 78"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Adresse
                  </label>
                  <input
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Votre adresse complète"
                  />
                </div>
              </div>

              {/* Contact d'urgence */}
              <div className="bg-beige-light p-4 rounded-xl space-y-4">
                <h4 className="font-semibold text-charcoal flex items-center gap-2">
                  <Heart size={18} className="text-gold-dark" />
                  Contact d'urgence
                </h4>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Nom du contact
                  </label>
                  <input
                    name="emergencyContact"
                    type="text"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Nom de la personne à contacter"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Téléphone d'urgence
                  </label>
                  <input
                    name="emergencyPhone"
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="06 98 76 54 32"
                  />
                </div>
              </div>

              {/* Informations médicales */}
              <div className="bg-beige-light p-4 rounded-xl space-y-4">
                <h4 className="font-semibold text-charcoal flex items-center gap-2">
                  <FileText size={18} className="text-gold-dark" />
                  Informations médicales
                </h4>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Groupe sanguin
                  </label>
                  <select
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleInputChange}
                    className="input-field"
                  >
                    <option value="">Sélectionnez</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Allergies
                  </label>
                  <textarea
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleInputChange}
                    className="input-field resize-none"
                    rows="2"
                    placeholder="Listez vos allergies (médicaments, aliments, etc.)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Antécédents médicaux
                  </label>
                  <textarea
                    name="antecedents"
                    value={formData.antecedents}
                    onChange={handleInputChange}
                    className="input-field resize-none"
                    rows="2"
                    placeholder="Antécédents chirurgicaux, maladies chroniques, etc."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">
                    Traitements en cours
                  </label>
                  <textarea
                    name="medications"
                    value={formData.medications}
                    onChange={handleInputChange}
                    className="input-field resize-none"
                    rows="2"
                    placeholder="Médicaments que vous prenez actuellement"
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`btn-primary w-full flex items-center justify-center gap-2 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Création en cours...
                  </>
                ) : (
                  <>
                    <UserPlus size={18} />
                    Créer mon compte
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          // Étape 1 - Formulaire d'inscription de base ou connexion
          <>
            <Link to="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-charcoal mb-6 transition-colors">
              <ArrowLeft size={16} />
              Retour à l'accueil
            </Link>

            <h2 className="text-3xl font-serif text-gold-dark mb-2 text-center">
              {mode === 'login' ? 'Connexion Patient' : 'Créer un compte'}
            </h2>
            <p className="text-center text-gray-500 mb-6 text-sm">
              Accédez à vos rendez-vous, documents et messagerie
            </p>

            <div className="flex mb-6 bg-beige-light rounded-lg p-1">
              <button
                type="button"
                onClick={() => { 
                  setMode('login'); 
                  setError(''); 
                  setStep(1);
                  setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  mode === 'login' ? 'bg-white shadow text-charcoal' : 'text-gray-500 hover:text-charcoal'
                }`}
              >
                <LogIn size={16} />
                Connexion
              </button>
              <button
                type="button"
                onClick={() => { 
                  setMode('register'); 
                  setError(''); 
                  setStep(1);
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  mode === 'register' ? 'bg-white shadow text-charcoal' : 'text-gray-500 hover:text-charcoal'
                }`}
              >
                <UserPlus size={16} />
                Inscription
              </button>
            </div>

            {mode === 'register' ? (
              <form onSubmit={handleRegistration} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Nom complet</label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="input-field"
                    placeholder="Jean Dupont"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    className="input-field"
                    placeholder="jean.dupont@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                
                {/* Mot de passe avec toggle visibility */}
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Mot de passe</label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      className="input-field pr-10"
                      placeholder="•••••••• (min. 6 caractères)"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-charcoal transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Minimum 6 caractères</p>
                </div>

                {/* Confirmation du mot de passe avec toggle visibility */}
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Confirmer le mot de passe</label>
                  <div className="relative">
                    <input
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      className={`input-field pr-10 ${
                        formData.confirmPassword && formData.password !== formData.confirmPassword 
                          ? 'border-red-500 focus:ring-red-500' 
                          : formData.confirmPassword && formData.password === formData.confirmPassword
                          ? 'border-green-500 focus:ring-green-500'
                          : ''
                      }`}
                      placeholder="Confirmez votre mot de passe"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-charcoal transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">Les mots de passe ne correspondent pas</p>
                  )}
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <p className="text-green-500 text-xs mt-1">✓ Les mots de passe correspondent</p>
                  )}
                </div>

                {error && <div className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</div>}

                <button 
                  type="submit" 
                  className="btn-primary w-full flex items-center justify-center gap-2"
                  disabled={formData.password !== formData.confirmPassword || formData.password.length < 6}
                >
                  <UserPlus size={18} />
                  Continuer
                </button>
              </form>
            ) : (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Email</label>
                  <input name="email" type="email" required className="input-field" placeholder="jean.dupont@email.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-1">Mot de passe</label>
                  <input name="password" type="password" required className="input-field" placeholder="••••••••" />
                </div>

                {error && <div className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded-lg">{error}</div>}

                <button type="submit" className="btn-primary w-full mt-2 flex items-center justify-center gap-2">
                  <LogIn size={18} />
                  Se connecter
                </button>
              </form>
            )}

            {mode === 'login' && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-gold hover:text-gold-dark transition-colors underline-offset-2 hover:underline"
                >
                  Mot de passe oublié ?
                </button>
              </div>
            )}

            <p className="text-xs text-gray-400 text-center mt-4">
              Compte test : jean.dupont@email.com
            </p>
          </>
        )}
      </div>
    </div>
  );
}