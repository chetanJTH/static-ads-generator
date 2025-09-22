import { NextRequest, NextResponse } from 'next/server'
import * as nodemailer from 'nodemailer'
import { z } from 'zod'

// Validation schema for contact form
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  category: z.string().min(1, 'Category is required')
})

export async function POST(request: NextRequest) {
  try {
    console.log('Contact API called')
    const body = await request.json()
    console.log('Request body:', body)
    
    // Validate the request body
    const validatedData = contactSchema.parse(body)
    const { name, email, subject, message, category } = validatedData

    // Debug environment variables
    console.log('EMAIL_USER exists:', !!process.env.EMAIL_USER)
    console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS)

    // Check if email configuration is available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email configuration not set - logging contact form submission instead')
      console.log('Contact form submission:', { name, email, subject, message, category })
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'Message received! (Email service not configured - logged to console)' 
        },
        { status: 200 }
      )
    }

    // Create transporter for Gmail SMTP
    console.log('Creating nodemailer transporter...')
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // info.kraftey@gmail.com
        pass: process.env.EMAIL_PASS  // App password
      }
    })
    console.log('Transporter created successfully')

    // Email content
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'info.kraftey@gmail.com',
      subject: `[Kraftey Contact] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #374151; margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Category:</strong> ${category}</p>
            <p><strong>Subject:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="color: #374151; margin-top: 0;">Message</h3>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #f3f4f6; border-radius: 8px; font-size: 12px; color: #6b7280;">
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>IP Address:</strong> ${request.ip || 'Unknown'}</p>
            <p><strong>User Agent:</strong> ${request.headers.get('user-agent') || 'Unknown'}</p>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission

Contact Details:
- Name: ${name}
- Email: ${email}
- Category: ${category}
- Subject: ${subject}

Message:
${message}

Submitted: ${new Date().toLocaleString()}
IP Address: ${request.ip || 'Unknown'}
      `
    }

    // Send email
    await transporter.sendMail(mailOptions)

    // Send auto-reply to user
    const autoReplyOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Thank you for contacting Kraftey!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Thank you for contacting Kraftey!</h2>
          
          <p>Hi ${name},</p>
          
          <p>We've received your message and will get back to you as soon as possible. Here's a summary of what you sent:</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Category:</strong> ${category}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
          </div>
          
          <p>Our team typically responds within 24 hours. If you have any urgent questions, feel free to reach out to us directly:</p>
          
          <ul>
            <li>General Support: support@kraftey.com</li>
            <li>Enterprise Sales: enterprise@kraftey.com</li>
            <li>Partnerships: partnerships@kraftey.com</li>
          </ul>
          
          <p>Best regards,<br>The Kraftey Team</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="font-size: 12px; color: #6b7280;">
            This is an automated response. Please do not reply to this email.
          </p>
        </div>
      `,
      text: `
Thank you for contacting Kraftey!

Hi ${name},

We've received your message and will get back to you as soon as possible. Here's a summary of what you sent:

Subject: ${subject}
Category: ${category}
Message: ${message}

Our team typically responds within 24 hours. If you have any urgent questions, feel free to reach out to us directly:

- General Support: support@kraftey.com
- Enterprise Sales: enterprise@kraftey.com
- Partnerships: partnerships@kraftey.com

Best regards,
The Kraftey Team

This is an automated response. Please do not reply to this email.
      `
    }

    await transporter.sendMail(autoReplyOptions)

    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully! We\'ll get back to you soon.' 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Contact form error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid form data',
          details: error.errors 
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to send message. Please try again later.' 
      },
      { status: 500 }
    )
  }
}
