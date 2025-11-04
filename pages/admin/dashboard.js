// Admin Dashboard Component with User Management
import React, { useState, useMemo } from 'react';
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

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const exportToCSV = () => {
    const headers = ['ID', 'Name', 'Email', 'Attendance', 'Hours', 'Role', 'Join Date'];
    const rows = sortedUsers.map(user => [
      user.id,
      user.name,
      user.email,
      user.attendance,
      user.hours,
      user.role,
      user.joinDate,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `admin_users_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users, track attendance, and monitor volunteer hours</p>
      </header>

      <div className="controls-section">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters">
          <select
            value={filters.role}
            onChange={(e) => handleFilterChange('role', e.target.value)}
            className="filter-select"
          >
            <option value="all">All Roles</option>
            <option value="volunteer">Volunteers</option>
            <option value="staff">Staff</option>
          </select>

          <input
            type="number"
            min="0"
            max="100"
            placeholder="Min Hours"
            value={filters.minHours}
            onChange={(e) => handleFilterChange('minHours', parseFloat(e.target.value) || 0)}
            className="filter-input"
          />

          <input
            type="number"
            min="0"
            max="100"
            placeholder="Max Hours"
            value={filters.maxHours}
            onChange={(e) => handleFilterChange('maxHours', parseFloat(e.target.value) || 100)}
            className="filter-input"
          />

          <button
            onClick={() => {
              setFilters({ role: 'all', minHours: 0, maxHours: 100 });
              setSearchTerm('');
            }}
            className="btn-reset"
          >
            Reset Filters
          </button>

          <button onClick={exportToCSV} className="btn-export">
            📥 Export to CSV
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="users-table">
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
