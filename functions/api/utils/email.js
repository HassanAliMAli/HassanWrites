// Email sending utility using Resend API
import { emailTemplates } from './email-templates.js';

export async function sendEmail(to, template, data, env) {
    try {
        if (!env.RESEND_API_KEY) {
            console.warn('RESEND_API_KEY not configured, skipping email');
            return { success: false, error: 'Email not configured' };
        }

        const emailData = emailTemplates[template](data);

        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${env.RESEND_API_KEY}`
            },
            body: JSON.stringify({
                from: env.FROM_EMAIL || 'HassanWrites <newsletter@hassanwrites.com>',
                to: [to],
                subject: emailData.subject,
                html: emailData.html
            })
        });

        if (!response.ok) {
            const error = await response.text();
            console.error('Email send failed:', error);
            return { success: false, error };
        }

        const result = await response.json();
        return { success: true, id: result.id };

    } catch (error) {
        console.error('Email error:', error);
        return { success: false, error: error.message };
    }
}

// Send welcome email with magic link
export async function sendWelcomeEmail(subscriber, magicLink, env) {
    return sendEmail(
        subscriber.email,
        'welcome',
        { magicLink, tier: subscriber.subscription_tier },
        env
    );
}

// Send magic link email
export async function sendMagicLinkEmail(email, magicLink, env) {
    return sendEmail(
        email,
        'magicLink',
        magicLink,
        env
    );
}

// Send payment failed email
export async function sendPaymentFailedEmail(email, portalLink, env) {
    return sendEmail(
        email,
        'paymentFailed',
        portalLink,
        env
    );
}

// Send cancellation email
export async function sendCancellationEmail(email, env) {
    return sendEmail(
        email,
        'subscriptionCanceled',
        {},
        env
    );
}
