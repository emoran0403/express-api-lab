const chirpsContainer = $("#chirpcontainer");
const addChirpButton = $("#submitButton");
const Chirpbox = $("#Chirpbox");
const usernameBox = $("#username");

addChirpButton.click((e) => {
  e.preventDefault(); // stops the button from refreshing the page
  const message = Chirpbox.val(); // store the value of the text in the chirpbox
  const username = usernameBox.val(); // store the value of the text in the username box
  if (!message) {
    // if there is nothing in the chirpbox, fire an alert
    swal.fire("Your chirp needs some text!");
    return;
  }

  if (!username) {
    // if there is nothing in the username box, fire an alert
    swal.fire("Don't forget your username!");
    return;
  }

  fetch("/api/chirps/", {
    // contact /api/chirps/ ...
    method: "POST", // ...with a POST request...
    headers: {
      // ...specifying the type of content...
      "content-type": "application/json",
    },
    body: JSON.stringify({ message, username }), // ...and deliver the content
  })
    .then((data) => data.json())
    .then((data) => {
      console.log(data);
      Chirpbox.val(""); // clears out the form boxes
      usernameBox.val("");
    })
    .catch((error) => console.log(error));
});

//! I need to get all chirps, then play with the data structure to turn it into an array and remove the next id key
// make the button call the deleteChirp function with the chirp ID
function getChirps() {
  fetch("/api/chirps/")
    .then((data) => data.json())
    .then((data) => {
      chirpsContainer.empty();
      chirpsContainer.append(
        data.map(
          (chirp) =>
            `<div class="card">
                <div class="card-body>
                    <h5 class="card-title">${chirp.username}</h5>
                    <p class="card-text">${chirp.message}</p>
                    <button onClick(() => {${chirp.id}})>Unchirp</button>
                    <button onClick(() => {${chirp.id}})>Rechirp</button> 
                </div>
            </div>`
        )
      );
    })
    .catch((error) => console.log(error));
}

getChirps();

function deleteChirp(id) {
  // contact /api/chirps/:id with a DELETE request to delete the specified chirp
  fetch(`/api/chirps/${id}`, { method: "DELETE" });
}

// <div class="card-header">${chirp?.username}</div>
