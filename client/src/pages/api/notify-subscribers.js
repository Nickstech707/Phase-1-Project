
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { jobs } = req.body;

  if (!jobs || !Array.isArray(jobs)) {
    return res.status(400).json({ error: 'Invalid jobs data' });
  }

  try {
    // Get all subscribers
    const { data: subscribers, error } = await supabase
      .from('subscribers')
      .select('email');

    if (error) throw error;

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Prepare email content
    const jobsList = jobs.map(job => `
      <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
        <h3>${job.title}</h3>
        <p><strong>Company:</strong> ${job.company_name}</p>
        <p><strong>Category:</strong> ${job.category}</p>
        <p><strong>Location:</strong> ${job.candidate_required_location}</p>
        <a href="${job.url}" style="color: #10b981; text-decoration: none;">View Job</a>
      </div>
    `).join('');

    // Send email to each subscriber
    const emailPromises = subscribers.map(({ email }) =>
      transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `${jobs.length} New Remote Jobs Available!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>New Remote Job Opportunities</h2>
            <p>Here are the latest remote jobs that match your interests:</p>
            ${jobsList}
            <p style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
              <small>
                To unsubscribe from these notifications, 
                <a href="${process.env.NEXT_PUBLIC_SITE_URL}/unsubscribe?email=${email}" 
                   style="color: #10b981; text-decoration: none;">click here</a>
              </small>
            </p>
          </div>
        `,
      })
    );

    await Promise.all(emailPromises);
    return res.status(200).json({ message: 'Notifications sent successfully' });
  } catch (error) {
    console.error('Error sending notifications:', error);
    return res.status(500).json({ error: 'Error sending notifications' });
  }
}