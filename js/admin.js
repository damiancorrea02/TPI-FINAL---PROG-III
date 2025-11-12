const ENDPOINT = "https://69125f3052a60f10c82173d4.mockapi.io/tpi";

document.addEventListener("DOMContentLoaded", async () => {
  const form = document.getElementById("adminForm");
  const usersList = document.getElementById("users-list")

  const usersResponse = await fetch(`${ENDPOINT}/auth`);
  const users = await usersResponse.json();

  for (const user of users) {
    const p = document.createElement("p")
    p.innerHTML = `${user.email} - ${user.isAdmin ? "admin" : "user"}`
    usersList.appendChild(p)
  }

  let authData = localStorage.getItem("user-data")
  authData = JSON.parse(authData)
  const isUserAdmin = authData.isAdmin

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    // si el usuario no es admin, rechazar petición
    if (!isUserAdmin) return alert("Function only available for admins.")

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const isAdmin = document.getElementById("isAdmin").checked;

    // el usuario no puede actualizar su propia cuenta
    if (authData.email === email) return alert("You cannot update your own accout.") 

    // validación básica
    if (!email || !password) {
      alert("Please fill in all required fields.");
      return;
    }

    const userData = { email, password, isAdmin };

    const exists = users.find((u) => u.email === email);

    // si el usuario ya existe, se lo actualiza
    if (exists) {
      try {
        await fetch(`${ENDPOINT}/auth/${exists.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData),
        });
        alert("The user was successfully updated.")
        location.reload()
      } catch (error) {
        console.error("Request failed:", err);
        return alert("An error occurred while updating the user.");
      }
    }

    // sino, lo crea
    try {
      const response = await fetch(`${ENDPOINT}/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        alert("The user was successfully created.");
        location.reload()
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
