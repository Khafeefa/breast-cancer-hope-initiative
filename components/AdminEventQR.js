import React, { useState } from 'react';
import QRCode from 'qrcode';

const AdminEventQR = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [loading, setLoading] = useState(false);

  // Generate unique event ID
  const generateEventId = () => {
    return `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  // Create new event
  const handleCreateEvent = async (e) => {
    e.preventDefault();
    if (!eventName || !eventDate || !eventLocation) {
      alert('Please fill in all fields');
      return;
    }

    const eventId = generateEventId();
    const newEvent = {
      id: eventId,
      name: eventName,
      date: eventDate,
      location: eventLocation,
      created: new Date().toISOString(),
    };

    setEvents([...events, newEvent]);
    setEventName('');
    setEventDate('');
    setEventLocation('');
    alert('Event created successfully!');
  };

  // Generate QR code for selected event
  const handleGenerateQR = async () => {
    if (!selectedEvent) {
      alert('Please select an event');
      return;
    }

    setLoading(true);
    const event = events.find((e) => e.id === selectedEvent);
    
    // Create check-in data object
    const checkInData = {
      eventId: event.id,
      eventName: event.name,
      date: event.date,
      location: event.location,
      checkInUrl: `${window.location.origin}/checkin/${event.id}`,
    };

    try {
      // Generate QR code with event data
      const qrCode = await QRCode.toDataURL(JSON.stringify(checkInData), {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      
      setQrCodeUrl(qrCode);
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  // Download QR code
  const handleDownloadQR = () => {
    if (!qrCodeUrl) return;

    const event = events.find((e) => e.id === selectedEvent);
    const link = document.createElement('a');
    link.download = `${event.name.replace(/\s+/g, '-')}-QR.png`;
    link.href = qrCodeUrl;
    link.click();
  };

  // Print QR code
  const handlePrintQR = () => {
    if (!qrCodeUrl) return;

    const printWindow = window.open('', '_blank');
    const event = events.find((e) => e.id === selectedEvent);
    
    printWindow.document.write(`
      <html>
        <head>
          <title>${event.name} - Check-in QR Code</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 40px;
            }
            h1 { color: #ec4899; margin-bottom: 10px; }
            .info { margin: 20px 0; color: #555; }
            img { max-width: 400px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <h1>${event.name}</h1>
          <div class="info">
            <p><strong>Date:</strong> ${new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Location:</strong> ${event.location}</p>
          </div>
          <img src="${qrCodeUrl}" alt="Event QR Code" />
          <p>Scan this QR code to check in to the event</p>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 250);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-pink-600 mb-8 text-center">
          Event QR Code Generator
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Create Event Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Create New Event
            </h2>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Name
                </label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Awareness Walk 2024"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Date
                </label>
                <input
                  type="datetime-local"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  placeholder="Community Center"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-pink-600 text-white py-2 px-4 rounded-lg hover:bg-pink-700 transition-colors font-medium"
              >
                Create Event
              </button>
            </form>

            {/* Events List */}
            {events.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Existing Events ({events.length})
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                    >
                      <div className="font-medium text-gray-800">{event.name}</div>
                      <div className="text-sm text-gray-600">
                        {new Date(event.date).toLocaleDateString()} - {event.location}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* QR Code Generator */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Generate QR Code
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Event
                </label>
                <select
                  value={selectedEvent}
                  onChange={(e) => {
                    setSelectedEvent(e.target.value);
                    setQrCodeUrl(''); // Clear previous QR code
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  disabled={events.length === 0}
                >
                  <option value="">Choose an event...</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.name} - {new Date(event.date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleGenerateQR}
                disabled={!selectedEvent || loading}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating...' : 'Generate QR Code'}
              </button>

              {/* QR Code Display */}
              {qrCodeUrl && (
                <div className="mt-6 text-center">
                  <div className="bg-gray-50 p-4 rounded-lg border-2 border-pink-200">
                    <img
                      src={qrCodeUrl}
                      alt="Event QR Code"
                      className="mx-auto max-w-full"
                    />
                    <div className="mt-4 space-y-2">
                      <p className="text-sm text-gray-600">
                        {events.find((e) => e.id === selectedEvent)?.name}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={handleDownloadQR}
                          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                          Download
                        </button>
                        <button
                          onClick={handlePrintQR}
                          className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          Print
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {!qrCodeUrl && selectedEvent && (
                <div className="text-center text-gray-500 py-8">
                  <svg
                    className="mx-auto h-16 w-16 text-gray-400 mb-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    />
                  </svg>
                  <p>Click 'Generate QR Code' to create a scannable code</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            How to Use
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Create a new event by filling out the form with event details</li>
            <li>Select the event from the dropdown menu</li>
            <li>Click 'Generate QR Code' to create a unique QR code for that event</li>
            <li>Download or print the QR code to display at your event</li>
            <li>Attendees can scan the code with their phones to check in</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default AdminEventQR;
