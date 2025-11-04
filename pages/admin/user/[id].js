import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function UserDetailView() {
  const router = useRouter();
  const { id } = router.query;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Fetch user data - replace with actual API call
      fetchUserData(id);
    }
  }, [id]);

  const fetchUserData = async (userId) => {
    try {
      // Mock data - replace with actual API call
      const mockData = {
        id: userId,
        name: 'Sample User',
        email: 'user@example.com',
        totalVolunteerHours: 45,
        attendance: [
          { id: 1, eventName: 'Awareness Walk 2024', date: '2024-10-15', hoursLogged: 4, status: 'Present' },
          { id: 2, eventName: 'Fundraising Gala', date: '2024-09-20', hoursLogged: 6, status: 'Present' },
          { id: 3, eventName: 'Support Group Session', date: '2024-08-10', hoursLogged: 2, status: 'Present' },
          { id: 4, eventName: 'Community Outreach', date: '2024-07-05', hoursLogged: 5, status: 'Present' },
        ],
        events: [
          { id: 1, name: 'Awareness Walk 2024', date: '2024-10-15', role: 'Volunteer Coordinator' },
          { id: 2, name: 'Fundraising Gala', date: '2024-09-20', role: 'Registration Staff' },
          { id: 3, name: 'Support Group Session', date: '2024-08-10', role: 'Facilitator' },
          { id: 4, name: 'Community Outreach', date: '2024-07-05', role: 'Team Lead' },
        ]
      };
      setUserData(mockData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading user details...</div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>User not found</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{userData.name} - User Detail | Admin Dashboard</title>
      </Head>
      <div style={styles.container}>
        <div style={styles.header}>
          <button onClick={() => router.back()} style={styles.backButton}>
            ← Back
          </button>
          <h1 style={styles.title}>User Detail View</h1>
        </div>

        {/* User Info Card */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>User Information</h2>
          <div style={styles.userInfo}>
            <div style={styles.infoRow}>
              <span style={styles.label}>Name:</span>
              <span style={styles.value}>{userData.name}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.label}>Email:</span>
              <span style={styles.value}>{userData.email}</span>
            </div>
            <div style={styles.infoRow}>
              <span style={styles.label}>User ID:</span>
              <span style={styles.value}>{userData.id}</span>
            </div>
          </div>
        </div>

        {/* Total Volunteer Hours Card */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Total Volunteer Hours</h2>
          <div style={styles.hoursDisplay}>
            <span style={styles.hoursNumber}>{userData.totalVolunteerHours}</span>
            <span style={styles.hoursLabel}>hours</span>
          </div>
        </div>

        {/* Attendance History Card */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Attendance History</h2>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Event Name</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Hours Logged</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {userData.attendance.map((record) => (
                  <tr key={record.id} style={styles.tableRow}>
                    <td style={styles.td}>{record.eventName}</td>
                    <td style={styles.td}>{record.date}</td>
                    <td style={styles.td}>{record.hoursLogged} hrs</td>
                    <td style={styles.td}>
                      <span style={styles.statusBadge}>{record.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Event Details Card */}
        <div style={styles.card}>
          <h2 style={styles.cardTitle}>Event Details</h2>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeader}>
                  <th style={styles.th}>Event Name</th>
                  <th style={styles.th}>Date</th>
                  <th style={styles.th}>Role</th>
                </tr>
              </thead>
              <tbody>
                {userData.events.map((event) => (
                  <tr key={event.id} style={styles.tableRow}>
                    <td style={styles.td}>{event.name}</td>
                    <td style={styles.td}>{event.date}</td>
                    <td style={styles.td}>{event.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    marginBottom: '2rem',
  },
  backButton: {
    backgroundColor: '#FFC0CB',
    color: '#ffffff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    marginBottom: '1rem',
    fontWeight: 'bold',
  },
  title: {
    color: '#FF1493',
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },
  card: {
    backgroundColor: '#ffffff',
    border: '2px solid #FFC0CB',
    borderRadius: '10px',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    boxShadow: '0 2px 4px rgba(255, 20, 147, 0.1)',
  },
  cardTitle: {
    color: '#FF1493',
    fontSize: '1.5rem',
    marginBottom: '1rem',
    borderBottom: '2px solid #FFC0CB',
    paddingBottom: '0.5rem',
  },
  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  infoRow: {
    display: 'flex',
    gap: '1rem',
  },
  label: {
    fontWeight: 'bold',
    color: '#FF1493',
    minWidth: '100px',
  },
  value: {
    color: '#333333',
  },
  hoursDisplay: {
    textAlign: 'center',
    padding: '2rem',
  },
  hoursNumber: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#FF1493',
    marginRight: '0.5rem',
  },
  hoursLabel: {
    fontSize: '1.5rem',
    color: '#FFC0CB',
  },
  tableContainer: {
    overflowX: 'auto',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    backgroundColor: '#FFC0CB',
  },
  th: {
    padding: '0.75rem',
    textAlign: 'left',
    color: '#FF1493',
    fontWeight: 'bold',
    borderBottom: '2px solid #FF1493',
  },
  tableRow: {
    borderBottom: '1px solid #FFC0CB',
  },
  td: {
    padding: '0.75rem',
    color: '#333333',
  },
  statusBadge: {
    backgroundColor: '#FFC0CB',
    color: '#FF1493',
    padding: '0.25rem 0.75rem',
    borderRadius: '15px',
    fontSize: '0.875rem',
    fontWeight: 'bold',
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.25rem',
    color: '#FF1493',
  },
  error: {
    textAlign: 'center',
    padding: '3rem',
    fontSize: '1.25rem',
    color: '#FF1493',
  },
};
