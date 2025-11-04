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
        body: JSON.stringify({ memberId: decodedText }),
      });

      if (response.ok) {
        setSuccess('Attendance recorded successfully!');
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to record attendance');
        setSuccess('');
      }
    } catch (err) {
      setError('Error: ' + err.message);
      setSuccess('');
    }
  };

  const startScanner = async () => {
    try {
      setScanning(true);
      setError('');
      setSuccess('');

      if (!html5QrcodeRef.current) {
        html5QrcodeRef.current = new Html5Qrcode('reader');
      }

      const qrCodeSuccessCallback = (decodedText) => {
        handleScan(decodedText);
      };

      const config = { fps: 10, qrbox: { width: 250, height: 250 } };

      await html5QrcodeRef.current.start(
        { facingMode: 'environment' },
        config,
        qrCodeSuccessCallback
      );
    } catch (err) {
      setError('Error starting scanner: ' + err.message);
      setScanning(false);
    }
  };

  const stopScanner = async () => {
    try {
      if (html5QrcodeRef.current?.isScanning) {
        await html5QrcodeRef.current.stop();
        setScanning(false);
      }
    } catch (err) {
      setError('Error stopping scanner: ' + err.message);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFB6C1 0%, #FFF 50%, #FFB6C1 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <main style={{
        textAlign: 'center',
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(255, 105, 180, 0.3)',
        maxWidth: '600px',
        width: '100%'
      }}>
        <h1 style={{
          color: '#FF69B4',
          fontSize: '2.5rem',
          marginBottom: '20px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          Member QR Code Scanner
        </h1>

        <div style={{ marginBottom: '20px' }}>
          {!scanning ? (
            <button
              onClick={startScanner}
              style={{
                background: 'linear-gradient(135deg, #FF69B4, #FFB6C1)',
                color: 'white',
                fontSize: '1.2rem',
                padding: '12px 30px',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(255, 105, 180, 0.4)',
                fontWeight: 'bold'
              }}
            >
              Start Scanning
            </button>
          ) : (
            <button
              onClick={stopScanner}
              style={{
                background: 'linear-gradient(135deg, #FFB6C1, #FF69B4)',
                color: 'white',
                fontSize: '1.2rem',
                padding: '12px 30px',
                border: 'none',
                borderRadius: '50px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(255, 182, 193, 0.4)',
                fontWeight: 'bold'
              }}
            >
              Stop Scanning
            </button>
          )}
        </div>

        <div
          id="reader"
          style={{
            width: '100%',
            maxWidth: '500px',
            margin: '20px auto',
            border: '3px solid #FFB6C1',
            borderRadius: '15px',
            overflow: 'hidden'
          }}
        ></div>

        {success && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#E6FFE6',
            color: '#008000',
            borderRadius: '10px',
            fontWeight: 'bold'
          }}>
            {success}
          </div>
        )}

        {error && (
          <div style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#FFE6E6',
            color: '#FF1493',
            borderRadius: '10px',
            fontWeight: 'bold'
          }}>
            {error}
          </div>
        )}

        <div style={{ marginTop: '30px' }}>
          <button
            onClick={() => router.push('/')}
            style={{
              background: 'linear-gradient(135deg, #FFB6C1, #FF69B4)',
              color: 'white',
              fontSize: '1rem',
              padding: '10px 25px',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(255, 182, 193, 0.4)',
              fontWeight: 'bold'
            }}
          >
            Back to Home
          </button>
        </div>
      </main>
    </div>
  );
}
