import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Edit, Trash2, Eye } from 'lucide-react';
import '@/pages/admin/AdminTable.css';

export const PostTable = ({ posts }) => {
    return (
        <Card>
            <CardContent className="p-0">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Views</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.map((post) => (
                            <tr key={post.id}>
                                <td className="font-medium">{post.title}</td>
                                <td>{post.author}</td>
                                <td>
                                    <Badge variant={post.status === 'Published' ? 'default' : 'secondary'}>
                                        {post.status}
                                    </Badge>
                                </td>
                                <td className="text-muted">{post.date}</td>
                                <td>{post.views.toLocaleString()}</td>
                                <td className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon"><Eye size={16} /></Button>
                                        <Button variant="ghost" size="icon"><Edit size={16} /></Button>
                                        <Button variant="ghost" size="icon" className="text-error"><Trash2 size={16} /></Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
};
