
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("adminForm");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const isAdmin = document.getElementById("isAdmin").checked;

    // Basic validation
    if (!email || !password) {
      alert("Please fill in all required fields.");
      return;
    }

    const userData = { email, password, isAdmin };

    try {
      const response = await fetch("/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert("User created successfully!");
        form.reset();
      } else {
        const error = await response.text();
        alert("Error creating user: " + error);
      }
    } catch (err) {
      console.error("Request failed:", err);
      alert("An error occurred while creating the user.");
    }
  });
});
