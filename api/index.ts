const port = Number(process.env.PORT) || 4000;

Bun.serve({
  port,
  routes: {
    "/health": () => Response.json({ status: "ok" }),
  },
  fetch() {
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`API listening on port ${port}`);