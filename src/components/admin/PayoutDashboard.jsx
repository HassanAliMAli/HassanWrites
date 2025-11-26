import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Download } from 'lucide-react';

export const PayoutDashboard = ({ payouts, pendingBalance, nextPayoutDate }) => {
    return (
        <>
            <div className="grid gap-6 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pending Balance</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{pendingBalance}</div>
                        <p className="text-xs text-muted-foreground mt-1">Next payout on {nextPayoutDate}</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Payout History</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="w-full overflow-auto">
                        <table className="w-full caption-bottom text-sm text-left">
                            <thead className="[&_tr]:border-b">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Date</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Amount</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Status</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground">Method</th>
                                    <th className="h-12 px-4 align-middle font-medium text-muted-foreground text-right">Invoice</th>
                                </tr>
                            </thead>
                            <tbody className="[&_tr:last-child]:border-0">
                                {payouts.map((payout) => (
                                    <tr key={payout.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <td className="p-4 align-middle">{payout.date}</td>
                                        <td className="p-4 align-middle font-medium">{payout.amount}</td>
                                        <td className="p-4 align-middle">
                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                                {payout.status}
                                            </Badge>
                                        </td>
                                        <td className="p-4 align-middle">{payout.method}</td>
                                        <td className="p-4 align-middle text-right">
                                            <Button variant="ghost" size="icon">
                                                <Download size={16} />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </>
    );
};
