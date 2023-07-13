const { getTodo } = require("../util/utilidades");
const dogsController = {
  getAllDogs: async (req, res) => {
    const name = req.query.name;
    let total = await getTodo();
    if (name) {
      let query = total.filter((p) =>
        p.name.toLowerCase().includes(name.toLowerCase())
      );
      query.length
        ? res.status(200).send(query)
        : res.status(404).send("Error, no existe tal perro con ese nombre");
    } else {
      res.status(200).send(total);
    }
  },
  getDogById: async (req, res) => {
    try {
      const { id } = req.params;
      //Primero me traigo todos los perros
      const todos = await getTodo();
      // console.log(todos);
      //Segundo, filtro y matcheo con la raza correspondiente
      const filtrado = todos.filter((r) => r.id == id);
      filtrado.length
        ? res.status(200).send(filtrado)
        : res.status(404).send("No existe tal raza de perro con ese ID");
    } catch (error) {
      res.status(500).send("Error server");
    }
  },
  deleteDogById: async (req, res) => {
    try {
      //Hago uso del metodo DESTROY de sequelize para borrarlo de mi BDD
      await Dog.destroy({
        //Donde el {id} es lo que tomo por params y elimino de bdd
        where: {
          id: req.params.id,
        },
      });
      res.status(200).send("Eliminado correctamente");
    } catch (error) {
      res.status(400).send("Id incorrecto");
    }
  },
  modifyDogById: async (req, res) => {
    try {
      //Hago uso del metodo UPDATE de sequelize para actualizarlo
      await Dog.update(
        {
          name: req.body.name,
          weight: req.body.weight,
          height: req.body.height,
        },
        {
          //Donde el {id} es lo que tomo por params y modifico las propiedades anteriores
          where: {
            id: req.params.id,
          },
        }
      );
      res.status(200).send("Modificado correctamente");
    } catch (error) {
      res.status(400).send("Id incorrecto");
    }
  },
  createDog: async (req, res) => {
    try {
      //lo que necesito por body (formulario frontEnd)
      const { name, weight, life_span, image, height, temperaments } = req.body;
      console.log(name, weight, life_span, image, height, temperaments);
      //todo lo que tenga el modelo TEMPERAMENT donde el name sea temperaments(body)
      const newTemperament = await Temperament.findAll({
        where: { name: temperaments },
      });
      //guardo lo que se crea en mi MODELO de perro en una constante
      const creadoDog = await Dog.create({
        name,
        weight,
        life_span,
        image,
        height,
      });
      console.log(creadoDog);
      //a la informacion anterior le hago el metodo ADD que lo asocia con el modelo TEMP y le pasa la variable que tiene la info del TEMPERAMENTO, LO UNE
      await creadoDog.addTemperament(newTemperament);
      console.log(creadoDog);

      res.status(200).send(creadoDog);
    } catch (error) {
      res.status(400).send("No se pudo crear el perro, verifique datos");
    }
  },
};
module.exports = dogsController;
