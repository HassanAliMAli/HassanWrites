import React, { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import CampaignForm from '@/components/admin/CampaignForm';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Plus, BarChart2 } from 'lucide-react';

const Campaigns = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const loadCampaigns = async () => {
            try {
                const data = await api.getCampaigns();
                setCampaigns(data);
            } catch {
                // Error handling
            } finally {
                setIsLoading(false);
            }
        };
        loadCampaigns();
    }, []);

    const handleCreate = async (data) => {
        try {
            await api.createCampaign(data);
            // Refresh list
            const updated = await api.getCampaigns();
            setCampaigns(updated);
            setShowForm(false);
        } catch {
            // Error handling
        }
    }


    if (showForm) {
        return (
            <div className="admin-page">
                <CampaignForm onCancel={() => setShowForm(false)} onSave={handleCreate} />
            </div>
        );
    }

    if (isLoading) return <div className="p-8 text-center">Loading campaigns...</div>;

    return (
        <div className="admin-page">
            <div className="admin-header mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold">Ad Campaigns</h1>
                <Button onClick={() => setShowForm(true)}>
                    <Plus size={18} className="mr-2" />
                    New Campaign
                </Button>
            </div>

            <div className="grid gap-6">
                {campaigns.map(campaign => (
                    <Card key={campaign.id}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <div className="flex items-center gap-3">
                                <CardTitle className="text-lg">{campaign.name}</CardTitle>
                                <Badge variant={campaign.status === 'Active' ? 'default' : 'secondary'}>
                                    {campaign.status}
                                </Badge>
                                <Badge variant="outline">{campaign.type}</Badge>
                            </div>
                            <Button variant="ghost" size="icon">
                                <BarChart2 size={18} />
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Impressions</p>
                                    <p className="font-medium text-lg">{campaign.impressions}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Clicks</p>
                                    <p className="font-medium text-lg">{campaign.clicks}</p>
                                </div>
                                <div>
                                    <p className="text-muted-foreground">Budget</p>
                                    <p className="font-medium text-lg">{campaign.budget}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Campaigns;
