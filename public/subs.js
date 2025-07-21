document.getElementById("subscriptionForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById("name").value,
    price: parseFloat(document.getElementById("price").value),
    currency: document.getElementById("currency").value,
    frequency: document.getElementById("frequency").value,
    category: document.getElementById("category").value,
    paymentMethod: document.getElementById("paymentMethod").value,
    status: document.getElementById("status").value,
    startDate: document.getElementById("startDate").value,
  };

  try {
    const res = await fetch("/api/v1/subscriptions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: 'include',
      body: JSON.stringify(data)
    });

    const result = await res.json();
    const messageEl = document.getElementById("message");

    if (res.ok) {
      messageEl.style.color = "green";
      messageEl.innerText = "Subscription added successfully!";
      document.getElementById("subscriptionForm").reset();
      window.location.href = "/dashboard";
    } else {
      messageEl.style.color = "red";
      messageEl.innerText = result.message || "Error adding subscription";
    }
  } catch (err) {
    document.getElementById("message").innerText = "Network error!";
    document.getElementById("message").style.color = "red";
  }
});
