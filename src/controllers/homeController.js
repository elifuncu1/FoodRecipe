const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Products = require('../models/products');
const FoodIngredients = require('../models/foodIngredients');
const foodRecipes = require('../models/foodRecipe');
const User = require('../models/userModel');
const RecipeCategories = require('../models/recipeCategoryModel');
const Review = require('../models/reviewModel');
const priceCalculateModule = require("./BusinessModules/ProductModules/priceCalculateModule");
const jcc = require('json-case-convertor');
const { escape } = require('mysql');

const homePage = async (req, res, next) => {
  try {
    const categories = await RecipeCategories.find();
    const recipeList = await foodRecipes.find().limit(20);


    res.render('home/homePage', { layout: '../layouts/Home/homeLayout', title: `Yemek Tarifleri`, description: ``, keywords: ``, categories, recipeList })
  }
  catch (err) {
    console.log(err)
  }
}

const GetPrice = async (req, res, next) => {
  try {
    const categories = await RecipeCategories.find();

    const findedRecipe = await foodRecipes.findOne({ Recipe_Name: req.params.recipeName });
    const reviews = await getFoodRecipeReviews(findedRecipe._id)
    const recipeIngredients = findedRecipe.Recipe_Ingredients;
    //   const ProductList = recipeIngredients.map(ingredient => ingredient.name);
    const foodFindPromises = recipeIngredients.map(async (ingredient) => {
      const FoodFind = await Products.find({
        $and: [
          { product_name: { $regex: new RegExp(ingredient.subname, 'i') } },
          { product_category: { $regex: new RegExp(`^${ingredient.category}$`, 'i') } }
        ]
      });



      return FoodFind;
    });
    const FoodFinds = await Promise.all(foodFindPromises);
    const IngredientsList = [];
    const ProductsList = [];


    for (let i = 0; i < recipeIngredients.length; i++) {
      const ingredient = recipeIngredients[i];
      const FoodFind = FoodFinds[i];
      const info = {
        FoodName: ingredient.name,
        SubName: ingredient.subname,
        productList: FoodFind,
        wantedQuantity: ingredient.weight,
        x: 1
      };
      ProductsList.push(await priceCalculateModule.getCostOfProduct(await jcc.upperCaseValues(info.productList), info.wantedQuantity, info.x));
      IngredientsList.push(await FoodIngredients.findOne({ Ingredients_SubName: recipeIngredients[i].subname }));

    }
    res.render('home/showRecipePage', { layout: '../layouts/Home/homeLayout', title: 'Yemek Tarifleri', description: '', keywords: '', findedRecipe, IngredientsList, ProductsList, categories,reviews });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
const showDetailsOfRecipePage = async (req, res, next) => {
  try {
    const findedRecipe = await foodRecipes.findOne({ Recipe_Name: req.params.recipeName });
    const recipeIngredients = findedRecipe.Recipe_Ingredients;
    //   const ProductList = recipeIngredients.map(ingredient => ingredient.name);
    const foodFindPromises = recipeIngredients.map(async (ingredient) => {
      const FoodFind = await Products.find({
        $and: [
          { product_name: { $regex: new RegExp(ingredient.subname, 'i') } },
          { product_category: { $regex: new RegExp(`^${ingredient.category}$`, 'i') } }
        ]
      });



      return FoodFind;
    });
    const FoodFinds = await Promise.all(foodFindPromises);
    const IngredientsList = [];
    const ProductsList = [];


    for (let i = 0; i < recipeIngredients.length; i++) {
      const ingredient = recipeIngredients[i];
      const FoodFind = FoodFinds[i];
      const info = {
        FoodName: ingredient.name,
        SubName: ingredient.subname,
        productList: FoodFind,
        wantedQuantity: ingredient.weight,
        x: 1
      };
      ProductsList.push(await priceCalculateModule.getCostOfProduct(await jcc.upperCaseValues(info.productList), info.wantedQuantity, info.x));
      IngredientsList.push(await FoodIngredients.findOne({ Ingredients_SubName: recipeIngredients[i].subname }));

    }
    res.render('home/showRecipePage', { layout: '../layouts/Home/homeLayout', title: 'Yemek Tarifleri', description: '', keywords: '', findedRecipe, IngredientsList, ProductsList });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }


};

const getFoodRecipeReviews1 = async (req, res, next) => {
  try {
    console.log("Geldi2")
    const { recipeId } = req.params; // Örnek olarak route parametresi olarak recipeId kullanıyoruz

    // Recipe modelindeki reviews alanından ilgili recipeId'ye göre değerlendirmeleri buluyoruz
    const reviews = await Review.find({ recipe: recipeId });

    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
const getFoodRecipeReviews = async function (recipeId) {
  try {
    console.log("Geldi2")
    const reviews = await Review.find({ recipe: recipeId });
    return reviews

  }
  catch(err){
    console.log(err)
  }


}


const postFoodRecipeReview = async (req, res, next) => {
  try {
    console.log("GELDİ1")
    const { recipeId } = req.params; // Örnek olarak route parametresi olarak recipeId kullanıyoruz
    const { rating, comment } = req.body;

    // Yeni bir değerlendirme oluştur
    const newReview = new Review({
      recipe: recipeId,
      rating: rating,
      comment: comment,
      reviewer: "Kullanıcı", // İstediğiniz şekilde kullanıcı adını buraya ekleyebilirsiniz
    });

    // Değerlendirmeyi kaydet
    await newReview.save();
    const refererUrl = req.headers.referer;
    res.redirect(refererUrl);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};







const showLoginPage = async (req, res, next) => {
  try {

    res.render('user/userLoginPage', { layout: '../layouts/User/userLoginLayout', title: `Giriş Yap`, description: ``, keywords: `` });
  } catch (err) {
    console.log(err);
  }
};

const showRegisterPage = async (req, res, next) => {
  try {

    res.render('user/userRegisterPage', { layout: '../layouts/User/userLoginLayout', title: `Kayıt Ol`, description: ``, keywords: `` });
  } catch (err) {
    console.log(err);
  }
};


// GET
//birim fiyatı bul !
//birimleri sınıflandır
const getProductsWithPrice = async (req, res, next) => {
  try {
    req.params.ProductName.split(":")
    const productsList = await Products.find({ $and: [{ category_id: Number(req.params.categoryId) }, { product_name: { "$regex": req.params.ProductName, $options: 'i' } }] }).lean();
    const upperCasedProducts = priceCalculateModule.forToUpperCase(productsList);//aramada hata ile karşılaşmamak için!
    const productsWithTotalPrice = priceCalculateModule.getCostOfProduct(upperCasedProducts, req.params.quantity, 1);//ilk parametre listenin kendisi knk ikincisi istediğim miktar.
    //şimdi requestten gelen mikar değerini almışke 


    res.json(productsWithTotalPrice);//şimdilikss


  } catch (err) {
    console.log(err);
  }
};

const getDetailsOfRecipe = async (req, res, next) => {

  try {
    const requirements = req.params.recipeDetails.split(",")
    const FoodWeight = []
    for (i = 0; i < requirements.length; i++) {
      try {
        const Ingredients = await FoodIngredients.find({ Ingredients_SpecialID: requirements[i].split(":")[0] })
        const Ingredients_Name = Ingredients[0].Ingredients_Name //Malzeme Adı
        const Ingredients_SubName = Ingredients[0].Ingredients_SubName //Malzeme'nin subname'i bu malzemeyi fonksiyonuna yolla
        const Ingredients_Weight = Ingredients[0].Ingredients_Weight //Malzemenin Ağırlığı
        const Ingredients_ID = Ingredients[0].Ingredients_ID //Malzeme ID
        const Requirement_Weight = requirements[i].split(":")[2] // Gereken Ağırlık
        FoodWeight.push(Ingredients_SubName + ':' + Ingredients_ID + ':' + Ingredients_Weight + ':' + Requirement_Weight)

      }
      catch {
      }
    }
    var suggestedProducts = [];
    console.log(FoodWeight)
    for (i = 0; i < (FoodWeight.length); i++) {
      var test = await Products.find({ $and: [{ product_name: { "$regex": FoodWeight[i].split(':')[0], $options: 'i' } }, { category_id: Number(FoodWeight[i].split(':')[1]) }] }).lean()
      var upperCasedProducts = priceCalculateModule.forToUpperCase(test);
      suggestedProducts[i] = priceCalculateModule.getCostOfProduct(upperCasedProducts, FoodWeight[i].split(":")[3], FoodWeight[i].split(':')[2]).cheapestProduct
    }
    const totalprice = {
      TotalRecipePrice: priceCalculateModule.calculateTotalValueOfRecipe(suggestedProducts)
    }
    suggestedProducts.push(totalprice)
    res.json(suggestedProducts)

  }
  catch (err) {
    console.log(err);
  }

}

//yemek tariflerini çeker
const getFoodRecipeList = async (req, res, next) => {
  const list = await foodRecipes.find({ active: "1" })
  res.json(list)
}
//malzeme listesini çeker
const GetFoodIngredientsList = async (req, res, next) => {
  const list = await FoodIngredients.find({ Ingredients_Active: 1 })
  res.json(list)

}









//Get/test 
const Test = async (req, res, next) => {
}







const Login = async (req, res, next) => {
  try {
    const idpw = req.params.idpw.split(':')
    console.log(idpw)
  }
  catch (err) {
    console.log(err)
  }

};

// User
const Register = async (req, res, next) => {
  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(req.body.sifre, saltRounds);
    const uniqueId = uuidv4();
    const informations = {
      kullaniciAdi: req.body.kullaniciAdi,
      sifre: passwordHash,
      Email: req.body.email,
      nameSurname: req.body.nameSurname,
      User_ID: uniqueId,
    };
    const password = req.body.sifre;

    bcrypt.hash(password, saltRounds, async (err, hash) => {
      if (err) {
        console.log("Hashleme hatası", err);
      } else {
        const newUser = new User(informations);
        await newUser.save();
        res.redirect("../");
        console.log(req.body.kullaniciAdi + " başarıyla veritabanına eklendi.");
      }
    });
  } catch (err) {
    console.log(err);
  }
};




// Buraya Post atmamız gereken şeyleri yazalım

module.exports = {
  GetPrice,
  getProductsWithPrice,
  postFoodRecipeReview,
  Login,
  Register,
  getFoodRecipeList,
  GetFoodIngredientsList,
  Test,
  getDetailsOfRecipe,
  homePage,
  showDetailsOfRecipePage,
  showLoginPage,
  showRegisterPage,
}