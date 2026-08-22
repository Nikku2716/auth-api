import supabase from '../../../lib/supabaseClient';

export async function GET() {
  console.log('Server running and connected to Supabase');
  return Response.json({ status: 'ok', message: 'Server running and connected to Supabase' });
}
