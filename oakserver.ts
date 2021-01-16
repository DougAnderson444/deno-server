// Server Sent Events in Oak with Deno
// https://oakserver.github.io/oak/sse

import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const port = 8000;
const app = new Application();
const router = new Router();

router.get('/', ctx => {
  ctx.response.body = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Server Send Events</title>
        <meta charset="utf-8">
        <script>
          const sse = new EventSource('/server-sent-events');
          sse.onerror = () => document.body.innerHTML = 'Connection Error';
          sse.onmessage = ({ data }) => document.body.innerHTML = data;
        </script>
      </head>
      <body></body>
    </html>
  `;
})

router.get("/server-sent-events", (ctx) => {
  const target = ctx.sendEvents();
  // ctx.request.accepts("text/event-stream");
  const sendDate = () => target.dispatchMessage(`${new Date()}`);
  sendDate();
  const interval = setInterval(sendDate, 1000);
});

app.use(router.routes());

app.addEventListener('listen', () => {
    console.log(`Listening on: http://localhost:${port}/`);
});

await app.listen({ port });
