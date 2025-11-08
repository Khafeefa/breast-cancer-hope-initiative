import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';

export default function EventAttendance() {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState('');
  const [confirming, setConfirming] = useState(false);
  const [hasAttended, setHasAttended] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (id && user) {
      fetchEvent();
      checkAttendance();
    }
  }, [id, user]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push(`/login?redirect=/event/${id}`);
      return;
    }
    setUser(session.user);
  };

  const fetchEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setEvent(data);
    } catch (error) {
      console.error('Error fetching event:', error);
      setMessage('Event not found');
    } finally {
      setLoading(false);
    }
  };

  const checkAttendance = async () => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('event_id', id)
        .eq('user_id', user.id)
        .single();

      if (data) {
        setHasAttended(true);
      }
    } catch (error) {
      // No attendance record found, which is fine
    }
  };

  const confirmAttendance = async () => {
    if (!user || !event) return;

    setConfirming(true);
    setMessage('');

    try {
      const { error } = await supabase
        .from('attendance')
        .insert([{
          user_id: user.id,
          event_id: event.id,
        }]);

      if (error) {
        if (error.code === '23505') {
          setMessage('You have already confirmed attendance for this event!');
        } else {
          throw error;
        }
      } else {
        setMessage('Attendance confirmed! Thank you for joining us.');
        setHasAttended(true);
      }
    } catch (error) {
      console.error('Error confirming attendance:', error);
      setMessage('Error confirming attendance. Please try again.');
    } finally {
      setConfirming(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFB6C1, #FFC0CB, #FFD1DC)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif',
      }}>
        <p style={{ color: '#FF1493', fontSize: '1.5rem', fontWeight: 'bold' }}>Loading...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFB6C1, #FFC0CB, #FFD1DC)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif',
      }}>
        <p style={{ color: '#FF1493', fontSize: '1.5rem', fontWeight: 'bold' }}>Event not found</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFB6C1, #FFC0CB, #FFD1DC)',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif',
    }}>
      <main style={{
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '40px',
        boxShadow: '0 10px 40px rgba(255, 105, 180, 0.3)',
      }}>
        <h1 style={{
          textAlign: 'center',
          color: '#FF1493',
          fontSize: '2.5rem',
          marginBottom: '30px',
          textShadow: '2px 2px 4px rgba(255, 105, 180, 0.3)',
        }}>
          {event.title}
        </h1>

        <div style={{
          marginBottom: '30px',
          padding: '20px',
          backgroundColor: '#FFE4ED',
          borderRadius: '15px',
        }}>
          <p style={{
            color: '#FF1493',
            fontSize: '1.1rem',
            marginBottom: '10px',
          }}>
            <strong>Location:</strong> {event.location}
          </p>
          <p style={{
            color: '#FF1493',
            fontSize: '1.1rem',
            marginBottom: '10px',
          }}>
            <strong>Start:</strong> {new Date(event.start_at).toLocaleString()}
          </p>
          <p style={{
            color: '#FF1493',
            fontSize: '1.1rem',
          }}>
            <strong>End:</strong> {new Date(event.end_at).toLocaleString()}
          </p>
        </div>

        {hasAttended ? (
          <div style={{
            padding: '20px',
            backgroundColor: '#E6FFE6',
            borderRadius: '15px',
            textAlign: 'center',
          }}>
            <p style={{
              color: '#008000',
              fontSize: '1.3rem',
              fontWeight: 'bold',
            }}>
              ✓ You have already confirmed your attendance!
            </p>
          </div>
        ) : (
          <button
            onClick={confirmAttendance}
            disabled={confirming}
            style={{
              background: confirming ? '#ccc' : 'linear-gradient(135deg, #FF69B4, #FFB6C1)',
              color: 'white',
              fontSize: '1.3rem',
              padding: '20px',
              border: 'none',
              borderRadius: '50px',
              cursor: confirming ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 15px rgba(255, 105, 180, 0.4)',
              fontWeight: 'bold',
              width: '100%',
              transition: 'transform 0.2s',
            }}
          >
            {confirming ? 'Confirming...' : 'Confirm My Attendance'}
          </button>
        )}

        {message && (
          <p style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: message.includes('Error') || message.includes('already') ? '#FFE6E6' : '#E6FFE6',
            color: message.includes('Error') || message.includes('already') ? '#FF1493' : '#008000',
            borderRadius: '10px',
            fontWeight: 'bold',
            textAlign: 'center',
          }}>
            {message}
          </p>
        )}
      </main>
    </div>
  );
}
