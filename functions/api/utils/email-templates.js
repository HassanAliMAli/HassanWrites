// Email templates for subscriber communications

export const emailTemplates = {
    welcome: (magicLink, tier) => ({
        subject: 'Welcome to HassanWrites Premium!',
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to HassanWrites!</h1>
    </div>
    
    <div style="background: white; padding: 40px 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; margin-bottom: 20px;">Thank you for subscribing to <strong>${tier === 'premium' ? 'Premium' : 'Newsletter'}</strong>!</p>
        
        <p style="font-size: 16px; margin-bottom: 30px;">Click the button below to access your premium content:</p>
        
        <div style="text-align: center; margin: 40px 0;">
            <a href="${magicLink}" style="background: #667eea; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px;">Access Premium Content</a>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="margin-top: 0; color: #667eea; font-size: 18px;">What you get:</h3>
            <ul style="margin: 10px 0; padding-left: 20px;">
                ${tier === 'premium' ? `
                <li>Access to all premium articles</li>
                <li>Weekly newsletter delivered to your inbox</li>
                <li>Exclusive insights and stories</li>
                <li>Ad-free reading experience</li>
                ` : `
                <li>Weekly newsletter delivered to your inbox</li>
                <li>Exclusive newsletter-only content</li>
                <li>Early access to new articles</li>
                `}
            </ul>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 40px;">
            Need to manage your subscription? <a href="https://hassanwrites.com/membership" style="color: #667eea;">Click here</a>
        </p>
        
        <p style="font-size: 14px; color: #666;">
            Questions? Reply to this email or contact support@hassanwrites.com
        </p>
    </div>
    
    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
        <p>HassanWrites &copy; ${new Date().getFullYear()}</p>
    </div>
</body>
</html>
        `.trim()
    }),

    magicLink: (magicLink) => ({
        subject: 'Access Your Premium Content',
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: white; padding: 40px 30px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #667eea; margin-top: 0;">Ready to read?</h2>
        
        <p style="font-size: 16px; margin-bottom: 30px;">Click the button below to access your premium content:</p>
        
        <div style="text-align: center; margin: 40px 0;">
            <a href="${magicLink}" style="background: #667eea; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px;">Access Content</a>
        </div>
        
        <p style="font-size: 14px; color: #666; border-top: 1px solid #e0e0e0; padding-top: 20px; margin-top: 40px;">
            This link expires in 1 hour and can only be used once.
        </p>
    </div>
</body>
</html>
        `.trim()
    }),

    paymentFailed: (portalLink) => ({
        subject: 'Payment Failed - Action Required',
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: white; padding: 40px 30px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #dc3545; margin-top: 0;">Payment Issue</h2>
        
        <p style="font-size: 16px; margin-bottom: 20px;">We were unable to process your recent payment for HassanWrites.</p>
        
        <p style="font-size: 16px; margin-bottom: 30px;">Please update your payment method to continue enjoying premium content.</p>
        
        <div style="text-align: center; margin: 40px 0;">
            <a href="${portalLink}" style="background: #dc3545; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px;">Update Payment Method</a>
        </div>
        
        <p style="font-size: 14px; color: #666;">
            If you have questions, please contact support@hassanwrites.com
        </p>
    </div>
</body>
</html>
        `.trim()
    }),

    subscriptionCanceled: () => ({
        subject: 'Your Subscription Has Been Canceled',
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: white; padding: 40px 30px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #333; margin-top: 0;">We're sorry to see you go</h2>
        
        <p style="font-size: 16px; margin-bottom: 20px;">Your HassanWrites subscription has been canceled.</p>
        
        <p style="font-size: 16px; margin-bottom: 30px;">You'll continue to have access until the end of your current billing period.</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <p style="margin: 0; font-size: 14px; color: #666;">
                Changed your mind? You can resubscribe anytime at <a href="https://hassanwrites.com/membership" style="color: #667eea;">hassanwrites.com/membership</a>
            </p>
        </div>
        
        <p style="font-size: 14px; color: #666; margin-top: 40px;">
            We'd love to hear your feedback. Reply to this email to let us know how we can improve.
        </p>
    </div>
</body>
</html>
        `.trim()
    })
};
