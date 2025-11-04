import Link from 'next/link'

export default function Home() {
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
        padding: '50px',
        borderRadius: '20px',
        boxShadow: '0 4px 20px rgba(255, 105, 180, 0.3)',
        maxWidth: '800px'
      }}>
        <h1 style={{
          color: '#FF69B4',
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
        
        <div style={{ marginTop: '40px' }}>
          <Link href="/scan">
            <button style={{
              background: 'linear-gradient(135deg, #FF69B4, #FFB6C1)',
              color: 'white',
              fontSize: '1.5rem',
              padding: '15px 40px',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(255, 105, 180, 0.4)',
              transition: 'transform 0.2s',
              fontWeight: 'bold'
            }}>
              Member Scan
            </button>
          </Link>
        </div>

        <div style={{ marginTop: '30px' }}>
          <Link href="/admin/login">
            <button style={{
              background: 'linear-gradient(135deg, #FFB6C1, #FF69B4)',
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
  )
}
