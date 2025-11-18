export async function GET(req: Request, { params }: any) {
  const backendURL = `http://199.231.188.60:5000/${params.path.join('/')}`;
  
  const response = await fetch(backendURL, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
  });

  const data = await response.text();
  return new Response(data, { status: response.status });
}

export async function POST(req: Request, { params }: any) {
  const backendURL = `http://199.231.188.60:5000/${params.path.join('/')}`;

  const body = await req.text();

  const response = await fetch(backendURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body,
  });

  const data = await response.text();
  return new Response(data, { status: response.status });
}

export async function PUT(req: Request, { params }: any) {
  const backendURL = `http://199.231.188.60:5000/${params.path.join('/')}`;
  const body = await req.text();

  const response = await fetch(backendURL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body
  });

  const data = await response.text();
  return new Response(data, { status: response.status });
}

export async function DELETE(req: Request, { params }: any) {
  const backendURL = `http://199.231.188.60:5000/${params.path.join('/')}`;
  
  const response = await fetch(backendURL, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.text();
  return new Response(data, { status: response.status });
}
