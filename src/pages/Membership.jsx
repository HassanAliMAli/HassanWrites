import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { SEO } from '@/components/seo/SEO';
import { useToast } from '@/components/ui/toast-context';
import './Membership.css';

const Membership = () => {
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(null);
    const { addToast } = useToast();

    const handleSubscribe = async (tier) => {
        if (!email) {
            addToast({
                title: 'Email required',
                description: 'Please enter your email address to continue',
                type: 'error'
            });
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            addToast({
                title: 'Invalid email',
                description: 'Please enter a valid email address',
                type: 'error'
            });
            return;
        }

        setLoading(tier);

        try {
            const response = await fetch('/api/stripe/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tier: tier.toLowerCase(),
                    email
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create checkout session');
            }

            const { checkoutUrl } = await response.json();

            // Redirect to Stripe Checkout
            window.location.href = checkoutUrl;

        } catch (error) {
            console.error('Checkout error:', error);
            addToast({
                title: 'Error',
                description: 'Failed to start checkout. Please try again.',
                type: 'error'
            });
            setLoading(null);
        }
    };

    const tiers = [
        {
            name: 'Newsletter',
            price: billingCycle === 'monthly' ? 5 : 50,
            description: 'Stay informed with curated insights',
            features: [
                'Weekly curated newsletter',
                'Important topics & insights',
                'Exclusive commentary',
                'Community access',
                'Cancel anytime'
            ],
            cta: 'Subscribe to Newsletter',
            popular: false
        },
        {
            name: 'Premium',
            price: billingCycle === 'monthly' ? 10 : 100,
            description: 'Get everything, plus all premium posts',
            features: [
                'Everything in Newsletter',
                'Access to all premium content',
                'Priority support',
                'Behind-the-scenes content',
                'Direct Q&A access',
                'Cancel anytime'
            ],
            cta: 'Subscribe to Premium',
            popular: true
        }
    ];

    return (
        <>
            <SEO
                title="Membership - HassanWrites"
                description="Join HassanWrites with exclusive newsletter access and premium content. Two tiers: Newsletter ($5/mo) and Premium ($10/mo)."
            />
            <div className="membership-page">
                <div className="container">
                    <div className="membership-hero">
                        <h1 className="membership-title">Support Quality Writing</h1>
                        <p className="membership-subtitle">
                            Get exclusive access to in-depth insights, curated newsletters, and premium content.
                            Join a community that values thoughtful content.
                        </p>
                        <p className="membership-support-msg">
                            Help us stay in business by supporting us as a paid member. If you enjoy our content,
                            your subscription helps us continue creating quality writing and valuable insights.
                        </p>

                        <div className="email-input-container">
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="email-input"
                            />
                        </div>
                    </div>

                    <div className="billing-toggle">
                        <button
                            className={`billing-option ${billingCycle === 'monthly' ? 'active' : ''}`}
                            onClick={() => setBillingCycle('monthly')}
                        >
                            Monthly
                        </button>
                        <button
                            className={`billing-option ${billingCycle === 'yearly' ? 'active' : ''}`}
                            onClick={() => setBillingCycle('yearly')}
                        >
                            Yearly
                            <span className="billing-badge">Save 17%</span>
                        </button>
                    </div>

                    <div className="pricing-grid">
                        {tiers.map((tier) => (
                            <Card key={tier.name} className={`pricing-card ${tier.popular ? 'popular' : ''}`}>
                                {tier.popular && <div className="popular-badge">Most Popular</div>}
                                <CardHeader>
                                    <CardTitle>{tier.name}</CardTitle>
                                    <p className="pricing-description">{tier.description}</p>
                                    <div className="pricing-amount">
                                        <span className="price">${tier.price}</span>
                                        <span className="period">/{billingCycle === 'monthly' ? 'month' : 'year'}</span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <ul className="features-list">
                                        {tier.features.map((feature, index) => (
                                            <li key={index} className="feature-item">
                                                <Check size={20} className="feature-icon" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Button
                                        className="w-full"
                                        size="lg"
                                        onClick={() => handleSubscribe(tier.name)}
                                        disabled={loading !== null}
                                    >
                                        {loading === tier.name ? 'Processing...' : tier.cta}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="membership-faq">
                    <h2>Frequently Asked Questions</h2>
                    <div className="faq-grid">
                        <div className="faq-item">
                            <h3>Can I cancel anytime?</h3>
                            <p>Yes! You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
                        </div>
                        <div className="faq-item">
                            <h3>What payment methods do you accept?</h3>
                            <p>We accept all major credit cards and debit cards through our secure payment processor, Stripe.</p>
                        </div>
                        <div className="faq-item">
                            <h3>How does early access work?</h3>
                            <p>Premium members get access to new posts a full week before they're published publicly. You'll receive an email notification when new content is available.</p>
                        </div>
                        <div className="faq-item">
                            <h3>Is there a free trial?</h3>
                            <p>Currently, we don't offer a free trial, but you can start with the Newsletter tier at $5/month to get a taste of the exclusive content.</p>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default Membership;
