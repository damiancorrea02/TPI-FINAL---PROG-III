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

// cambiar contenido del "login button" dependiendo si hay sesion iniciada o no
const navBar = document.getElementById("navbarCollapse");
const loginButton = document.getElementById("login-header");

document.addEventListener("DOMContentLoaded", () => {
  const userData = localStorage.getItem("user-data");
  const parsedUserData = JSON.parse(userData);
  // si el user esta logeado, cambiar la funcionalidad del boton para que funcione como un logout
  if (userData) {
    loginButton.innerHTML = "Logout";
    loginButton.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("user-data");
      location.reload();
    });
  }

  // si el user esta logeado y es admin, se habilita la funcion de manejar usuarios como admin
  if (userData && parsedUserData.isAdmin) {
    const adminPageButton = document.createElement("a");
    adminPageButton.classList = "btn btn-primary rounded-pill py-2 px-4"
    adminPageButton.innerHTML = "Admin";
    adminPageButton.href = "/admin.html";
    navBar.appendChild(adminPageButton);
  }
});
