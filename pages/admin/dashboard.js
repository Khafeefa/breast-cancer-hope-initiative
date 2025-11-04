// Admin Dashboard Component with User Management
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import './dashboard.css';

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
    <div className="admin-dashboard">
      {/* Home Button */}
      <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 1000 }}>
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

      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage volunteer information and track participation</p>
      </header>
      
      <div className="controls-section">
        {/* Search Bar */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {/* Filter Controls */}
        <div className="filters">
          <label>
            Role:
            <select value={filters.role} onChange={(e) => setFilters({...filters, role: e.target.value})}>
              <option value="all">All Roles</option>
              <option value="volunteer">Volunteer</option>
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          
          <label>
            Min Hours:
            <input
              type="number"
              min="0"
              value={filters.minHours}
              onChange={(e) => setFilters({...filters, minHours: Number(e.target.value)})}
            />
          </label>
          
          <label>
            Max Hours:
            <input
              type="number"
              min="0"
              value={filters.maxHours}
              onChange={(e) => setFilters({...filters, maxHours: Number(e.target.value)})}
            />
          </label>
        </div>
      </div>
      
      {/* User Table */}
      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('id')} className="sortable">
                ID {sortConfig.key === 'id' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('name')} className="sortable">
                Name {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('email')} className="sortable">
                Email {sortConfig.key === 'email' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('attendance')} className="sortable">
                Attendance {sortConfig.key === 'attendance' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('hours')} className="sortable">
                Hours {sortConfig.key === 'hours' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('role')} className="sortable">
                Role {sortConfig.key === 'role' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => handleSort('joinDate')} className="sortable">
                Join Date {sortConfig.key === 'joinDate' && (sortConfig.direction === 'asc' ? '▲' : '▼')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td className="user-name">{user.name}</td>
                <td className="user-email">{user.email}</td>
                <td className="attendance-cell">{user.attendance}</td>
                <td className="hours-cell">{user.hours.toFixed(1)} hrs</td>
                <td><span className={`role-badge role-${user.role}`}>{user.role}</span></td>
                <td>{user.joinDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {sortedUsers.length === 0 && (
          <div className="no-results">No users found matching your criteria.</div>
        )}
      </div>
      <footer className="dashboard-footer">
        <p>Showing {sortedUsers.length} of {users.length} users</p>
      </footer>
    </div>
  );
};

// Admin-only access wrapper component
export const AdminDashboardWithAuth = ({ isAdmin = true }) => {
  if (!isAdmin) {
    return (
      <div className="access-denied">
        <h2>Access Denied</h2>
        <p>You do not have permission to access the admin dashboard. Admin-only access required.</p>
      </div>
    );
  }
  return <AdminDashboard />;
};

export default AdminDashboard;
