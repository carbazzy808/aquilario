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

    const ip = event.headers['x-forwarded-for'] || '';
    const ua = event.headers['user-agent'] || '';

    const { error } = await supabase
      .from('beta_signups')
      .upsert(
        { email, platform, goal, source: 'aquilario', ip, user_agent: ua },
        { onConflict: 'email' }
      );

    if (error) throw error;

    return { statusCode: 200, body: JSON.stringify({ ok: true }) };
  } catch (e) {
    // surface the error in logs & response to speed up debugging
    console.error(e);
    return { statusCode: 500, body: 'Server error: ' + (e.message || 'unknown') };
  }
};



