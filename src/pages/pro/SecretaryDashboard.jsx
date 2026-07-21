import { useState } from 'react';
import {
  Calendar, Users, Clock, Plus, Check, X,
  ToggleLeft, ToggleRight, CalendarCheck, UserCheck, ClipboardList,
  ChevronRight, ArrowLeft, FileText, Phone, Mail,
  Cake, Stethoscope, FilePlus, FileCheck, FlaskConical, Download, Eye
} from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import TopNav from '../../components/TopNav';
import GlassCard from '../../components/GlassCard';
import { useApp } from '../../context/AppContext';
import { DAY_LABELS, APPOINTMENT_SERVICES } from '../../data/mockData';

const TABS = [
  { id: 'appointments', label: 'Agenda & Rendez-vous', icon: Calendar },
  { id: 'patients', label: 'Fiches Patients', icon: Users },
  { id: 'schedule', label: 'Planning Médecin', icon: Clock },
];

const DOC_TYPE_CONFIG = {
  prescription: { label: 'Ordonnance', icon: FileCheck, color: '#15803D', bg: '#DCFCE7' },
  quote:        { label: 'Devis',       icon: FilePlus,  color: '#1D4ED8', bg: '#DBEAFE' },
  analysis:     { label: 'Analyse',     icon: FlaskConical, color: '#7C3AED', bg: '#EDE9FE' },
};

