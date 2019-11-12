var cart =[];
var products = [];
var flag=1;
var cartId = 1;
var userId = 1;
var productId = 1;
var loggedInUser="";
var users = [];
var order = [];

divListProduct = document.getElementById("divListProduct");
cartAddedProduct = document.getElementById("cartAddedProduct");

var currentUser = document.getElementById("currentUser");

function getSessionOfUser(){
    if(!sessionStorage.loggedInUser){
        sessionStorage.loggedInUser = JSON.stringify([]);
    }
    else{
        loggedInUser = JSON.parse(sessionStorage.loggedInUser);
        userId = loggedInUser.indexOf(loggedInUser[loggedInUser.length-1])+1;
    

    if(loggedInUser=="")
    return "";
    else{

    var displayName = document.createElement("a");
    var nameToBeDisplayed = document.createTextNode("Welcome "+loggedInUser[0].Name+"       |   ");
    displayName.appendChild(nameToBeDisplayed);

    var logOut = document.createElement("a");
    logOut.setAttribute("href","login.html");
    var textLogOut = document.createTextNode("LogOut");
    logOut.appendChild(textLogOut);

    currentUser.appendChild(displayName);
    currentUser.appendChild(logOut);

    currentUser.setAttribute("style","margin-left:80%");

    var breakLine = document.createElement("br");
    currentUser.appendChild(breakLine);
    }
}
}


function addProductToList(objProduct) {
    var result = document.createElement("div");

    var cartButton = document.createElement("button");
    cartButton.innerHTML = "Add to Cart";


    var str = "Product name : " + objProduct.Name + "<br>Description : " + objProduct.Desc + "<br>Price : Rs " + objProduct.Price + "<br>";

    var qtyText = document.createElement("input");
    qtyText.setAttribute("type","number");
    qtyText.setAttribute("placeholder" ,"Enter Quantity");
    qtyText.setAttribute("size","15");
    qtyText.setAttribute("style","margin-right:10px");
    qtyText.setAttribute("minlength","1");

    var product = document.createElement("p");
    product.innerHTML=str;

    result.setAttribute("id", objProduct.Id);
    result.appendChild(product);

    result.appendChild(qtyText);

    result.appendChild(cartButton);

    divListProduct.appendChild(result);


    storeProductsToCart();

    cartButton.addEventListener("click", function (e) {

        if(loggedInUser=="")
        {
            alert("You Are Not Logged In")
            location.href="login.html";
            return "";
        }
        else{
        var cartObj = new Object();
        
        cartObj.uId = loggedInUser[0].uId;
        cartObj.Id = objProduct.Id;
        cartObj.Name= objProduct.Name;
        cartObj.Desc = objProduct.Desc;
        cartObj.Price = objProduct.Price;
        cartObj.Quantity = qtyText.value;
        


        qtyText.value="";
        
        // for(var i=0;i<cart.length;i++)
        // {
        //     if(cartObj.Id == cart[i].Id)
        //     {
        //         cart.splice(cartId-1,1);
        //     }
        // }

        for(var i=0;i<products.length;i++)
        {
            if(products[i].Id == cartObj.Id)
            {

                    if(products[i].Quantity==0)
                    {
                        var parentNode = e.target.parentNode;
                        var index = findIndex(parseInt(parentNode.id))
                        console.log(products);
                        products.splice(index,1);
                        localStorage.products = JSON.stringify(products)
                    }
                    
                    if(cartObj.Quantity > products[i].Quantity || cartObj.Quantity==0)
                    {
                        alert(products[i].Quantity+" units are available and is Invalid");
                        break;
                    }
                    else{
                    products[i].Quantity-=cartObj.Quantity;
                    cart.push(cartObj);
                    }
            }
        }
        
        function findIndex( id )
        {
            for(var i=0;i<products.length;i++)
                {
                    if(products[i].Id == id)
                    {
                        return i;
                    }
                }
        }


        storeProductsToProducts();
        storeProductsToCart();
        
        cartId++;
        // getStoredProductsFromCart();

        getStoredProductsFromCart();

        if(flag==1)
        {
            
            var breakLine = document.createElement("br");
            document.getElementById("right").appendChild(breakLine);

            var checkOut = document.createElement("button");
            checkOut.innerHTML="Checkout";

            document.getElementById("right").appendChild(checkOut);
            flag=0;

            checkOut.addEventListener("click",function(event){
                  window.location.href="cart.html"
            });
        }

        
    }
});
}




    // function getStoredProductsFromCart() {


    //     if(!sessionStorage.loggedInUser){
    //         sessionStorage.loggedInUser = JSON.stringify([]);
    //     }
    //     else{
    //         loggedInUser = JSON.parse(sessionStorage.loggedInUser);
    //         userId = loggedInUser.indexOf(loggedInUser[loggedInUser.length-1])+1;
    //     }

    //     if(loggedInUser=="")
    //     {
    //         return "";
    //     }

    //     else{
    //             // if (!localStorage.cart) {
    //             //     localStorage.cart = JSON.stringify([]);
    //             // }

    //             // else{

    //                 // var showProductOfLoggedUserName = loggedInUser[0].Name;
    //                 var showProductOfLoggedUserId = loggedInUser[0].uId;
    //                 // cart =  JSON.parse(localStorage.cart);
    //                 //  productId=cart.indexOf(cart[cart.length-1])+1;
            
    //                 //  cartAddedProduct.innerHTML="";
    //                 // while (cartAddedProduct.hasChildNodes()) {
    //                 //     cartAddedProduct.removeChild(cartAddedProduct.lastChild);
    //                 // }
        
    //                 //  for(var i=0;i<cart.length;i++)
    //                 //  {  
    //                     addProductToCart(showProductOfLoggedUserId);            
    //                 //  }
    //             // }

    //     }




    // }


