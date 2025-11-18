const carsContainer = document.querySelector(".cars-container");

document.addEventListener("DOMContentLoaded", async () => {
  const userData = localStorage.getItem("user-data");
  const parsedUserData = JSON.parse(userData);

  const loadingState = document.createElement("p");
  loadingState.innerHTML = "Loading cars...";
  loadingState.className = "loading-state";
  carsContainer.replaceChildren(loadingState);

  try {
    // Obtener datos de autos y reservaciones
    const [rentedResponse, carsResponse] = await Promise.all([
      fetch(`${ENDPOINT}/rented_cars`),
      fetch("resources/cars.json"),
    ]);

    const rentedData = await rentedResponse.json();
    const carsData = await carsResponse.json();

    // Filtrar autos rentados por user id
    const rentedByOwner = rentedData.filter(
      (c) => c.user_id === parsedUserData.id
    );
    carsContainer.innerHTML = "";

    // Si no se encuentran autos rentados, mostrar un mensaje
    if (rentedByOwner.length === 0) {
      const noRentalsMessage = document.createElement("p");
      noRentalsMessage.textContent = "You don't have any rented cars.";
      noRentalsMessage.className = "loading-state";
      carsContainer.appendChild(noRentalsMessage);
      return;
    }

    // Crear una "card" para cada auto rentado
    rentedByOwner.forEach((rental) => {
      const car = carsData.find((c) => c.id === parseInt(rental.car_id));

      if (!car) return;

      const carCard = document.createElement("div");
      carCard.className = "car-card";

      carCard.innerHTML = `
        <img src="${car.image}" alt="${car.name}">
        <h2>${car.name}</h2>
        <p>Status: <span class="status rented">Rented</span></p>
        <p>Price per day: $${car.pricePerDay}</p>
        <p>Pick up: ${rental.pick_up_date} at ${rental.pick_up_time}</p>
        <p>Drop off: ${rental.drop_off_date} at ${rental.drop_off_time}</p>
        <p>Location: ${rental.pick_up_location} → ${rental.drop_off_location}</p>
        <button id="cancel-reservation-${rental.id}" class="cancel-reservation">Cancel Reservation</button>
      `;
      carsContainer.appendChild(carCard);
      //   Botón para cancelar la reserva
      const cancelButton = document.getElementById(
        `cancel-reservation-${rental.id}`
      );
      cancelButton.addEventListener("click", async () => {
        const confirmed = window.confirm(
          "Are you sure you want to cancel this reservation?"
        );
        if (confirmed) {
          try {
            const response = await fetch(`${ENDPOINT}/rented_cars/${rental.id}`, {
              method: "DELETE",
            });
            location.reload()
          } catch (error) {
            console.error(error);
            alert("Error cancelling reservation");
          }
        }
      });
    });
  } catch (error) {
    console.error("Error loading rented cars:", error);
    carsContainer.innerHTML =
      "<p class='loading-state'>Error loading rented cars. Please try again later.</p>";
  }
});
