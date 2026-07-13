import { useState } from 'react';
import { Calendar, Users, Clock, Plus, Check, X, ToggleLeft, ToggleRight } from 'lucide-react';
import DashboardLayout from '../../components/DashboardLayout';
import SidebarNav from '../../components/SidebarNav';
import GlassCard from '../../components/GlassCard';
import { useApp } from '../../context/AppContext';
import { DAY_LABELS, APPOINTMENT_SERVICES } from '../../data/mockData';

const TABS = [
  { id: 'appointments', label: 'Agenda & Rendez-vous', icon: Calendar },
  { id: 'patients', label: 'Fiches Patients', icon: Users },
  { id: 'schedule', label: 'Planning Médecin', icon: Clock },
];

export default function SecretaryDashboard() {
  const { appointments, patients, schedule, updateAppointmentStatus, updateSchedule, addAppointment } = useApp();
  const [activeTab, setActiveTab] = useState('appointments');
  const [showNewAppt, setShowNewAppt] = useState(false);
  const [newAppt, setNewAppt] = useState({ patientId: '', date: '', time: '', service: APPOINTMENT_SERVICES[0] });
  const [editingDay, setEditingDay] = useState(null);
  const [newSlot, setNewSlot] = useState('');

  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter((a) => a.date === today);
  const sortedAppointments = [...appointments].sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  const handleCreateAppointment = (e) => {
    e.preventDefault();
    const patient = patients.find((p) => p.id === newAppt.patientId);
    if (!patient) return;
    addAppointment({
      ...newAppt,
      patientName: patient.name,
      status: 'confirmed',
    });
    setShowNewAppt(false);
    setNewAppt({ patientId: '', date: '', time: '', service: APPOINTMENT_SERVICES[0] });
  };

  const toggleDay = (day) => {
    updateSchedule(day, { enabled: !schedule[day].enabled });
  };

  const addSlotToDay = (day) => {
    if (!newSlot || schedule[day].slots.includes(newSlot)) return;
    updateSchedule(day, { slots: [...schedule[day].slots, newSlot].sort() });
    setNewSlot('');
  };

  const removeSlot = (day, slot) => {
    updateSchedule(day, { slots: schedule[day].slots.filter((s) => s !== slot) });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'patients':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif text-charcoal border-b border-beige-dark/30 pb-3">Fiches Patients</h2>
            <div className="space-y-3">
              {patients.map((patient) => {
                const patientAppts = appointments.filter((a) => a.patientId === patient.id);
                return (
                  <GlassCard key={patient.id} className="!p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-sm text-gray-500">{patient.email} — {patient.phone}</p>
                        <p className="text-xs text-gray-400 mt-1">Né(e) le {patient.birthDate || 'N/A'}</p>
                      </div>
                      <span className="text-xs bg-beige-light px-2 py-1 rounded-full text-gold-dark">
                        {patientAppts.length} RDV
                      </span>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        );

      case 'schedule':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-serif text-charcoal border-b border-beige-dark/30 pb-3">Gestion du Planning Médecin</h2>
            <p className="text-sm text-gray-500">Configurez les jours et créneaux de disponibilité du Dr. Martin.</p>

            <div className="space-y-4">
              {Object.entries(DAY_LABELS).map(([day, label]) => (
                <GlassCard key={day} hover={false} className="!p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <button onClick={() => toggleDay(day)} className="text-gold-dark">
                        {schedule[day].enabled ? <ToggleRight size={24} /> : <ToggleLeft size={24} className="text-gray-400" />}
                      </button>
                      <span className={`font-medium ${schedule[day].enabled ? 'text-charcoal' : 'text-gray-400'}`}>{label}</span>
                    </div>
                    {schedule[day].enabled && (
                      <button
                        onClick={() => setEditingDay(editingDay === day ? null : day)}
                        className="text-sm text-gold-dark hover:text-gold"
                      >
                        {editingDay === day ? 'Fermer' : 'Modifier'}
                      </button>
                    )}
                  </div>

                  {schedule[day].enabled && (
                    <div className="flex flex-wrap gap-2">
                      {schedule[day].slots.map((slot) => (
                        <span key={slot} className="inline-flex items-center gap-1 bg-beige-light px-3 py-1 rounded-full text-sm">
                          {slot}
                          {editingDay === day && (
                            <button onClick={() => removeSlot(day, slot)} className="text-red-400 hover:text-red-600">
                              <X size={14} />
                            </button>
                          )}
                        </span>
                      ))}
                      {schedule[day].slots.length === 0 && (
                        <span className="text-sm text-gray-400 italic">Aucun créneau</span>
                      )}
                    </div>
                  )}

                  {editingDay === day && (
                    <div className="flex gap-2 mt-3">
                      <input
                        type="time"
                        value={newSlot}
                        onChange={(e) => setNewSlot(e.target.value)}
                        className="input-field w-auto"
                      />
                      <button onClick={() => addSlotToDay(day)} className="btn-secondary text-sm flex items-center gap-1">
                        <Plus size={14} />
                        Ajouter
                      </button>
                    </div>
                  )}
                </GlassCard>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-beige-dark/30 pb-3">
              <h2 className="text-2xl font-serif text-charcoal">Rendez-vous</h2>
              <button onClick={() => setShowNewAppt(!showNewAppt)} className="btn-secondary text-sm flex items-center gap-1">
                <Plus size={16} />
                Nouveau RDV
              </button>
            </div>

            {showNewAppt && (
              <GlassCard hover={false} className="animate-fade-in">
                <h3 className="font-serif text-lg text-gold-dark mb-4">Créer un rendez-vous</h3>
                <form onSubmit={handleCreateAppointment} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Patient</label>
                    <select
                      value={newAppt.patientId}
                      onChange={(e) => setNewAppt({ ...newAppt, patientId: e.target.value })}
                      required
                      className="input-field"
                    >
                      <option value="">Sélectionner</option>
                      {patients.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Service</label>
                    <select
                      value={newAppt.service}
                      onChange={(e) => setNewAppt({ ...newAppt, service: e.target.value })}
                      className="input-field"
                    >
                      {APPOINTMENT_SERVICES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Date</label>
                    <input
                      type="date"
                      value={newAppt.date}
                      onChange={(e) => setNewAppt({ ...newAppt, date: e.target.value })}
                      required
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Heure</label>
                    <input
                      type="time"
                      value={newAppt.time}
                      onChange={(e) => setNewAppt({ ...newAppt, time: e.target.value })}
                      required
                      className="input-field"
                    />
                  </div>
                  <button type="submit" className="btn-primary sm:col-span-2">Créer le rendez-vous</button>
                </form>
              </GlassCard>
            )}

            <div>
              <h3 className="font-serif text-lg text-gold-dark mb-3">Aujourd'hui ({today})</h3>
              {todayAppointments.length === 0 ? (
                <p className="text-gray-500 italic text-sm">Aucun rendez-vous planifié pour aujourd'hui.</p>
              ) : (
                <div className="space-y-2">
                  {todayAppointments.map((appt) => (
                    <AppointmentRow key={appt.id} appt={appt} onUpdateStatus={updateAppointmentStatus} />
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="font-serif text-lg text-gold-dark mb-3">Tous les rendez-vous</h3>
              <div className="space-y-2">
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
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        <SidebarNav items={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 glass-card min-h-[500px]">
          {renderContent()}
        </div>
      </div>
    </DashboardLayout>
  );
}

function AppointmentRow({ appt, onUpdateStatus }) {
  return (
    <div className="flex items-center justify-between p-3 bg-beige-light/50 rounded-lg hover:bg-beige-light transition-colors">
      <div>
        <p className="font-medium text-sm">{appt.patientName}</p>
        <p className="text-xs text-gray-500">{appt.date} à {appt.time} — {appt.service}</p>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-xs px-2 py-1 rounded-full ${
          appt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
          appt.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
          'bg-red-100 text-red-600'
        }`}>
          {appt.status === 'confirmed' ? 'Confirmé' : appt.status === 'pending' ? 'En attente' : 'Annulé'}
        </span>
        {appt.status === 'pending' && (
          <>
            <button onClick={() => onUpdateStatus(appt.id, 'confirmed')} className="p-1 text-green-600 hover:bg-green-50 rounded" title="Confirmer">
              <Check size={16} />
            </button>
            <button onClick={() => onUpdateStatus(appt.id, 'cancelled')} className="p-1 text-red-500 hover:bg-red-50 rounded" title="Annuler">
              <X size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
