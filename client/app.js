const chirpsContainer = $("#chirpcontainer");
const addChirpButton = $("#submitButton");
const editChirpButton = $(`#editButton`);
const Chirpbox = $("#Chirpbox");
const usernameBox = $("#username");

editChirpButton.hide(); // hide the edit box on initial load, we only want it to show up when we're editing a chirp

getChirps(); // get the chirps when the page loads

let tempID; // value assigned when the edit button is pressed, so that the save edit button will have access to the chirp id

editChirpButton.click((e) => {
  // contact /api/chirps/:id with a PUT request to edit the specified chirp
  e.preventDefault(); // dont let the button refresh the page
  console.log(Chirpbox);
  console.log(usernameBox);
  fetch(`/api/chirps/${tempID}`, {
    // use the route:  /api/chirps/:id ...
    method: "PUT", // ...send a PUT request...
    headers: {
      // ...specifying the type of content...
      "content-type": "application/json",
    },
    body: JSON.stringify({ message: Chirpbox.val(), username: usernameBox.val() }), // ...and deliver the content
  })
    .then((res) => res.json())
    .then((res) => {
      editChirpButton.hide(); // swap the button displays
      addChirpButton.show();
      tempID = undefined; // set tempid to undefined
      Chirpbox.val(""); // clear out the input boxes
      usernameBox.val("");
    })
    .then((res) => {
      getChirps(); // display the chirps afterwards
    })
    .catch((error) => console.log(error));
});

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
    swal.fire("Who be chirpin?");
    return;
  }

  fetch("/api/chirps/", {
    // use the route:  /api/chirps/ ...
    method: "POST", // ...send a POST request...
    headers: {
      // ...specifying the type of content...
      "content-type": "application/json",
    },
    body: JSON.stringify({ message, username }), // ...and deliver the content
  })
    .then((data) => data.json())
    .then((data) => {
      swal.fire(`${usernameBox.val()} just chirped: ${Chirpbox.val()}`); // by using the values of the input boxes I never ran into the issue of it not displaying chirps
      Chirpbox.val(""); // clears out the form boxes
      usernameBox.val("");
      getChirps(); // display the chirps
    })
    .catch((error) => console.log(error));
});

function getChirps() {
  // contacts the server and asks for the chirp data, makes the data nicer, and then displays the chirps starting with the most recent
  fetch("/api/chirps/")
    .then((data) => data.json()) // takes our JSON and turns it into a JS object
    .then((badData) => {
      // badData is the object containing the badly formatted chirp objects
      const niceData = Object.keys(badData).map((key) => {
        // takes bad data and reformats it to an array of objects so we can map over it later
        return {
          id: key, // use the key as the id
          ...badData[key], // keep all of the old data entries
        };
      });

      niceData.pop(); // pops off the last entry in the array, in this case, the 'nextID' entry which we do not want to display as a chirp
      niceData.reverse(); // reverses the array, so that the most recent chirps appear first
      // Even though it destroys the original form of 'niceData' that is ok since 'niceData' is just a copy of our JSON data
      chirpsContainer.empty();

      // let arr = niceData.map((d) => d); // for debugging
      // console.log(arr);

      niceData.map((chirp) => {
        console.log("birdy boi: ", chirp);
        chirpsContainer.append(
          `<div class="card">
                    <div class="card-body>
                        <h5 class="card-title">Username: ${chirp.username.toString()}</h5>
                        <p class="card-text">Chirp: ${chirp.message.toString()}</p>
                        <button class="btn btn-danger" onclick="deleteChirp(${chirp.id.toString()})">Unchirp</button>
                        <button class="btn btn-info" onclick="enableEditChirpButton(${chirp.id}, ${chirp.message}, ${chirp.username})">Rechirp</button> 
                    </div>
            </div>`
        );
      });
    })
    .catch((error) => console.log(error));
}

function deleteChirp(id) {
  // contact /api/chirps/:id with a DELETE request to delete the specified chirp
  fetch(`/api/chirps/${id}`, { method: "DELETE" })
    .then((res) => res.json())
    .then((res) => getChirps()) // display the chirps afterwards
    .catch((error) => console.log(error));
}

function enableEditChirpButton(id, message, username) {
  addChirpButton.hide(); // swap the button displays
  editChirpButton.show();

  // console.log(id);
  // console.log(message);
  // console.log(username);

  Chirpbox.val(message); // fill the inputs with the previous chirp data
  usernameBox.val(username);

  tempID = id; // set temp id to the current chirp id so that the edit button function will have access to it
}
