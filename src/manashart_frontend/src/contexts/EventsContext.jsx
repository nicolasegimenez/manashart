import React, { createContext, useContext, useState, useEffect } from 'react';

const EventsContext = createContext();

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};

// Default events data (compatible with CryptoTickets structure)
const defaultEvents = [
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
  },
  {
    id: 4,
    title: "Ethereal Soundscapes",
    subtitle: "Progressive House & Techno",
    date: "2024-03-15",
    time: "22:00",
    location: "The Void Club, Berlin",
    image: "/api/placeholder/400/600",
    category: "Music",
    vibrationLevel: 65,
    maxCapacity: 800,
    sold: 234,
    prices: {
      general: { icp: 35, btc: 0.00067, eth: 0.019 },
      vip: { icp: 65, btc: 0.00125, eth: 0.035 }
    },
    description: "Immerse yourself in a journey through progressive soundscapes where technology meets consciousness.",
    artists: ["Marcus Zenith", "Luna Frequencies", "Digital Shaman"],
    features: ["Immersive Visual Experience", "High-End Sound System", "Limited Capacity", "Crypto-Only Entry"]
  },
  {
    id: 5,
    title: "Quantum Gathering",
    subtitle: "Experimental Electronic", 
    date: "2024-03-22",
    time: "21:30",
    location: "Warehouse X, Amsterdam",
    image: "/api/placeholder/400/600",
    category: "Music",
    vibrationLevel: 72,
    maxCapacity: 400,
    sold: 156,
    prices: {
      general: { icp: 45, btc: 0.00089, eth: 0.025 },
      premium: { icp: 85, btc: 0.00167, eth: 0.047 }
    },
    description: "An intimate gathering for those who resonate with higher frequencies.",
    artists: ["Resonance Collective", "Frequency Modulators", "Bass Alchemist"],
    features: ["Intimate Venue", "Experimental Sounds", "Consciousness-Focused", "Premium Audio"]
  }
];

export const EventsProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load events from localStorage on mount
  useEffect(() => {
    try {
      const savedEvents = localStorage.getItem('manashart-events');
      if (savedEvents) {
        setEvents(JSON.parse(savedEvents));
      } else {
        // Initialize with default events
        setEvents(defaultEvents);
        localStorage.setItem('manashart-events', JSON.stringify(defaultEvents));
      }
    } catch (error) {
      console.error('Error loading events from localStorage:', error);
      setEvents(defaultEvents);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save events to localStorage whenever events change
  useEffect(() => {
    if (!loading && events.length > 0) {
      try {
        localStorage.setItem('manashart-events', JSON.stringify(events));
      } catch (error) {
        console.error('Error saving events to localStorage:', error);
      }
    }
  }, [events, loading]);

  // Generate unique ID for new events
  const generateId = () => {
    return Math.max(...events.map(e => e.id), 0) + 1;
  };

  // Create new event
  const createEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: generateId(),
      sold: 0, // New events start with 0 sold tickets
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  // Update existing event
  const updateEvent = (id, updates) => {
    setEvents(prev => prev.map(event => 
      event.id === id 
        ? { ...event, ...updates, updatedAt: new Date().toISOString() }
        : event
    ));
  };

  // Delete event
  const deleteEvent = (id) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  };

  // Get event by ID
  const getEventById = (id) => {
    return events.find(event => event.id === parseInt(id));
  };

  // Get events by category
  const getEventsByCategory = (category) => {
    return events.filter(event => 
      event.category.toLowerCase() === category.toLowerCase()
    );
  };

  // Get events by vibration level
  const getEventsByVibrationLevel = (minLevel, maxLevel = Infinity) => {
    return events.filter(event => 
      event.vibrationLevel >= minLevel && event.vibrationLevel <= maxLevel
    );
  };

  // Get available events (not at capacity)
  const getAvailableEvents = () => {
    return events.filter(event => event.sold < event.maxCapacity);
  };

  // Purchase tickets (update sold count) - supports multiple ticket categories
  const purchaseTickets = (eventId, ticketsData) => {
    const event = getEventById(eventId);
    if (!event) {
      throw new Error('Event not found');
    }
    
    // Calculate total quantity from ticketsData object
    const totalQuantity = typeof ticketsData === 'number' 
      ? ticketsData 
      : Object.values(ticketsData).reduce((sum, qty) => sum + qty, 0);
    
    if (event.sold + totalQuantity > event.maxCapacity) {
      throw new Error('Not enough tickets available');
    }
    
    updateEvent(eventId, { sold: event.sold + totalQuantity });
    return true;
  };

  // Reset events to defaults (useful for development)
  const resetEvents = () => {
    setEvents(defaultEvents);
    localStorage.setItem('manashart-events', JSON.stringify(defaultEvents));
  };

  const value = {
    events,
    loading,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    getEventsByCategory,
    getEventsByVibrationLevel,
    getAvailableEvents,
    purchaseTickets,
    resetEvents,
    // Helper stats
    totalEvents: events.length,
    totalCapacity: events.reduce((sum, event) => sum + event.maxCapacity, 0),
    totalSold: events.reduce((sum, event) => sum + event.sold, 0)
  };

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
};

export default EventsContext;