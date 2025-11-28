import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { MoreHorizontal, Edit, Trash2, Mail } from 'lucide-react';
import { Dropdown, DropdownItem } from '@/components/ui/Dropdown';
import '@/pages/admin/AdminTable.css';

export const UserTable = ({ users, onDelete }) => {
    return (
        <Card>
            <CardContent className="p-0">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>
                                    <div className="flex items-center gap-2">
                                        <Avatar src={user.avatar} alt={user.name} size="sm" />
                                        <div>
                                            <div className="font-medium">{user.name}</div>
                                            <div className="text-muted text-xs">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>{user.role}</td>
                                <td>
                                    <Badge variant={user.status === 'Active' ? 'success' : 'secondary'}>
                                        {user.status || 'Active'}
                                    </Badge>
                                </td>
                                <td className="text-right">
                                    <Dropdown
                                        trigger={<Button variant="ghost" size="icon"><MoreHorizontal size={16} /></Button>}
                                        align="right"
                                    >
                                        <DropdownItem icon={Edit} onClick={() => { }}>Edit</DropdownItem>
                                        <DropdownItem icon={Mail} onClick={() => { }}>Email</DropdownItem>
                                        <DropdownItem icon={Trash2} danger onClick={() => onDelete?.(user.id)}>Delete</DropdownItem>
                                    </Dropdown>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
};
