import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Check, Mail } from 'lucide-react';
import { SEO } from '@/components/seo/SEO';
import './Membership.css';

const SubscribeSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');

    useEffect(() => {
        // Get session_id from URL (Stripe redirects with this)
        const sessionId = searchParams.get('session_id');

        if (!sessionId) {
            navigate('/membership');
        }

        // In production, you could verify the session with Stripe here
        // For now, we'll show the success message
    }, [searchParams, navigate]);

    return (
        <>
            <SEO
                title="Welcome to HassanWrites Premium!"
                description="Thank you for subscribing. Check your email for access instructions."
            />
            <div className="membership-page">
                <div className="container">
                    <div className="membership-hero">
                        <div style={{ textAlign: 'center', margin: '3rem auto' }}>
                            <div className="success-icon" style={{
                                fontSize: '4rem',
                                color: 'var(--color-success)',
                                marginBottom: '1rem'
                            }}>
                                ✓
                            </div>
                            <h1 className="membership-title">Welcome to HassanWrites!</h1>
                            <p className="membership-subtitle" style={{ marginTop: '1rem' }}>
                                Thank you for subscribing. Your payment was successful!
                            </p>
                        </div>
                    </div>

                    <Card style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <CardHeader>
                            <CardTitle style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Mail size={24} />
                                Check Your Email
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>
                                    We've sent a magic link to your email address. Click the link in the email to access your premium content.
                                </p>

                                <div style={{
                                    background: 'var(--color-bg-secondary)',
                                    padding: '1.5rem',
                                    borderRadius: '8px',
                                    margin: '1.5rem 0'
                                }}>
                                    <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>What's Next?</h3>
                                    <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '1.8' }}>
                                        <li>Check your email inbox</li>
                                        <li>Click the "Access Premium Content" button</li>
                                        <li>You'll be logged in for 30 days</li>
                                        <li>Enjoy all premium articles!</li>
                                    </ul>
                                </div>

                                <p style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>
                                    <strong>Didn't receive the email?</strong> Check your spam folder, or contact support@hassanwrites.com
                                </p>

                                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                                    <Button onClick={() => navigate('/')} style={{ flex: 1 }}>
                                        Go to Homepage
                                    </Button>
                                    <Button variant="outline" onClick={() => navigate('/membership')} style={{ flex: 1 }}>
                                        Manage Subscription
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center' }}>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.9rem' }}>
                            You can manage your subscription, update payment method, or cancel anytime from the membership page.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default SubscribeSuccess;
