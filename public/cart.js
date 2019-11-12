var cart =[];
var products = [];
var cartId = 1;
var flag=1;
var sum=0;
var order = [];
// var productId /= 1;

checkOutProduct = document.getElementById("checkOutProduct");


function getDataFromLocalStorage()
{
    if(!sessionStorage.loggedInUser){
        sessionStorage.loggedInUser = JSON.stringify([]);
    }
    else{
        loggedInUser = JSON.parse(sessionStorage.loggedInUser);
        userId = loggedInUser.indexOf(loggedInUser[loggedInUser.length-1])+1;
    }
}


function getStoredProducts() {

    getDataFromLocalStorage();

    if (!localStorage.cart) {
        localStorage.cart = JSON.stringify([]);
    }
    else{
         cart =  JSON.parse(localStorage.cart);
         productId=cart.indexOf(cart[cart.length-1])+1;


         for(var i=0;i<cart.length;i++)
         {
            checkOutProductList(cart[i]);            
            sum+=cart[i].Price*cart[i].Quantity;
         }
        payBillButton();
    }
}


function checkOutProductList(objProduct) {
    var result = document.createElement("div");


    var str = "Product name : " + objProduct.Name + "<br>Description : " + objProduct.Desc + "<br>Price : Rs " + objProduct.Price + "<br>Quantity: "+objProduct.Quantity+"<hr>";

    var product = document.createElement("p");
    product.innerHTML=str;

    result.setAttribute("id", objProduct.Id);
    result.appendChild(product);


    checkOutProduct.appendChild(result);


    storeProducts();

}



function payBillButton()
{
    

        var payBill = document.createElement("button");
        payBill.innerHTML = "Pay Bill";
        payBill.setAttribute("style","margin-right:20px");

        var continueShopping = document.createElement("button");
        continueShopping.innerHTML="Continue";


        var totalPrice = document.createTextNode("Total Price: "+sum);


        checkOutProduct.appendChild(totalPrice);
        breakLine();
        breakLine();
        breakLine();
        checkOutProduct.appendChild(payBill);
        checkOutProduct.appendChild(continueShopping);

        payBill.addEventListener("click",function(e){
            alert("Payment Received");

            order = cart;

            localStorage.order = JSON.stringify(order);
            console.log(order);
            localStorage.cart = JSON.stringify([]);
        });

        continueShopping.addEventListener("click",function(e){
        window.location.href="view-product.html";
    });
}

function breakLine()
{
    var breakLine = document.createElement("br");
    checkOutProduct.appendChild(breakLine);
}


function storeProducts() {
    localStorage.cart = JSON.stringify(cart);
}

