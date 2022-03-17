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

function getChirps() {
  fetch("/api/chirps/")
    .then((data) => data.json()) // takes our JSON and turns it into a JS object
    .then((badData) => {
      // badData is the object containing the badly formatted chirp objects
      const niceData = Object.keys(badData).map((key) => {
        // takes bad data and reformats it to an array of objects so we can map over it later
        return {
          id: key,
          username: badData[key].username,
          message: badData[key].message,
        };
      });

      niceData.pop(); // pops off the last entry in the array, in this case, the 'nextID' entry which we do not want to display as a chirp
      chirpsContainer.empty();
      chirpsContainer.append(
        niceData.map(
          (chirp) =>
            `<div class="card">
                <div class="card-body>
                    <h5 class="card-title">Username: ${chirp.username}</h5>
                    <p class="card-text">Chirp: ${chirp.message}</p>
                    <button>ID: ${chirp.id} Unchirp</button>
                    <button>ID: ${chirp.id} Rechirp</button> 
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
