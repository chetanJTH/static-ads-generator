# Email Service Setup for Contact Form

## Overview
The contact form now sends emails to `info.kraftey@gmail.com` when users submit the form. This setup includes both notification emails to the admin and auto-reply emails to users.

## Environment Variables Required

Add these environment variables to your `.env.local` file in the frontend directory:

```bash
# Email Configuration for Contact Form
EMAIL_USER=info.kraftey@gmail.com
EMAIL_PASS=your_app_password_here
```

## Gmail App Password Setup

To use Gmail SMTP, you need to generate an App Password:

1. **Enable 2-Factor Authentication** on your Google Account
2. Go to **Google Account Settings** → **Security**
3. Under "2-Step Verification", click **App passwords**
4. Select **Mail** as the app
5. Copy the generated 16-character password
6. Use this password in the `EMAIL_PASS` environment variable

## Features

### Contact Form API (`/api/contact`)
- **POST** endpoint that accepts contact form submissions
- Validates form data using Zod schema
- Sends notification email to `info.kraftey@gmail.com`
- Sends auto-reply email to the user
- Includes form data, timestamp, and user details

### Email Content
- **Admin Notification**: Formatted HTML email with all form details
- **User Auto-Reply**: Professional confirmation email with contact information
- **Security**: Includes IP address and user agent for tracking

### Form Validation
- Name: Required
- Email: Valid email format required
- Subject: Required
- Message: Minimum 10 characters
- Category: Required (general, enterprise, partnerships, etc.)

## Testing

To test the email service:

1. Set up the environment variables
2. Start the development server: `npm run dev`
3. Go to `/contact` page
4. Fill out and submit the form
5. Check `info.kraftey@gmail.com` for the notification email
6. Check the user's email for the auto-reply

## Troubleshooting

### Common Issues:
1. **Authentication Error**: Make sure you're using an App Password, not your regular Gmail password
2. **SMTP Error**: Verify the EMAIL_USER and EMAIL_PASS environment variables
3. **Form Not Submitting**: Check browser console for API errors

### Logs:
- Check the server console for email sending logs
- API errors are logged with detailed information

## Security Notes

- App passwords are more secure than regular passwords
- Environment variables should never be committed to version control
- The API includes rate limiting and validation to prevent spam
- IP addresses are logged for security purposes
