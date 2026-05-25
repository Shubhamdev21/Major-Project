import nodemailer from 'nodemailer';
import prisma from '../prisma';
import logger from '../utils/logger';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmailDigest = async (userEmail: string) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const alerts = await prisma.alert.findMany({
      where: {
        createdAt: {
          gte: yesterday
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (alerts.length === 0) {
      logger.info(`No alerts for digest to ${userEmail}`);
      return;
    }

    const alertRows = alerts.map(a => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${a.severity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${a.message}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${a.createdAt.toLocaleString()}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <h2 style="color: #00a3ff; border-bottom: 2px solid #00a3ff; padding-bottom: 10px;">Industrial Monitoring - Daily Digest</h2>
        <p>Hello, here is a summary of the alerts recorded in the last 24 hours.</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background-color: #f8f9fa; text-align: left;">
              <th style="padding: 10px;">Severity</th>
              <th style="padding: 10px;">Message</th>
              <th style="padding: 10px;">Time</th>
            </tr>
          </thead>
          <tbody>
            ${alertRows}
          </tbody>
        </table>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777;">
          This is an automated report. Please do not reply.
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Major Industrial Hub" <${process.env.SMTP_USER}>`,
      to: userEmail,
      subject: `Daily Alert Digest - ${new Date().toLocaleDateString()}`,
      html: htmlContent,
    });

    logger.info(`Email digest sent to ${userEmail}`);
  } catch (error: any) {
    logger.error(`Failed to send email digest: ${error.message}`);
  }
};

// Schedule daily digest (Example: at midnight)
// For now, I'll provide an endpoint or a simple interval for testing if needed.
