import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import styles from '../styles/EventsTabs.module.css';

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
      const eventsRef = collection(db, 'events');
      const q = query(eventsRef, orderBy('date', 'asc'));
      const querySnapshot = await getDocs(q);
      
      const now = new Date();
      const upcoming = [];
      const past = [];

      querySnapshot.forEach((doc) => {
        const eventData = { id: doc.id, ...doc.data() };
        const eventDate = new Date(eventData.date);

        if (eventDate >= now) {
          upcoming.push(eventData);
        } else {
          past.push(eventData);
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
      return <p className={styles.message}>Loading events...</p>;
    }

    if (events.length === 0) {
      return <p className={styles.message}>No events found.</p>;
    }

    return (
      <div className={styles.eventsList}>
        {events.map((event) => (
          <div key={event.id} className={styles.eventCard}>
            <h3 className={styles.eventTitle}>{event.title}</h3>
            <p className={styles.eventDate}>{formatDate(event.date)}</p>
            <p className={styles.eventHours}>
              <strong>Duration:</strong> {event.hours || 0} hours
            </p>
            {event.description && (
              <p className={styles.eventDescription}>{event.description}</p>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Events</h1>
      
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'upcoming' ? styles.active : ''}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Events ({upcomingEvents.length})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'past' ? styles.active : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past Events ({pastEvents.length})
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'upcoming' ? renderEvents(upcomingEvents) : renderEvents(pastEvents)}
      </div>
    </div>
  );
}
