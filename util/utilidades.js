const { DOGS_API_KEY } = process.env;
const axios = require("axios");
const { Dog, Temperament } = require("../database");
//Funcion que al EJECUTARSE me trae los PERROS con su correspondientes PROPIEDADES
const getApiData = async () => {
  //Me guardo lo que trae la API
  const url = await axios.get(
    `https://api.thedogapi.com/v1/breeds?api_key${DOGS_API_KEY}`
  );
  let info = await url.data.map((p) => {
    return {
      id: p.id,
      name: p.name,
      life_span: p.life_span,
      height: p.height.metric,
      weight: p.weight.metric,
      image: p.image.url,
      temperament: p.temperament,
    };
  });
  return info;
};

///////Funcion que me trae TODO mi modelo de DOG e incluyo el modelo de temperamento, solo el ATTRIBUTE NAME de THROUGH, es algo imperativo, siempre va.
const getDbData = async () => {
  let dbInfo = await Dog.findAll({
    include: [
      {
        model: Temperament,
        attributes: ["name"],
        through: {
          attributes: [],
        },
      },
    ],
  });
  //La modifico una vez unida con el Temperamento para luego mapearla en busca de cada DOG,mapeo el TEMPERAMENTO ya que me devuelve
  let info = await dbInfo.map((dog) => {
    return {
      id: dog.id,
      name: dog.name,
      weight: dog.weight,
      life_span: dog.life_span,
      image: dog.image,
      createInDb: dog.createInDb,
      height: dog.height,
      temperament: dog.temperaments.map((t) => t.name),
    };
  });
  return info;
};
//Ahora toca unir mi FUNCION que trae data de API y la FUNCION que trae de la Bd
const getTodo = async () => {
  const apiInfo = await getApiData();
  //Este se encarga de agregarle PESO,ALTURA y TEMPS a los perros que poseen el NaN o no tienen completo
  const revision = apiInfo.map((dog) => {
    if (dog.name == "Olde English Bulldogge") dog.weight = "22 - 30";
    if (dog.name == "Smooth Fox Terrier") dog.weight = "6 - 8";
    if (dog.name == "African Hunting Dog") dog.height = "60 - 76";
    if (dog.name == "Pekingese") dog.weight = "6 - 8";
    if (dog.id == 261) dog.temperament = "Loyal, Trainable, Gentle";
    if (dog.id == 211) dog.temperament = "Loyal, Intelligent, Charming";
    if (dog.id == 196) dog.temperament = "Intelligent, Friendly, Loyal";
    if (dog.id == 197) dog.temperament = "Intelligent, Friendly, Loyal";
    return dog;
  });
  const dbInfo = await getDbData();
  return [...dbInfo, ...revision];
};
module.exports = {
  getTodo,
};
