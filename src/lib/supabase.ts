import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY; // Add this line

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  }
});

// Create admin client with service role key for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Storage configuration
const storageConfig = {
  storageApiKey: '356de81725145133a7c52f3aaafae155',
  storageSecretKey: 'd16603e3a204d0a66607ea0f549e580de1632f7b29ece313ec5a86e5a217784c'
}

// Helper function to get correct storage URL
export const getStorageUrl = (path: string) => {
  const { data } = supabase.storage
    .from('carimages') // Changed from 'cars' to 'carimages'
    .getPublicUrl(path);
  
  return data.publicUrl;
};

export const getEngineSoundUrl = (path: string) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  
  const { data: { publicUrl } } = supabase
    .storage
    .from('exhaustsounds')
    .getPublicUrl(path);
    
  console.log('Engine sound public URL:', publicUrl);
  return publicUrl;
};