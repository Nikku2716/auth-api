import { verifyAuth } from '../../../../lib/verifyAuth';

export async function GET(request) {
  const { user, error } = await verifyAuth(request);
  if (error) return error;

  return Response.json({ message: `Welcome to your dashboard, ${user.email}` }, { status: 200 });
}
