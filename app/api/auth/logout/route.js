import supabase from '../../../../lib/supabaseClient';
import { verifyAuth } from '../../../../lib/verifyAuth';

export async function POST(request) {
  const { token, error } = await verifyAuth(request);
  if (error) return error;

  await supabase.auth.signOut(token);

  return new Response(null, { status: 204 });
}
