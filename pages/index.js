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
          Together we bring hope, support, and awareness to the fight against breast cancer.
        </p>
        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          marginTop: '40px'
        }}>
          <Link href="/admin/login">
            <button style={{
              backgroundColor: '#FF69B4',
              color: 'white',
              fontSize: '1.2rem',
              padding: '15px 30px',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 4px 10px rgba(255, 105, 180, 0.3)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}>
              Admin Login
            </button>
          </Link>
          <Link href="/scan">
            <button style={{
              backgroundColor: '#4169E1',
              color: 'white',
              fontSize: '1.2rem',
              padding: '15px 30px',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 4px 10px rgba(65, 105, 225, 0.3)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}>
              Member Scan
            </button>
          </Link>
        </div>
      </main>
    </div>
  )
}
