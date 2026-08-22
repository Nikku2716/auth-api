import supabase from '../../../../lib/supabaseClient';

export async function POST(request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return Response.json({ error: "Email and password are required" }, { status: 400 });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return Response.json({ error: "Invalid login credentials" }, { status: 401 });
  }

  return Response.json({
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token
  }, { status: 200 });
}
