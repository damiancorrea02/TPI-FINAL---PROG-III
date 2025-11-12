const emailInp = document.getElementById("email");
const passInp = document.getElementById("password");
const loginButton = document.getElementById("login-btn");

const ENDPOINT = "https://69125f3052a60f10c82173d4.mockapi.io/tpi";

loginButton.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const userData = {};
  const password = passInp.value;
  const email = emailInp.value;
  if (!password.trim() || !email.trim()) {
    return alert("Please enter all the data");
  }

  userData.email = email;
  userData.password = password;
  if (email === "servettiemilio1@gmail.com") {
    userData.isAdmin = true;
  } else userData.isAdmin = false;

  // revisa si la cuenta ya existe
  const usersResponse = await fetch(`${ENDPOINT}/auth`);
  const users = await usersResponse.json();

  const exists = users.find((u) => u.email === email);

  // si existe y la contraseña no es correcta, muestra un error
  if (exists && exists.password !== password) {
    return alert("Invalid data")
  }

  // si existe guarda la info en localstorage y redirecciona
  if (exists) {
    localStorage.setItem("user-data", JSON.stringify(userData));
    location.replace("/index.html");
  }
  // sino, crea la cuenta y luego la guarda
  else {
    const response = await fetch(`${ENDPOINT}/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    localStorage.setItem("user-data", JSON.stringify(userData));
    location.replace("/index.html");
  }
  } catch (error) {
   alert("Error signing in") 
  }
});
