import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // service role key

const supabase = createClient(supabaseUrl, supabaseKey);


async function check() {
  console.log("Checking profiles table...");
  const { data: pData, error: pError } = await supabase.from('profiles').select('*').limit(1);
  console.log("Profiles result:", { pData, pError });

  console.log("Checking orders table...");
  const { data: oData, error: oError } = await supabase.from('orders').select('*').limit(1);
  console.log("Orders result:", { oData, oError });
}

check();
