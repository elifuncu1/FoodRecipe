const FoodIngredientsModel = require('../../../models/foodIngredients');

const splitIngredients = async function (selectedRecipe) {
  try {
    const veriArray = selectedRecipe.Recipe_Ingredients.split(',');

    const urunler = [];

    for (const item of veriArray) {
      const [urunAdi] = item.split(':');

      const eşleşenUrun = await FoodIngredientsModel.find({ Ingredients_Name: urunAdi });
      if (eşleşenUrun.length > 0) {
        urunler.push(...eşleşenUrun);
      }
    }

    return urunler;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  splitIngredients,
};
