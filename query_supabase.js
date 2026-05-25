import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error fetching from product1:', error);
  } else {
    console.log('Columns in product1:', data && data.length > 0 ? Object.keys(data[0]) : 'No data, but table exists');
    if (data && data.length > 0) {
      console.log('Sample data:', data[0]);
    }
  }
}

checkSchema();
