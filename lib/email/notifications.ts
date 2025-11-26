import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactFormData {
    first_name: string;
    last_name: string;
    gender: string;
    email: string;
    phone: string;
    city: string;
    connection: string;
    message_title: string;
    message_body: string;
}

export async function sendAdminNotification(data: ContactFormData) {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@ycjchurch.org';
    const fromEmail = process.env.FROM_EMAIL || 'notifications@ycjchurch.org';

    try {
        const { data: emailData, error } = await resend.emails.send({
            from: fromEmail,
            to: adminEmail,
            subject: `New Contact Form Submission: ${data.message_title}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .header {
                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                            color: white;
                            padding: 20px;
                            border-radius: 8px 8px 0 0;
                        }
                        .content {
                            background: #f9fafb;
                            padding: 20px;
                            border: 1px solid #e5e7eb;
                            border-top: none;
                        }
                        .field {
                            margin-bottom: 15px;
                            padding: 12px;
                            background: white;
                            border-radius: 6px;
                            border-left: 4px solid #667eea;
                        }
                        .label {
                            font-weight: bold;
                            color: #667eea;
                            font-size: 12px;
                            text-transform: uppercase;
                            margin-bottom: 4px;
                        }
                        .value {
                            color: #1f2937;
                            font-size: 14px;
                        }
                        .message-box {
                            background: white;
                            padding: 15px;
                            border-radius: 6px;
                            border: 1px solid #e5e7eb;
                            margin-top: 10px;
                        }
                        .footer {
                            text-align: center;
                            padding: 20px;
                            color: #6b7280;
                            font-size: 12px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1 style="margin: 0; font-size: 24px;">📬 New Contact Form Submission</h1>
                            <p style="margin: 5px 0 0 0; opacity: 0.9;">YCJ Church Website</p>
                        </div>
                        <div class="content">
                            <div class="field">
                                <div class="label">Name</div>
                                <div class="value">${data.first_name} ${data.last_name}</div>
                            </div>
                            
                            <div class="field">
                                <div class="label">Gender</div>
                                <div class="value">${data.gender.charAt(0).toUpperCase() + data.gender.slice(1)}</div>
                            </div>
                            
                            <div class="field">
                                <div class="label">Email</div>
                                <div class="value"><a href="mailto:${data.email}" style="color: #667eea;">${data.email}</a></div>
                            </div>
                            
                            <div class="field">
                                <div class="label">Phone</div>
                                <div class="value"><a href="tel:${data.phone}" style="color: #667eea;">${data.phone}</a></div>
                            </div>
                            
                            <div class="field">
                                <div class="label">City</div>
                                <div class="value">${data.city}</div>
                            </div>
                            
                            <div class="field">
                                <div class="label">Connection to Church</div>
                                <div class="value">${formatConnection(data.connection)}</div>
                            </div>
                            
                            <div class="field">
                                <div class="label">Message Title</div>
                                <div class="value"><strong>${data.message_title}</strong></div>
                            </div>
                            
                            <div class="field">
                                <div class="label">Message</div>
                                <div class="message-box">${data.message_body.replace(/\n/g, '<br>')}</div>
                            </div>
                        </div>
                        <div class="footer">
                            <p>This email was sent from your YCJ Church website contact form.</p>
                            <p>Submitted on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

        if (error) {
            console.error('Error sending admin notification:', error);
            throw error;
        }

        return emailData;
    } catch (error) {
        console.error('Failed to send admin notification:', error);
        throw error;
    }
}

function formatConnection(connection: string): string {
    const connectionMap: { [key: string]: string } = {
        'member': 'Member/Volunteer in this church',
        'attending': 'Attending YCJ Church regularly',
        'online-other': 'Attending YCJ\'s ONLINE Services BUT going to another church',
        'online-only': 'Attending YCJ\'s ONLINE Services BUT not going to any church',
        'none': 'Not attending any church at all'
    };
    return connectionMap[connection] || connection;
}
