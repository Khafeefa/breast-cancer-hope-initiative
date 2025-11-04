import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage('Success! Please check your email to confirm your account.');
      setTimeout(() => router.push('/login'), 3000);
    }
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Sign Up - Breast Cancer Hope Initiative</title>
      </Head>
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Create Account</h1>
          <p style={styles.subtitle}>Join Breast Cancer Hope Initiative</p>
          
          <form onSubmit={handleSignup} style={styles.form}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
                placeholder="Enter your email"
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                style={styles.input}
                placeholder="Enter your password (min 6 characters)"
              />
            </div>

            {message && (
              <div style={{
                ...styles.message,
                backgroundColor: message.includes('Success') ? '#ffc0cb' : '#ffe0e0',
                color: message.includes('Success') ? '#c71585' : '#d32f2f'
              }}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p style={styles.footer}>
            Already have an account?{' '}
            <a href="/login" style={styles.link}>Log In</a>
          </p>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #ffc0cb 0%, #ffffff 50%, #ffc0cb 100%)',
    padding: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '40px',
    boxShadow: '0 8px 24px rgba(199, 21, 133, 0.15)',
    maxWidth: '450px',
    width: '100%',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#c71585',
    marginBottom: '10px',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    textAlign: 'center',
    marginBottom: '30px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: '2px solid #ffc0cb',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.3s',
  },
  message: {
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    textAlign: 'center',
  },
  button: {
    padding: '14px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#ffffff',
    backgroundColor: '#c71585',
    border: 'none',
    borderRadius: '8px',
    transition: 'background-color 0.3s',
  },
  footer: {
    textAlign: 'center',
    marginTop: '20px',
    fontSize: '14px',
    color: '#666',
  },
  link: {
    color: '#c71585',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
};
