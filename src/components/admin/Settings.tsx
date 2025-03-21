import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';
import type { User, UserMetadata } from '@supabase/supabase-js';

interface AdminUser extends User {
  user_metadata: UserMetadata & {
    role?: string;
  }
}

export default function Settings() {
  const [newPassword, setNewPassword] = useState('');
  const [newUser, setNewUser] = useState({ email: '', password: '' });
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: { users }, error } = await supabase.auth.admin.listUsers();
      if (error) throw error;
      const adminUsers = (users as AdminUser[])?.filter(user => user.user_metadata?.role === 'admin') || [];
      setUsers(adminUsers);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch users');
    }
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setPasswordError('Password must contain at least one uppercase letter');
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setPasswordError('Password must contain at least one number');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handlePasswordChange = async () => {
    if (!validatePassword(newPassword)) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      toast.success('Password updated successfully');
      setNewPassword('');
    } catch (error) {
      toast.error(error.message || 'Error updating password');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async () => {
    if (!validatePassword(newUser.password)) return;
    if (!newUser.email) {
      toast.error('Email is required');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: newUser.email,
        password: newUser.password,
        options: {
          data: { role: 'admin' }
        }
      });
      if (error) throw error;
      toast.success('User added successfully');
      setNewUser({ email: '', password: '' });
      await fetchUsers();
    } catch (error) {
      toast.error(error.message || 'Error adding user');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveUser = async (userId) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;
      toast.success('User removed successfully');
      await fetchUsers();
    } catch (error) {
      toast.error(error.message || 'Error removing user');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="settings-container p-6">
      <h2 className="text-2xl font-bold mb-6">Dashboard Settings</h2>
      
      <div className="settings-section mb-8">
        <h3 className="text-xl mb-4">Change Dashboard Password</h3>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="input-field mb-4"
          placeholder="New Password"
          disabled={isLoading}
        />
        {passwordError && (
          <p className="text-destructive mb-2">{passwordError}</p>
        )}
        <button
          onClick={handlePasswordChange}
          className="btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Updating...' : 'Update Password'}
        </button>
      </div>

      <div className="settings-section mb-8">
        <h3 className="text-xl mb-4">Add Dashboard User</h3>
        <input
          type="email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="input-field mb-4"
          placeholder="Email"
          disabled={isLoading}
        />
        <input
          type="password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="input-field mb-4"
          placeholder="Password"
          disabled={isLoading}
        />
        <button
          onClick={handleAddUser}
          className="btn-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Adding...' : 'Add User'}
        </button>
      </div>

      <div className="settings-section">
        <h3 className="text-xl mb-4">Manage Users</h3>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 bg-accent">
              <span>{user.email}</span>
              <button
                onClick={() => handleRemoveUser(user.id)}
                className="btn-destructive"
                disabled={isLoading}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
