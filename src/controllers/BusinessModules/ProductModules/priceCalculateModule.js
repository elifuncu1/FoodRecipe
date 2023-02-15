const jcc = require('json-case-convertor');
//queryden sadece json _doc gelmeli!
module.exports.getCostOfProduct = function (productList,wantedQuantity,x){//birim litre veya Kg ise (1000) "alt tipe dönüşüm"
    //
    var index = 0; 
    var listForReturn = productList ;
    var factor;
    var productQuantity;
    var unit
    var cheapestPrice = Number.MAX_SAFE_INTEGER;
    var cheapestProduct;
    var avgPrice = 0;
    try{
        productList.forEach(element => {
        productQuantity = findQuantityOfProducts(element);
        unit = findUnit(element);
        if(unit == "GR" || unit == "ML" || unit == "G"){
            factor = wantedQuantity * x / productQuantity 
        }else if(unit == "KG" || unit == "LT" || unit == "L"){//adet için vs sonra ayarlama yaparız...
            factor = wantedQuantity * x / productQuantity / 1000 
        }
        else{
            factor = wantedQuantity * x / productQuantity 
        }
        listForReturn[index].requested_price = element.product_price * factor ; 
        avgPrice += listForReturn[index].requested_price;
        if(element.product_price < cheapestPrice){
            cheapestProduct = element
        }
        index ++ ;
    });
}
catch{
    return 0
}
    avgPrice = avgPrice / index;
    return {'productList' :listForReturn,'cheapestProduct' : cheapestProduct,'avaragePrice' : avgPrice};
    
}
 function findQuantityOfProducts (product){
        
        return product.product_name.replace(/\D/g, '');
    
}
 function findUnit (product){//artık birim ilk üründen rahat bir şekilde gözükebiliyor h.o //Katı sıvı için! 
  return  product.product_name.slice(-2);
}
module.exports.forToUpperCase = function (productList){
    var listForReturn = productList; 
    var index = 0;
    try{productList.forEach(element => {
        listForReturn[index] = jcc.upperCaseValues(element);
        index++ ;
    });
    }catch(err){
        console.log(err)
    }
    return listForReturn;
}
module.exports.findQuantityOfProducts= function(product){//sadece export için geçici bir yazım daha düzgün gösterim varsa düzeltilmeli
    return findQuantityOfProducts(product);
}
module.exports.findUnit = function(product){
    return findUnit(product);
}
module.exports.calculateTotalValueOfRecipe = function(selectedProducts){
    var totalPrice = 0;
    try{selectedProducts.forEach(element => {
        try{
        totalPrice += element.requested_price;
        }
        catch{
            
        }
    });
    }catch(err){
        console.log(err)
    }

    return totalPrice;
}

