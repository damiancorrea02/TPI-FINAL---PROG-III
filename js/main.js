(function ($) {
  "use strict";

  // Spinner
  var spinner = function () {
    setTimeout(function () {
      if ($("#spinner").length > 0) {
        $("#spinner").removeClass("show");
      }
    }, 1);
  };
  spinner(0);

  // Initiate the wowjs
  new WOW().init();

  // Sticky Navbar
  $(window).scroll(function () {
    if ($(this).scrollTop() > 200) {
      $(".sticky-top").addClass("shadow-sm").css("top", "0px");
    } else {
      $(".sticky-top").removeClass("shadow-sm").css("top", "-100px");
    }
  });

  // Car Categories
  $(".categories-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1000,
    dots: false,
    loop: true,
    margin: 25,
    nav: true,
    navText: [
      '<i class="fas fa-chevron-left"></i>',
      '<i class="fas fa-chevron-right"></i>',
    ],
    responsiveClass: true,
    responsive: {
      0: {
        items: 1,
      },
      576: {
        items: 1,
      },
      768: {
        items: 1,
      },
      992: {
        items: 2,
      },
      1200: {
        items: 3,
      },
    },
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });
})(jQuery);

const ENDPOINT = "https://69125f3052a60f10c82173d4.mockapi.io/tpi";

// cambiar contenido del "login button" dependiendo si hay sesion iniciada o no
const navBar = document.getElementById("navbarCollapse");
const loginButton = document.getElementById("login-header");
const navBarCollapse = document.getElementById("navbarLinks")
// formulario de reservación
const carForm = document.getElementById("car-reservation");
const carTypeInput = document.getElementById("car-type");
const pickUpInput = document.getElementById("pick-up");
const dropOffInput = document.getElementById("drop-off");
const pickUpDateInput = document.getElementById("pick-up-date");
const pickUpTimeInput = document.getElementById("pick-up-time");
const dropOffDateInput = document.getElementById("drop-off-date");
const dropOffTimeInput = document.getElementById("drop-off-time");

document.addEventListener("DOMContentLoaded", () => {
  // dia minimo hoy
  let today = new Date();
  today = today.toISOString().split("T")[0];

  if (pickUpDateInput) pickUpDateInput.setAttribute("min", today);
  if (dropOffDateInput) dropOffDateInput.setAttribute("min", today);
  const userData = localStorage.getItem("user-data");
  const parsedUserData = JSON.parse(userData);
  // si el user esta logeado, cambiar la funcionalidad del boton para que funcione como un logout
  if (userData) {
    loginButton.innerHTML = "Logout";
    loginButton.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("user-data");
      location.replace("/index.html");
    });
  }

  // si el user esta logeado, mostrar el rented cars link
  if (userData) {
    const rentedCarsLink = document.createElement("a")
    rentedCarsLink.innerHTML = "Rented Cars"
    rentedCarsLink.classList = "nav-item nav-link"
    rentedCarsLink.href = "rentedcars.html"
    navBarCollapse.appendChild(rentedCarsLink)
  }

  // si el user esta logeado y es admin, se habilita la funcion de manejar usuarios como admin
  if (userData && parsedUserData.isAdmin) {
    const adminPageButton = document.createElement("a");
    adminPageButton.classList = "btn btn-primary rounded-pill py-2 px-4";
    adminPageButton.innerHTML = "Admin";
    adminPageButton.href = "/admin.html";
    navBar.appendChild(adminPageButton);
  }

  // hacer formulario de creacion funcional
  if (carForm) {
    carForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const mandatoryFieldsFilled =
        carTypeInput.value &&
        pickUpInput.value &&
        pickUpDateInput.value &&
        pickUpTimeInput.value &&
        dropOffDateInput.value &&
        dropOffTimeInput.value;
      if (!mandatoryFieldsFilled) {
        return alert("Please fill in all required fields to continue.");
      }
      // recopilacion de los datos del formulario
      const formData = {
        user_id: parsedUserData.id,
        car_id: carTypeInput.value,
        pick_up_location: pickUpInput.value,
        drop_off_location: dropOffInput.value || pickUpInput.value,
        pick_up_date: pickUpDateInput.value,
        pick_up_time: pickUpTimeInput.value,
        drop_off_date: dropOffDateInput.value,
        drop_off_time: dropOffTimeInput.value,
      };
      // guardar la renta en el backend
      try {
        const response = await fetch(`${ENDPOINT}/rented_cars`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        alert("The reservation was saved.")
      } catch (error) {
        console.error(error)
        alert("Error saving the reservation");
      }
    });
  }
});
