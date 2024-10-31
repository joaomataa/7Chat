document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch("php/login.php", {
    method: "POST",
    body: new URLSearchParams(`username=${username}&password=${password}`),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Login successful!") {
        sessionStorage.setItem("loggedInUserId", data.user_id);
        sessionStorage.setItem("loggedInUsername", username);
        window.location.href = "chat.html"
      }
    })
    .catch((error) => {
      console.error("Error during login: ", error)
      alert("An error occurred during login. Please try again.");
    })
});

document.getElementById("registerForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const regUsername = document.getElementById("regUsername").value;
  const regPassword = document.getElementById("regPassword").value
  const regPasswordConfirm = document.getElementById("regPasswordConfirm").value

  if (regPassword !== regPasswordConfirm) {
    alert("Passwords do not match. Please try again.");
    return;
  }

  fetch("php/register.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      username: regUsername,
      password: regPassword,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert("Registration successful! Please log in.");
        location.reload()
      } else {
        alert(data.message || "Registration failed");
      }
    })
    .catch((error) => {
      console.error("Error during registration:", error)
    })
});

document.getElementById("showRegisterForm").addEventListener("click", function (e) {
  e.preventDefault();
  document.getElementById("loginContainer").classList.add("hidden")
  document.getElementById("registerContainer").classList.remove("hidden")
})

document.getElementById("showLoginForm").addEventListener("click", function (e) {
  e.preventDefault();
  document.getElementById("registerContainer").classList.add("hidden")
  document.getElementById("loginContainer").classList.remove("hidden")
})
