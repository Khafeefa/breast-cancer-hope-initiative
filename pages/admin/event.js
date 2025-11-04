import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';

export default function AdminEvent() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAdmin = sessionStorage.getItem('isAdmin');
      if (isAdmin !== 'true') {
        router.push('/admin/login');
      }
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data, error } = await supabase
        .from('events')
        .insert([
          {
            title,
            location,
            start_time: startTime,
            end_time: endTime,
          },
        ])
        .select();

      if (error) throw error;

      setMessage('Event created successfully!');
      // Reset form
      setTitle('');
      setLocation('');
      setStartTime('');
      setEndTime('');
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAdmin');
    router.push('/admin/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFB6C1 0%, #FFF 50%, #FFB6C1 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <header style={{
        width: '100%',
        maxWidth: '800px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{
          color: '#FF69B4',
          fontSize: '2.5rem',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          Create Event
        </h1>
        <button
          onClick={handleLogout}
          style={{
            background: 'linear-gradient(135deg, #FF69B4, #FFB6C1)',
            color: 'white',
            fontSize: '1rem',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(255, 105, 180, 0.4)',
            fontWeight: 'bold'
          }}
        >
          Logout
        </button>
      </header>

      <main style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(255, 105, 180, 0.3)',
        maxWidth: '800px',
        width: '100%'
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label htmlFor="title" style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontWeight: 'bold'
            }}>
              Event Title:
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '1rem',
                border: '2px solid #FFB6C1',
                borderRadius: '10px',
                outline: 'none'
              }}
              required
            />
          </div>

          <div>
            <label htmlFor="location" style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontWeight: 'bold'
            }}>
              Location:
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '1rem',
                border: '2px solid #FFB6C1',
                borderRadius: '10px',
                outline: 'none'
              }}
              required
            />
          </div>

          <div>
            <label htmlFor="startTime" style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontWeight: 'bold'
            }}>
              Start Time:
            </label>
            <input
              type="datetime-local"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '1rem',
                border: '2px solid #FFB6C1',
                borderRadius: '10px',
                outline: 'none'
              }}
              required
            />
          </div>

          <div>
            <label htmlFor="endTime" style={{
              display: 'block',
              marginBottom: '8px',
              color: '#333',
              fontWeight: 'bold'
            }}>
              End Time:
            </label>
            <input
              type="datetime-local"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '1rem',
                border: '2px solid #FFB6C1',
                borderRadius: '10px',
                outline: 'none'
              }}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#ccc' : 'linear-gradient(135deg, #FF69B4, #FFB6C1)',
              color: 'white',
              fontSize: '1.2rem',
              padding: '15px',
              border: 'none',
              borderRadius: '50px',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '10px',
              boxShadow: '0 4px 15px rgba(255, 105, 180, 0.4)',
              fontWeight: 'bold'
            }}
          >
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </form>

        {message && (
          <p style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: message.includes('Error') ? '#FFE6E6' : '#E6FFE6',
            color: message.includes('Error') ? '#FF1493' : '#008000',
            borderRadius: '10px',
            fontWeight: 'bold',
            textAlign: 'center'
          }}>
            {message}
          </p>
        )}
      </main>
    </div>
  );
}
