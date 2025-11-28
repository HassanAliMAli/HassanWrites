import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { UserTable } from '@/components/admin/UserTable';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/toast-context';
import { api } from '@/lib/api';
import './Admin.css';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isInviting, setIsInviting] = useState(false);
    const [showInviteForm, setShowInviteForm] = useState(false);
    const [inviteData, setInviteData] = useState({ email: '', name: '', role: 'reader' });
    const { addToast } = useToast();

    const loadUsers = React.useCallback(async () => {
        try {
            const data = await api.getUsers();
            setUsers(data);
        } catch {
            addToast({ title: 'Error', description: 'Failed to load users', type: 'error' });
        } finally {
            setIsLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const handleInvite = async (e) => {
        e.preventDefault();
        setIsInviting(true);

        try {
            await api.createUser(inviteData);
            addToast({ title: 'Success', description: 'User created successfully', type: 'success' });
            setShowInviteForm(false);
            setInviteData({ email: '', name: '', role: 'reader' });
            loadUsers();
        } catch (error) {
            addToast({ title: 'Error', description: error.message, type: 'error' });
        } finally {
            setIsInviting(false);
        }
    };

    const handleDelete = async (userId) => {
        if (!confirm('Are you sure you want to delete this user?')) return;

        try {
            await api.deleteUser(userId);
            addToast({ title: 'Success', description: 'User deleted', type: 'success' });
            loadUsers();
        } catch {
            addToast({ title: 'Error', description: 'Failed to delete user', type: 'error' });
        }
    };

    if (isLoading) {
        return <div className="admin-page"><p>Loading...</p></div>;
    }

    return (
        <div className="admin-page">
            <div className="flex justify-between items-center mb-6">
                <h1 className="admin-title">Users</h1>
                <Button onClick={() => setShowInviteForm(!showInviteForm)}>
                    {showInviteForm ? 'Cancel' : 'Add User'}
                </Button>
            </div>

            {showInviteForm && (
                <div className="bg-surface p-6 rounded-lg mb-6">
                    <h2 className="text-lg font-semibold mb-4">Create New User</h2>
                    <form onSubmit={handleInvite} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Email</label>
                            <Input
                                type="email"
                                value={inviteData.email}
                                onChange={(e) => setInviteData({ ...inviteData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <Input
                                type="text"
                                value={inviteData.name}
                                onChange={(e) => setInviteData({ ...inviteData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Role</label>
                            <select
                                className="w-full p-2 rounded border"
                                value={inviteData.role}
                                onChange={(e) => setInviteData({ ...inviteData, role: e.target.value })}
                            >
                                <option value="reader">Reader</option>
                                <option value="author">Author</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        <Button type="submit" disabled={isInviting}>
                            {isInviting ? 'Creating...' : 'Create User'}
                        </Button>
                    </form>
                </div>
            )}

            <UserTable users={users} onDelete={handleDelete} />
        </div>
    );
};

export default Users;
