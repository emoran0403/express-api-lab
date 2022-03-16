const fs = require("fs");
let chirps = { nextid: 0 };

if (fs.existsSync("chirps.json")) {
  chirps = JSON.parse(fs.readFileSync("chirps.json"));
}

// gets all the chirps, associated with the GET request
let getChirps = () => {
  return Object.assign({}, chirps); //create a copy and return it
};

// gets a specific chirp based on the id provided in the URL, associated with the GET request
let getChirp = (id) => {
  return Object.assign({}, chirps[id]); //create a copy and return it
};

// makes a new chirp, and writes it to the file, associated with the POST request
let createChirp = (chirp) => {
  chirps[chirps.nextid++] = chirp;
  writeChirps();
};

// finds a specific chirp based on id, edits it, then writes it to the file, associated with the PUT request
let updateChirp = (id, chirp) => {
  chirps[id] = chirp;
  writeChirps();
};

let deleteChirp = (id) => {
  delete chirps[id];
  writeChirps();
};

let writeChirps = () => {
  fs.writeFileSync("chirps.json", JSON.stringify(chirps));
};

module.exports = {
  CreateChirp: createChirp,
  DeleteChirp: deleteChirp,
  GetChirps: getChirps,
  GetChirp: getChirp,
  UpdateChirp: updateChirp,
};
