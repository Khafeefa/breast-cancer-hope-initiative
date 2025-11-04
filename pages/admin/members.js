import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('first_name, last_name, asu_email, role')
        .order('last_name', { ascending: true });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Members List</h1>
      
      {loading ? (
        <p>Loading members...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border-b text-left">First Name</th>
                <th className="px-4 py-2 border-b text-left">Last Name</th>
                <th className="px-4 py-2 border-b text-left">ASU Email</th>
                <th className="px-4 py-2 border-b text-left">Role</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-2 text-center">No members found</td>
                </tr>
              ) : (
                members.map((member, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border-b">{member.first_name}</td>
                    <td className="px-4 py-2 border-b">{member.last_name}</td>
                    <td className="px-4 py-2 border-b">{member.asu_email}</td>
                    <td className="px-4 py-2 border-b">{member.role}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
