const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Products = require('../models/products');
const FoodIngredients = require('../models/foodIngredients');
const foodRecipes = require('../models/foodRecipe');
const User = require('../models/userModel');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { find } = require('../models/products');
const { json } = require('body-parser');
var priceCalculateModule = require("./BusinessModules/ProductModules/priceCalculateModule");//Modülden çalışmaya devamke unutmuyoruz "DRY"
var splitModule = require("./BusinessModules/ProductModules/splitModule");//Modülden çalışmaya devamke unutmuyoruz "DRY"
const { postFoodIngredients } = require('./adminController');