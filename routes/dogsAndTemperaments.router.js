const express = require("express");
const router = express.Router();

const bookController = require("../controllers/book.controller");
const dogsController = require("../controllers/dogs.controller");
const temperamentController = require("../controllers/temperament.controller");
//WELCOME
router.get("/", async (req, res) => {
  res.status(200).send("WELCOME");
});

//DOGS
router.get("/dogs", dogsController.getAllDogs);
router.get("/dogs/:id", dogsController.getDogById);
router.delete("/dogs/:id", dogsController.deleteDogById);
router.put("/dogs/:id", dogsController.modifyDogById);
router.post("/dogs", dogsController.createDog);
//TEMPERAMENTS
router.get("/temperaments", temperamentController.getAllController);
//old
router.get("/", bookController.getAll);
router.get("/:id", bookController.getById);
router.post("/", bookController.create);
router.put("/:id", bookController.updateById);
router.delete("/:id", bookController.deleteById);

module.exports = router;
