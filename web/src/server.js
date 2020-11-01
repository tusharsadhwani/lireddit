const { createServer } = require("https");
const next = require("next");
const fs = require("fs");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  if (process.env.NODE_ENV === "production") {
    const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_PATH).toString();
    const certificate = fs
      .readFileSync(process.env.CERTIFICATE_PATH)
      .toString();

    var options = {
      key: privateKey,
      cert: certificate,
    };
    const server = createServer(options, (req, res) => {
      const parsedUrl = new URL(req.url, `https://${process.env.DOMAIN}`);
      handle(req, res, parsedUrl);
    });
    server.listen(443, (err) => {
      if (err) throw err;
      console.log(`> Ready on https://localhost`);
    });
  } else {
    const server = createServer((req, res) => {
      const parsedUrl = new URL(req.url, `http://${process.env.DOMAIN}`);
      handle(req, res, parsedUrl);
    });
    server.listen(80, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://localhost`);
    });
  }
});
