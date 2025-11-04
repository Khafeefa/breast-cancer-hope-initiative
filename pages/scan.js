import { useState, useEffect, useRef } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { useRouter } from 'next/router';

export default function Scan() {
  const [data, setData] = useState('');
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const scannerRef = useRef(null);
  const html5QrcodeRef = useRef(null);

  useEffect(() => {
    return () => {
      // Cleanup scanner on unmount
      if (html5QrcodeRef.current?.isScanning) {
        html5QrcodeRef.current.stop().catch(console.error);
      }
    };
  }, []);

  const handleScan = async (decodedText) => {
    setData(decodedText);
    setScanning(false);
    
    // Stop scanner after successful scan
    if (html5QrcodeRef.current?.isScanning) {
      await html5QrcodeRef.current.stop();
    }
    
    try {
      // Send attendance data to API
      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          qrData: decodedText,
          timestamp: new Date().toISOString(),
        }),
      });
      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Attendance recorded successfully!');
        setTimeout(() => {
          setSuccess('');
        }, 2000);
      } else {
        setError(data.message || 'Failed to record attendance');
      }
    } catch (err) {
      setError('Error recording attendance: ' + err.message);
    }
  };

  const startScanner = async () => {
    setError('');
    setScanning(true);
    
    try {
      const html5Qrcode = new Html5Qrcode('qr-reader');
      html5QrcodeRef.current = html5Qrcode;
      
      await html5Qrcode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        handleScan,
        (errorMessage) => {
          // Ignore continuous scanning errors
        }
      );
    } catch (err) {
      console.error(err);
      setError('Camera access denied or error occurred');
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    if (html5QrcodeRef.current?.isScanning) {
      try {
        await html5QrcodeRef.current.stop();
        setScanning(false);
      } catch (err) {
        console.error('Error stopping scanner:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <h1 className="text-3xl font-bold text-pink-600 mb-2 text-center">
            QR Attendance Check-In
          </h1>
          <p className="text-gray-600 text-center mb-8">
            Scan your QR code to record your attendance
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
              <button 
                onClick={() => setError('')} 
                className="float-right font-bold"
              >
                ×
              </button>
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <div className="mb-6">
            {scanning ? (
              <div>
                <div id="qr-reader" ref={scannerRef} className="border-4 border-pink-500 rounded-lg overflow-hidden"></div>
                <div className="text-center mt-4">
                  <button
                    onClick={stopScanner}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                  >
                    Stop Scanner
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <button
                  onClick={startScanner}
                  className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
                >
                  Start Scanner
                </button>
              </div>
            )}
          </div>

          {data && (
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-700 mb-2">Scanned Data:</h3>
              <p className="text-sm text-gray-600 break-all">{data}</p>
            </div>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/')}
              className="text-pink-600 hover:text-pink-800 font-semibold"
            >
              ← Back to Home
            </button>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Instructions:</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>Click "Start Scanner" to activate the camera</li>
            <li>Position the QR code within the scanner frame</li>
            <li>Wait for the automatic scan and confirmation</li>
            <li>Your attendance will be recorded instantly</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
