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
          flexWrap: 'wrap'
        }}>
          <button style={{
            backgroundColor: '#FF69B4',
            color: 'white',
            border: 'none',
            padding: '15px 30px',
            fontSize: '1.2rem',
            borderRadius: '10px',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(255, 105, 180, 0.4)',
            transition: 'all 0.3s ease'
          }}>
            Get Involved
          </button>
          <button style={{
            backgroundColor: 'white',
            color: '#FF69B4',
            border: '2px solid #FF69B4',
            padding: '15px 30px',
            fontSize: '1.2rem',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}>
            Learn More
          </button>
        </div>
      </main>
      <footer style={{
        marginTop: '50px',
        color: '#666',
        textAlign: 'center'
      }}>
        <p>© 2025 Breast Cancer Hope Initiative | Spreading Hope & Awareness</p>
      </footer>
    </div>
  );
}
