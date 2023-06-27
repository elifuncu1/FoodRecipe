const FoodIngredientsModel = require('../../../models/foodIngredients');

const splitIngredients = async function (selectedRecipe) {
  try {
    const veriArray = selectedRecipe.Recipe_Ingredients.split(',');

    const urunler = [];

    for (const item of veriArray) {
      const [urunAdi] = item.split(':');
      const eslesenUrun = await FoodIngredientsModel.find({ Ingredients_Name: urunAdi });
      if (eslesenUrun.length > 0) {
        urunler.push(...eslesenUrun);
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
