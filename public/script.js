window.onload = async () => {
  const res = await fetch("/api/v1/subscriptions/user/me", {
    credentials: "include", 
  });

  if (!res.ok) {
    alert("Failed to fetch subscriptions");
    return;
  }

  const subscriptions = await res.json();
  const subsDiv = document.getElementById("subs-list");
  subsDiv.innerHTML = "";

  subscriptions.forEach((subs) => {
  subsDiv.innerHTML += `
  <div class="subscription-card">
    <p><strong>Name:</strong> ${subs.name}</p>
    <p><strong>Price:</strong> ${subs.price} ${subs.currency}</p>
    <p><strong>Frequency:</strong> ${subs.frequency}</p>
    <p><strong>Category:</strong> ${subs.category}</p>
    <p><strong>Start:</strong> ${subs.startDate.split('T')[0]}</p>
    <p><strong>Renewal:</strong> ${subs.renewalDate.split('T')[0]}</p>
    <p><strong>Status:</strong> ${subs.status}</p>
  </div>
  `;
  }); 
};

  const form = document.getElementById("subForm");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const price = document.getElementById("price").value.trim();
    const currency = document.getElementById("currency").value;
    const frequency = document.getElementById("frequency").value;
    const category = document.getElementById("category").value;
    const paymentMethod = document.getElementById("paymentMethod").value.trim();
    const status = document.getElementById("status").value;
    const startDate =document.getElementById("startDate").value;

    const res = await fetch("/api/v1/subscriptions/", {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price ,currency, frequency, startDate, paymentMethod, category, status }),
    });

    if (res.ok) {
      window.location.href = "/dashboard.html";
      window.alert("email will be sent before 1 week of expiration of subscription");
    } else {
      const data = await res.json();
      alert(data.message || "failed to add the subscription");
    }
  });

 const editForm = document.getElementById("editSubs");
 
  editForm.addEventListener("submit",async(e)=>{
    e.preventDefault();

    const name = document.getElementById("edit-name").value.trim();
    if (!name) {
    alert("Subscription name is required for editing.");
    return;
}
    const price = document.getElementById("edit-price").value.trim();
    const currency = document.getElementById("edit-currency").value;
    const frequency = document.getElementById("edit-frequency").value;
    const category = document.getElementById("edit-category").value;
    const paymentMethod = document.getElementById("edit-paymentMethod").value.trim();
    const status = document.getElementById("edit-status").value;
    const startDate =document.getElementById("edit-startDate").value;

    const res = await fetch(`/api/v1/subscriptions/edit/${name}`, {
      credentials: "include",
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price ,currency, frequency, startDate, paymentMethod, category, status }),
    });

    if (res.ok) {
      const message=document.getElementById("message")
      message.innerHTML=`your subscription for ${name} is updated`;
      window.location.href = "/dashboard.html";
    } else {
      const data = await res.json();
      alert(data.message || "failed to add the subscription");
    }
    
  })

