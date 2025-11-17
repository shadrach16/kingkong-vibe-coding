import React, { useState, useEffect } from 'react';
import MainLayout from '../components/common/layouts/MainLayout';
import adminService from '../services/adminService';
import { useAuth } from '../context/AuthContext';

const AdminDashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await adminService.getAllUsers(user.apiKey);
        setUsers(fetchedUsers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user && user.role === 'admin') {
      fetchUsers();
    }
  }, [user]);

  const handleUpdateTaskLimit = async (userId) => {
    const newLimit = prompt("Enter new task limit:");
    if (newLimit === null || isNaN(newLimit)) return;
    try {
      await adminService.updateUserTaskLimit(userId, parseInt(newLimit), user.apiKey);
      alert('Task limit updated.');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleResetApiKey = async (userId) => {
    if (!window.confirm("Are you sure you want to reset this user's API key?")) return;
    try {
      await adminService.resetUserApiKey(userId, user.apiKey);
      alert('API key reset successfully.');
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) {
    return <MainLayout><div className="text-center text-gray-400">Loading admin dashboard...</div></MainLayout>;
  }

  if (error) {
    return <MainLayout><div className="text-center text-red-400">Error: {error}</div></MainLayout>;
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg overflow-x-auto">
          <table className="min-w-full text-left text-sm text-gray-400">
            <thead className="uppercase bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Role</th>
                <th scope="col" className="px-6 py-3">Current Plan</th>
                <th scope="col" className="px-6 py-3">Usage</th>
                <th scope="col" className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-700">
                  <td className="px-6 py-4 font-semibold">{u.email}</td>
                  <td className="px-6 py-4">{u.role}</td>
                  <td className="px-6 py-4">{u.billing?.currentPlan?.name || 'N/A'}</td>
                  <td className="px-6 py-4">{u.billing?.usageCount || 0}</td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button onClick={() => handleUpdateTaskLimit(u._id)} className="text-blue-400 hover:text-blue-500 font-medium">Adjust Limit</button>
                    <button onClick={() => handleResetApiKey(u._id)} className="text-red-400 hover:text-red-500 font-medium">Reset API Key</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminDashboardPage;