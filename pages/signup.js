import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validate ASU email
    if (!email.endsWith('@asu.edu')) {
      setMessage('Please use a valid ASU email address (@asu.edu)');
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
    } else if (data.user) {
      // Store additional profile information
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            first_name: firstName,
            last_name: lastName,
            email: email,
          },
        ]);

      if (profileError) {
        setMessage('Account created but profile setup failed: ' + profileError.message);
      } else {
        setMessage('Account created successfully! Redirecting...');
        setTimeout(() => router.push('/'), 2000);
      }
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
              <label style={styles.label}>First Name</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                style={styles.input}
                placeholder="Enter your first name"
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                style={styles.input}
                placeholder="Enter your last name"
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>ASU Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
                placeholder="Enter your ASU email (@asu.edu)"
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
                placeholder="Enter your password"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={styles.button}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>
          {message && (
            <p
              style={{
                ...styles.message,
                backgroundColor: message.includes('error') || message.includes('failed')
                  ? '#ffdddd'
                  : '#ddffdd',
                color: message.includes('error') || message.includes('failed') ? '#cc0000' : '#00aa00',
              }}
            >
              {message}
            </p>
          )}
          <div style={styles.footer}>
            Already have an account?{' '}
            <a href="/login" style={styles.link}>
              Log In
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#fff5f7',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '10px',
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
