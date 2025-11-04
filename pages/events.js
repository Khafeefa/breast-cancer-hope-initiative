import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
import EventsTabs from '../components/EventsTabs';
import Link from 'next/link';

export default function EventsPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        // Redirect to login if not authenticated
        router.push('/login');
      } else {
        setUser(user);
      }
      setLoading(false);
    };

    checkUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session?.user) {
        router.push('/login');
      } else {
        setUser(session.user);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ffc0cb 0%, #ffffff 50%, #ffc0cb 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <p style={{ fontSize: '1.5rem', color: '#c71585' }}>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ffc0cb 0%, #ffffff 50%, #ffc0cb 100%)',
      fontFamily: 'Arial, sans-serif',
      padding: '20px'
    }}>
      {/* Navigation Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px',
        marginBottom: '20px'
      }}>
        <Link href="/">
          <button style={{
            background: 'linear-gradient(135deg, #c71585, #ffc0cb)',
            color: 'white',
            fontSize: '1rem',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 2px 10px rgba(199, 21, 133, 0.3)'
          }}>
            ← Back to Home
          </button>
        </Link>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          {user && (
            <>
              <span style={{
                color: '#c71585',
                fontWeight: 'bold',
                fontSize: '1rem'
              }}>
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  background: 'linear-gradient(135deg, #ffc0cb, #c71585)',
                  color: 'white',
                  fontSize: '1rem',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 10px rgba(255, 192, 203, 0.3)'
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>

      {/* Events Tabs Component */}
      <EventsTabs />
    </div>
  );
}
