import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Mail, Search, Download, Users } from 'lucide-react';
import { api } from '@/lib/api';
import './Admin.css';

const Subscribers = () => {
    const [subscribers, setSubscribers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterTier, setFilterTier] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSubscribers = async () => {
            try {
                const data = await api.getSubscribers();
                setSubscribers(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Failed to fetch subscribers:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubscribers();
    }, []);

    const filteredSubscribers = subscribers.filter(sub => {
        const matchesSearch = sub.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTier = filterTier === 'all' || sub.subscription_tier === filterTier;
        const matchesStatus = filterStatus === 'all' || sub.subscription_status === filterStatus;
        return matchesSearch && matchesTier && matchesStatus;
    });

    const stats = {
        total: subscribers.length,
        active: subscribers.filter(s => s.subscription_status === 'active').length,
        premium: subscribers.filter(s => s.subscription_tier === 'premium' && s.subscription_status === 'active').length,
        newsletter: subscribers.filter(s => s.subscription_tier === 'newsletter' && s.subscription_status === 'active').length,
    };

    const handleExportCSV = () => {
        const csv = [
            ['Email', 'Tier', 'Status', 'Subscribed Date'].join(','),
            ...filteredSubscribers.map(s => [
                s.email,
                s.subscription_tier,
                s.subscription_status,
                new Date(s.created_at).toLocaleDateString()
            ].join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    return (
        <div className="admin-page">
            <div className="flex justify-between items-center mb-6">
                <h1 className="admin-title">Subscribers</h1>
                <Button onClick={handleExportCSV} className="gap-2">
                    <Download size={18} />
                    Export CSV
                </Button>
            </div>

            {/* Stats */}
            <div className="stats-grid mb-6">
                <Card>
                    <CardContent className="stat-card">
                        <div className="stat-info">
                            <p className="stat-label">Total Subscribers</p>
                            <p className="stat-value">{stats.total}</p>
                        </div>
                        <div className="stat-icon-wrapper">
                            <Users size={24} className="stat-icon" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="stat-card">
                        <div className="stat-info">
                            <p className="stat-label">Active</p>
                            <p className="stat-value">{stats.active}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="stat-card">
                        <div className="stat-info">
                            <p className="stat-label">Premium</p>
                            <p className="stat-value">{stats.premium}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="stat-card">
                        <div className="stat-info">
                            <p className="stat-label">Newsletter</p>
                            <p className="stat-value">{stats.newsletter}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="flex gap-4 flex-wrap">
                        <div className="flex-1 min-w-[250px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted" size={18} />
                                <Input
                                    placeholder="Search by email..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                        <select
                            value={filterTier}
                            onChange={(e) => setFilterTier(e.target.value)}
                            className="px-4 py-2 border rounded-lg"
                        >
                            <option value="all">All Tiers</option>
                            <option value="newsletter">Newsletter</option>
                            <option value="premium">Premium</option>
                        </select>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border rounded-lg"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="canceled">Canceled</option>
                            <option value="past_due">Past Due</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Subscribers Table */}
            <Card>
                <CardHeader>
                    <CardTitle>All Subscribers ({filteredSubscribers.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left p-3">Email</th>
                                    <th className="text-left p-3">Tier</th>
                                    <th className="text-left p-3">Status</th>
                                    <th className="text-left p-3">Subscribed</th>
                                    <th className="text-left p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="5" className="p-8 text-center text-muted">Loading subscribers...</td>
                                    </tr>
                                ) : filteredSubscribers.map((subscriber) => (
                                    <tr key={subscriber.id} className="border-b hover:bg-muted/50">
                                        <td className="p-3">{subscriber.email}</td>
                                        <td className="p-3">
                                            <Badge variant={subscriber.subscription_tier === 'premium' ? 'default' : 'secondary'}>
                                                {subscriber.subscription_tier}
                                            </Badge>
                                        </td>
                                        <td className="p-3">
                                            <Badge variant={subscriber.subscription_status === 'active' ? 'success' : 'secondary'}>
                                                {subscriber.subscription_status}
                                            </Badge>
                                        </td>
                                        <td className="p-3 text-sm text-muted">
                                            {new Date(subscriber.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="p-3">
                                            <Button variant="ghost" size="sm" className="gap-2">
                                                <Mail size={16} />
                                                Send Link
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {!isLoading && filteredSubscribers.length === 0 && (
                            <div className="text-center py-12 text-muted">
                                No subscribers found
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Subscribers;
