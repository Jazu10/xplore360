import nodemailer from 'nodemailer'
import { SITE_NAME } from '@/lib/site-config'

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })
}

export interface ContactEmailData {
  name: string
  email: string
  phone?: string
  destination?: string
  packageName?: string
  message: string
}

export async function sendContactEmail(data: ContactEmailData): Promise<void> {
  const businessEmail = process.env.BUSINESS_EMAIL || process.env.EMAIL_USER
  if (!businessEmail) throw new Error('BUSINESS_EMAIL not configured')

  const transporter = getTransporter()

  // Email to business
  await transporter.sendMail({
    from: `"${SITE_NAME} Website" <${process.env.EMAIL_USER}>`,
    to: businessEmail,
    replyTo: data.email,
    subject: data.packageName
      ? `New Enquiry: ${data.packageName} — ${data.name}`
      : `New Travel Enquiry from ${data.name}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #0A0A0A;">
        <div style="background: #0A0A0A; padding: 32px; text-align: center;">
          <h1 style="color: #C9A96E; font-size: 28px; margin: 0; letter-spacing: 2px;">${SITE_NAME.toUpperCase()}</h1>
          <p style="color: #ffffff80; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin: 8px 0 0;">New Customer Enquiry</p>
        </div>
        <div style="padding: 40px 32px; background: #ffffff; border: 1px solid #f0ece4;">
          ${data.packageName ? `<div style="background: #F5F0E8; border-left: 3px solid #C9A96E; padding: 16px 20px; margin-bottom: 28px;">
            <p style="margin: 0; font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #C9A96E;">Package Interest</p>
            <p style="margin: 6px 0 0; font-size: 18px; font-weight: 600;">${data.packageName}</p>
          </div>` : ''}
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #f0ece4; color: #666; font-size: 13px; width: 120px;">Name</td><td style="padding: 10px 0; border-bottom: 1px solid #f0ece4; font-weight: 500;">${data.name}</td></tr>
            <tr><td style="padding: 10px 0; border-bottom: 1px solid #f0ece4; color: #666; font-size: 13px;">Email</td><td style="padding: 10px 0; border-bottom: 1px solid #f0ece4;"><a href="mailto:${data.email}" style="color: #C9A96E;">${data.email}</a></td></tr>
            ${data.phone ? `<tr><td style="padding: 10px 0; border-bottom: 1px solid #f0ece4; color: #666; font-size: 13px;">Phone</td><td style="padding: 10px 0; border-bottom: 1px solid #f0ece4;"><a href="tel:${data.phone}" style="color: #C9A96E;">${data.phone}</a></td></tr>` : ''}
            ${data.destination ? `<tr><td style="padding: 10px 0; border-bottom: 1px solid #f0ece4; color: #666; font-size: 13px;">Destination</td><td style="padding: 10px 0; border-bottom: 1px solid #f0ece4;">${data.destination}</td></tr>` : ''}
          </table>
          <div style="margin-top: 28px;">
            <p style="font-size: 12px; letter-spacing: 2px; text-transform: uppercase; color: #999; margin-bottom: 10px;">Message</p>
            <p style="line-height: 1.7; color: #333; background: #F5F0E8; padding: 20px; margin: 0;">${data.message.replace(/\n/g, '<br>')}</p>
          </div>
          <div style="margin-top: 32px; text-align: center;">
            <a href="mailto:${data.email}" style="display: inline-block; background: #C9A96E; color: white; padding: 14px 32px; text-decoration: none; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">Reply to ${data.name}</a>
          </div>
        </div>
        <div style="padding: 20px 32px; text-align: center; background: #F5F0E8;">
          <p style="color: #999; font-size: 12px; margin: 0;">${SITE_NAME} &mdash; Premium Travel Experiences &mdash; UK</p>
        </div>
      </div>
    `,
  })

  // Auto-reply to customer
  await transporter.sendMail({
    from: `"${SITE_NAME} Travel" <${process.env.EMAIL_USER}>`,
    to: data.email,
    subject: `Thank you for your enquiry, ${data.name.split(' ')[0]}`,
    html: `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; color: #0A0A0A;">
        <div style="background: #0A0A0A; padding: 32px; text-align: center;">
          <h1 style="color: #C9A96E; font-size: 28px; margin: 0; letter-spacing: 2px;">${SITE_NAME.toUpperCase()}</h1>
          <p style="color: #ffffff80; font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin: 8px 0 0;">Premium Travel Experiences</p>
        </div>
        <div style="padding: 40px 32px; background: #ffffff;">
          <h2 style="font-size: 24px; margin: 0 0 16px;">Thank you, ${data.name.split(' ')[0]}.</h2>
          <p style="line-height: 1.8; color: #444;">We've received your enquiry and a member of our team will be in touch within <strong>2 hours</strong> during business hours (Mon–Sat, 9am–7pm).</p>
          ${data.packageName ? `<p style="line-height: 1.8; color: #444;">We'll be in touch about the <strong>${data.packageName}</strong> package with all the details you need.</p>` : ''}
          <p style="line-height: 1.8; color: #444;">In the meantime, feel free to browse our other packages at our website, or reach us directly via WhatsApp for the fastest response.</p>
          <div style="margin: 32px 0; padding: 24px; background: #F5F0E8; border-left: 3px solid #C9A96E;">
            <p style="margin: 0; font-size: 13px; color: #666;">Need an immediate response?</p>
            <p style="margin: 8px 0 0; font-weight: 600; color: #0A0A0A;">${process.env.BUSINESS_EMAIL || ''}</p>
          </div>
        </div>
        <div style="padding: 20px 32px; text-align: center; background: #F5F0E8;">
          <p style="color: #999; font-size: 12px; margin: 0;">© ${SITE_NAME} &mdash; London, United Kingdom</p>
        </div>
      </div>
    `,
  })
}

export const isEmailConfigured = () =>
  Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS)
