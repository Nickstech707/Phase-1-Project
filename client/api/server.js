import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Load environment variables
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
  'REACT_APP_SUPABASE_URL',
  'REACT_APP_SUPABASE_ANON_KEY',
  'REACT_APP_EMAIL_HOST',
  'REACT_APP_EMAIL_PORT',
  'REACT_APP_EMAIL_USER',
  'REACT_APP_EMAIL_PASSWORD',
  'REACT_APP_EMAIL_FROM',
  'CLIENT_URL'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Required environment variable ${varName} is missing`);
  }
});

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false
}));

app.use(cors({
  // origin: process.env.CLIENT_URL,
  origin: '*',
 
  methods: ['GET', 'POST', 'OPTIONS'],
  
  allowedHeaders: ['Content-Type', 'Authorization']
}));


// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000, 
//   max: 100, 
// });
// app.use(limiter);

// app.use(express.json({ limit: '1kb' }));

// Initialize Supabase client
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Initialize email transporter
const transporter = nodemailer.createTransport({
  host: process.env.REACT_APP_EMAIL_HOST,
  port: parseInt(process.env.REACT_APP_EMAIL_PORT),
  secure: true,
  auth: {
    user: process.env.REACT_APP_EMAIL_USER,
    pass: process.env.REACT_APP_EMAIL_PASSWORD,
  },
});

// Helper function to sanitize job data
function sanitizeJobData(job) {
  const sanitize = (text) => {
    if (!text) return '';
    return String(text)
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  return {
    title: sanitize(job.title),
    company_name: sanitize(job.company_name),
    category: sanitize(job.category),
    candidate_required_location: sanitize(job.candidate_required_location),
    url: sanitize(job.url)
  };
}

// Improved sendJobNotification function
async function sendJobNotification(emails, jobs, batchSize = 50) {
  // Validate inputs
  if (!Array.isArray(emails) || !Array.isArray(jobs)) {
    throw new Error('Invalid input: emails and jobs must be arrays');
  }

  if (emails.length === 0 || jobs.length === 0) {
    throw new Error('Empty input: emails and jobs arrays cannot be empty');
  }

  // Sanitize job data
  const sanitizedJobs = jobs.map(sanitizeJobData);

  // Create email content
  const jobsList = sanitizedJobs
    .map(job => `
      <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;">
        <h3 style="color: #2d3748; margin: 0 0 10px 0;">${job.title}</h3>
        <p style="margin: 5px 0;"><strong>Company:</strong> ${job.company_name}</p>
        <p style="margin: 5px 0;"><strong>Category:</strong> ${job.category}</p>
        <p style="margin: 5px 0;"><strong>Location:</strong> ${job.candidate_required_location}</p>
        <a href="${job.url}" 
           style="display: inline-block; margin-top: 10px; color: #10b981; text-decoration: none;">
          View Job
        </a>
      </div>
    `)
    .join('');

  // Generate plain text version
  const plainText = sanitizedJobs
    .map(job => `
      ${job.title}
      Company: ${job.company_name}
      Category: ${job.category}
      Location: ${job.candidate_required_location}
      View Job: ${job.url}
    `)
    .join('\n\n');

  // Process emails in batches
  const results = {
    successful: [],
    failed: []
  };

  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);
    const batchPromises = batch.map(async email => {
      try {
        await transporter.sendMail({
          from: process.env.REACT_APP_EMAIL_FROM,
          to: email,
          subject: `${jobs.length} New Remote Jobs Available!`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <h2 style="color: #1a202c; margin-bottom: 20px;">New Remote Job Opportunities</h2>
              <p style="color: #4a5568; margin-bottom: 20px;">
                Here are the latest remote jobs that match your interests:
              </p>
              ${jobsList}
              <p style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 0.875rem; color: #718096;">
                To unsubscribe from these notifications, 
                <a href="${process.env.CLIENT_URL}/unsubscribe/${encodeURIComponent(email)}" 
                   style="color: #10b981; text-decoration: none;">
                  click here
                </a>
              </p>
            </div>
          `,
          text: plainText
        });
        results.successful.push(email);
      } catch (error) {
        
        results.failed.push({ email, error: error.message });
      }
    });

    // Wait for batch to complete with delay between batches
    await Promise.all(batchPromises);
    if (i + batchSize < emails.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }

  return results;  
}


