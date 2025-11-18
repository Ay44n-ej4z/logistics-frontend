const BACKEND_BASE = "http://199.231.188.60:5000";

export async function GET(req: Request, { params }: any) {
  const url = `${BACKEND_BASE}/${params.path.join("/")}`;

  const res = await fetch(url, {
    method: "GET",
    headers: req.headers, // 🔥 forward all headers
    cache: "no-store"
  });

  return new Response(await res.text(), {
    status: res.status,
    headers: res.headers,
  });
}

export async function POST(req: Request, { params }: any) {
  const url = `${BACKEND_BASE}/${params.path.join("/")}`;
  const body = await req.text();

  const res = await fetch(url, {
    method: "POST",
    headers: req.headers, // 🔥 forward all headers
    body,
    cache: "no-store"
  });

  return new Response(await res.text(), {
    status: res.status,
    headers: res.headers,
  });
}

export async function PUT(req: Request, { params }: any) {
  const url = `${BACKEND_BASE}/${params.path.join("/")}`;
  const body = await req.text();

  const res = await fetch(url, {
    method: "PUT",
    headers: req.headers, // 🔥 forward all headers
    body,
  });

  return new Response(await res.text(), {
    status: res.status,
    headers: res.headers,
  });
}

export async function DELETE(req: Request, { params }: any) {
  const url = `${BACKEND_BASE}/${params.path.join("/")}`;

  const res = await fetch(url, {
    method: "DELETE",
    headers: req.headers, // 🔥 forward all headers
  });

  return new Response(await res.text(), {
    status: res.status,
    headers: res.headers,
  });
}
