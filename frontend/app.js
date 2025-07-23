const form = document.getElementById("greet-form");
const nameInput = document.getElementById("name-input");
const responseBox = document.getElementById("response");
const spinner = document.getElementById("spinner");
const historyList = document.getElementById("history-list");

let greetingHistory = [];

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const style     = e.submitter.value;           // "nice"  |  "hate"
  const endpoint  = style === "hate" ? "/api/hate" : "/api/greet";

  // Build the request body
  const data = { name: nameInput.value };

  // Show spinner, clear response
  spinner.style.display = "block";
  responseBox.textContent = "";

  try {
    // POST to FastAPI
    const res = await fetch(`https://ajax-demo-backend-ashen.vercel.app${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const json = await res.json();
    responseBox.textContent = json.message;   // “Hello, …!”
    addToHistory(json.message);
  } catch (err) {
    responseBox.textContent = "Server unreachable 😢";
    addToHistory("[Error] Server unreachable 😢");
    console.error(err);
  } finally {
    spinner.style.display = "none";
  }
});

function addToHistory(message) {
  greetingHistory.push(message);
  if (greetingHistory.length > 10) greetingHistory.shift(); // keep last 10
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = "";
  greetingHistory.forEach((msg, idx) => {
    const li = document.createElement("li");
    li.textContent = msg;
    historyList.appendChild(li);
  });
}
