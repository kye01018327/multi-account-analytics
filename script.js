document.getElementById("refreshBtn").addEventListener("click", async () => {
  const output = document.getElementById("output");
  output.textContent = "Fetching data...";

  try {
    const res = await fetch("/account");
    if (!res.ok) throw new Error(`Server error: ${res.status}`);
    const data = await res.json();
    output.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    output.textContent = `Error: ${err.message}`;
  }
});
