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
    <div style={{ minHeight: '100vh', padding: '0 0.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <main style={{ padding: '5rem 0', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        <h1 style={{ margin: 0, lineHeight: 1.15, fontSize: '4rem', textAlign: 'center' }}>Admin Login</h1>
        
        <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                padding: '0.5rem',
                fontSize: '1rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                width: '300px'
              }}
              required
            />
          </div>
          
          {error && (
            <div style={{ color: 'red', marginBottom: '1rem' }}>
              {error}
            </div>
          )}
          
          <button
            type="submit"
            style={{
              padding: '0.75rem 1.5rem',
              fontSize: '1rem',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
        </form>
      </main>
    </div>
  );
}
