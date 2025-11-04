import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function EventsTabs() {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const { data: events, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;

      const now = new Date();
      const upcoming = [];
      const past = [];

      events?.forEach((event) => {
        const eventDate = new Date(event.date);
        if (eventDate >= now) {
          upcoming.push(event);
        } else {
          past.push(event);
        }
      });

      setUpcomingEvents(upcoming);
      setPastEvents(past.reverse()); // Show most recent past events first
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderEvents = (events) => {
    if (loading) {
      return <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Loading events...</p>;
    }

    if (events.length === 0) {
      return <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>No events found.</p>;
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {events.map((event) => (
          <div
            key={event.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1.5rem',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>{event.title}</h3>
            <p style={{ margin: '0.5rem 0', color: '#666' }}>{formatDate(event.date)}</p>
            <p style={{ margin: '0.5rem 0', color: '#666' }}>
              Duration: {event.hours || 0} hours
            </p>
            {event.description && (
              <p style={{ margin: '1rem 0 0 0', color: '#555' }}>{event.description}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>Events</h1>
      
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #ddd' }}>
        <button
          style={{
            flex: 1,
            padding: '1rem',
            border: 'none',
            background: activeTab === 'upcoming' ? '#e91e63' : 'transparent',
            color: activeTab === 'upcoming' ? 'white' : '#666',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            borderRadius: '8px 8px 0 0',
            transition: 'all 0.3s ease'
          }}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Events ({upcomingEvents.length})
        </button>
        <button
          style={{
            flex: 1,
            padding: '1rem',
            border: 'none',
            background: activeTab === 'past' ? '#e91e63' : 'transparent',
            color: activeTab === 'past' ? 'white' : '#666',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: 'bold',
            borderRadius: '8px 8px 0 0',
            transition: 'all 0.3s ease'
          }}
          onClick={() => setActiveTab('past')}
        >
          Past Events ({pastEvents.length})
        </button>
      </div>

      <div>
        {activeTab === 'upcoming' ? renderEvents(upcomingEvents) : renderEvents(pastEvents)}
      </div>
    </div>
  );
}
