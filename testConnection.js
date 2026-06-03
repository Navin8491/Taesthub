const supabaseUrl = process.env.VITE_SUPABASE_URL ? `${process.env.VITE_SUPABASE_URL.replace(/\/$/, '')}/rest/v1/` : '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // service role key


async function run() {
  try {
    const res = await fetch(supabaseUrl, {
      headers: {
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    console.log("Status:", res.status);
    console.log("Status text:", res.statusText);
    const text = await res.text();
    console.log("Response length:", text.length);
    if (res.status === 200) {
      const data = JSON.parse(text);
      console.log("Exposed definitions:", Object.keys(data.definitions || {}));
    } else {
      console.log("Error response:", text);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

run();
