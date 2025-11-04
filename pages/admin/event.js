import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabase';
import QRCode from 'qrcode';

export default function AdminEvent() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [generatingQr, setGeneratingQr] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAdmin = sessionStorage.getItem('isAdmin');
      if (isAdmin !== 'true') {
        router.push('/admin/login');
      }
    }
    fetchEvents();
  }, [router]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_time', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

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
      setTitle('');
      setLocation('');
      setStartTime('');
      setEndTime('');
      fetchEvents();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const generateQRCode = async () => {
    if (!selectedEvent) {
      setMessage('Please select an event to generate QR code');
      return;
    }

    setGeneratingQr(true);
    setMessage('');

    try {
      const event = events.find(e => e.id === parseInt(selectedEvent));
      if (!event) throw new Error('Event not found');

      // Generate URL for the event (adjust this URL to match your app's structure)
      const eventUrl = `${window.location.origin}/event/${event.id}`;
      
      // Generate QR code
      const qrDataUrl = await QRCode.toDataURL(eventUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#FF69B4',
          light: '#FFFFFF'
        }
      });

      setQrCodeUrl(qrDataUrl);
      setMessage('QR Code generated successfully!');
    } catch (error) {
      setMessage(`Error generating QR code: ${error.message}`);
    } finally {
      setGeneratingQr(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;

    const event = events.find(e => e.id === parseInt(selectedEvent));
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `${event?.title.replace(/\s+/g, '_')}_QR.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFB6C1, #FFC0CB, #FFD1DC)',
        padding: '40px 20px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <main
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          backgroundColor: 'white',
          borderRadius: '20px',
          padding: '40px',
          boxShadow: '0 10px 40px rgba(255, 105, 180, 0.3)',
        }}
      >
        <h1
          style={{
            textAlign: 'center',
            color: '#FF1493',
            fontSize: '2.5rem',
            marginBottom: '30px',
            textShadow: '2px 2px 4px rgba(255, 105, 180, 0.3)',
          }}
        >
          Create New Event
        </h1>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="title"
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#FF1493',
                fontWeight: 'bold',
                fontSize: '1.1rem',
              }}
            >
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
                outline: 'none',
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="location"
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#FF1493',
                fontWeight: 'bold',
                fontSize: '1.1rem',
              }}
            >
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
                outline: 'none',
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="startTime"
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#FF1493',
                fontWeight: 'bold',
                fontSize: '1.1rem',
              }}
            >
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
                outline: 'none',
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="endTime"
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#FF1493',
                fontWeight: 'bold',
                fontSize: '1.1rem',
              }}
            >
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
                outline: 'none',
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
              fontWeight: 'bold',
              width: '100%',
            }}
          >
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </form>

        {/* QR Code Generator Section */}
        <div style={{ marginTop: '40px', paddingTop: '40px', borderTop: '2px solid #FFB6C1' }}>
          <h2
            style={{
              textAlign: 'center',
              color: '#FF1493',
              fontSize: '2rem',
              marginBottom: '20px',
            }}
          >
            Generate Event QR Code
          </h2>
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="eventSelect"
              style={{
                display: 'block',
                marginBottom: '8px',
                color: '#FF1493',
                fontWeight: 'bold',
                fontSize: '1.1rem',
              }}
            >
              Select Event:
            </label>
            <select
              id="eventSelect"
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '1rem',
                border: '2px solid #FFB6C1',
                borderRadius: '10px',
                outline: 'none',
                backgroundColor: 'white',
              }}
            >
              <option value="">-- Select an event --</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.title} - {new Date(event.start_time).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={generateQRCode}
            disabled={generatingQr || !selectedEvent}
            style={{
              background: (generatingQr || !selectedEvent) ? '#ccc' : 'linear-gradient(135deg, #FF69B4, #FFB6C1)',
              color: 'white',
              fontSize: '1.2rem',
              padding: '15px',
              border: 'none',
              borderRadius: '50px',
              cursor: (generatingQr || !selectedEvent) ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 15px rgba(255, 105, 180, 0.4)',
              fontWeight: 'bold',
              width: '100%',
            }}
          >
            {generatingQr ? 'Generating...' : 'Generate QR Code'}
          </button>

          {qrCodeUrl && (
            <div style={{ marginTop: '30px', textAlign: 'center' }}>
              <img
                src={qrCodeUrl}
                alt="Event QR Code"
                style={{
                  maxWidth: '100%',
                  border: '3px solid #FFB6C1',
                  borderRadius: '15px',
                  padding: '15px',
                  backgroundColor: 'white',
                }}
              />
              <button
                onClick={downloadQRCode}
                style={{
                  background: 'linear-gradient(135deg, #FF69B4, #FFB6C1)',
                  color: 'white',
                  fontSize: '1rem',
                  padding: '12px 30px',
                  border: 'none',
                  borderRadius: '50px',
                  cursor: 'pointer',
                  marginTop: '15px',
                  boxShadow: '0 4px 15px rgba(255, 105, 180, 0.4)',
                  fontWeight: 'bold',
                }}
              >
                Download QR Code
              </button>
            </div>
          )}
        </div>

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
