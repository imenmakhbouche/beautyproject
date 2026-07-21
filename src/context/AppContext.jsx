import { createContext, useContext, useState, useCallback } from 'react';
import {
  INITIAL_PATIENTS,
  INITIAL_APPOINTMENTS,
  INITIAL_DOCUMENTS,
  INITIAL_MESSAGES,
  INITIAL_SCHEDULE,
} from '../data/mockData';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [patients, setPatients] = useState(INITIAL_PATIENTS);
  const [appointments, setAppointments] = useState(INITIAL_APPOINTMENTS);
  const [documents, setDocuments] = useState(INITIAL_DOCUMENTS);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [schedule, setSchedule] = useState(INITIAL_SCHEDULE);
  const [prescriptions, setPrescriptions] = useState([]);

  const loginPatient = useCallback((email, password, isRegister = false, name = '') => {
    let patient = patients.find((p) => p.email === email);
    if (isRegister) {
      if (patient) return { success: false, error: 'Cet email est déjà utilisé.' };
      patient = {
        id: `p${Date.now()}`,
        name: name || 'Nouveau Patient',
        email,
        phone: '',
        birthDate: '',
      };
      setPatients((prev) => [...prev, patient]);
    } else if (!patient) {
      patient = patients[0];
    }
    setCurrentUser({ role: 'patient', ...patient });
    return { success: true };
  }, [patients]);

  const loginPro = useCallback((email) => {
    const role = email.includes('secretaire') ? 'secretary' : 'doctor';
    setCurrentUser({
      role,
      name: role === 'secretary' ? 'Secrétaire Clinique' : 'Dr. Sophie Martin',
      email,
    });
    return { success: true };
  }, []);

  const logout = useCallback(() => setCurrentUser(null), []);

  const addAppointment = useCallback((appointment) => {
    const newAppt = { ...appointment, id: `a${Date.now()}`, status: 'pending' };
    setAppointments((prev) => [...prev, newAppt]);
    return newAppt;
  }, []);

  const updateAppointmentStatus = useCallback((id, status) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  }, []);

  const addDocument = useCallback((doc) => {
    const newDoc = { ...doc, id: `d${Date.now()}`, date: new Date().toISOString().split('T')[0] };
    setDocuments((prev) => [...prev, newDoc]);
    return newDoc;
  }, []);

  const sendMessage = useCallback((patientId, sender, text) => {
    const msg = {
      id: `m${Date.now()}`,
      patientId,
      sender,
      text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);
    return msg;
  }, []);

  const updateSchedule = useCallback((day, updates) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], ...updates },
    }));
  }, []);

  const addPrescription = useCallback((prescription) => {
    const newRx = { ...prescription, id: `rx${Date.now()}`, date: new Date().toISOString().split('T')[0] };
    setPrescriptions((prev) => [...prev, newRx]);
    addDocument({
      patientId: prescription.patientId,
      name: `Ordonnance - ${prescription.patientName}.pdf`,
      type: 'prescription',
      uploadedBy: 'doctor',
    });
    return newRx;
  }, [addDocument]);

  return (
    <AppContext.Provider
      value={{
        currentUser,
        patients,
        appointments,
        documents,
        messages,
        schedule,
        prescriptions,
        loginPatient,
        loginPro,
        logout,
        addAppointment,
        updateAppointmentStatus,
        addDocument,
        sendMessage,
        updateSchedule,
        addPrescription,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
