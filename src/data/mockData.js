export const CLINIC_INFO = {
  phone: '+216 51 714 714',
  address: 'Bâtiment Bin Mahmoud, en face du restaurant Ali Baba, 2e étage , Sidi Bouzid',
  mapsEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3285.234567890123!2d9.484200!3d35.035600!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12578c9c0e528729%3A0x3f3c9b0e5d5b0c0!2sB%C3%A2timent+Bin+Mahmoud%2C+Sidi+Bouzid!5e0!3m2!1sfr!2stn!4v1700000000000!5m2!1sfr!2stn',
  mapsLink: 'https://www.google.com/maps/place/B%C3%A2timent+Bin+Mahmoud,+Sidi+Bouzid/@35.0356,9.4842,17z/data=!3m1!4b1!4m6!3m5!1s0x12578c9c0e528729:0x3f3c9b0e5d5b0c0!8m2!3d35.0356!4d9.4842!16s%2Fg%2F11bw8d5c9v?entry=ttu',
};

export const SERVICES = [
  {
    id: 1,
    title: 'Traitement des cicatrices au laser',
    description: 'Traitements personnalisés pour une peau éclatante et rajeunie.',
    icon: 'sparkles',
    introduction: "Nos traitements des cicatrices au laser associent technologie de pointe et expertise médicale pour améliorer l'apparence de la peau. Chaque séance est personnalisée selon le type de cicatrice et les besoins de votre peau, afin de favoriser sa régénération et de retrouver une peau plus lisse, uniforme et harmonieuse.",
    image: 'https://via.placeholder.com/150',
    benefits: [
      'Atténuation visible des cicatrices et des imperfections',
      'Stimulation naturelle de la régénération de la peau',
      'Traitement personnalisé selon le type et la profondeur des cicatrices',
      'Technologie laser avancée pour des résultats sûrs et durables',
    ],
  },
  {
    id: 2,
    title: 'Épilation au laser du visage et du corps',
    description: 'Injections, peelings et soins avancés par le Dr. Martin.',
    icon: 'syringe',
    introduction: 'Notre service d’épilation au laser du visage et du corps associe technologie de pointe et expertise professionnelle pour une réduction durable de la pilosité. Chaque traitement est personnalisé selon votre type de peau et de poils afin d’offrir des résultats efficaces, une peau plus lisse et un confort optimal en toute sécurité.',
    benefits: [
      'Réduction durable de la pilosité indésirable',
      'Peau plus lisse et confortable au quotidien',
      'Traitement personnalisé selon votre type de peau et de poils',
      'Technologie laser de pointe pour une épilation précise et sécurisée',
    ],
  },
  {
    id: 3,
    title: 'Détatouage au laser',
    description: 'Technologies de pointe pour l\'épilation et les imperfections.',
    icon: 'zap',
    introduction: 'Notre service de détatouage au laser utilise une technologie de pointe pour éliminer progressivement les tatouages de manière sûre et efficace. Chaque traitement est adapté à votre type de peau, ainsi qu’à la couleur et à la profondeur du tatouage, afin d’obtenir les meilleurs résultats tout en préservant la santé de votre peau.',
    benefits: [
      'Élimination progressive des tatouages indésirables',
      'Traitement adapté à tous les types de peau',
      'Technologie laser de haute précision pour un maximum de sécurité',
      'Résultats progressifs avec un respect optimal de la peau',
    ],
  },
];

export const DOCTOR_INFO = {
  name: 'Dr. BOUSIF SAMEH',
  specialty: 'Médecine Esthétique & Dermatologie',
  bio: 'Plus de 15 ans d\'expérience dans les soins esthétiques. Diplômée de la Faculté de medecine de Marsilia, le Dr. BOUSIF accompagne chaque patient avec une approche personnalisée et bienveillante.',
  achievements: ['Membre de la Société Française de Médecine Esthétique', '5000+ patients satisfaits', 'Certification Laser Avancée'],
};

