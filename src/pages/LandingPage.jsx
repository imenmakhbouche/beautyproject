import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarHeart,
  Stethoscope,
  Sparkles,
  Syringe,
  Zap,
  Award,
  Users,
  Star,
  Phone,
  MapPin,
  CheckCircle,
  X,
} from 'lucide-react';
import { SERVICES, DOCTOR_INFO, CLINIC_INFO } from '../data/mockData';

const iconMap = { sparkles: Sparkles, syringe: Syringe, zap: Zap };

export default function LandingPage() {
  const [selectedService, setSelectedService] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const activeService = SERVICES.find((s) => s.id === selectedService);

  const handleServiceClick = (serviceId) => {
    setSelectedService((prev) => (prev === serviceId ? null : serviceId));
  };

  return (
    <div className="min-h-screen">
      {/* Contact bar */}
      <div className="bg-charcoal text-white px-4 py-3">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm">
          <a
            href={`tel:${CLINIC_INFO.phone.replace(/\s/g, '')}`}
            className="flex items-center gap-2 hover:text-gold transition-colors"
          >
            <Phone size={16} className="text-gold shrink-0" />
            <span>{CLINIC_INFO.phone}</span>
          </a>
          <button
            type="button"
            onClick={() => setShowMap((prev) => !prev)}
            className="flex items-center gap-2 hover:text-gold transition-colors text-left"
          >
            <MapPin size={16} className="text-gold shrink-0" />
            <span className="underline underline-offset-2 decoration-gold/50">{CLINIC_INFO.address}</span>
          </button>
        </div>
      </div>

      {/* Map panel */}
      {showMap && (
        <div className="relative bg-beige-light border-b border-beige-dark/30 animate-fade-in">
          <div className="max-w-5xl mx-auto p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-serif text-lg text-charcoal flex items-center gap-2">
                <MapPin size={18} className="text-gold-dark" />
                Localisation du cabinet
              </h3>
              <button
                type="button"
                onClick={() => setShowMap(false)}
                className="p-1.5 rounded-lg hover:bg-beige-dark/30 text-gray-500 hover:text-charcoal transition-colors"
                aria-label="Fermer la carte"
              >
                <X size={20} />
              </button>
            </div>
            <div className="rounded-xl overflow-hidden shadow-lg border border-beige-dark/30">
              <iframe
                title="Carte du cabinet Clinique Beauté Élégance"
                src={CLINIC_INFO.mapsEmbedUrl}
                width="100%"
                height="320"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a
              href={CLINIC_INFO.mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-3 text-sm text-gold-dark hover:text-gold font-medium transition-colors"
            >
              <MapPin size={14} />
              Ouvrir dans Google Maps
            </a>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-beige-light via-blanc-casse to-beige px-6 py-20 text-center overflow-hidden">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_20%,#D4AF37_0%,transparent_50%)]" />
        <div className="relative max-w-4xl mx-auto space-y-6 animate-fade-in">
          <p className="text-gold-dark font-medium tracking-widest uppercase text-sm">Clinique Esthétique Premium</p>
          <h1 className="text-5xl md:text-6xl text-charcoal font-serif">Clinique Beauté Élégance</h1>
          <p className="text-xl max-w-2xl mx-auto text-charcoal/80 leading-relaxed">
            Découvrez nos services esthétiques et prenez rendez-vous avec notre médecin expert pour sublimer votre beauté naturelle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link to="/patient/login" className="btn-primary flex items-center justify-center gap-2 shadow-lg">
              <CalendarHeart size={20} />
              Espace Patient
            </Link>
            <Link to="/pro/login" className="btn-secondary flex items-center justify-center gap-2 shadow-lg font-medium">
              <Stethoscope size={20} />
              Accès Professionnel
            </Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-serif text-center text-gold-dark mb-4">Nos Services</h2>
          <p className="text-center text-gray-500 text-sm mb-10">
            Cliquez sur un service pour découvrir son introduction et ses bénéfices
          </p>

          {/* Service detail panel — appears above cards */}
          {activeService && (
            <div className="glass-card mb-8 animate-fade-in border-l-4 border-gold">
              <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = iconMap[activeService.icon];
                    return (
                      <div className="w-12 h-12 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
                        <Icon size={24} className="text-gold-dark" />
                      </div>
                    );
                  })()}
                  <h3 className="font-serif text-2xl text-gold-dark">{activeService.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedService(null)}
                  className="p-1.5 rounded-lg hover:bg-beige-light text-gray-400 hover:text-charcoal transition-colors shrink-0"
                  aria-label="Fermer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-charcoal/60 mb-2">Introduction</h4>
                  <p className="text-charcoal/80 leading-relaxed">{activeService.introduction}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-charcoal/60 mb-3">Bénéfices</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {activeService.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2 text-sm text-charcoal/80">
                        <CheckCircle size={16} className="text-gold shrink-0 mt-0.5" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  to="/patient/login"
                  className="btn-gold inline-flex items-center gap-2 text-sm mt-2"
                >
                  <CalendarHeart size={16} />
                  Prendre rendez-vous pour ce service
                </Link>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SERVICES.map((service) => {
              const Icon = iconMap[service.icon];
              const isActive = selectedService === service.id;
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => handleServiceClick(service.id)}
                  className={`glass-card text-center group w-full cursor-pointer text-left transition-all duration-300 ${
                    isActive
                      ? 'ring-2 ring-gold shadow-xl -translate-y-1'
                      : 'hover:shadow-xl hover:-translate-y-0.5'
                  }`}
                >
                  <div className={`w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors duration-300 ${
                    isActive ? 'bg-gold/25' : 'bg-beige-light group-hover:bg-gold/20'
                  }`}>
                    <Icon size={28} className="text-gold-dark" />
                  </div>
                  <h3 className="font-serif text-xl text-charcoal mb-2">{service.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
                  <p className="text-xs text-gold-dark mt-3 font-medium">
                    {isActive ? 'Masquer les détails ↑' : 'Voir introduction & bénéfices →'}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Doctor */}
      <section className="px-6 py-16 bg-beige-light">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-10 items-center">
          <div className="w-48 h-48 rounded-full bg-gradient-to-br from-gold/30 to-beige-dark flex items-center justify-center shrink-0 shadow-xl">
            <Stethoscope size={64} className="text-gold-dark" />
          </div>
          <div className="flex-1 space-y-4">
            <h2 className="text-3xl font-serif text-gold-dark">{DOCTOR_INFO.name}</h2>
            <p className="text-gold font-medium">{DOCTOR_INFO.specialty}</p>
            <p className="text-charcoal/80 leading-relaxed">{DOCTOR_INFO.bio}</p>
            <ul className="space-y-2">
              {DOCTOR_INFO.achievements.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-charcoal/70">
                  <Award size={16} className="text-gold shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-6 py-12 bg-charcoal text-white">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <Users size={32} className="mx-auto text-gold" />
            <p className="text-3xl font-serif text-gold">5000+</p>
            <p className="text-gray-300 text-sm">Patients accompagnés</p>
          </div>
          <div className="space-y-2">
            <Star size={32} className="mx-auto text-gold" />
            <p className="text-3xl font-serif text-gold">15 ans</p>
            <p className="text-gray-300 text-sm">D'expérience</p>
          </div>
          <div className="space-y-2">
            <Sparkles size={32} className="mx-auto text-gold" />
            <p className="text-3xl font-serif text-gold">98%</p>
            <p className="text-gray-300 text-sm">Satisfaction client</p>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="px-6 py-16 text-center bg-blanc-casse">
        <h2 className="text-2xl font-serif text-charcoal mb-4">Prêt à prendre soin de vous ?</h2>
        <p className="text-gray-500 text-sm mb-6">
          {CLINIC_INFO.phone} — {CLINIC_INFO.address}
        </p>
        <Link to="/patient/login" className="btn-gold inline-flex items-center gap-2">
          <CalendarHeart size={18} />
          Prendre rendez-vous
        </Link>
      </section>
    </div>
  );
}
