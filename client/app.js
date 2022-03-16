const chirpsContainer = $("#chirpcontainer");
const addChirpButton = $("#submitButton");
const Chirpbox = $("#Chirpbox");
const usernameBox = $("#username");

addChirpButton.click((e) => {
  e.preventDefault();
  const message = Chirpbox.val();
  const username = usernameBox.val();
  if (!message || !username) {
    swal.fire("fill in the boxes");
    return;
  }
  fetch("/api/chirps/", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ message, username }),
  })
    .then((data) => data.json())
    .then((data) => {
      console.log(data);
      Chirpbox.val("");
      usernameBox.val("");
    })
    .catch((error) => console.log(error));
});

function getChirps() {
  fetch("/api/chirps/")
    .then((data) => data.json())
    .then((data) => {
      chirpsContainer.empty();
      chirpsContainer.append(
        data.map(
          (chirp) =>
            `<div class="card">
            <div class="card-body">${chirp.message}</div>
            </div>`
        )
      );
    })
    .catch((error) => console.log(error));
}

getChirps();

function deleteChirp(id) {
  fetch(`/api/chirps/${id}`, { method: "DELETE" });
}

// <div class="card-header">${chirp?.username}</div>
