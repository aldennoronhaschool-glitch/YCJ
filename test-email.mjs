// Test script to verify email configuration
// Run this with: node --loader ts-node/esm test-email.mjs

import { Resend } from 'resend';

async function testEmail() {
    console.log('🔍 Testing Email Configuration...\n');

    // Check environment variables
    const apiKey = process.env.RESEND_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;
    const fromEmail = process.env.FROM_EMAIL;

    console.log('Environment Variables:');
    console.log('✓ RESEND_API_KEY:', apiKey ? `Set (${apiKey.substring(0, 10)}...)` : '❌ NOT SET');
    console.log('✓ ADMIN_EMAIL:', adminEmail || '❌ NOT SET');
    console.log('✓ FROM_EMAIL:', fromEmail || '❌ NOT SET');
    console.log('');

    if (!apiKey) {
        console.error('❌ RESEND_API_KEY is not set in .env.local');
        console.log('\nPlease add: RESEND_API_KEY=re_your_api_key_here');
        process.exit(1);
    }

    if (!adminEmail) {
        console.error('❌ ADMIN_EMAIL is not set in .env.local');
        console.log('\nPlease add: ADMIN_EMAIL=your-email@example.com');
        process.exit(1);
    }

    try {
        const resend = new Resend(apiKey);

        console.log('📧 Sending test email...\n');

        const { data, error } = await resend.emails.send({
            from: fromEmail || 'onboarding@resend.dev',
            to: adminEmail,
            subject: '✅ Test Email - YCJ Website Notifications Working!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                        <h1 style="margin: 0;">✅ Email Notifications Working!</h1>
                    </div>
                    <div style="background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb;">
                        <p>Great news! Your email notification system is configured correctly.</p>
                        <p>You will now receive notifications when someone submits the contact form on your YCJ Church website.</p>
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
                        <p style="color: #6b7280; font-size: 12px;">
                            This is a test email sent at ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
                        </p>
                    </div>
                </div>
            `,
        });

        if (error) {
            console.error('❌ Error sending email:', error);
            console.log('\nPossible issues:');
            console.log('1. Invalid API key');
            console.log('2. Email address not verified (if using test domain)');
            console.log('3. Domain not verified (if using custom domain)');
            console.log('\nTo fix:');
            console.log('- Go to https://resend.com/emails');
            console.log('- Check your API key is correct');
            console.log('- If using onboarding@resend.dev, verify your admin email in Resend dashboard');
            process.exit(1);
        }

        console.log('✅ Email sent successfully!');
        console.log('📬 Email ID:', data?.id);
        console.log('\n🎉 Check your inbox at:', adminEmail);
        console.log('\n💡 If you don\'t see it:');
        console.log('   1. Check spam/junk folder');
        console.log('   2. Wait a few minutes');
        console.log('   3. Verify your email in Resend dashboard if using test domain');

    } catch (error) {
        console.error('❌ Unexpected error:', error);
        process.exit(1);
    }
}

testEmail();
