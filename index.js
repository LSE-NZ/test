const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve a basic HTML form
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head><title>League Account Search</title></head>
      <body>
        <h2>Trigger Python Search</h2>
        <form method="POST" action="/search">
          <label>Account Name:</label>
          <input type="text" name="name" required /><br><br>
          <label>Game Count:</label>
          <input type="number" name="count" required /><br><br>
          <button type="submit">Run Search</button>
        </form>
      </body>
    </html>
  `);
});

// Handle form submit → forward request to Python backend
app.post("/search", async (req, res) => {
  const { name, count } = req.body;

  try {
    // Replace with your Python backend Railway URL
    const pythonServiceURL = "https://test-production-ceab.up.railway.app/search";

    const response = await fetch(pythonServiceURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, count })
    });

    const data = await response.json();

    // Show a simple success message
    res.send(`
      <html>
        <body>
          <h3>Backend response:</h3>
          <pre>${JSON.stringify(data, null, 2)}</pre>
          <a href="/">Go back</a>
        </body>
      </html>
    `);

  } catch (error) {
    console.error(error);
    res.status(500).send("Error contacting Python backend.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Frontend running on port ${PORT}`));