// Unified unsubscribe handler
app.post('/api/unsubscribe', async (req, res) => {
  const { email } = req.body;

  // Check if email is present in the request
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  // Normalize and validate email
  const normalizedEmail = email.toLowerCase().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    // Check if the subscriber exists and update their status
    const { data: subscriber, error: fetchError } = await supabase
      .from('subscribers')
      .select('status')
      .eq('email', normalizedEmail)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      
      return res.status(500).json({ error: 'Error checking subscription status' });
    }

    if (!subscriber) {
      return res.status(404).json({ error: 'Email not found in subscriber list' });
    }

    if (subscriber.status === 'unsubscribed') {
      return res.status(409).json({ error: 'This email is already unsubscribed' });
    }

    // Update the subscriber's status to unsubscribed
    const { error: updateError } = await supabase
      .from('subscribers')
      .update({ 
        status: 'unsubscribed',
        unsubscribe_date: new Date().toISOString()
      })
      .eq('email', normalizedEmail);

    if (updateError) {
      
      return res.status(500).json({ error: 'Error updating subscription status' });
    }

    // Send confirmation email
    await transporter.sendMail({
      from: process.env.REACT_APP_EMAIL_FROM,
      to: normalizedEmail,
      subject: 'Unsubscription Confirmed',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2>Unsubscription Confirmed</h2>
          <p>You have been successfully unsubscribed from job notifications.</p>
          <p>If this was a mistake, you can resubscribe at any time by visiting:</p>
          <p><a href="${process.env.CLIENT_URL}">${process.env.CLIENT_URL}</a></p>
        </div>
      `,
      text: `
        Unsubscription Confirmed
        
        You have been successfully unsubscribed from job notifications.
        
        If this was a mistake, you can resubscribe at any time by visiting:
        ${process.env.CLIENT_URL} 
      `
    });

    return res.status(200).json({ 
      message: 'You have successfully unsubscribed from job notifications.', 
      email: normalizedEmail 
    });

  } catch (error) {
    
    return res.status(500).json({ error: 'Internal server error' });
  }
});


// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});


// Database health check endpoint
app.get('/api/db-health', async (req, res) => {
  try {
    const isConnected = await testSupabaseConnection();
    if (isConnected) {
      const { data, error } = await supabase
        .from('subscribers')
        .select('count')
        .single();

      if (error) throw error;

      res.status(200).json({ status: 'OK', subscriberCount: data.count });
    } else {
      res.status(500).json({ status: 'Error', message: 'Failed to connect to database' });
    }
  } catch (error) {
    
    res.status(500).json({ status: 'Error', message: error.message });
  }
});

// Subscribe endpoint
app.post('/api/subscribe', async (req, res) => {
  const { email, newJobs = [] } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }

  try {
    // Check for existing subscriber
    const { data: existingSubscriber, error: checkError } = await supabase
      .from('subscribers')
      .select('email, status')
      .eq('email', email.toLowerCase())
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
    
      return res.status(500).json({ error: 'Error checking subscription status' });
    }

    // If the subscriber exists but is unsubscribed, reactivate them
    if (existingSubscriber) {
      if (existingSubscriber.status === 'unsubscribed') {
        const { error: updateError } = await supabase
          .from('subscribers')
          .update({ 
            status: 'active',
            subscription_date: new Date().toISOString(),
            unsubscribe_date: null
          })
          .eq('email', email.toLowerCase());

        if (updateError) {
          
          return res.status(500).json({ error: 'Error reactivating subscription' });
        }

        // Send welcome back email with new jobs if available
        if (newJobs.length > 0) {
          try {
            await sendJobNotification([email], newJobs);
          } catch (emailError) {
            
          }
        }

        return res.status(200).json({ 
          message: 'Subscription reactivated successfully',
          email: email.toLowerCase()
        });
      }
      return res.status(409).json({ error: 'This email is already subscribed' });
    }

    // Insert new subscriber
    const { error: insertError } = await supabase
      .from('subscribers')
      .insert([{ 
        email: email.toLowerCase(),
        status: 'active',
        subscription_date: new Date().toISOString()
      }]);

    if (insertError) {
      if (insertError.code === '23505') {
        return res.status(409).json({ error: 'This email is already subscribed. Please use a different email' });
      }
      
      return res.status(500).json({ error: 'Error creating subscription' });
    }

    // Send welcome email with new jobs if available
    if (newJobs.length > 0) {
      try {
        await sendJobNotification([email], newJobs);
      } catch (emailError) {
       
      }
    }

    res.status(201).json({ 
      message: 'Successfully subscribed',
      email: email.toLowerCase()
    });
  } catch (error) {
    
    res.status(500).json({ error: 'Error processing subscription' });
  }
});

// GET endpoint for unsubscribe link in emails
app.get('/api/unsubscribe', async (req, res) => {
  const { email } = req.query;

  try {
    await handleUnsubscribe(email);
    
    // Redirect to confirmation page
    res.redirect(`${process.env.CLIENT_URL}/unsubscribe-success`);
  } catch (error) {
    
    
    // Redirect to error page with message
    res.redirect(`${process.env.CLIENT_URL}/unsubscribe-error?message=${encodeURIComponent(error.message)}`);
  }
});

// POST endpoint for programmatic unsubscribe
app.post('/api/unsubscribe', async (req, res) => {
  const { email } = req.body;

  try {
    const unsubscribedEmail = await handleUnsubscribe(email);
    res.status(200).json({ 
      message: 'Successfully unsubscribed',
      email: unsubscribedEmail
    });
  } catch (error) {
    
    res.status(400).json({ error: error.message });
  }
});

// Notify subscribers endpoint
app.post('/api/notify-subscribers', async (req, res) => {
  const { jobs } = req.body;

  if (!Array.isArray(jobs) || jobs.length === 0) {
    return res.status(400).json({ 
      error: 'Invalid jobs data. Expected non-empty array of jobs.' 
    });
  }

  try {
    // Get active subscribers
    const { data: subscribers, error: fetchError } = await supabase
      .from('subscribers')
      .select('email')
      .eq('status', 'active');

    

    if (fetchError) {
      
      return res.status(500).json({ error: 'Error fetching subscribers' });
    }

    if (!subscribers || subscribers.length === 0) {
      return res.status(200).json({ message: 'No active subscribers found' });
    }

    // Send notifications
    const results = await sendJobNotification(
      subscribers.map(sub => sub.email),
      jobs
    );

    res.status(200).json({ 
      message: 'Notifications process completed',
      results: {
        totalSubscribers: subscribers.length,
        successfulSends: results.successful.length,
        failedSends: results.failed.length,
        jobCount: jobs.length
      }
    });

  } catch (error) {
    
    res.status(500).json({ error: 'Error sending notifications' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Handle unmatched routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  
  
  // Log startup information
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('CORS origin:', process.env.CLIENT_URL);
  console.log('Email service configured:', !!process.env.REACT_APP_EMAIL_HOST);
  console.log('Supabase configured:', !!process.env.REACT_APP_SUPABASE_URL);
});

// Graceful shutdown handler
process.on('SIGTERM', () => {
  
  
  // Close server
  server.close(() => {
   

    process.exit(0);
  });
});