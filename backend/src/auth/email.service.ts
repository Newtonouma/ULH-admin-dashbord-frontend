import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const smtpHost = this.configService.get<string>('SMTP_HOST');
    const smtpPort = this.configService.get<number>('SMTP_PORT', 587);
    const smtpUser = this.configService.get<string>('SMTP_USER');
    const smtpPassword = this.configService.get<string>('SMTP_PASSWORD');

    if (!smtpHost || !smtpUser || !smtpPassword) {
      this.logger.warn('SMTP configuration not found. Email functionality will be disabled.');
      return;
    }

    this.transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    this.logger.log('Email transporter initialized successfully');
  }

  async sendPasswordResetEmail(to: string, resetToken: string, username: string): Promise<void> {
    if (!this.transporter) {
      this.logger.warn('Email transporter not configured. Cannot send password reset email.');
      return;
    }

    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3001');
    const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}`;

    const mailOptions: nodemailer.SendMailOptions = {
      from: this.configService.get<string>('SMTP_FROM') || this.configService.get<string>('SMTP_USER'),
      to,
      subject: 'Password Reset Request - Universal Lighthouse',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          <p>Hello ${username},</p>
          <p>You have requested to reset your password for Universal Lighthouse. Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>If the button doesn't work, you can copy and paste the following link into your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p><strong>This link will expire in 1 hour.</strong></p>
          <p>If you didn't request this password reset, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            This email was sent from Universal Lighthouse.<br>
            Please do not reply to this email.
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Password reset email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${to}:`, error);
      throw new Error('Failed to send password reset email');
    }
  }

  async sendWelcomeEmail(to: string, username: string): Promise<void> {
    if (!this.transporter) {
      this.logger.warn('Email transporter not configured. Cannot send welcome email.');
      return;
    }

    const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3001');

    const mailOptions: nodemailer.SendMailOptions = {
      from: this.configService.get<string>('SMTP_FROM') || this.configService.get<string>('SMTP_USER'),
      to,
      subject: 'Welcome to Universal Lighthouse',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Universal Lighthouse!</h2>
          <p>Hello ${username},</p>
          <p>Your account has been successfully created. You now have admin access to the Universal Lighthouse platform.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${frontendUrl}" 
               style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Access Platform
            </a>
          </div>
          <p>As an admin, you have full access to:</p>
          <ul>
            <li>Manage causes and campaigns</li>
            <li>Organize events</li>
            <li>Coordinate team activities</li>
            <li>View gallery content</li>
            <li>Track donations</li>
          </ul>
          <p>If you have any questions, please don't hesitate to reach out.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            This email was sent from Universal Lighthouse.<br>
            Please do not reply to this email.
          </p>
        </div>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Welcome email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${to}:`, error);
      // Don't throw error for welcome email - it's not critical
    }
  }
}