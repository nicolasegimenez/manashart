import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Zap, Bitcoin, Ticket, Star, ShoppingCart } from 'lucide-react';

const CryptoTickets = ({ userProfile, actor }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedTickets, setSelectedTickets] = useState({});
  const [showPayment, setShowPayment] = useState(false);

  // Mock events data
  const events = [
    {
      id: 1,
      title: "Conscious Music Festival",
      subtitle: "Elevate Your Frequency",
      date: "2025-08-15",
      time: "18:00",
      location: "Cosmic Arena, Buenos Aires",
      image: "/api/placeholder/400/300",
      category: "Music",
      vibrationLevel: 85,
      maxCapacity: 5000,
      sold: 3200,
      prices: {
        general: { icp: 0.5, btc: 0.00001, eth: 0.0003 },
        vip: { icp: 1.2, btc: 0.000025, eth: 0.0007 },
        cosmic: { icp: 2.5, btc: 0.00005, eth: 0.0015 }
      },
      description: "Una experiencia sonora que eleva tu conciencia a través de frecuencias conscientes.",
      artists: ["Cosmic Beats", "Frequency Healers", "Digital Shamans"],
      features: ["Instalación inmersiva", "Healing Station", "Crypto Bar"]
    },
    {
      id: 2,
      title: "NFT Art Exhibition",
      subtitle: "Digital Consciousness",
      date: "2025-07-22",
      time: "19:30",
      location: "Meta Gallery, Palermo",
      image: "/api/placeholder/400/300",
      category: "Art",
      vibrationLevel: 70,
      maxCapacity: 300,
      sold: 150,
      prices: {
        general: { icp: 0.3, btc: 0.000008, eth: 0.0002 },
        collector: { icp: 0.8, btc: 0.00002, eth: 0.0005 }
      },
      description: "Explora la intersección entre arte digital y espiritualidad.",
      artists: ["Digital Mystics", "Crypto Artists Collective"],
      features: ["Mint Live", "AR Experience", "Meditation Corner"]
    },
    {
      id: 3,
      title: "Blockchain Meditation",
      subtitle: "Mindful Technology",
      date: "2025-08-01",
      time: "20:00",
      location: "Quantum Space, Recoleta",
      image: "/api/placeholder/400/300",
      category: "Wellness",
      vibrationLevel: 95,
      maxCapacity: 100,
      sold: 45,
      prices: {
        general: { icp: 0.8, btc: 0.00002, eth: 0.0005 },
        premium: { icp: 1.5, btc: 0.000035, eth: 0.0009 }
      },
      description: "Sesión de meditación colectiva potenciada por tecnología blockchain.",
      artists: ["Cyber Monks", "Tech Gurus"],
      features: ["Binaural Beats", "Chakra Alignment", "Digital Detox"]
    }
  ];

  const cryptoIcons = {
    icp: "◊",
    btc: "₿",
    eth: "Ξ"
  };

  const getVibrationColor = (level) => {
    if (level >= 90) return "from-yellow-400 to-orange-400";
    if (level >= 70) return "from-purple-400 to-pink-400";
    if (level >= 50) return "from-blue-400 to-cyan-400";
    return "from-gray-400 to-gray-500";
  };

  const getAvailability = (event) => {
    const remaining = event.maxCapacity - event.sold;
    const percentage = (remaining / event.maxCapacity) * 100;
    
    if (percentage > 50) return { status: "available", color: "text-green-400", text: `${remaining} disponibles` };
    if (percentage > 20) return { status: "limited", color: "text-yellow-400", text: `Solo ${remaining} restantes` };
    if (percentage > 0) return { status: "critical", color: "text-red-400", text: `¡Últimas ${remaining} entradas!` };
    return { status: "sold", color: "text-red-500", text: "Agotado" };
  };

  const handleTicketSelect = (eventId, category, quantity) => {
    setSelectedTickets(prev => ({
      ...prev,
      [eventId]: {
        ...prev[eventId],
        [category]: quantity
      }
    }));
  };

  const getTotalPrice = (eventId, crypto) => {
    const event = events.find(e => e.id === eventId);
    const tickets = selectedTickets[eventId] || {};
    let total = 0;
    
    Object.entries(tickets).forEach(([category, quantity]) => {
      if (event.prices[category] && event.prices[category][crypto]) {
        total += event.prices[category][crypto] * quantity;
      }
    });
    
    return total;
  };

  const hasTicketsSelected = (eventId) => {
    const tickets = selectedTickets[eventId] || {};
    return Object.values(tickets).some(quantity => quantity > 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 mb-4">
            MANASHART TICKETS
          </h1>
          <p className="text-xl text-white/70 mb-2">
            Experiencias Conscientes · Pagos Crypto · Frecuencias Elevadas
          </p>
          {userProfile && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xl rounded-full px-4 py-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-white font-semibold">{userProfile.vibration}Hz</span>
              </div>
              <div className="text-white/60 text-sm">
                Descuentos especiales por tu nivel de vibración
              </div>
            </div>
          )}
        </div>

        {/* Event Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event) => {
            const availability = getAvailability(event);
            const userDiscount = userProfile && userProfile.vibration >= event.vibrationLevel ? 0.9 : 1;
            
            return (
              <div
                key={event.id}
                className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-purple-400/50 transition-all duration-300 hover:scale-105"
              >
                {/* Event Image */}
                <div className="h-48 bg-gradient-to-br from-purple-600 to-pink-600 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getVibrationColor(event.vibrationLevel)}`}>
                      {event.vibrationLevel}Hz
                    </div>
                    <div className="px-3 py-1 rounded-full text-xs font-semibold bg-black/50 text-white">
                      {event.category}
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold">{event.title}</h3>
                    <p className="text-white/80 text-sm">{event.subtitle}</p>
                  </div>
                </div>

                {/* Event Info */}
                <div className="p-6">
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-white/70">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.date).toLocaleDateString('es-AR')}</span>
                      <Clock className="w-4 h-4 ml-2" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{event.sold}/{event.maxCapacity}</span>
                      <span className={`text-xs font-semibold ${availability.color}`}>
                        {availability.text}
                      </span>
                    </div>
                  </div>

                  {/* Ticket Types */}
                  <div className="space-y-3 mb-4">
                    {Object.entries(event.prices).map(([category, prices]) => (
                      <div key={category} className="bg-white/5 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-white font-semibold capitalize">{category}</span>
                          <div className="flex items-center gap-2">
                            {Object.entries(prices).map(([crypto, price]) => (
                              <div key={crypto} className="text-xs text-white/70">
                                {cryptoIcons[crypto]} {(price * userDiscount).toFixed(6)}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleTicketSelect(event.id, category, Math.max(0, (selectedTickets[event.id]?.[category] || 0) - 1))}
                            className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
                          >
                            -
                          </button>
                          <span className="text-white font-semibold w-8 text-center">
                            {selectedTickets[event.id]?.[category] || 0}
                          </span>
                          <button
                            onClick={() => handleTicketSelect(event.id, category, (selectedTickets[event.id]?.[category] || 0) + 1)}
                            className="w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center hover:bg-purple-700 transition-colors"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Purchase Button */}
                  {hasTicketsSelected(event.id) && (
                    <div className="space-y-2">
                      <div className="bg-white/10 rounded-lg p-3">
                        <div className="text-xs text-white/70 mb-1">Total:</div>
                        <div className="flex items-center gap-4">
                          {Object.entries(cryptoIcons).map(([crypto, icon]) => (
                            <div key={crypto} className="text-white font-semibold">
                              {icon} {(getTotalPrice(event.id, crypto) * userDiscount).toFixed(6)}
                            </div>
                          ))}
                        </div>
                        {userDiscount < 1 && (
                          <div className="text-xs text-green-400 mt-1">
                            ¡10% descuento por vibración elevada!
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          setSelectedEvent(event);
                          setShowPayment(true);
                        }}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        Comprar Tickets
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Payment Modal */}
        {showPayment && selectedEvent && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 rounded-2xl border border-white/10 p-6 max-w-md w-full">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">Finalizar Compra</h3>
                <p className="text-white/70">{selectedEvent.title}</p>
              </div>

              {/* Ticket Summary */}
              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <h4 className="text-white font-semibold mb-3">Resumen de Tickets</h4>
                {Object.entries(selectedTickets[selectedEvent.id] || {}).map(([category, quantity]) => (
                  quantity > 0 && (
                    <div key={category} className="flex justify-between text-white/70 mb-2">
                      <span>{category} x{quantity}</span>
                      <span>◊ {(selectedEvent.prices[category].icp * quantity * (userProfile && userProfile.vibration >= selectedEvent.vibrationLevel ? 0.9 : 1)).toFixed(6)}</span>
                    </div>
                  )
                ))}
              </div>

              {/* Payment Options */}
              <div className="space-y-3 mb-6">
                <h4 className="text-white font-semibold">Método de Pago</h4>
                {Object.entries(cryptoIcons).map(([crypto, icon]) => (
                  <button
                    key={crypto}
                    className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg p-4 text-white transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <span className="text-xl">{icon}</span>
                        <span className="font-semibold">{crypto.toUpperCase()}</span>
                      </span>
                      <span className="font-bold">
                        {(getTotalPrice(selectedEvent.id, crypto) * (userProfile && userProfile.vibration >= selectedEvent.vibrationLevel ? 0.9 : 1)).toFixed(6)}
                      </span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowPayment(false)}
                  className="flex-1 bg-gray-700 text-white py-3 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => {
                    alert('¡Compra realizada con éxito! Los tickets se enviaron a tu wallet.');
                    setShowPayment(false);
                    setSelectedTickets({});
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CryptoTickets;