export const INITIAL_PATIENTS = [
  { id: 'p1', name: 'Jean Dupont', email: 'jean.dupont@email.com', phone: '06 12 34 56 78', birthDate: '1985-03-15' },
  { id: 'p2', name: 'Marie Laurent', email: 'marie.laurent@email.com', phone: '06 98 76 54 32', birthDate: '1990-07-22' },
  { id: 'p3', name: 'Claire Bernard', email: 'claire.bernard@email.com', phone: '06 55 44 33 22', birthDate: '1978-11-08' },
];

export const INITIAL_APPOINTMENTS = [
  { id: 'a1', patientId: 'p1', patientName: 'Jean Dupont', date: '2026-07-15', time: '10:00', service: 'Consultation', status: 'confirmed' },
  { id: 'a2', patientId: 'p2', patientName: 'Marie Laurent', date: '2026-07-15', time: '14:30', service: 'Soins du Visage', status: 'confirmed' },
  { id: 'a3', patientId: 'p3', patientName: 'Claire Bernard', date: '2026-07-16', time: '09:00', service: 'Médecine Esthétique', status: 'pending' },
];

export const INITIAL_DOCUMENTS = [
  { id: 'd1', patientId: 'p1', name: 'Ordonnance - Crème hydratante.pdf', type: 'prescription', date: '2026-06-20', uploadedBy: 'doctor' },
  { id: 'd2', patientId: 'p1', name: 'Devis - Traitement laser.pdf', type: 'quote', date: '2026-06-15', uploadedBy: 'secretary' },
  { id: 'd3', patientId: 'p2', name: 'Résultats analyse.pdf', type: 'analysis', date: '2026-07-01', uploadedBy: 'patient' },
];

export const INITIAL_MESSAGES = [
  { id: 'm1', patientId: 'p1', sender: 'patient', text: 'Bonjour Docteur, j\'ai une question sur ma crème prescrite.', timestamp: '2026-07-10T09:30:00' },
  { id: 'm2', patientId: 'p1', sender: 'doctor', text: 'Bonjour Jean, n\'hésitez pas à m\'appeler au cabinet ou à préciser votre question ici.', timestamp: '2026-07-10T11:00:00' },
  { id: 'm3', patientId: 'p2', sender: 'patient', text: 'Puis-je décaler mon rendez-vous de demain ?', timestamp: '2026-07-11T16:45:00' },
];

export const INITIAL_SCHEDULE = {
  monday: { enabled: true, slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
  tuesday: { enabled: true, slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
  wednesday: { enabled: true, slots: ['09:00', '10:00', '14:00', '15:00', '16:00'] },
  thursday: { enabled: true, slots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'] },
  friday: { enabled: true, slots: ['09:00', '10:00', '11:00'] },
  saturday: { enabled: false, slots: [] },
  sunday: { enabled: false, slots: [] },
};

export const DAY_LABELS = {
  monday: 'Lundi',
  tuesday: 'Mardi',
  wednesday: 'Mercredi',
  thursday: 'Jeudi',
  friday: 'Vendredi',
  saturday: 'Samedi',
  sunday: 'Dimanche',
};

export const APPOINTMENT_SERVICES = [
  'Consultation',
  'Soins du Visage',
  'Médecine Esthétique',
  'Consultation Laser',
  'Suivi post-traitement',
];

export function getAvailableDates(schedule, daysAhead = 14) {
  const dates = [];
  const today = new Date();
  const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  for (let i = 1; i <= daysAhead; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dayKey = dayKeys[date.getDay()];
    if (schedule[dayKey]?.enabled) {
      dates.push({
        date: date.toISOString().split('T')[0],
        dayKey,
        label: date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }),
      });
    }
  }
  return dates;
}

export function getBookedSlots(appointments, date) {
  return appointments
    .filter((a) => a.date === date && a.status !== 'cancelled')
    .map((a) => a.time);
}
