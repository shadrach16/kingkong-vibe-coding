import React, { useState } from 'react';
import { Users, UserPlus, Trash, Edit, Mail, Award, Key, Crown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const TeamManagement = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('member');

  // Placeholder functions for demonstration
  const handleInviteUser = (e) => {
    e.preventDefault();
    console.log(`Inviting user with email: ${email} and role: ${role}`);
    setIsModalOpen(false);
    setEmail('');
    setRole('member');
  };

  const members = [
    {
      id: user?.user?._id,
      name: user?.user?.name || user?.user?.email,
      email: user?.user?.email,
      role: 'admin',
      plan: user?.user?.subscriptionPlan,
    },
 
  ];

  const getRoleBadge = (userRole) => {
    switch (userRole) {
      case 'owner':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-purple-700 bg-purple-100 rounded-full"><Crown className="h-3 w-3" /> Owner</span>;
      case 'admin':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded-full"><Award className="h-3 w-3" /> Admin</span>;
      case 'member':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-100 rounded-full"><Users className="h-3 w-3" /> Member</span>;
      default:
        return null;
    }
  };

  const getPlanBadge = (plan) => {
    switch (plan) {
      case 'pro':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-indigo-700 bg-indigo-100 rounded-full">Pro</span>;
      case 'free':
        return <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium text-gray-700 bg-gray-100 rounded-full">Free</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-xl border border-gray-200 shadow-sm my-12">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex items-center gap-4 text-gray-900">
          <div className="p-2 bg-indigo-50 rounded-full">
            <Users className="h-6 w-6 text-indigo-500" />
          </div>
          <h3 className="text-2xl font-bold">Team Management</h3>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg shadow-md transition-colors duration-200 hover:bg-indigo-700"
        >
          <UserPlus className="h-5 w-5" />
          Invite Member
        </button>
      </div>
      <p className="text-sm text-gray-600">
        Manage your team members, their roles, and access to the dashboard and API.
      </p>

      {/* Team Members List */}
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <ul className="divide-y divide-gray-200">
          {members.map((member) => (
            <li key={member.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between transition-colors duration-150 hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                  {member.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-lg font-semibold text-gray-800 truncate">{member.name}</p>
                  <p className="text-sm text-gray-500 truncate">{member.email}</p>
                </div>
              </div>
              <div className="mt-4 sm:mt-0 flex flex-wrap items-center gap-2 sm:space-x-4">
                {getRoleBadge(member.role)}
                {getPlanBadge(member.plan)}
                <button
                  className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                  aria-label={`Edit ${member.name}`}
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  aria-label={`Remove ${member.name}`}
                >
                  <Trash className="h-5 w-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Invite Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center p-4 z-50">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-900">Invite New Member</h3>
            <p className="text-sm text-gray-600 mb-6">Send an invitation to a new team member to join your organization.</p>
            <form onSubmit={handleInviteUser} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;