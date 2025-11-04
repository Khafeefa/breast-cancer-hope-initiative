import { useState } from 'react';
import { useRouter } from 'next/router';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password === 'BreastAdmin2025') {
      // Set admin flag in sessionStorage
      sessionStorage.setItem('isAdmin', 'true');
      // Redirect to admin event page
      router.push('/admin/event');
    } else {
      setError('Incorrect password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FFB6C1 0%, #FFF 50%, #FFB6C1 100%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      <main style={{
        textAlign: 'center',
        backgroundColor: 'white',
        padding: '50px',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(255, 105, 180, 0.3)',
        maxWidth: '500px',
        width: '100%'
      }}>
        <h1 style={{
          color: '#FF69B4',
          fontSize: '3rem',
          marginBottom: '20px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          Admin Login
        </h1>
        
        <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="password" style={{
              display: 'block',
              marginBottom: '0.5rem',
              color: '#333',
              fontWeight: 'bold',
              textAlign: 'left'
            }}>
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                padding: '12px',
                fontSize: '1rem',
                border: '2px solid #FFB6C1',
                borderRadius: '10px',
                width: '100%',
                outline: 'none',
                transition: 'border-color 0.3s'
              }}
              required
            />
          </div>
          
          {error && (
            <p style={{
              color: '#FF1493',
              marginTop: '1rem',
              fontWeight: 'bold'
            }}>
              {error}
            </p>
          )}
          
          <button
            type="submit"
            style={{
              background: 'linear-gradient(135deg, #FF69B4, #FFB6C1)',
              color: 'white',
              fontSize: '1.2rem',
              padding: '12px 40px',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              marginTop: '1rem',
              boxShadow: '0 4px 15px rgba(255, 105, 180, 0.4)',
              fontWeight: 'bold',
              width: '100%'
            }}
          >
            Login
          </button>
        </form>
      </main>
    </div>
  );
}
