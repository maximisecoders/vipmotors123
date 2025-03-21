import { supabase } from '../lib/supabaseClient';

export const checkAuth = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('Not authenticated');
  }

  const { data: { user } } = await supabase.auth.getUser();
  
  if (user?.user_metadata?.role !== 'admin') {
    throw new Error('Not authorized');
  }

  return true;
};
