import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Users, Eye, FileText, DollarSign } from 'lucide-react';
import AnalyticsCharts from '@/components/admin/AnalyticsCharts';
import './Admin.css';

const Dashboard = () => {
    const stats = [
        { label: 'Total Views', value: '45.2K', change: '+12%', icon: Eye },
        { label: 'Active Users', value: '1,205', change: '+5%', icon: Users },
        { label: 'Published Posts', value: '84', change: '+2', icon: FileText },
        { label: 'Revenue', value: '$2,450', change: '+18%', icon: DollarSign },
    ];

    return (
        <div className="admin-page">
            <h1 className="admin-title">Dashboard</h1>

            <div className="stats-grid">
                {stats.map((stat) => (
                    <Card key={stat.label}>
                        <CardContent className="stat-card">
                            <div className="stat-info">
                                <p className="stat-label">{stat.label}</p>
                                <p className="stat-value">{stat.value}</p>
                            </div>
                            <div className="stat-icon-wrapper">
                                <stat.icon size={24} className="stat-icon" />
                            </div>
                        </CardContent>
                        <div className="stat-footer">
                            <span className="stat-change text-success">{stat.change}</span>
                            <span className="stat-period">from last month</span>
                        </div>
                    </Card>
                ))}
            </div>

            <AnalyticsCharts />
        </div>
    );
};

export default Dashboard;
