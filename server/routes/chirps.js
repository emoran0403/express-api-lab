const express = require("express");
const chirpsStore = require("../chirpstore");
let router = express.Router();

//* Current route is /api/chirps

// GET will retrieve data from a source
// this GET is set up to retrieve ALL chirps, or a specific chirp if an id is provided in the URL
router.get("/:id", (req, res) => {
  let id = req.params.id; // grabs the id from the URL and calls it 'id' for convenience
  let chosenChirp = chirpsStore.GetChirp(id); // gets the chirp to be updated

  if (Object.keys(chosenChirp).length) {
    // if an id was provided
    // and if the requested chirp exists, then respond with the chosen chirp
    res.json(chirpsStore.GetChirp(id)); // a response comes with an implied 200 success code, so I don't need to chain on .status(200)
  } else {
    // if an id was not provided, then get all chirps
    res.status(404).json({ message: `The Chirp with ID: ${id} was not found :(` }); // 404 => Not Found
  }
});

router.get("/", (req, res) => {
  res.send(chirpsStore.GetChirps());
});

// POST will create data and send it to the source
// our post will create a new chirp object with a new id, and add it to the previous list of chirps
router.post("/", (req, res) => {
  chirpsStore.CreateChirp(req.body); // create a new chirp from the data provided in the body of the response
  res.status(200).json({ message: "New Chirp Added!" }); // .sendStatus completes the response, whereas .status(num) is better for chaining if necessary
});

// PUT will retrieve data, edit that data, then send it back to the source
// our PUT will get a chirp, edit it, then send it back to the list of chirps...but only if it exists
router.put("/:id", (req, res) => {
  let id = req.params.id; // grabs the id from the URL
  let newChirp = req.body; // grabs the body from the request
  let oldChirp = chirpsStore.GetChirp(id); // gets the chirp to be updated
  if (id && Object.keys(oldChirp).length) {
    // if the url contains an id - without which we cannot edit a chirp
    // if the requested chirp exists, then we can edit it with the new chirp
    chirpsStore.UpdateChirp(id, newChirp);
    res.status(200).json({ message: "Chirp Updated!" }); //! i need to ALWAYS send either a status code or a response.  simply calling update chirp does neither
  } else {
    // if an id is not present, or if the requested chirp does not exist, we cannot edit it - so send an error
    res.status(404).json({ message: `The Chirp with ID: ${id} was not found :(` }); // 404 => Not Found
  }
});

// DELETE will delete a specified piece of data
// our delete request will check if a chirp exists, and if it does, it will then be deleted
router.delete("/:id", (req, res) => {
  let id = req.params.id;
  let chirpToDelete = chirpsStore.GetChirp(id); // gets the chirp to be updated

  if (id && Object.keys(chirpToDelete).length) {
    // if the url contains an id - without which we cannot edit a chirp
    // if the requested chirp exists, then we can edit it with the new chirp
    chirpsStore.DeleteChirp(id);
    res.status(200).json({ message: `The Chirp with ID: ${id} was deleted! Goodbye!` });
  } else {
    // if an id is not present, or if the requested chirp does not exist, we cannot edit it - so send an error
    res.status(404).json({ message: `The Chirp with ID: ${id} was not found :(` }); // 404 => Not Found
  }
});

module.exports = router;
