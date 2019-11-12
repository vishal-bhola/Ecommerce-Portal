
var mongoose = require('mongoose');

var Schema  = mongoose.Schema

let Products = new Schema({
    Name:{type:String},
    Desc:{type:String},
    Price:{type:Number},
    Quantity:{type: Number}

});

var products = mongoose.model("product",Products)


let Carts = new Schema({
    Pid:{type:String},
    Name:{type:String},
    Desc:{type:String},
    Price:{type:Number},
    Quantity:{type:Number},
    Email:{type:String},
    TotalCost:{type:Number}
});

var cart = mongoose.model("cart",Carts)



let Users = new Schema({
    Name:{type:String},
    Email:{type:String},
    Password:{type:String},
    Phone:{type:String},
})

var user = mongoose.model("user",Users);


let Admins = new Schema({
    Name:{type:String},
    Email:{type:String},
    Password:{type:String},
})

var admin = mongoose.model("admin",Admins);


let Checkout = new Schema({
    Name:{type:String},
    Desc:{type:String},
    Price:{type:Number},
    CartId:{
        type: Schema.Types.ObjectId,
        ref: "cart"
    },
    PId:{
        type:Schema.Types.ObjectId,
        ref:"cart"
    },
    Quantity:{type:Number},
    Email:{type:String},
    userName:{type:String},
    TotalCost:{type:Number},
    Date:{type:Date}
})

var checkout = mongoose.model("checkout",Checkout);

module.exports={
    products,
    cart,
    user,
    checkout,
    admin
}
