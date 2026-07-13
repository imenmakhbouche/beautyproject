import { useState } from 'react';
import { Calendar, FolderOpen, FilePlus, Mail, Search, FileText, Send, CheckCircle } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SidebarNav from '../../components/SidebarNav';
import GlassCard from '../../components/GlassCard';
import { useApp } from '../../context/AppContext';

const TABS = [
  { id: 'appointments', label: 'Mes Rendez-vous', icon: Calendar },
  { id: 'folders', label: 'Dossiers Patients', icon: FolderOpen },
  { id: 'prescriptions', label: 'Créer une Ordonnance', icon: FilePlus },
  { id: 'messages', label: 'Messagerie Patients', icon: Mail },
];

export default function DoctorDashboard() {
  const { patients, appointments, documents, messages, prescriptions, sendMessage, addPrescription } = useApp();
  const [activeTab, setActiveTab] = useState('folders');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [rxPatientId, setRxPatientId] = useState('');
  const [rxNotes, setRxNotes] = useState('');
  const [rxSuccess, setRxSuccess] = useState(false);
  const [messagePatientId, setMessagePatientId] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedPatientDocs = selectedPatient
    ? documents.filter((d) => d.patientId === selectedPatient.id)
    : [];

  const selectedPatientAppts = selectedPatient
    ? appointments.filter((a) => a.patientId === selectedPatient.id)
    : [];

  const handleCreatePrescription = (e) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === rxPatientId);
    if (!patient || !rxNotes.trim()) return;

    addPrescription({
      patientId: patient.id,
      patientName: patient.name,
      notes: rxNotes.trim(),
    });
    setRxSuccess(true);
    setRxNotes('');
    setRxPatientId('');
    setTimeout(() => setRxSuccess(false), 3000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messagePatientId || !newMessage.trim()) return;
    sendMessage(messagePatientId, 'doctor', newMessage.trim());
    setNewMessage('');
  };

  const patientMessages = messagePatientId
    ? messages.filter((m) => m.patientId === messagePatientId)
    : [];

  const renderContent = () => {
    switch (activeTab) {
      case 'appointments':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif text-charcoal border-b border-beige-dark/30 pb-3">Mes Rendez-vous</h2>
            <div className="space-y-2">
              {appointments
                .filter((a) => a.status !== 'cancelled')
                .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
                .map((appt) => (
                  <div key={appt.id} className="flex justify-between items-center p-3 bg-beige-light/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{appt.patientName}</p>
                      <p className="text-xs text-gray-500">{appt.date} à {appt.time} — {appt.service}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      appt.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {appt.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        );

      case 'prescriptions':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif text-charcoal border-b border-beige-dark/30 pb-3">Générateur d'Ordonnances</h2>

            {rxSuccess && (
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-3 rounded-lg animate-fade-in">
                <CheckCircle size={18} />
                Ordonnance créée et envoyée au dossier patient !
              </div>
            )}

            <GlassCard hover={false}>
              <form onSubmit={handleCreatePrescription} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Sélectionner le patient</label>
                  <select
                    value={rxPatientId}
                    onChange={(e) => setRxPatientId(e.target.value)}
                    required
                    className="input-field"
                  >
                    <option value="">Choisir un patient</option>
                    {patients.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Notes / Prescription</label>
                  <textarea
                    value={rxNotes}
                    onChange={(e) => setRxNotes(e.target.value)}
                    required
                    rows={6}
                    placeholder="Rédigez l'ordonnance ici..."
                    className="input-field resize-none"
                  />
                </div>
                <button type="submit" className="btn-gold flex items-center gap-2">
                  <FilePlus size={18} />
                  Générer et envoyer l'ordonnance
                </button>
              </form>
            </GlassCard>

            {prescriptions.length > 0 && (
              <div>
                <h3 className="font-serif text-lg text-gold-dark mb-3">Ordonnances récentes</h3>
                <div className="space-y-2">
                  {prescriptions.map((rx) => (
                    <GlassCard key={rx.id} className="!p-4">
                      <p className="font-medium text-sm">{rx.patientName} — {rx.date}</p>
                      <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{rx.notes}</p>
                    </GlassCard>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'messages':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif text-charcoal border-b border-beige-dark/30 pb-3">Messagerie Patients</h2>

            <div>
              <label className="block text-sm font-medium mb-1">Sélectionner un patient</label>
              <select
                value={messagePatientId}
                onChange={(e) => setMessagePatientId(e.target.value)}
                className="input-field"
              >
                <option value="">Choisir un patient</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {messagePatientId && (
              <GlassCard hover={false} className="!p-0 overflow-hidden">
                <div className="h-72 overflow-y-auto p-4 space-y-3">
                  {patientMessages.length === 0 ? (
                    <p className="text-gray-500 italic text-sm text-center mt-16">Aucun message avec ce patient.</p>
                  ) : (
                    patientMessages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                          msg.sender === 'doctor'
                            ? 'bg-gold-dark text-white rounded-br-sm'
                            : 'bg-beige-light text-charcoal rounded-bl-sm'
                        }`}>
                          <p>{msg.text}</p>
                          <p className={`text-xs mt-1 ${msg.sender === 'doctor' ? 'text-gold/60' : 'text-gray-500'}`}>
                            {new Date(msg.timestamp).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-2 p-4 border-t border-beige-dark/20">
                  <input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Répondre au patient..."
                    className="input-field flex-1"
                  />
                  <button type="submit" className="btn-gold flex items-center gap-1 shrink-0">
                    <Send size={16} />
                    Envoyer
                  </button>
                </form>
              </GlassCard>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif text-charcoal border-b border-beige-dark/30 pb-3">Recherche Dossier Patient</h2>

            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setSelectedPatient(null); }}
                placeholder="Nom du patient..."
                className="input-field pl-10"
              />
            </div>

            {!selectedPatient ? (
              <div className="space-y-2">
                {filteredPatients.length === 0 ? (
                  <p className="text-gray-500 italic">Aucun patient trouvé.</p>
                ) : (
                  filteredPatients.map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                      className="w-full text-left p-4 bg-beige-light/50 rounded-lg hover:bg-beige-light transition-colors"
                    >
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-gray-500">{patient.email}</p>
                    </button>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                <button onClick={() => setSelectedPatient(null)} className="text-sm text-gold-dark hover:text-gold">
                  ← Retour à la recherche
                </button>

                <GlassCard hover={false}>
                  <h3 className="font-serif text-xl text-gold-dark">{selectedPatient.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">{selectedPatient.email} — {selectedPatient.phone}</p>
                  <p className="text-xs text-gray-400">Né(e) le {selectedPatient.birthDate || 'N/A'}</p>
                </GlassCard>

                <div>
                  <h4 className="font-serif text-lg text-charcoal mb-3">Historique des rendez-vous</h4>
                  {selectedPatientAppts.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">Aucun rendez-vous.</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedPatientAppts.map((appt) => (
                        <div key={appt.id} className="p-3 bg-beige-light/50 rounded-lg text-sm">
                          {appt.date} à {appt.time} — {appt.service} ({appt.status})
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-serif text-lg text-charcoal mb-3">Documents</h4>
                  {selectedPatientDocs.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">Aucun document.</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedPatientDocs.map((doc) => (
                        <div key={doc.id} className="flex items-center gap-3 p-3 bg-beige-light/50 rounded-lg">
                          <FileText size={18} className="text-gold-dark" />
                          <div>
                            <p className="text-sm font-medium">{doc.name}</p>
                            <p className="text-xs text-gray-500">{doc.date} — {doc.type}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <DashboardLayout title="Espace Médecin" subtitle="Dr. Sophie Martin" variant="dark">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        <SidebarNav items={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 glass-card min-h-[500px]">
          {renderContent()}
        </div>
      </div>
    </DashboardLayout>
  );
}
