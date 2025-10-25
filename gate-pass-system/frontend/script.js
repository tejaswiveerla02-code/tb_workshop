// Function to send the student request
async function sendRequest() {
  const studentId = document.getElementById("studentId").value;
  const reason = document.getElementById("reason").value;
  const msg = document.getElementById("msg");

  // Basic validation
  if (!studentId || !reason) {
    msg.textContent = "❌ Please enter both Student ID and reason.";
    msg.classList.add("show");
    setTimeout(() => msg.classList.remove("show"), 3000);
    return;
  }

  try {
    // Send request to backend
    const response = await fetch("http://localhost:3000/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId, reason })
    });

    if (!response.ok) {
      msg.textContent = "❌ Failed to submit request.";
      msg.classList.add("show");
      return;
    }

    const data = await response.json();

    // 🕒 Backend returns stored date & time → display them here
    msg.innerHTML = `
      ✅ Request submitted successfully!<br>
      🆔 Student ID: <b>${data.request.studentId}</b><br>
      📄 Request ID: <b>${data.request.id}</b><br>
      📅 Date: ${data.request.date}<br>
      ⏰ Time: ${data.request.time}
    `;

    msg.classList.add("show");

    // Clear form fields
    document.getElementById("studentId").value = "";
    document.getElementById("reason").value = "";

    // Hide message after few seconds
    setTimeout(() => msg.classList.remove("show"), 6000);
  } catch (err) {
    console.error(err);
    msg.textContent = "❌ Error submitting request. Is backend running?";
    msg.classList.add("show");
  }
}
