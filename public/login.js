  const form = document.getElementById("signup-form");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const res = await fetch("/api/v1/auth/sign-up", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    if (res.ok) {
      window.location.href = "/login.html";
    } else {
      const data = await res.json();
      alert(data.message || "Sign up failed");
    }
  });