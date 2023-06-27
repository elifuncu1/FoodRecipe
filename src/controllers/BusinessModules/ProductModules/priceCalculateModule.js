const jcc = require('json-case-convertor');

// Verilen bir ürün listesi, istenen miktar ve dönüşüm faktörü kullanarak ürün fiyatlarını hesaplar
module.exports.getCostOfProduct = function (productList, wantedQuantity, x) {
    var index = 0; 
    var listForReturn = productList ;
    var factor;
    var productQuantity;
    var unit;
    var cheapestPrice = Number.MAX_SAFE_INTEGER;
    var cheapestProduct;
    var avgPrice = 0;
    
    try {
        productList.forEach(element => {
            productQuantity = findQuantityOfProducts(element); // Her eleman için ürün miktarını bulur
            unit = findUnit(element); // Her eleman için ürün birimini bulur
            
            // Birim GR, ML veya G ise (1000) "alt tipe dönüşüm" yapılır
            if (unit == "GR" || unit == "ML" || unit == "G") {
                factor = wantedQuantity * x / productQuantity;
            } 
            // Birim KG, LT veya L ise (1000) ile çarparak "alt tipe dönüşüm" yapılır
            else if (unit == "KG" || unit == "LT" || unit == "L") {
                factor = wantedQuantity * x / productQuantity / 1000;
            }
            else {
                factor = wantedQuantity * x / productQuantity;
            }
            
            listForReturn[index].requested_price = element.product_price * factor;
            avgPrice += listForReturn[index].requested_price;
            
            if (element.product_price < cheapestPrice) {
                cheapestProduct = element;
            }
            
            index++;
        });
        avgPrice = avgPrice / index;
    
        return {
            'productList': listForReturn,
            'cheapestProduct': cheapestProduct,
            'averagePrice': avgPrice
        };
    } catch(err) {
        console.log(err)
    }
    
  
}

// Ürün listesindeki her bir ürünün değerlerini büyük harfe dönüştürür
module.exports.forToUpperCase = function (productList) {
    var listForReturn = productList; 
    var index = 0;
    
    try {
        productList.forEach(element => {
            listForReturn[index] = jcc.upperCaseValues(element);
            index++;
        });
    } catch(err) {
        console.log(err);
    }
    
    return listForReturn;
}

// Ürün adından ürün miktarını bulur
function findQuantityOfProducts(product) {
    return product.product_name.replace(/\D/g, '');
}

// Ürün adından ürün birimini bulur
function findUnit(product) {
    return product.product_name.slice(-2);
}

// Seçilen ürünlerin toplam değerini hesaplar
module.exports.calculateTotalValueOfRecipe = function(selectedProducts) {
    var totalPrice = 0;
    
    try {
        selectedProducts.forEach(element => {
            try {
                totalPrice += element.requested_price;
            } catch {
                
            }
        });
    } catch(err) {
        console.log(err);
    }

    return totalPrice;
}
