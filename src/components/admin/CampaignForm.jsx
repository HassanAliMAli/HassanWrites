import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';

const CampaignForm = ({ onCancel, onSave }) => {
    const [formData, setFormData] = useState({
        name: '',
        type: 'Direct',
        budget: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <Card className="max-w-md mx-auto mt-6">
            <CardHeader>
                <CardTitle>New Campaign</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Campaign Name</label>
                        <Input
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            placeholder="e.g. Summer Sale"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Type</label>
                        <select
                            className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="Direct">Direct</option>
                            <option value="Affiliate">Affiliate</option>
                            <option value="Programmatic">Programmatic</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Budget</label>
                        <Input
                            value={formData.budget}
                            onChange={e => setFormData({ ...formData, budget: e.target.value })}
                            placeholder="$1000"
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2">
                    <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button type="submit">Create Campaign</Button>
                </CardFooter>
            </form>
        </Card>
    );
};

export default CampaignForm;
