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
const { parse } = require('cookie');

const homePage = async (req, res, next) => {
  try {
    const categories = await RecipeCategories.find();
    const topRatedRecipes = await foodRecipes.find({ Recipe_Rate: { $exists: true } })
      .sort({ Recipe_Rate: -1 })
      .limit(9);
    const latestRecipeList = await foodRecipes.find().sort({ _id: -1 }).limit(9);
    const randomRecipeList = await foodRecipes.aggregate([{ $sample: { size: 20 } }]);



    res.render('home/homePage', { layout: '../layouts/Home/homeLayout', title: `Yemek Tarifleri`, description: ``, keywords: ``, categories, topRatedRecipes, latestRecipeList, randomRecipeList })
  }
  catch (err) {
    console.log(err)
  }
}
const showRecipeWithCategory = async (req, res, next) => {
  try {
    const categories = await RecipeCategories.find();
    const selectedRecipes = await foodRecipes.find({ Recipe_Category: req.params.categoryName })




    res.render('home/showWithCategoryPage', { layout: '../layouts/Home/homeLayout', title: `Yemek Tarifleri`, description: ``, keywords: ``, categories, selectedRecipes })
  }
  catch (err) {
    console.log(err)
  }
}
const showAddRecipePage = async (req, res, next) => {
  try {
    const ingredients = await FoodIngredients.find({ active: "1" })
    const categories = await RecipeCategories.find();


    res.render('user/addFoodRecipePage', { layout: '../layouts/free', title: `Tarif Ekle`, description: ``, keywords: ``, ingredients, categories })
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
    let price = priceCalculateModule.calculateTotalValueOfRecipe(ProductsList);
    findedRecipe.Recipe_Price = price; // Price değerini güncelle

    await findedRecipe.save(); // Güncellenmiş nesneyi kaydet

    console.log(price)

    res.render('home/showRecipePage', { layout: '../layouts/Home/homeLayout', title: 'Yemek Tarifleri', description: '', keywords: '', findedRecipe, IngredientsList, ProductsList, categories, reviews });
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
  catch (err) {
    console.log(err)
  }


}


const postFoodRecipeReview = async (req, res, next) => {
  try {
    const { recipeId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.cookies.loggedUser; // loggedUser cookies'ini alın

    // Kullanıcının daha önce yorum yaptığı kontrol ediliyor
    const user = await User.findOne({ User_ID: userId });

    const existingReview = await Review.findOne({ recipe: recipeId, reviewer: user.kullaniciAdi });
    if (existingReview) {
      // Kullanıcı daha önce yorum yapmışsa hata döndürülüyor
      return res.status(400).json({ message: 'You have already reviewed this recipe' });
    }


    const newReview = new Review({
      recipe: recipeId,
      rating: Number(rating),
      comment: comment,
      reviewer: user.kullaniciAdi,
    });

    await newReview.save();

    // Yorum kaydedildikten sonra, ilgili yemeğin puanını güncelleyin
    const recipe = await foodRecipes.findById(recipeId);
    recipe.Recipe_Rate = (recipe.Recipe_Rate * recipe.Review_Number + Number(rating)) / (recipe.Review_Number + 1); // Puanı güncelleyin
    recipe.Review_Number += 1; // Yorum sayısını arttırın
    console.log(recipe.Recipe_Rate);
    console.log(recipe.Review_Number);
    await recipe.save();

    const refererUrl = req.headers.referer;
    res.redirect(refererUrl);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};





const showUserDetailsPage = async (req, res, next) => {
  try {
    const cookies = parse(req.headers.cookie || '');
    const loggedUser = await User.findOne({ User_ID: cookies.loggedUser });
    res.render('user/userDetailsPage', { layout: '../layouts/Home/homeLayout', title: `Kullanıcı bilgileri`, description: ``, keywords: ``, loggedUser });
  } catch (err) {
    console.log(err);
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
const postfoodRecipe = async (req, res, next) => {
  try {
    const {
      product_name,
      recipeCategory,
      product_description,
      video
    } = req.body;
    const products = []; // products adlı boş bir dizi oluşturuldu
    let price = 0;
    const foodIngredients = JSON.parse(req.body.foodIngredients);
    const photos = [];
    for (let index = 0; index < req.files.length; index++) {
      const element = req.files[index].filename;
      photos.push(element)
    }

    const ingredients = await Promise.all(foodIngredients.map(async (ingredient) => {
      const productFind = await Products.find({
        $and: [
          { product_name: { $regex: new RegExp(ingredient.subname, 'i') } },
          { product_category: { $regex: new RegExp(`^${ingredient.category}$`, 'i') } }
        ]
      });

      if (productFind.length > 0) {
        products.push({
          Ingredients_Weight: ingredient.Ingredients_Weight,
          Product: productFind
        });

        return {
          subname: ingredient.Ingredients_SubName,
          weight: ingredient.Ingredients_Weight,
          category: ingredient.Ingredients_SubCategory,
          name: ingredient.Ingredients_Name,
          quantity: ingredient.quantity
        };
      }
    }));

    for (const prod of products) {
      const costOfProduct = await priceCalculateModule.getCostOfProduct(jcc.upperCaseValues(prod.Product), prod.Ingredients_Weight, 1).cheapestProduct;
      if (costOfProduct) {
        price += costOfProduct.requested_price;
      }
    }

    console.log("Total Price:", price);

    const informations = {
      Recipe_Name: product_name,
      Recipe_Description: product_description,
      Recipe_Category: recipeCategory,
      Recipe_Video: video,
      Recipe_Ingredients: ingredients,
      Recipe_photo: photos,
      Recipe_Price: 0,
      Ingredients_Active: "1"
    };

    const newProduct = new foodRecipes(informations);
    await newProduct.save();
    res.redirect('../');
    console.log(product_name + ' başarı ile veritabanına eklendi.');
  } catch (err) {
    console.log(err);
  }
};





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
  showRecipeWithCategory,
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
  showUserDetailsPage,
  showAddRecipePage,
  postfoodRecipe
}