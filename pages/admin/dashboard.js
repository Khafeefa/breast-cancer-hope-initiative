// Admin Dashboard Component with User Management
import React, { useState, useMemo } from 'react';
import Link from 'next/link';

const AdminDashboard = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', attendance: 18, hours: 45.5, role: 'volunteer', joinDate: '2024-01-15' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', attendance: 12, hours: 32.0, role: 'volunteer', joinDate: '2024-02-20' },
    { id: 3, name: 'Carol Davis', email: 'carol@example.com', attendance: 22, hours: 58.5, role: 'volunteer', joinDate: '2023-11-10' },
    { id: 4, name: 'David Wilson', email: 'david@example.com', attendance: 15, hours: 38.0, role: 'staff', joinDate: '2024-03-05' },
    { id: 5, name: 'Eve Martinez', email: 'eve@example.com', attendance: 20, hours: 52.0, role: 'volunteer', joinDate: '2024-01-22' },
  ]);

  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [filters, setFilters] = useState({ role: 'all', minHours: 0, maxHours: 100 });
  const [searchTerm, setSearchTerm] = useState('');

  // Filter users based on criteria
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesRole = filters.role === 'all' || user.role === filters.role;
      const matchesHours = user.hours >= filters.minHours && user.hours <= filters.maxHours;
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesRole && matchesHours && matchesSearch;
    });
  }, [users, filters, searchTerm]);

  // Sort users
  const sortedUsers = useMemo(() => {
    const sorted = [...filteredUsers].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (typeof aValue === 'string') {
        return sortConfig.direction === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      
      return sortConfig.direction === 'asc'
        ? aValue - bValue
        : bValue - aValue;
    });
    return sorted;
  }, [filteredUsers, sortConfig]);

  const handleSort = (key) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  return (
    <div className="admin-dashboard" style={{ padding: '2rem', backgroundColor: '#fff5f8', minHeight: '100vh' }}>
      {/* Top Navigation Buttons */}
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 1000, display: 'flex', gap: '10px' }}>
        <Link href="/admin/members">
          <button style={{
            background: 'linear-gradient(135deg, #c71585, #ffc0cb)',
            color: 'white',
            fontSize: '1rem',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(199, 21, 133, 0.4)',
            fontWeight: 'bold'
          }}>
            👥 Members List
          </button>
        </Link>
        <Link href="/">
          <button style={{
            background: 'linear-gradient(135deg, #c71585, #ffc0cb)',
            color: 'white',
            fontSize: '1rem',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '50px',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(199, 21, 133, 0.4)',
            fontWeight: 'bold'
          }}>
            🏠 Home
          </button>
        </Link>
      </div>

      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ color: '#c71585', fontSize: '2.5rem', marginBottom: '0.5rem' }}>Admin Dashboard</h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>Manage volunteer information and track participation</p>
      </header>
      
      <div style={{ marginBottom: '2rem' }}>
        {/* Search Bar */}
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '2px solid #ffc0cb',
              borderRadius: '8px',
              fontSize: '1rem'
            }}
          />
        </div>
        
        {/* Filter Controls */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontWeight: 'bold', color: '#c71585' }}>Role:</span>
            <select value={filters.role} onChange={(e) => setFilters({...filters, role: e.target.value})} style={{ padding: '0.5rem', border: '2px solid #ffc0cb', borderRadius: '8px' }}>
              <option value="all">All Roles</option>
              <option value="volunteer">Volunteer</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontWeight: 'bold', color: '#c71585' }}>Min Hours:</span>
            <input
              type="number"
              min="0"
              value={filters.minHours}
              onChange={(e) => setFilters({...filters, minHours: Number(e.target.value)})}
              style={{ padding: '0.5rem', border: '2px solid #ffc0cb', borderRadius: '8px' }}
            />
          </label>
          
          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span style={{ fontWeight: 'bold', color: '#c71585' }}>Max Hours:</span>
            <input
              type="number"
              min="0"
              value={filters.maxHours}
              onChange={(e) => setFilters({...filters, maxHours: Number(e.target.value)})}
              style={{ padding: '0.5rem', border: '2px solid #ffc0cb', borderRadius: '8px' }}
            />
          </label>
        </div>
      </div>
      
      {/* User Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
          <thead>
            <tr style={{ backgroundColor: '#fff0f5' }}>
              <th onClick={() => handleSort('id')} style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer', color: '#c71585', fontWeight: 'bold', borderBottom: '2px solid #c71585' }}>
                ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('name')} style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer', color: '#c71585', fontWeight: 'bold', borderBottom: '2px solid #c71585' }}>
                Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('email')} style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer', color: '#c71585', fontWeight: 'bold', borderBottom: '2px solid #c71585' }}>
                Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('attendance')} style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer', color: '#c71585', fontWeight: 'bold', borderBottom: '2px solid #c71585' }}>
                Attendance {sortConfig.key === 'attendance' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('hours')} style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer', color: '#c71585', fontWeight: 'bold', borderBottom: '2px solid #c71585' }}>
                Hours {sortConfig.key === 'hours' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('role')} style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer', color: '#c71585', fontWeight: 'bold', borderBottom: '2px solid #c71585' }}>
                Role {sortConfig.key === 'role' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('joinDate')} style={{ padding: '1rem', textAlign: 'left', cursor: 'pointer', color: '#c71585', fontWeight: 'bold', borderBottom: '2px solid #c71585' }}>
                Join Date {sortConfig.key === 'joinDate' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #ffc0cb' }}>
                <td style={{ padding: '1rem', color: '#333' }}>{user.id}</td>
                <td style={{ padding: '1rem', color: '#333' }}>{user.name}</td>
                <td style={{ padding: '1rem', color: '#333' }}>{user.email}</td>
                <td style={{ padding: '1rem', color: '#333' }}>{user.attendance}</td>
                <td style={{ padding: '1rem', color: '#333' }}>{user.hours.toFixed(1)} hrs</td>
                <td style={{ padding: '1rem' }}><span style={{ backgroundColor: '#ffc0cb', color: '#c71585', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>{user.role}</span></td>
                <td style={{ padding: '1rem', color: '#333' }}>{user.joinDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {sortedUsers.length === 0 && (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#666', fontSize: '1.1rem' }}>No users found matching your criteria.</div>
        )}
      </div>

      <footer style={{ marginTop: '2rem', textAlign: 'center', padding: '1rem', borderTop: '2px solid #ffc0cb', color: '#666' }}>
        Showing {sortedUsers.length} of {users.length} users
      </footer>
    </div>
  );
};

// Admin-only access wrapper component
export const AdminDashboardWithAuth = ({ isAdmin = true }) => {
  if (!isAdmin) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center' }}>
        <h2 style={{ color: '#c71585' }}>Access Denied</h2>
        <p style={{ color: '#666' }}>You do not have permission to access the admin dashboard. Admin-only access required.</p>
      </div>
    );
  }

  return <AdminDashboard />;
};

export default AdminDashboard;
