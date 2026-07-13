import { useState, useEffect } from 'react';
import { 
  CalendarRange, FolderOpen, Mail, Clock, Upload, FileText, Send, 
  CheckCircle, User, Calendar, FileText as FileIcon, MessageSquare, 
  LogOut, Bell, Settings, Home, ArrowLeft, UserCircle, 
  Phone, MapPin, Calendar as CalendarIcon, Heart, AlertCircle, 
  Activity, Droplet, Edit, Save, X, Download, Eye
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import {
  getAvailableDates,
  getBookedSlots,
  APPOINTMENT_SERVICES,
} from '../../data/mockData';

// Composant pour l'en-tête avec profil
const ProfileHeader = ({ patient, onLogout, onTabChange, activeTab }) => {
  return (
    <header className="bg-white shadow-sm border-b border-beige-dark/20 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo et titre */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onTabChange('overview')}>
          <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
            <span className="text-gold-dark font-serif text-2xl">
              {patient?.name?.charAt(0) || 'P'}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-serif text-gold-dark">Clinique Beauté Élégance</h1>
            <p className="text-sm text-gray-500">Espace Patient</p>
          </div>
        </div>

        {/* Profil et actions */}
        <div className="flex items-center gap-6">
          {/* Notifications */}
          <button 
            className="text-gray-400 hover:text-gold-dark transition-colors relative"
            onClick={() => alert('📬 Vous avez 2 nouvelles notifications')}
          >
            <Bell size={24} />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              2
            </span>
          </button>

          {/* Profil */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-base font-medium text-charcoal">{patient?.name}</p>
              <p className="text-sm text-gray-500">{patient?.email}</p>
            </div>
            <div 
              className="w-12 h-12 rounded-full bg-gold-dark flex items-center justify-center text-white text-lg font-medium cursor-pointer hover:bg-gold transition-colors"
              onClick={() => onTabChange('profile')}
              title="Voir mon profil"
            >
              {patient?.name?.charAt(0) || 'P'}
            </div>
            <button
              onClick={onLogout}
              className="text-gray-400 hover:text-red-600 transition-colors"
              title="Déconnexion"
            >
              <LogOut size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Navigation rapide */}
      <div className="max-w-6xl mx-auto px-6 pb-3 flex gap-8 text-base overflow-x-auto">
        <NavItem 
          icon={Home} 
          label="Dashboard" 
          count={0} 
          isActive={activeTab === 'overview'}
          onClick={() => onTabChange('overview')}
        />
        <NavItem 
          icon={UserCircle} 
          label="Profil" 
          count={0} 
          isActive={activeTab === 'profile'}
          onClick={() => onTabChange('profile')}
        />
        <NavItem 
          icon={CalendarRange} 
          label="Rendez-vous" 
          count={0} 
          isActive={activeTab === 'appointments'}
          onClick={() => onTabChange('appointments')}
        />
        <NavItem 
          icon={FolderOpen} 
          label="Documents" 
          count={0} 
          isActive={activeTab === 'documents'}
          onClick={() => onTabChange('documents')}
        />
        <NavItem 
          icon={MessageSquare} 
          label="Messages" 
          count={3} 
          isActive={activeTab === 'messages'}
          onClick={() => onTabChange('messages')}
        />
      </div>
    </header>
  );
};

// Composant NavItem
const NavItem = ({ icon: Icon, label, count, isActive, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-3 transition-colors whitespace-nowrap pb-3 border-b-[3px] text-base font-medium ${
      isActive 
        ? 'text-gold-dark border-gold-dark' 
        : 'text-gray-600 hover:text-gold-dark border-transparent hover:border-gold-dark'
    }`}
  >
    <Icon size={22} />
    <span>{label}</span>
    {count > 0 && (
      <span className="bg-gold text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
        {count}
      </span>
    )}
  </button>
);

// Composant bouton de retour
const BackButton = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gold-dark transition-colors mb-4"
  >
    <ArrowLeft size={18} />
    Retour au dashboard
  </button>
);

// Composant de visualisation de document
const DocumentViewer = ({ document, onClose }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      let simulatedContent = '';
      if (document.type === 'prescription') {
        simulatedContent = `📋 ORDONNANCE MÉDICALE

Dr. Sophie Martin
Médecin Esthétique
Clinique Beauté Élégance

Patient: ${document.patientId === 'p1' ? 'Jean Dupont' : document.patientId === 'p2' ? 'Marie Laurent' : 'Claire Bernard'}
Date: ${document.date}

─────────────────────────────

TRAITEMENT PRESCRIT:

1. Crème hydratante visage - Application matin et soir
2. Protection solaire SPF 50 - Tous les jours
3. Sérum anti-âge - Appliquer avant la crème

─────────────────────────────

Durée du traitement: 3 mois
Renouvellement: Sur consultation

Signature: Dr. Sophie Martin`;
      } else if (document.type === 'quote') {
        simulatedContent = `📄 DEVIS ESTIMATIF

Clinique Beauté Élégance
Service: ${document.name.includes('laser') ? 'Traitement Laser' : 'Consultation Esthétique'}

─────────────────────────────

Description des prestations:
- Consultation initiale avec le Dr. Martin
- Évaluation personnalisée
- Établissement du plan de traitement

Montant total: 150€
Validité: 30 jours

─────────────────────────────

Pour toute question, contactez notre secrétariat.`;
      } else if (document.type === 'analysis') {
        simulatedContent = `📊 RÉSULTATS D'ANALYSE

Patient: ${document.patientId === 'p1' ? 'Jean Dupont' : document.patientId === 'p2' ? 'Marie Laurent' : 'Claire Bernard'}
Date d'analyse: ${document.date}

─────────────────────────────

RÉSULTATS DE L'ANALYSE:

Paramètres normaux:
- Tension artérielle: 120/80 mmHg ✅
- Glycémie: 0.95 g/L ✅
- Cholestérol total: 1.90 g/L ✅

─────────────────────────────

Conclusion: Bilan général satisfaisant.
Recommandation: Maintenir une alimentation équilibrée.`;
      } else {
        simulatedContent = `📄 DOCUMENT

Nom du document: ${document.name}
Date: ${document.date}
Type: ${document.type}

─────────────────────────────

Contenu du document:
Ce document est disponible pour consultation.
Veuillez contacter le secrétariat pour plus d'informations.

─────────────────────────────

Clinique Beauté Élégance
Votre santé, notre priorité.`;
      }
      
      setContent(simulatedContent);
      setIsLoading(false);
    }, 800);
  }, [document]);

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${document.name.split('.')[0]}_${document.date}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPDF = () => {
    alert('📄 Téléchargement du document en cours...');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-beige-dark/20">
          <div className="flex items-center gap-3">
            <FileText size={24} className="text-gold-dark" />
            <div>
              <h3 className="font-semibold text-charcoal">{document.name}</h3>
              <p className="text-xs text-gray-500">
                {document.date} — {document.type === 'prescription' ? 'Ordonnance' : 
                  document.type === 'quote' ? 'Devis' : 
                  document.type === 'analysis' ? 'Analyse' : 'Document'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-charcoal transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-gray-500">Chargement du document...</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <pre className="font-mono text-sm whitespace-pre-wrap leading-relaxed text-charcoal">
                {content}
              </pre>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-4 border-t border-beige-dark/20 bg-white rounded-b-2xl">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="bg-gold/10 text-gold-dark px-2 py-0.5 rounded text-xs">
              {document.type}
            </span>
            <span>•</span>
            <span>Fichier texte</span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gold-dark border border-gold rounded-lg hover:bg-gold/10 transition-colors"
            >
              <Download size={18} />
              Télécharger (.txt)
            </button>
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-gold-dark rounded-lg hover:bg-gold transition-colors"
            >
              <FileText size={18} />
              Télécharger PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Composant Profil Patient
const PatientProfile = ({ patient, onUpdatePatient }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  const defaultPatient = {
    id: patient?.id || 'p1',
    name: patient?.name || 'Jean Dupont',
    email: patient?.email || 'jean.dupont@email.com',
    phone: patient?.phone || '06 12 34 56 78',
    birthDate: patient?.birthDate || '1985-03-15',
    address: patient?.address || '123 Rue de Paris, 75001 Paris',
    emergencyContact: patient?.emergencyContact || 'Marie Dupont',
    emergencyPhone: patient?.emergencyPhone || '06 98 76 54 32',
    allergies: patient?.allergies || 'Pollen, Arachides',
    antecedents: patient?.antecedents || 'Appendicectomie en 2010',
    medications: patient?.medications || 'Aucun traitement en cours',
    bloodType: patient?.bloodType || 'A+',
    createdAt: patient?.createdAt || '2026-01-01T00:00:00.000Z',
    appointmentCount: patient?.appointmentCount || 5,
    lastVisit: patient?.lastVisit || '15/06/2026',
    nextAppointment: patient?.nextAppointment || '20/07/2026'
  };

  const patientData = patient || defaultPatient;

  const [editData, setEditData] = useState({
    name: patientData.name || '',
    email: patientData.email || '',
    phone: patientData.phone || '',
    birthDate: patientData.birthDate || '',
    address: patientData.address || '',
    emergencyContact: patientData.emergencyContact || '',
    emergencyPhone: patientData.emergencyPhone || '',
    allergies: patientData.allergies || '',
    antecedents: patientData.antecedents || '',
    medications: patientData.medications || '',
    bloodType: patientData.bloodType || '',
  });

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    const updatedPatient = {
      ...patientData,
      ...editData
    };
    
    if (onUpdatePatient) {
      onUpdatePatient(updatedPatient);
    }
    
    setSuccessMessage('✅ Profil mis à jour avec succès !');
    setIsEditing(false);
    
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  const handleCancel = () => {
    setEditData({
      name: patientData.name || '',
      email: patientData.email || '',
      phone: patientData.phone || '',
      birthDate: patientData.birthDate || '',
      address: patientData.address || '',
      emergencyContact: patientData.emergencyContact || '',
      emergencyPhone: patientData.emergencyPhone || '',
      allergies: patientData.allergies || '',
      antecedents: patientData.antecedents || '',
      medications: patientData.medications || '',
      bloodType: patientData.bloodType || '',
    });
    setIsEditing(false);
    setSuccessMessage('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif text-charcoal flex items-center gap-2">
          <UserCircle size={24} className="text-gold-dark" />
          Mon Profil
        </h2>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 text-gold-dark hover:text-gold transition-colors"
          >
            <Edit size={18} />
            Modifier le profil
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors"
            >
              <X size={18} />
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
            >
              <Save size={18} />
              Enregistrer
            </button>
          </div>
        )}
      </div>

      {successMessage && (
        <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg border border-green-200 animate-fade-in">
          {successMessage}
        </div>
      )}

      <div className="bg-gradient-to-r from-gold/10 to-beige-light rounded-2xl p-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gold-dark flex items-center justify-center text-white text-3xl font-medium shadow-lg">
            {editData.name?.charAt(0) || patientData.name?.charAt(0) || 'P'}
          </div>
          <div>
            <h3 className="text-2xl font-serif text-charcoal">{editData.name || patientData.name || 'Non renseigné'}</h3>
            <p className="text-gray-500">{editData.email || patientData.email || 'Non renseigné'}</p>
            <div className="flex items-center gap-4 mt-2 text-sm">
              <span className="flex items-center gap-1 text-gray-500">
                <CalendarIcon size={14} />
                Membre depuis {patientData.createdAt ? new Date(patientData.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
              </span>
              <span className="text-green-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
                Actif
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-beige-dark/10 p-6">
          <h4 className="font-serif text-lg text-gold-dark mb-4 flex items-center gap-2">
            <User size={18} />
            Informations personnelles
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider">Nom complet</label>
              {isEditing ? (
                <input
                  name="name"
                  value={editData.name}
                  onChange={handleEditChange}
                  className="input-field mt-1"
                  placeholder="Votre nom complet"
                />
              ) : (
                <p className="font-medium text-charcoal">{patientData.name || 'Non renseigné'}</p>
              )}
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider">Email</label>
              {isEditing ? (
                <input
                  name="email"
                  type="email"
                  value={editData.email}
                  onChange={handleEditChange}
                  className="input-field mt-1"
                  placeholder="votre@email.com"
                />
              ) : (
                <p className="font-medium text-charcoal">{patientData.email || 'Non renseigné'}</p>
              )}
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider">Téléphone</label>
              {isEditing ? (
                <input
                  name="phone"
                  value={editData.phone}
                  onChange={handleEditChange}
                  className="input-field mt-1"
                  placeholder="06 12 34 56 78"
                />
              ) : (
                <p className="font-medium text-charcoal">{patientData.phone || 'Non renseigné'}</p>
              )}
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider">Date de naissance</label>
              {isEditing ? (
                <input
                  name="birthDate"
                  type="date"
                  value={editData.birthDate}
                  onChange={handleEditChange}
                  className="input-field mt-1"
                />
              ) : (
                <p className="font-medium text-charcoal">
                  {patientData.birthDate ? new Date(patientData.birthDate).toLocaleDateString('fr-FR') : 'Non renseigné'}
                </p>
              )}
            </div>
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider">Adresse</label>
              {isEditing ? (
                <input
                  name="address"
                  value={editData.address}
                  onChange={handleEditChange}
                  className="input-field mt-1"
                  placeholder="Votre adresse complète"
                />
              ) : (
                <p className="font-medium text-charcoal">{patientData.address || 'Non renseigné'}</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-beige-dark/10 p-6">
            <h4 className="font-serif text-lg text-gold-dark mb-4 flex items-center gap-2">
              <Heart size={18} />
              Contact d'urgence
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider">Nom du contact</label>
                {isEditing ? (
                  <input
                    name="emergencyContact"
                    value={editData.emergencyContact}
                    onChange={handleEditChange}
                    className="input-field mt-1"
                    placeholder="Nom de la personne à contacter"
                  />
                ) : (
                  <p className="font-medium text-charcoal">{patientData.emergencyContact || 'Non renseigné'}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider">Téléphone d'urgence</label>
                {isEditing ? (
                  <input
                    name="emergencyPhone"
                    value={editData.emergencyPhone}
                    onChange={handleEditChange}
                    className="input-field mt-1"
                    placeholder="06 98 76 54 32"
                  />
                ) : (
                  <p className="font-medium text-charcoal">{patientData.emergencyPhone || 'Non renseigné'}</p>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-beige-dark/10 p-6">
            <h4 className="font-serif text-lg text-gold-dark mb-4 flex items-center gap-2">
              <Activity size={18} />
              Informations médicales
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider">Groupe sanguin</label>
                {isEditing ? (
                  <select
                    name="bloodType"
                    value={editData.bloodType}
                    onChange={handleEditChange}
                    className="input-field mt-1"
                  >
                    <option value="">Non renseigné</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                ) : (
                  <p className="font-medium text-charcoal">{patientData.bloodType || 'Non renseigné'}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider">Allergies</label>
                {isEditing ? (
                  <textarea
                    name="allergies"
                    value={editData.allergies}
                    onChange={handleEditChange}
                    className="input-field mt-1 resize-none"
                    rows="2"
                    placeholder="Listez vos allergies"
                  />
                ) : (
                  <p className="font-medium text-charcoal">{patientData.allergies || 'Aucune allergie déclarée'}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider">Antécédents médicaux</label>
                {isEditing ? (
                  <textarea
                    name="antecedents"
                    value={editData.antecedents}
                    onChange={handleEditChange}
                    className="input-field mt-1 resize-none"
                    rows="2"
                    placeholder="Vos antécédents médicaux"
                  />
                ) : (
                  <p className="font-medium text-charcoal">{patientData.antecedents || 'Aucun antécédent déclaré'}</p>
                )}
              </div>
              <div>
                <label className="block text-xs text-gray-400 uppercase tracking-wider">Traitements en cours</label>
                {isEditing ? (
                  <textarea
                    name="medications"
                    value={editData.medications}
                    onChange={handleEditChange}
                    className="input-field mt-1 resize-none"
                    rows="2"
                    placeholder="Vos traitements en cours"
                  />
                ) : (
                  <p className="font-medium text-charcoal">{patientData.medications || 'Aucun traitement déclaré'}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-beige-light/50 rounded-2xl p-6 border border-beige-dark/10">
        <h4 className="font-serif text-gold-dark mb-3 flex items-center gap-2">
          <AlertCircle size={18} />
          Informations importantes
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Nombre de rendez-vous</p>
            <p className="font-medium text-charcoal">{patientData.appointmentCount || 0}</p>
          </div>
          <div>
            <p className="text-gray-500">Dernière visite</p>
            <p className="font-medium text-charcoal">{patientData.lastVisit || 'Aucune'}</p>
          </div>
          <div>
            <p className="text-gray-500">Prochain rendez-vous</p>
            <p className="font-medium text-charcoal">{patientData.nextAppointment || 'À planifier'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { currentUser, appointments, documents, messages, schedule, addAppointment, addDocument, sendMessage, logout, setCurrentPatient, patients, setPatients } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedService, setSelectedService] = useState(APPOINTMENT_SERVICES[0]);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [uploadName, setUploadName] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);

  const patientId = currentUser?.id || 'p1';
  const patientName = currentUser?.name || 'Jean Dupont';

  // Filtrer les données du patient
  const myAppointments = appointments.filter((a) => a.patientId === patientId);
  const myDocuments = documents.filter((d) => d.patientId === patientId);
  const myMessages = messages.filter((m) => m.patientId === patientId);

  const availableDates = getAvailableDates(schedule);
  const selectedDayKey = availableDates.find((d) => d.date === selectedDate)?.dayKey;
  const availableSlots = selectedDayKey
    ? schedule[selectedDayKey].slots.filter((slot) => !getBookedSlots(appointments, selectedDate).includes(slot))
    : [];

  // Fermer le document viewer avec Echap
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && selectedDocument) {
        setSelectedDocument(null);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [selectedDocument]);

  // Fonction pour mettre à jour les données du patient
  const handleUpdatePatient = (updatedPatient) => {
    const updatedPatients = patients.map(p => 
      p.id === updatedPatient.id ? updatedPatient : p
    );
    setPatients(updatedPatients);
    setCurrentPatient(updatedPatient);
    localStorage.setItem('patientData', JSON.stringify(updatedPatient));
  };

  const handleBookAppointment = () => {
    if (!selectedDate || !selectedTime) return;
    addAppointment({
      patientId,
      patientName,
      date: selectedDate,
      time: selectedTime,
      service: selectedService,
    });
    setBookingSuccess(true);
    setSelectedDate('');
    setSelectedTime('');
    setTimeout(() => setBookingSuccess(false), 3000);
  };

  const handleUpload = (e) => {
    e.preventDefault();
    const file = e.target.file.files[0];
    if (!file && !uploadName) return;
    addDocument({
      patientId,
      name: file?.name || uploadName,
      type: 'upload',
      uploadedBy: 'patient',
    });
    setUploadName('');
    e.target.reset();
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendMessage(patientId, 'patient', newMessage.trim());
    setNewMessage('');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Composant de messagerie style messenger
  const Messenger = () => (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-[calc(100vh-350px)] flex flex-col">
      <div className="bg-gold/10 px-6 py-3 border-b border-beige-dark/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold-dark flex items-center justify-center text-white">
            <MessageSquare size={18} />
          </div>
          <div>
            <h3 className="font-semibold text-charcoal">Dr. Sophie Martin</h3>
            <p className="text-xs text-green-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span>
              En ligne
            </p>
          </div>
        </div>
        <span className="text-xs text-gray-400">Messagerie sécurisée</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
        {myMessages.length === 0 ? (
          <div className="text-center text-gray-400 mt-20">
            <MessageSquare size={40} className="mx-auto mb-3 opacity-30" />
            <p>Aucun message</p>
            <p className="text-sm">Commencez une discussion avec votre médecin</p>
          </div>
        ) : (
          myMessages.map((msg) => {
            const isPatient = msg.sender === 'patient';
            return (
              <div
                key={msg.id}
                className={`flex ${isPatient ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${isPatient ? 'order-1' : 'order-1'}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm ${
                      isPatient
                        ? 'bg-gold-dark text-white rounded-br-none'
                        : 'bg-white text-charcoal rounded-bl-none border border-beige-dark/10'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p className={`text-xs mt-1 ${isPatient ? 'text-gold/70' : 'text-gray-400'}`}>
                      {new Date(msg.timestamp).toLocaleString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                {!isPatient && (
                  <div className="order-2 ml-3">
                    <div className="w-8 h-8 rounded-full bg-gold-dark flex items-center justify-center text-white text-xs font-medium">
                      M
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-beige-dark/20">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Écrivez votre message..."
              className="input-field resize-none min-h-[50px] max-h-[120px] pr-12"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
            />
            <button
              type="button"
              className="absolute right-3 bottom-3 text-gray-400 hover:text-gold-dark transition-colors"
              onClick={() => alert('😊 Choisissez un emoji')}
            >
              <span className="text-sm">😊</span>
            </button>
          </div>
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="btn-primary flex items-center gap-2 shrink-0 disabled:opacity-40 disabled:cursor-not-allowed px-6"
          >
            <Send size={18} />
            Envoyer
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Appuyez sur Entrée pour envoyer, Maj+Entrée pour un nouveau ligne
        </p>
      </form>
    </div>
  );

  const renderContent = () => {
    const showBackButton = activeTab !== 'overview' && activeTab !== 'profile';

    return (
      <>
        {showBackButton && (
          <BackButton onClick={() => handleTabChange('overview')} />
        )}

        {activeTab === 'profile' && (
          <PatientProfile 
            patient={currentUser} 
            onUpdatePatient={handleUpdatePatient}
          />
        )}

        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif text-charcoal flex items-center gap-2">
              <CalendarRange size={24} className="text-gold-dark" />
              Rendez-vous
            </h2>

            {bookingSuccess && (
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-lg animate-fade-in border border-green-200">
                <CheckCircle size={18} />
                Rendez-vous demandé avec succès ! En attente de confirmation.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-sm border border-beige-dark/10 p-6">
                <h3 className="font-serif text-lg text-gold-dark mb-4 flex items-center gap-2">
                  <Clock size={18} />
                  Nouvelle réservation
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Service</label>
                    <select 
                      value={selectedService} 
                      onChange={(e) => setSelectedService(e.target.value)} 
                      className="input-field"
                    >
                      {APPOINTMENT_SERVICES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <select 
                      value={selectedDate} 
                      onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(''); }} 
                      className="input-field"
                    >
                      <option value="">Choisir une date</option>
                      {availableDates.map((d) => (
                        <option key={d.date} value={d.date}>{d.label}</option>
                      ))}
                    </select>
                  </div>
                  {selectedDate && (
                    <div>
                      <label className="block text-sm font-medium mb-1">Créneau horaire</label>
                      <div className="grid grid-cols-3 gap-2">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTime(slot)}
                            className={`px-3 py-2 rounded-lg text-sm border transition-all duration-200 ${
                              selectedTime === slot
                                ? 'bg-gold-dark text-white border-gold-dark'
                                : 'bg-white border-beige-dark hover:border-gold'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                      {availableSlots.length === 0 && (
                        <p className="text-sm text-gray-500 italic mt-2">Aucun créneau disponible ce jour.</p>
                      )}
                    </div>
                  )}
                  <button
                    onClick={handleBookAppointment}
                    disabled={!selectedDate || !selectedTime}
                    className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Confirmer le rendez-vous
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-beige-dark/10 p-6">
                <h3 className="font-serif text-lg text-gold-dark mb-4 flex items-center gap-2">
                  <Calendar size={18} />
                  Mes rendez-vous
                </h3>
                {myAppointments.length === 0 ? (
                  <p className="text-gray-500 italic text-sm">Aucun rendez-vous planifié.</p>
                ) : (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {myAppointments.map((appt) => (
                      <div key={appt.id} className="flex justify-between items-center p-3 bg-beige-light/50 rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{appt.service}</p>
                          <p className="text-xs text-gray-500">{appt.date} à {appt.time}</p>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          appt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                          appt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {appt.status === 'confirmed' ? 'Confirmé' : appt.status === 'pending' ? 'En attente' : appt.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif text-charcoal flex items-center gap-2">
              <FolderOpen size={24} className="text-gold-dark" />
              Mes Documents
            </h2>

            <div className="bg-white rounded-2xl shadow-sm border border-beige-dark/10 p-6">
              <h3 className="font-serif text-lg text-gold-dark mb-4 flex items-center gap-2">
                <Upload size={18} />
                Ajouter un document
              </h3>
              <form onSubmit={handleUpload} className="flex flex-col sm:flex-row gap-3">
                <input name="file" type="file" className="input-field flex-1" />
                <button type="submit" className="btn-secondary shrink-0">Téléverser</button>
              </form>
              <p className="text-xs text-gray-400 mt-2">Simulation : le fichier sera ajouté à votre dossier.</p>
            </div>

            <div className="space-y-3">
              {myDocuments.length === 0 ? (
                <p className="text-gray-500 italic">Aucun document dans votre dossier.</p>
              ) : (
                myDocuments.map((doc) => (
                  <div key={doc.id} className="bg-white rounded-2xl shadow-sm border border-beige-dark/10 p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                        <FileText size={20} className="text-gold-dark" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{doc.name}</p>
                        <p className="text-xs text-gray-500">{doc.date} — {doc.type === 'prescription' ? 'Ordonnance' : 
                          doc.type === 'quote' ? 'Devis' : 
                          doc.type === 'analysis' ? 'Analyse' : 'Document'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        className="text-sm text-gold-dark hover:text-gold transition-colors flex items-center gap-1"
                        onClick={() => setSelectedDocument(doc)}
                      >
                        <Eye size={16} />
                        Voir
                      </button>
                      <button 
                        className="text-sm text-gold-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                        onClick={() => {
                          alert(`📥 Téléchargement du document: ${doc.name}`);
                        }}
                      >
                        <Download size={16} />
                        Télécharger
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'messages' && <Messenger />}

        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-gold/5 to-beige-light rounded-2xl p-6">
              <h2 className="text-2xl font-serif text-charcoal">
                Bienvenue, <span className="text-gold-dark">{patientName}</span>
              </h2>
              <p className="text-gray-500 mt-1">Voici un aperçu de votre espace santé</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div 
                className="bg-white rounded-2xl shadow-sm border border-beige-dark/10 p-6 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleTabChange('profile')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Profil</p>
                    <p className="text-lg font-serif text-gold-dark truncate">{patientName}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                    <UserCircle size={24} className="text-gold-dark" />
                  </div>
                </div>
                <p className="text-xs text-gold-dark mt-2 flex items-center gap-1">
                  Voir mon profil →
                </p>
              </div>

              <div 
                className="bg-white rounded-2xl shadow-sm border border-beige-dark/10 p-6 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleTabChange('appointments')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Rendez-vous</p>
                    <p className="text-3xl font-serif text-gold-dark">{myAppointments.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                    <CalendarRange size={24} className="text-gold-dark" />
                  </div>
                </div>
                <p className="text-xs text-gold-dark mt-2 flex items-center gap-1">
                  Voir mes rendez-vous →
                </p>
              </div>

              <div 
                className="bg-white rounded-2xl shadow-sm border border-beige-dark/10 p-6 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleTabChange('documents')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Documents</p>
                    <p className="text-3xl font-serif text-gold-dark">{myDocuments.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                    <FolderOpen size={24} className="text-gold-dark" />
                  </div>
                </div>
                <p className="text-xs text-gold-dark mt-2 flex items-center gap-1">
                  Voir mes documents →
                </p>
              </div>

              <div 
                className="bg-white rounded-2xl shadow-sm border border-beige-dark/10 p-6 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleTabChange('messages')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Messages</p>
                    <p className="text-3xl font-serif text-gold-dark">{myMessages.length}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                    <MessageSquare size={24} className="text-gold-dark" />
                  </div>
                </div>
                <p className="text-xs text-gold-dark mt-2 flex items-center gap-1">
                  Voir mes messages →
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleTabChange('appointments')}
                className="bg-white rounded-2xl shadow-sm border border-beige-dark/10 p-4 text-left hover:shadow-md transition-shadow flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                  <CalendarRange size={24} className="text-gold-dark" />
                </div>
                <div>
                  <p className="font-medium text-charcoal">Prendre un rendez-vous</p>
                  <p className="text-sm text-gray-500">Consultez les disponibilités</p>
                </div>
              </button>

              <button
                onClick={() => handleTabChange('messages')}
                className="bg-white rounded-2xl shadow-sm border border-beige-dark/10 p-4 text-left hover:shadow-md transition-shadow flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                  <MessageSquare size={24} className="text-gold-dark" />
                </div>
                <div>
                  <p className="font-medium text-charcoal">Message au médecin</p>
                  <p className="text-sm text-gray-500">Une question ? Contactez-nous</p>
                </div>
              </button>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-beige-light">
      <ProfileHeader 
        patient={currentUser} 
        onLogout={handleLogout} 
        onTabChange={handleTabChange}
        activeTab={activeTab}
      />

      <div className="max-w-6xl mx-auto px-6 py-8">
        {renderContent()}
      </div>

      {/* Document Viewer Modal */}
      {selectedDocument && (
        <DocumentViewer 
          document={selectedDocument} 
          onClose={() => setSelectedDocument(null)} 
        />
      )}
    </div>
  );
}