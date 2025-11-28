import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/toast-context';
import { Globe, Palette, Search, Mail, Share2, FileText, Lock, BarChart, Bell } from 'lucide-react';
import './Admin.css';
import './Settings.css';

const Settings = () => {
    const { addToast } = useToast();
    const [activeTab, setActiveTab] = useState('general');

    const [generalSettings, setGeneralSettings] = useState({
        siteName: 'HassanWrites',
        tagline: 'Insights and Stories',
        siteUrl: 'https://hassanwrites.com',
        timezone: 'UTC',
        contactEmail: 'contact@hassanwrites.com'
    });

    const [brandingSettings, setBrandingSettings] = useState({
        primaryColor: '#6366f1',
        accentColor: '#f59e0b',
        customCSS: ''
    });

    const [seoSettings, setSeoSettings] = useState({
        metaTitle: 'HassanWrites - Insights and Stories',
        metaDescription: 'Personal blog by Hassan - thoughts, stories, and insights.',
        ogImage: '',
        twitterHandle: '@hassanwrites',
        googleAnalyticsId: '',
        sitemap: true
    });

    const [newsletterSettings, setNewsletterSettings] = useState({
        enabled: true,
        sendFrequency: 'weekly',
        fromName: 'Hassan',
        fromEmail: 'newsletter@hassanwrites.com'
    });



    const [socialSettings, setSocialSettings] = useState({
        twitter: '',
        facebook: '',
        linkedin: '',
        instagram: '',
        github: '',
        youtube: ''
    });

    const [contentSettings, setContentSettings] = useState({
        postsPerPage: '10',
        commentsEnabled: true,
        moderateComments: true
    });

    const [privacySettings, setPrivacySettings] = useState({
        showAuthorEmail: false,
        allowSearchEngines: true,
        gdprCompliant: true,
        cookieConsent: true
    });

    const [analyticsSettings, setAnalyticsSettings] = useState({
        googleAnalytics: '',
        trackPageViews: true
    });

    const [notificationSettings, setNotificationSettings] = useState({
        emailOnComment: true,
        emailOnSubscription: true
    });

    const tabs = [
        { id: 'general', label: 'General', icon: Globe },
        { id: 'branding', label: 'Branding', icon: Palette },
        { id: 'seo', label: 'SEO', icon: Search },
        { id: 'newsletter', label: 'Newsletter', icon: Mail },

        { id: 'social', label: 'Social Media', icon: Share2 },
        { id: 'content', label: 'Content', icon: FileText },
        { id: 'privacy', label: 'Privacy', icon: Lock },
        { id: 'analytics', label: 'Analytics', icon: BarChart },
        { id: 'notifications', label: 'Notifications', icon: Bell }
    ];

    const handleSave = (section) => {
        addToast({
            title: 'Settings Saved',
            description: `${section} settings updated successfully!`,
            type: 'success'
        });
    };

    return (
        <div className="admin-page">
            <h1 className="admin-title">Settings</h1>

            <div className="settings-container">
                <div className="settings-tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`settings-tab ${activeTab === tab.id ? 'active' : ''}`}
                        >
                            <tab.icon size={18} />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                <div className="settings-content">
                    {activeTab === 'general' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>General Settings</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <label className="settings-label">Site Name</label>
                                        <Input
                                            value={generalSettings.siteName}
                                            onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="settings-label">Tagline</label>
                                        <Input
                                            value={generalSettings.tagline}
                                            onChange={(e) => setGeneralSettings({ ...generalSettings, tagline: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="settings-label">Site URL</label>
                                        <Input
                                            type="url"
                                            value={generalSettings.siteUrl}
                                            onChange={(e) => setGeneralSettings({ ...generalSettings, siteUrl: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="settings-label">Timezone</label>
                                        <select
                                            className="settings-select"
                                            value={generalSettings.timezone}
                                            onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                                        >
                                            <option value="UTC">UTC</option>
                                            <option value="America/New_York">Eastern Time</option>
                                            <option value="America/Chicago">Central Time</option>
                                            <option value="America/Los_Angeles">Pacific Time</option>
                                            <option value="Europe/London">London</option>
                                            <option value="Asia/Dubai">Dubai</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="settings-label">Contact Email</label>
                                        <Input
                                            type="email"
                                            value={generalSettings.contactEmail}
                                            onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                                        />
                                    </div>
                                    <Button onClick={() => handleSave('General')}>Save Changes</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'branding' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Branding & Design</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="settings-label">Primary Color</label>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="color"
                                                    value={brandingSettings.primaryColor}
                                                    onChange={(e) => setBrandingSettings({ ...brandingSettings, primaryColor: e.target.value })}
                                                    className="w-20 h-10"
                                                />
                                                <Input
                                                    value={brandingSettings.primaryColor}
                                                    onChange={(e) => setBrandingSettings({ ...brandingSettings, primaryColor: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="settings-label">Accent Color</label>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="color"
                                                    value={brandingSettings.accentColor}
                                                    onChange={(e) => setBrandingSettings({ ...brandingSettings, accentColor: e.target.value })}
                                                    className="w-20 h-10"
                                                />
                                                <Input
                                                    value={brandingSettings.accentColor}
                                                    onChange={(e) => setBrandingSettings({ ...brandingSettings, accentColor: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="settings-label">Custom CSS</label>
                                        <textarea
                                            className="settings-textarea"
                                            rows="10"
                                            value={brandingSettings.customCSS}
                                            onChange={(e) => setBrandingSettings({ ...brandingSettings, customCSS: e.target.value })}
                                            placeholder="/* Add your custom CSS here */"
                                        />
                                    </div>
                                    <Button onClick={() => handleSave('Branding')}>Save Changes</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'seo' && (
                        <Card>
                            <CardHeader><CardTitle>SEO & Metadata</CardTitle></CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <label className="settings-label">Meta Title</label>
                                        <Input value={seoSettings.metaTitle} onChange={(e) => setSeoSettings({ ...seoSettings, metaTitle: e.target.value })} maxLength="60" />
                                        <p className="settings-hint">{seoSettings.metaTitle.length}/60 characters</p>
                                    </div>
                                    <div>
                                        <label className="settings-label">Meta Description</label>
                                        <textarea className="settings-textarea" rows="3" value={seoSettings.metaDescription} onChange={(e) => setSeoSettings({ ...seoSettings, metaDescription: e.target.value })} maxLength="160" />
                                        <p className="settings-hint">{seoSettings.metaDescription.length}/160 characters</p>
                                    </div>
                                    <div>
                                        <label className="settings-label">Twitter Handle</label>
                                        <Input value={seoSettings.twitterHandle} onChange={(e) => setSeoSettings({ ...seoSettings, twitterHandle: e.target.value })} placeholder="@username" />
                                    </div>
                                    <div>
                                        <label className="settings-label">Google Analytics ID</label>
                                        <Input value={seoSettings.googleAnalyticsId} onChange={(e) => setSeoSettings({ ...seoSettings, googleAnalyticsId: e.target.value })} placeholder="G-XXXXXXXXXX" />
                                    </div>
                                    <div className="settings-checkbox-group">
                                        <label className="settings-checkbox">
                                            <input type="checkbox" checked={seoSettings.sitemap} onChange={(e) => setSeoSettings({ ...seoSettings, sitemap: e.target.checked })} />
                                            <span>Generate XML Sitemap</span>
                                        </label>
                                    </div>
                                    <Button onClick={() => handleSave('SEO')}>Save Changes</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'newsletter' && (
                        <Card>
                            <CardHeader><CardTitle>Newsletter & Email</CardTitle></CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <label className="settings-checkbox">
                                        <input type="checkbox" checked={newsletterSettings.enabled} onChange={(e) => setNewsletterSettings({ ...newsletterSettings, enabled: e.target.checked })} />
                                        <span>Enable Newsletter</span>
                                    </label>
                                    <div>
                                        <label className="settings-label">Send Frequency</label>
                                        <select className="settings-select" value={newsletterSettings.sendFrequency} onChange={(e) => setNewsletterSettings({ ...newsletterSettings, sendFrequency: e.target.value })}>
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="biweekly">Bi-weekly</option>
                                            <option value="monthly">Monthly</option>
                                        </select>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="settings-label">From Name</label>
                                            <Input value={newsletterSettings.fromName} onChange={(e) => setNewsletterSettings({ ...newsletterSettings, fromName: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="settings-label">From Email</label>
                                            <Input type="email" value={newsletterSettings.fromEmail} onChange={(e) => setNewsletterSettings({ ...newsletterSettings, fromEmail: e.target.value })} />
                                        </div>
                                    </div>
                                    <Button onClick={() => handleSave('Newsletter')}>Save Changes</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}



                    {activeTab === 'social' && (
                        <Card>
                            <CardHeader><CardTitle>Social Media Integration</CardTitle></CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <label className="settings-label">Twitter</label>
                                        <Input value={socialSettings.twitter} onChange={(e) => setSocialSettings({ ...socialSettings, twitter: e.target.value })} placeholder="https://twitter.com/username" />
                                    </div>
                                    <div>
                                        <label className="settings-label">Facebook</label>
                                        <Input value={socialSettings.facebook} onChange={(e) => setSocialSettings({ ...socialSettings, facebook: e.target.value })} placeholder="https://facebook.com/username" />
                                    </div>
                                    <div>
                                        <label className="settings-label">LinkedIn</label>
                                        <Input value={socialSettings.linkedin} onChange={(e) => setSocialSettings({ ...socialSettings, linkedin: e.target.value })} placeholder="https://linkedin.com/in/username" />
                                    </div>
                                    <div>
                                        <label className="settings-label">Instagram</label>
                                        <Input value={socialSettings.instagram} onChange={(e) => setSocialSettings({ ...socialSettings, instagram: e.target.value })} placeholder="https://instagram.com/username" />
                                    </div>
                                    <div>
                                        <label className="settings-label">GitHub</label>
                                        <Input value={socialSettings.github} onChange={(e) => setSocialSettings({ ...socialSettings, github: e.target.value })} placeholder="https://github.com/username" />
                                    </div>
                                    <div>
                                        <label className="settings-label">YouTube</label>
                                        <Input value={socialSettings.youtube} onChange={(e) => setSocialSettings({ ...socialSettings, youtube: e.target.value })} placeholder="https://youtube.com/@username" />
                                    </div>
                                    <Button onClick={() => handleSave('Social Media')}>Save Changes</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'content' && (
                        <Card>
                            <CardHeader><CardTitle>Content & Publishing</CardTitle></CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <label className="settings-label">Posts Per Page</label>
                                        <Input type="number" value={contentSettings.postsPerPage} onChange={(e) => setContentSettings({ ...contentSettings, postsPerPage: e.target.value })} min="1" max="50" />
                                    </div>
                                    <div className="settings-checkbox-group">
                                        <label className="settings-checkbox">
                                            <input type="checkbox" checked={contentSettings.commentsEnabled} onChange={(e) => setContentSettings({ ...contentSettings, commentsEnabled: e.target.checked })} />
                                            <span>Enable Comments</span>
                                        </label>
                                        <label className="settings-checkbox">
                                            <input type="checkbox" checked={contentSettings.moderateComments} onChange={(e) => setContentSettings({ ...contentSettings, moderateComments: e.target.checked })} />
                                            <span>Moderate Comments Before Publishing</span>
                                        </label>
                                    </div>
                                    <Button onClick={() => handleSave('Content')}>Save Changes</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'privacy' && (
                        <Card>
                            <CardHeader><CardTitle>Privacy & Security</CardTitle></CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="settings-checkbox-group">
                                        <label className="settings-checkbox">
                                            <input type="checkbox" checked={privacySettings.showAuthorEmail} onChange={(e) => setPrivacySettings({ ...privacySettings, showAuthorEmail: e.target.checked })} />
                                            <span>Show Author Email Publicly</span>
                                        </label>
                                        <label className="settings-checkbox">
                                            <input type="checkbox" checked={privacySettings.allowSearchEngines} onChange={(e) => setPrivacySettings({ ...privacySettings, allowSearchEngines: e.target.checked })} />
                                            <span>Allow Search Engine Indexing</span>
                                        </label>
                                        <label className="settings-checkbox">
                                            <input type="checkbox" checked={privacySettings.gdprCompliant} onChange={(e) => setPrivacySettings({ ...privacySettings, gdprCompliant: e.target.checked })} />
                                            <span>GDPR Compliance Mode</span>
                                        </label>
                                        <label className="settings-checkbox">
                                            <input type="checkbox" checked={privacySettings.cookieConsent} onChange={(e) => setPrivacySettings({ ...privacySettings, cookieConsent: e.target.checked })} />
                                            <span>Show Cookie Consent Banner</span>
                                        </label>
                                    </div>
                                    <Button onClick={() => handleSave('Privacy')}>Save Changes</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'analytics' && (
                        <Card>
                            <CardHeader><CardTitle>Analytics & Tracking</CardTitle></CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <label className="settings-label">Google Analytics ID</label>
                                        <Input value={analyticsSettings.googleAnalytics} onChange={(e) => setAnalyticsSettings({ ...analyticsSettings, googleAnalytics: e.target.value })} placeholder="G-XXXXXXXXXX" />
                                    </div>
                                    <div className="settings-checkbox-group">
                                        <label className="settings-checkbox">
                                            <input type="checkbox" checked={analyticsSettings.trackPageViews} onChange={(e) => setAnalyticsSettings({ ...analyticsSettings, trackPageViews: e.target.checked })} />
                                            <span>Track Page Views</span>
                                        </label>
                                    </div>
                                    <Button onClick={() => handleSave('Analytics')}>Save Changes</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {activeTab === 'notifications' && (
                        <Card>
                            <CardHeader><CardTitle>Notification Settings</CardTitle></CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="settings-checkbox-group">
                                        <label className="settings-checkbox">
                                            <input type="checkbox" checked={notificationSettings.emailOnComment} onChange={(e) => setNotificationSettings({ ...notificationSettings, emailOnComment: e.target.checked })} />
                                            <span>Email on New Comment</span>
                                        </label>
                                        <label className="settings-checkbox">
                                            <input type="checkbox" checked={notificationSettings.emailOnSubscription} onChange={(e) => setNotificationSettings({ ...notificationSettings, emailOnSubscription: e.target.checked })} />
                                            <span>Email on New Subscription</span>
                                        </label>
                                    </div>
                                    <Button onClick={() => handleSave('Notifications')}>Save Changes</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
