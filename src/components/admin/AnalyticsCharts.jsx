import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import './AnalyticsCharts.css';

const AnalyticsCharts = () => {
    return (
        <div className="analytics-grid">
            <Card className="chart-card">
                <CardHeader>
                    <CardTitle>Page Views Overview</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="chart-container">
                        <div className="bar-chart">
                            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                                <div key={i} className="bar-group">
                                    <div
                                        className="bar"
                                        style={{ height: `${h}%`, animationDelay: `${i * 50}ms` }}
                                        title={`${h}%`}
                                    />
                                    <span className="bar-label">{i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card className="chart-card">
                <CardHeader>
                    <CardTitle>Traffic Sources</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="traffic-list">
                        <div className="traffic-item">
                            <div className="traffic-info">
                                <span className="traffic-label">Direct</span>
                                <div className="traffic-bar-bg">
                                    <div className="traffic-bar" style={{ width: '45%' }} />
                                </div>
                            </div>
                            <span className="traffic-value">45%</span>
                        </div>
                        <div className="traffic-item">
                            <div className="traffic-info">
                                <span className="traffic-label">Social</span>
                                <div className="traffic-bar-bg">
                                    <div className="traffic-bar" style={{ width: '30%', backgroundColor: 'var(--color-warning)' }} />
                                </div>
                            </div>
                            <span className="traffic-value">30%</span>
                        </div>
                        <div className="traffic-item">
                            <div className="traffic-info">
                                <span className="traffic-label">Organic</span>
                                <div className="traffic-bar-bg">
                                    <div className="traffic-bar" style={{ width: '25%', backgroundColor: 'var(--color-success)' }} />
                                </div>
                            </div>
                            <span className="traffic-value">25%</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default AnalyticsCharts;
