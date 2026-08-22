export async function GET() {
  return Response.json({ message: "Welcome stranger! This info is public." }, { status: 200 });
}
