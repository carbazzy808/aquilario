const { createClient } = require('@supabase/supabase-js');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email, platform, goal } = JSON.parse(event.body || '{}');
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return { statusCode: 400, body: 'Valid email required' };
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE
    );

    // Normalize inputs
    const platformValue =
      typeof platform === 'string' && platform.trim()
        ? [platform.trim()]      // 👈 wrap as array for text[]
        : null;

    const goalValue = (goal || '').toString().trim() || null;

    const { error } = await supabase
      .from('beta_signups')
      .upsert(
        { email, platform: platformValue, goal: goalValue, source: 'aquilario' },
        { onConflict: 'email_ci' }   // use 'email' if you set a unique on email; 'email_ci' if you added the case-insensitive index
      );

    if (error) throw error;
    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: 'Server error: ' + (e.message || 'unknown') };
  }
};




