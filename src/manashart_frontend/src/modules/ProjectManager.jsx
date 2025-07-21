import React, { useState } from 'react';
import { useEvents } from '../contexts/EventsContext';
import { Plus, Calendar, MapPin, Users, Edit2, Trash2, Eye, Save, X } from 'lucide-react';

const ProjectManager = ({ actor, userProfile, refreshProfile }) => {
  const { 
    events, 
    createEvent, 
    updateEvent, 
    deleteEvent, 
    totalEvents, 
    totalCapacity, 
    totalSold 
  } = useEvents();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    date: '',
    time: '',
    location: '',
    category: 'Music',
    vibrationLevel: 40,
    maxCapacity: 100,
    description: '',
    artists: '',
    features: '',
    image: '/api/placeholder/400/600',
    prices: {
      icp: 25,
      btc: 0.0005,
      eth: 0.015
    }
  });

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      date: '',
      time: '',
      location: '',
      category: 'Music',
      vibrationLevel: 40,
      maxCapacity: 100,
      description: '',
      artists: '',
      features: '',
      image: '/api/placeholder/400/600',
      prices: {
        icp: 25,
        btc: 0.0005,
        eth: 0.015
      }
    });
    setShowCreateForm(false);
    setEditingEvent(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const eventData = {
      ...formData,
      artists: formData.artists.split(',').map(artist => artist.trim()).filter(Boolean),
      features: formData.features.split(',').map(feature => feature.trim()).filter(Boolean)
    };

    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
    } else {
      createEvent(eventData);
    }
    
    resetForm();
  };

  const handleEdit = (event) => {
    setFormData({
      ...event,
      artists: event.artists.join(', '),
      features: event.features.join(', ')
    });
    setEditingEvent(event);
    setShowCreateForm(true);
  };

  const handleDelete = (eventId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      deleteEvent(eventId);
    }
  };

  const EventCard = ({ event }) => (
    <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{event.title}</h3>
          <p className="text-white/60">{event.subtitle}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(event)}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleDelete(event.id)}
            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-white/70">
          <Calendar className="w-4 h-4" />
          <span>{event.date} - {event.time}</span>
        </div>
        <div className="flex items-center gap-2 text-white/70">
          <MapPin className="w-4 h-4" />
          <span>{event.location}</span>
        </div>
        <div className="flex items-center gap-2 text-white/70">
          <Users className="w-4 h-4" />
          <span>{event.sold} / {event.maxCapacity}</span>
        </div>
        <div className="text-white/70">
          <span className="font-semibold">{event.vibrationLevel}Hz</span> requeridos
        </div>
      </div>

      <div className="bg-white/5 rounded p-3">
        <div className="text-sm text-white/60 mb-2">Precios:</div>
        <div className="flex gap-4 text-sm">
          <span className="text-purple-400">{event.prices.icp} ICP</span>
          <span className="text-orange-400">{event.prices.btc} BTC</span>
          <span className="text-blue-400">{event.prices.eth} ETH</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Event Manager</h1>
          <p className="text-white/70">Crea y gestiona tus eventos de Manashart</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Crear Evento
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg p-6 border border-purple-500/30">
          <h3 className="text-white/70 text-sm mb-1">Total Eventos</h3>
          <p className="text-3xl font-bold text-white">{totalEvents}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-600/20 to-cyan-600/20 rounded-lg p-6 border border-blue-500/30">
          <h3 className="text-white/70 text-sm mb-1">Capacidad Total</h3>
          <p className="text-3xl font-bold text-white">{totalCapacity}</p>
        </div>
        <div className="bg-gradient-to-br from-green-600/20 to-emerald-600/20 rounded-lg p-6 border border-green-500/30">
          <h3 className="text-white/70 text-sm mb-1">Tickets Vendidos</h3>
          <p className="text-3xl font-bold text-white">{totalSold}</p>
        </div>
      </div>

      {/* Events List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>

      {/* Create/Edit Form Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-xl p-6 w-full max-w-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">
                {editingEvent ? 'Editar Evento' : 'Crear Nuevo Evento'}
              </h3>
              <button
                onClick={resetForm}
                className="p-2 text-white/70 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Título</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Subtítulo</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Fecha</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Hora</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Ubicación</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Categoría</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                  >
                    <option value="Music">Música</option>
                    <option value="Art">Arte</option>
                    <option value="Technology">Tecnología</option>
                    <option value="Workshop">Taller</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Nivel de Vibración (Hz)</label>
                  <input
                    type="number"
                    value={formData.vibrationLevel}
                    onChange={(e) => setFormData({...formData, vibrationLevel: parseInt(e.target.value)})}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    min="0"
                    max="100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Capacidad Máxima</label>
                  <input
                    type="number"
                    value={formData.maxCapacity}
                    onChange={(e) => setFormData({...formData, maxCapacity: parseInt(e.target.value)})}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40 h-24"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">Artistas (separados por comas)</label>
                  <input
                    type="text"
                    value={formData.artists}
                    onChange={(e) => setFormData({...formData, artists: e.target.value})}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
                    placeholder="Artista 1, Artista 2, Artista 3"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm mb-2">Características (separadas por comas)</label>
                  <input
                    type="text"
                    value={formData.features}
                    onChange={(e) => setFormData({...formData, features: e.target.value})}
                    className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/40"
                    placeholder="Sonido Premium, Visuales, Acceso VIP"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-4">Precios</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-purple-400 text-sm mb-1">ICP</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.prices.icp}
                      onChange={(e) => setFormData({
                        ...formData, 
                        prices: { ...formData.prices, icp: parseFloat(e.target.value) }
                      })}
                      className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-orange-400 text-sm mb-1">BTC</label>
                    <input
                      type="number"
                      step="0.000001"
                      value={formData.prices.btc}
                      onChange={(e) => setFormData({
                        ...formData, 
                        prices: { ...formData.prices, btc: parseFloat(e.target.value) }
                      })}
                      className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-blue-400 text-sm mb-1">ETH</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={formData.prices.eth}
                      onChange={(e) => setFormData({
                        ...formData, 
                        prices: { ...formData.prices, eth: parseFloat(e.target.value) }
                      })}
                      className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {editingEvent ? 'Actualizar' : 'Crear'} Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManager;
