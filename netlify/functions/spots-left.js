// netlify/functions/spots-left.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async () => {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE // server-only
    );

    // count distinct emails (HEAD + count = exact is cheap)
    const { count, error } = await supabase
      .from('beta_signups')
      .select('email', { count: 'exact', head: true });

    if (error) throw error;

    const CAP = 100;
    const spotsLeft = Math.max(0, CAP - (count || 0));

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
      body: JSON.stringify({ count: count || 0, cap: CAP, spotsLeft }),
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
  }
};
