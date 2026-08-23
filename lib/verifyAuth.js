import supabase from './supabaseClient';

export async function verifyAuth(request) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] === '') {
    return { user: null, error: Response.json({ error: "Access token required" }, { status: 401 }) };
  }

  const token = authHeader.split(' ')[1];
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return { user: null, error: Response.json({ error: "Invalid or expired token" }, { status: 401 }) };
  }

  return { user: data.user, token, error: null };
}
