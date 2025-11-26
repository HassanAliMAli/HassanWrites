import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { PayoutDashboard } from '@/components/admin/PayoutDashboard';
import { DollarSign } from 'lucide-react';

const Payouts = () => {
    const [payouts, setPayouts] = useState([]);
    const [stats, setStats] = useState({ pendingBalance: '$0.00', nextPayoutDate: '-' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [payoutsData, statsData] = await Promise.all([
                    api.getPayouts(),
                    api.getPayoutStats()
                ]);
                setPayouts(payoutsData);
                setStats(statsData);
            } catch (error) {
                console.error('Failed to load payouts', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    if (isLoading) return <div className="p-8 text-center">Loading payouts...</div>;

    return (
        <div className="admin-page">
            <div className="admin-header mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Payouts</h1>
                <Button variant="outline">
                    <DollarSign size={18} className="mr-2" />
                    Configure Stripe
                </Button>
            </div>

            <PayoutDashboard
                payouts={payouts}
                pendingBalance={stats.pendingBalance}
                nextPayoutDate={stats.nextPayoutDate}
            />
        </div>
    );
};

export default Payouts;
