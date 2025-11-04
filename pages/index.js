import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Home() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check current user session
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ffc0cb 0%, #ffffff 50%, #ffc0cb 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      {/* User Auth Navigation Bar */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        display: 'flex',
        gap: '15px',
        alignItems: 'center'
      }}>
        {user ? (
          <>
            <span style={{ color: '#c71585', fontWeight: 'bold' }}>
              {user.email}
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: '#c71585',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login">
              <button style={{
                background: 'white',
                color: '#c71585',
                padding: '10px 20px',
                border: '2px solid #c71585',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button style={{
                background: '#c71585',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>

      <main style={{
        textAlign: 'center',
        backgroundColor: 'white',
        padding: '50px',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(199, 21, 133, 0.3)',
        maxWidth: '800px'
      }}>
        <h1 style={{
          color: '#c71585',
          fontSize: '3.5rem',
          marginBottom: '20px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}>
          Breast Cancer Hope Initiative
        </h1>
        <p style={{
          color: '#333',
          fontSize: '1.5rem',
          lineHeight: '1.8',
          marginBottom: '30px'
        }}>
          Supporting Hope, Spreading Awareness, and Empowering Communities
        </p>
        
        {/* Member Scan Button */}
        <div style={{ marginTop: '30px' }}>
          <Link href="/scan">
            <button style={{
              background: 'linear-gradient(135deg, #c71585, #ffc0cb)',
              color: 'white',
              fontSize: '1.5rem',
              padding: '15px 40px',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(199, 21, 133, 0.4)',
              transition: 'transform 0.2s',
              fontWeight: 'bold'
            }}>
              Member Scan
            </button>
          </Link>
        </div>

        {/* Admin Login Button */}
        <div style={{ marginTop: '20px' }}>
          <Link href="/admin/login">
            <button style={{
              background: 'linear-gradient(135deg, #ffc0cb, #c71585)',
              color: 'white',
              fontSize: '1.2rem',
              padding: '12px 30px',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(255, 182, 193, 0.4)',
              transition: 'transform 0.2s',
              fontWeight: 'bold'
            }}>
              Admin Login
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
}
