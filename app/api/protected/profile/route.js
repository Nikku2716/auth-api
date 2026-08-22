export async function GET(request) {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] === '') {
    return Response.json({ error: "Access token required" }, { status: 401 });
  }

  const token = authHeader.split(' ')[1];

  // Stage 3 will actually verify this token with Supabase — for now, just extracting it
  return Response.json({ message: "Token received, not yet verified", token }, { status: 200 });
}
