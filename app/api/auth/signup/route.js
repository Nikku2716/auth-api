import supabase from '../../../../lib/supabaseClient';

export async function POST(request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return Response.json({ error: "Email and password are required" }, { status: 400 });
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return Response.json({ error: error.message }, { status: 400 });
  }

  return Response.json(data.user, { status: 201 });
}
