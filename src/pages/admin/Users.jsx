import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { UserTable } from '@/components/admin/UserTable';

import './Admin.css';

const Users = () => {

    const users = [
        { id: 1, name: 'Hassan', email: 'hassan@example.com', role: 'Admin', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Hassan&background=6366f1&color=fff' },
        { id: 2, name: 'Sarah', email: 'sarah@example.com', role: 'Author', status: 'Active', avatar: 'https://ui-avatars.com/api/?name=Sarah&background=ec4899&color=fff' },
        { id: 3, name: 'John Doe', email: 'john@example.com', role: 'Reader', status: 'Active', avatar: null },
        { id: 4, name: 'Jane Smith', email: 'jane@example.com', role: 'Reader', status: 'Inactive', avatar: null },
    ];

    const [isInviting, setIsInviting] = useState(false);

    const handleInvite = async () => {
        setIsInviting(true);

        setTimeout(() => {
            setIsInviting(false);
        }, 1000);
    };

    return (
        <div className="admin-page">
            <div className="flex justify-between items-center">
                <h1 className="admin-title">Users</h1>
                <Button onClick={handleInvite} disabled={isInviting}>
                    {isInviting ? 'Sending Invite...' : 'Invite User'}
                </Button>
            </div>

            <UserTable users={users} />
        </div>
    );
};

export default Users;
