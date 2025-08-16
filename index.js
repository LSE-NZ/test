// index.js
const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve a basic HTML form
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>League PUUID Search</title></head>
      <body>
        <h2>Search Riot API</h2>
        <form method="POST" action="/search">
          <label>PUUID:</label>
          <input type="text" name="puuid" required /><br><br>
          <label>Game Quantity:</label>
          <input type="number" name="quantity" required /><br><br>
          <button type="submit">Search</button>
        </form>
      </body>
    </html>
  `);
});

// Handle form submit → forward request to your Python backend
app.post("/search", async (req, res) => {
  const { puuid, quantity } = req.body;

  try {
    // Replace this with your Railway Python backend URL
    const pythonServiceURL = `https://sincere-insight-production.up.railway.app/search`;

    const response = await fetch(pythonServiceURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ puuid, quantity })
    });

    const data = await response.json();
    res.send(`<pre>${JSON.stringify(data, null, 2)}</pre>`);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data from Python service.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Frontend running on port ${PORT}`));
