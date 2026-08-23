import supabase from '../../../../lib/supabaseClient';

export async function GET(request) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] === '') {
    return Response.json({ error: "Access token required" }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return Response.json({ error: "Invalid or expired token" }, { status: 401 });
  }

  return Response.json({
    id: data.user.id,
    email: data.user.email,
    created_at: data.user.created_at
  }, { status: 200 });
}