/* ─── Document Viewer ───────────────────────────────────────────────────────── */
function DocViewer({ doc, patient, onClose }) {
  const today = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });

  const renderContent = () => {
    switch (doc.type) {
      case 'prescription':
        return (
          <div className="docview-paper">
            <div className="docview-clinic-header">
              <div>
                <p className="docview-clinic-name">Dr. BOUSIF SAMEH</p>
                <p className="docview-clinic-specialty">Médecine Esthétique & Dermatologie</p>
                <p className="docview-clinic-address">Bâtiment Bin Mahmoud, Sidi Bouzid — Tél: +216 51 714 714</p>
              </div>
              <div className="docview-logo-box">Rx</div>
            </div>
            <div className="docview-divider" />
            <div className="docview-meta-row">
              <span><strong>Patient :</strong> {patient.name}</span>
              <span><strong>Date :</strong> {doc.date}</span>
            </div>
            <h3 className="docview-section-title">Ordonnance Médicale</h3>
            <div className="docview-rx-list">
              <div className="docview-rx-item">
                <p className="rx-drug">① Crème hydratante SPF 50+</p>
                <p className="rx-posology">Appliquer matin et soir sur les zones traitées — Durée : 30 jours</p>
              </div>
              <div className="docview-rx-item">
                <p className="rx-drug">② Gel apaisant post-laser</p>
                <p className="rx-posology">2 applications par jour pendant 15 jours. Éviter le soleil direct.</p>
              </div>
              <div className="docview-rx-item">
                <p className="rx-drug">③ Complément vitamines C & E</p>
                <p className="rx-posology">1 comprimé par jour le matin au cours du repas — 1 mois</p>
              </div>
            </div>
            <div className="docview-divider" style={{ marginTop: 32 }} />
            <div className="docview-footer">
              <div>
                <p className="docview-note">⚠ Médicaments à usage externe sauf indication contraire.</p>
                <p className="docview-note">Prochain contrôle recommandé dans 3 semaines.</p>
              </div>
              <div className="docview-signature">
                <div className="signature-line" />
                <p>Dr. BOUSIF SAMEH</p>
              </div>
            </div>
          </div>
        );

      case 'quote':
        return (
          <div className="docview-paper">
            <div className="docview-clinic-header">
              <div>
                <p className="docview-clinic-name">Dr. BOUSIF SAMEH</p>
                <p className="docview-clinic-specialty">Médecine Esthétique & Dermatologie</p>
                <p className="docview-clinic-address">Bâtiment Bin Mahmoud, Sidi Bouzid — Tél: +216 51 714 714</p>
              </div>
              <div className="docview-logo-box" style={{ background: '#1D4ED8' }}>€</div>
            </div>
            <div className="docview-divider" />
            <div className="docview-meta-row">
              <span><strong>Patient :</strong> {patient.name}</span>
              <span><strong>Date :</strong> {doc.date}</span>
            </div>
            <h3 className="docview-section-title">Devis de Traitement</h3>
            <table className="docview-table">
              <thead>
                <tr>
                  <th>Prestation</th>
                  <th>Séances</th>
                  <th>Prix / séance</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Traitement laser cicatrices</td>
                  <td>4</td>
                  <td>350 DT</td>
                  <td>1 400 DT</td>
                </tr>
                <tr>
                  <td>Sérum régénérant post-laser</td>
                  <td>—</td>
                  <td>120 DT</td>
                  <td>120 DT</td>
                </tr>
                <tr>
                  <td>Consultation de suivi (×2)</td>
                  <td>2</td>
                  <td>80 DT</td>
                  <td>160 DT</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="table-total">
                  <td colSpan={3}><strong>Total estimatif TTC</strong></td>
                  <td><strong>1 680 DT</strong></td>
                </tr>
              </tfoot>
            </table>
            <p className="docview-note" style={{ marginTop: 16 }}>Ce devis est valable 30 jours à compter de sa date d'émission.</p>
            <div className="docview-footer" style={{ marginTop: 32 }}>
              <div>
                <p className="docview-note">Modalités de paiement : 50% à la réservation, 50% à la 1ère séance.</p>
              </div>
              <div className="docview-signature">
                <div className="signature-line" />
                <p>Dr. BOUSIF SAMEH</p>
              </div>
            </div>
          </div>
        );

      case 'analysis':
        return (
          <div className="docview-paper">
            <div className="docview-clinic-header">
              <div>
                <p className="docview-clinic-name">Laboratoire Médical Central</p>
                <p className="docview-clinic-specialty">Analyses biologiques & dermatologiques</p>
              </div>
              <div className="docview-logo-box" style={{ background: '#7C3AED' }}>🔬</div>
            </div>
            <div className="docview-divider" />
            <div className="docview-meta-row">
              <span><strong>Patient :</strong> {patient.name}</span>
              <span><strong>Date :</strong> {doc.date}</span>
            </div>
            <h3 className="docview-section-title">Résultats d'Analyse</h3>
            <table className="docview-table">
              <thead>
                <tr>
                  <th>Paramètre</th>
                  <th>Valeur</th>
                  <th>Référence</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Type de peau</td>
                  <td>Mixte</td>
                  <td>—</td>
                  <td><span className="result-normal">Normal</span></td>
                </tr>
                <tr>
                  <td>Sensibilité cutanée</td>
                  <td>Modérée</td>
                  <td>Faible — Modérée</td>
                  <td><span className="result-normal">✓ OK</span></td>
                </tr>
                <tr>
                  <td>Hydratation épidermique</td>
                  <td>62%</td>
                  <td>≥ 55%</td>
                  <td><span className="result-normal">✓ OK</span></td>
                </tr>
                <tr>
                  <td>Indice mélanine</td>
                  <td>28 UA</td>
                  <td>15–35 UA</td>
                  <td><span className="result-normal">Normal</span></td>
                </tr>
                <tr>
                  <td>Réactivité laser (type Fitzpatrick)</td>
                  <td>Type III</td>
                  <td>I–VI</td>
                  <td><span className="result-warn">⚠ Précaution</span></td>
                </tr>
              </tbody>
            </table>
            <p className="docview-note" style={{ marginTop: 16 }}>Peau de phototype III : traitement laser possible avec paramètres adaptés.</p>
            <div className="docview-footer" style={{ marginTop: 24 }}>
              <span />
              <div className="docview-signature">
                <div className="signature-line" />
                <p>Biologiste responsable</p>
              </div>
            </div>
          </div>
        );

      default:
        return <p className="docview-note">Aperçu non disponible pour ce type de document.</p>;
    }
  };

  return (
    <div className="docview-overlay" onClick={onClose}>
      <div className="docview-modal animate-fade-in" onClick={e => e.stopPropagation()}>
        <div className="docview-toolbar">
          <span className="docview-toolbar-title">
            <FileText size={16} /> {doc.name}
          </span>
          <button className="docview-close" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="docview-body">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

/* ─── Patient Folder Modal ────────────────────────────────────────────────── */
function PatientFolder({ patient, appointments, documents, onClose }) {
  const [folderTab, setFolderTab] = useState('rdv');
  const [previewDoc, setPreviewDoc] = useState(null);

  const patientAppts = appointments
    .filter(a => a.patientId === patient.id)
    .sort((a, b) => b.date.localeCompare(a.date));
  const patientDocs = documents.filter(d => d.patientId === patient.id);

  const handleDownload = (doc) => {
    // Simulate download with a text blob (replace with real URL in production)
    const blob = new Blob(
      [`Document: ${doc.name}\nType: ${doc.type}\nDate: ${doc.date}\nPar: ${doc.uploadedBy}`],
      { type: 'text/plain' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const initials = patient.name.split(' ').map(n => n[0]).join('').toUpperCase();

  const age = patient.birthDate
    ? Math.floor((Date.now() - new Date(patient.birthDate)) / (365.25 * 24 * 3600 * 1000))
    : null;

  return (
    <div className="folder-overlay" onClick={onClose}>
      <div className="folder-modal animate-fade-in" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="folder-header">
          <button className="folder-back" onClick={onClose}>
            <ArrowLeft size={18} /> Retour
          </button>
          <div className="folder-patient-hero">
            <div className="folder-avatar">{initials}</div>
            <div className="folder-patient-info">
              <h2 className="folder-patient-name">{patient.name}</h2>
              <div className="folder-patient-meta">
                {age && <span><Cake size={13} /> {age} ans</span>}
                <span><Mail size={13} /> {patient.email}</span>
                <span><Phone size={13} /> {patient.phone || '—'}</span>
              </div>
              {patient.birthDate && (
                <p className="folder-birthdate">Né(e) le {patient.birthDate}</p>
              )}
            </div>
          </div>

          {/* Folder tab bar */}
          <div className="folder-tabs">
            {[
              { id: 'rdv',  label: `Rendez-vous (${patientAppts.length})`, icon: Calendar },
              { id: 'docs', label: `Documents (${patientDocs.length})`,     icon: FileText },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setFolderTab(t.id)}
                className={`folder-tab ${folderTab === t.id ? 'folder-tab-active' : ''}`}
              >
                <t.icon size={15} /> {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="folder-body">
          {/* ─ RDV Tab ─ */}
          {folderTab === 'rdv' && (
            <div className="folder-section">
              {patientAppts.length === 0 ? (
                <div className="folder-empty">
                  <CalendarCheck size={36} />
                  <p>Aucun rendez-vous enregistré</p>
                </div>
              ) : (
                <div className="folder-rdv-list">
                  {patientAppts.map(appt => {
                    const statusConfig = {
                      confirmed: { label: 'Confirmé',  cls: 'status-confirmed' },
                      pending:   { label: 'En attente', cls: 'status-pending'   },
                      cancelled: { label: 'Annulé',    cls: 'status-cancelled'  },
                    };
                    const { label, cls } = statusConfig[appt.status] || statusConfig.pending;
                    return (
                      <div key={appt.id} className="folder-rdv-row">
                        <div className="rdv-icon-wrap">
                          <Stethoscope size={16} />
                        </div>
                        <div className="rdv-details">
                          <p className="rdv-service">{appt.service}</p>
                          <p className="rdv-datetime">{appt.date} à {appt.time}</p>
                        </div>
                        <span className={`status-badge ${cls}`}>{label}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ─ Documents Tab ─ */}
          {folderTab === 'docs' && (
            <div className="folder-section">
              {patientDocs.length === 0 ? (
                <div className="folder-empty">
                  <FileText size={36} />
                  <p>Aucun document enregistré</p>
                </div>
              ) : (
                <div className="folder-doc-list">
                  {patientDocs.map(doc => {
                    const cfg = DOC_TYPE_CONFIG[doc.type] || DOC_TYPE_CONFIG.prescription;
                    const Icon = cfg.icon;
                    return (
                      <div
                        key={doc.id}
                        className="folder-doc-row folder-doc-row-clickable"
                        onClick={() => setPreviewDoc(doc)}
                        title="Cliquer pour voir le document"
                      >
                        <div className="doc-icon-wrap" style={{ background: cfg.bg, color: cfg.color }}>
                          <Icon size={18} />
                        </div>
                        <div className="doc-details">
                          <p className="doc-name">{doc.name}</p>
                          <p className="doc-meta">
                            <span className="doc-type-badge" style={{ background: cfg.bg, color: cfg.color }}>
                              {cfg.label}
                            </span>
                            · {doc.date} · par {doc.uploadedBy}
                          </p>
                        </div>
                        <div className="doc-row-actions">
                          <span className="doc-preview-hint"><Eye size={14} /> Aperçu</span>
                          <button
                            className="doc-download-btn"
                            onClick={e => { e.stopPropagation(); handleDownload(doc); }}
                            title="Télécharger"
                          >
                            <Download size={15} />
                            Télécharger
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* Document Preview */}
      {previewDoc && (
        <DocViewer doc={previewDoc} patient={patient} onClose={() => setPreviewDoc(null)} />
      )}
    </div>
  );
}

/* ─── Main Dashboard ─────────────────────────────────────────────────────── */
export default function SecretaryDashboard() {
  const { appointments, patients, schedule, documents, updateAppointmentStatus, updateSchedule, addAppointment } = useApp();
  const [activeTab, setActiveTab] = useState('appointments');
  const [showNewAppt, setShowNewAppt] = useState(false);
  const [newAppt, setNewAppt] = useState({ patientId: '', date: '', time: '', service: APPOINTMENT_SERVICES[0] });
  const [editingDay, setEditingDay] = useState(null);
  const [newSlot, setNewSlot] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((a) => a.date === today);
  const sortedAppointments = [...appointments].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  const pendingCount = appointments.filter(a => a.status === 'pending').length;
  const confirmedCount = appointments.filter(a => a.status === 'confirmed').length;

  const handleCreateAppointment = (e) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === newAppt.patientId);
    if (!patient) return;
    addAppointment({ ...newAppt, patientName: patient.name, status: 'confirmed' });
    setShowNewAppt(false);
    setNewAppt({ patientId: '', date: '', time: '', service: APPOINTMENT_SERVICES[0] });
  };

  const toggleDay = (day) => updateSchedule(day, { enabled: !schedule[day].enabled });

  const addSlotToDay = (day) => {
    if (!newSlot || schedule[day].slots.includes(newSlot)) return;
    updateSchedule(day, { slots: [...schedule[day].slots, newSlot].sort() });
    setNewSlot('');
  };

  const removeSlot = (day, slot) =>
    updateSchedule(day, { slots: schedule[day].slots.filter((s) => s !== slot) });

  const renderContent = () => {
    switch (activeTab) {
      case 'patients':
        return (
          <div className="dashboard-section">
            <div className="section-header">
              <div className="section-title-group">
                <UserCheck size={22} className="section-icon" />
                <h2 className="section-title">Fiches Patients</h2>
              </div>
              <span className="section-badge">{patients.length} patients</span>
            </div>

            <div className="patients-grid">
              {patients.map((patient) => {
                const patientAppts = appointments.filter((a) => a.patientId === patient.id);
                const initials = patient.name.split(' ').map(n => n[0]).join('').toUpperCase();
                return (
                  <button
                    key={patient.id}
                    className="patient-card"
                    onClick={() => setSelectedPatient(patient)}
                    title="Voir le dossier patient"
                  >
                    <div className="patient-avatar">{initials}</div>
                    <div className="patient-info">
                      <p className="patient-name">{patient.name}</p>
                      <p className="patient-email">{patient.email}</p>
                      <p className="patient-phone">{patient.phone}</p>
                      {patient.birthDate && <p className="patient-birth">Né(e) le {patient.birthDate}</p>}
                    </div>
                    <div className="patient-card-right">
                      <div className="patient-rdv-badge">
                        <CalendarCheck size={13} />
                        <span>{patientAppts.length} RDV</span>
                      </div>
                      <div className="patient-open-hint">
                        <ChevronRight size={15} /> Voir dossier
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 'schedule':
        return (
          <div className="dashboard-section">
            <div className="section-header">
              <div className="section-title-group">
                <ClipboardList size={22} className="section-icon" />
                <div>
                  <h2 className="section-title">Planning Médecin</h2>
                  <p className="section-subtitle">Configurez les jours et créneaux de disponibilité du Dr. Martin.</p>
                </div>
              </div>
            </div>

            <div className="schedule-grid">
              {Object.entries(DAY_LABELS).map(([day, label]) => (
                <div key={day} className={`schedule-day-card ${schedule[day].enabled ? 'day-enabled' : 'day-disabled'}`}>
                  <div className="day-header">
                    <div className="day-toggle-group">
                      <button onClick={() => toggleDay(day)} className="toggle-btn">
                        {schedule[day].enabled
                          ? <ToggleRight size={26} className="toggle-on" />
                          : <ToggleLeft size={26} className="toggle-off" />}
                      </button>
                      <span className="day-label">{label}</span>
                    </div>
                    {schedule[day].enabled && (
                      <button onClick={() => setEditingDay(editingDay === day ? null : day)} className="day-edit-btn">
                        {editingDay === day ? 'Fermer' : 'Modifier'}
                      </button>
                    )}
                  </div>

                  {schedule[day].enabled && (
                    <div className="slots-container">
                      {schedule[day].slots.map((slot) => (
                        <span key={slot} className="time-slot">
                          {slot}
                          {editingDay === day && (
                            <button onClick={() => removeSlot(day, slot)} className="slot-remove">
                              <X size={12} />
                            </button>
                          )}
                        </span>
                      ))}
                      {schedule[day].slots.length === 0 && <span className="no-slots">Aucun créneau</span>}
                    </div>
                  )}

                  {editingDay === day && (
                    <div className="add-slot-row">
                      <input type="time" value={newSlot}
                        onChange={(e) => setNewSlot(e.target.value)}
                        className="input-field slot-input" />
                      <button onClick={() => addSlotToDay(day)} className="btn-gold add-slot-btn">
                        <Plus size={14} /> Ajouter
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="dashboard-section">
            {/* Stats */}
            <div className="stats-row">
              <div className="stat-card stat-gold">
                <CalendarCheck size={20} className="stat-icon" />
                <div><p className="stat-value">{appointments.length}</p><p className="stat-label">Total RDV</p></div>
              </div>
              <div className="stat-card stat-green">
                <Check size={20} className="stat-icon" />
                <div><p className="stat-value">{confirmedCount}</p><p className="stat-label">Confirmés</p></div>
              </div>
              <div className="stat-card stat-yellow">
                <Clock size={20} className="stat-icon" />
                <div><p className="stat-value">{pendingCount}</p><p className="stat-label">En attente</p></div>
              </div>
              <div className="stat-card stat-blue">
                <Users size={20} className="stat-icon" />
                <div><p className="stat-value">{patients.length}</p><p className="stat-label">Patients</p></div>
              </div>
            </div>

            {/* Header */}
            <div className="section-header">
              <div className="section-title-group">
                <Calendar size={22} className="section-icon" />
                <h2 className="section-title">Rendez-vous</h2>
              </div>
              <button onClick={() => setShowNewAppt(!showNewAppt)} className="btn-new-rdv">
                <Plus size={16} /> Nouveau RDV
              </button>
            </div>

            {/* New RDV form */}
            {showNewAppt && (
              <div className="new-appt-form animate-fade-in">
                <h3 className="form-title">Créer un rendez-vous</h3>
                <form onSubmit={handleCreateAppointment} className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Patient</label>
                    <select value={newAppt.patientId}
                      onChange={(e) => setNewAppt({ ...newAppt, patientId: e.target.value })}
                      required className="input-field">
                      <option value="">Sélectionner un patient</option>
                      {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Service</label>
                    <select value={newAppt.service}
                      onChange={(e) => setNewAppt({ ...newAppt, service: e.target.value })}
                      className="input-field">
                      {APPOINTMENT_SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input type="date" value={newAppt.date}
                      onChange={(e) => setNewAppt({ ...newAppt, date: e.target.value })}
                      required className="input-field" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Heure</label>
                    <input type="time" value={newAppt.time}
                      onChange={(e) => setNewAppt({ ...newAppt, time: e.target.value })}
                      required className="input-field" />
                  </div>
                  <button type="submit" className="btn-primary form-submit">Créer le rendez-vous</button>
                </form>
              </div>
            )}

            {/* Today */}
            <div className="appt-section">
              <div className="appt-section-header">
                <h3 className="appt-section-title">
                  <span className="today-dot" /> Aujourd'hui ({today})
                </h3>
                <span className="appt-count">{todayAppointments.length} rendez-vous</span>
              </div>
              {todayAppointments.length === 0 ? (
                <div className="empty-state">
                  <CalendarCheck size={32} className="empty-icon" />
                  <p>Aucun rendez-vous planifié pour aujourd'hui</p>
                </div>
              ) : (
                <div className="appt-list">
                  {todayAppointments.map((appt) => (
                    <AppointmentRow key={appt.id} appt={appt} onUpdateStatus={updateAppointmentStatus} />
                  ))}
                </div>
              )}
            </div>

            {/* All */}
            <div className="appt-section">
              <div className="appt-section-header">
                <h3 className="appt-section-title">
                  <ChevronRight size={16} /> Tous les rendez-vous
                </h3>
                <span className="appt-count">{sortedAppointments.length} au total</span>
              </div>
              <div className="appt-list">
                {sortedAppointments.map((appt) => (
                  <AppointmentRow key={appt.id} appt={appt} onUpdateStatus={updateAppointmentStatus} />
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <DashboardLayout title="Espace Secrétariat" subtitle="Gestion du cabinet" variant="dark">
      <div className="secretary-dashboard">
        <TopNav items={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="dashboard-content">
          {renderContent()}
        </div>
      </div>

      {/* Patient Folder Overlay */}
      {selectedPatient && (
        <PatientFolder
          patient={selectedPatient}
          appointments={appointments}
          documents={documents}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </DashboardLayout>
  );
}

function AppointmentRow({ appt, onUpdateStatus }) {
  const statusConfig = {
    confirmed: { label: 'Confirmé',  cls: 'status-confirmed' },
    pending:   { label: 'En attente', cls: 'status-pending'   },
    cancelled: { label: 'Annulé',    cls: 'status-cancelled'  },
  };
  const { label, cls } = statusConfig[appt.status] || statusConfig.pending;

  return (
    <div className="appt-row">
      <div className="appt-avatar">
        {appt.patientName.split(' ').map(n => n[0]).join('').toUpperCase()}
      </div>
      <div className="appt-details">
        <p className="appt-patient">{appt.patientName}</p>
        <p className="appt-meta">{appt.date} à {appt.time} — {appt.service}</p>
      </div>
      <div className="appt-actions">
        <span className={`status-badge ${cls}`}>{label}</span>
        {appt.status === 'pending' && (
          <>
            <button onClick={() => onUpdateStatus(appt.id, 'confirmed')} className="action-btn action-confirm" title="Confirmer">
              <Check size={15} />
            </button>
            <button onClick={() => onUpdateStatus(appt.id, 'cancelled')} className="action-btn action-cancel" title="Annuler">
              <X size={15} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