function addProductToCart(showProductOfLoggedUserId) {
    // alert()

    // if (!localStorage.users) {
    //     localStorage.users = JSON.stringify([]);
    // }
    // else{
    //      users =  JSON.parse(localStorage.users);
    //      userId=users.indexOf(users[users.length-1])+1;
    // }


    // for(var i=0;i<users.length;i++)
    // {
    //     if(users[i].uId ==showProductOfLoggedUserId && users[i].Name==showProductOfLoggedUserName)
    //     {
    //         
    //         while (cartAddedProduct.hasChildNodes()) {
    //         cartAddedProduct.removeChild(cartAddedProduct.lastChild);
    //          }

    //     }
    //     else
    //     return "";
    // }

    if (!localStorage.cart) {
        localStorage.cart = JSON.stringify([]);
    }
    else{
         cart =  JSON.parse(localStorage.cart);
         while (cartAddedProduct.hasChildNodes()) {
                cartAddedProduct.removeChild(cartAddedProduct.lastChild);
            }
        //  userId=users.indexOf(users[s.length-1])+1;
    }

   for(var i=0;i<cart.length;i++)
   { 


    

    if(cart[i].uId==showProductOfLoggedUserId) {
        var qty= cart[i].Quantity;

        var result = document.createElement("div");

        var deleteProduct = document.createElement("button");
        deleteProduct.innerHTML = "Delete";

        var str = "Product name : " + cart[i].Name + "<br>Description : " + cart[i].Desc + "<br>Price : Rs " + cart[i].Price + "<br>"+cart[i].Quantity+"<br>";

        var product = document.createElement("p");
        product.innerHTML=str;

        result.setAttribute("id", cart[i].Id);
        result.appendChild(product);

    
        result.appendChild(deleteProduct);

        cartAddedProduct.appendChild(result);

        cartAddedProduct.setAttribute("margin-left","20px")

        storeProductsToCart();
        // storeProductsToOrder();

        deleteProduct.addEventListener("click", function (e) {
            var parentNode = e.target.parentNode;
            var index = findIndex(parseInt(parentNode.id))
            // console.log(products);
            cart.splice(index,1);

            quantityAddedToProduct(parentNode.id,qty);

            cartAddedProduct.removeChild(parentNode);

            storeProductsToCart();
        });
    }
   }
}


function quantityAddedToProduct(index,qty)
{
    for(var i=0;i<products.length;i++)
    {
        if(products[i].Id == index)
        {
            var sub = +products[i].Quantity + +qty;

            products[i].Quantity = sub
        }
    }
                
                localStorage.products = JSON.stringify(products)

                
}

function findIndex( id )
{
    for(var i=0;i<products.length;i++)
        {
            if(products[i].Id == id)
            {
                return i;
            }
        }
}




function storeProductsToCart() {
    localStorage.cart = JSON.stringify(cart);
}

function storeProductsToProducts()
{
    localStorage.products=JSON.stringify(products);
}

