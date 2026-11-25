const http = require("http");
const fs = require("fs");
const path = require("path");

const folder = path.join(__dirname, "share");

http.createServer((req, res) => {
  try {
    if (req.url === "/") {
      const links = fs.readdirSync(folder, { withFileTypes: true })
        .filter((f) => f.isFile())
        .map((f) => `<li style="font-size:26px"><a href="/${f.name}">${f.name}</a></li>`)
        .join("");
      res.writeHead(200, { "Content-Type": "text/html" });
      return res.end(`<h2>Class Files</h2><ul>${links}</ul>`);
    }

    const file = path.join(folder, path.basename(decodeURIComponent(req.url)));
    if (fs.existsSync(file) && fs.statSync(file).isFile()) {
      res.writeHead(200, { "Content-Type": "application/octet-stream" });
      return res.end(fs.readFileSync(file));
    }

    res.writeHead(404);
    res.end("Not found");
  } catch (error) {
    res.writeHead(500);
    res.end("Server error");
  }
}).listen(8080, () => console.log("Sharing files on port 8080"));