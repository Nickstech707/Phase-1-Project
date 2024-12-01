import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, subscriptionDate, status } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    // Check if the email is already subscribed
    const { data: existingSubscriber, error: fetchError } = await supabase
      .from('subscribers')
      .select('email')
      .eq('email', email)
      .single();

    if (fetchError) throw fetchError;

    if (existingSubscriber) {
      return res.status(409).json({ error: 'This email is already subscribed' });
    }

    // Insert the new subscriber
    const { error: insertError } = await supabase
      .from('subscribers')
      .insert([{ email, subscriptionDate, status }]);

    if (insertError) throw insertError;

    return res.status(201).json({ message: 'Successfully subscribed' });
  } catch (error) {
    console.error('Subscription error:', error);
    return res.status(500).json({ error: 'Error subscribing to alerts' });
  }
}