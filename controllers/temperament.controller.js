const { DOGS_API_KEY } = process.env;

const temperamentController = {
  getAllController: async (req, res) => {
    //Me traigo TODA la info de la API
    let infoApi = await axios.get(
      `https://api.thedogapi.com/v1/breeds?api_key${DOGS_API_KEY}`
    );
    //Mapeo la INFO que pedi anteriormente en busca de la PROPIEDAD TEMPERAMENT y la guardo
    let mapeadaApi = infoApi.data.map((t) => t.temperament); //A esa informacion le aplico metodos para poder manipularlo mejor
    let tempera = mapeadaApi.join(",").split(",");
    tempera.forEach(async (t) => {
      await Temperament.findOrCreate({
        where: { name: t },
      });
    });
    let todosTemperamentos = await Temperament.findAll();
    res.status(200).send(todosTemperamentos);
  },
};
module.exports = temperamentController;
