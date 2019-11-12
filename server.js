var express = require("express");
var mongoose = require("mongoose");
var products = require("./database").products;
var cart = require("./database").cart;
var user = require("./database").user;
var checkout = require('./database').checkout;
var admin = require('./database').admin;
var app = express();
var url = require("url");
var path = require('path');
var bodyparser = require("body-parser");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var ejs  = require('ejs');
var m=0;
// const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(res.redirect('/view-product'), waitTimeInMs));





app.use(cookieParser());
app.use(
  session({
    secret: "asfaasdasd",
    resave: true,
    saveUninitialized: true
  })
);

app.use(
  bodyparser.urlencoded({
    extended: true
  })
);
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname,'public')))
app.set("view engine", "ejs");

mongoose
  .connect("mongodb://localhost/ecom", {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("db connected");
  })
  .catch(error => {
    console.log(error);
  });

app.get("/", (req, res) => {
  products.find().then(product => {
    res.render("manage-product", {product});
  });
});


app.post("/addProducts", (req, res) => {
  // console.log(req.body.productname)
  var product = new products({
    Name: req.body.productname,
    Price: req.body.productprice,
    Desc: req.body.productdesc,
    Quantity: req.body.productqty
  });
  // console.log(product._id)
  product.save()
    .then(() => {
        res.redirect("/");
      })
    .catch(error => {
      console.log(error);
    });
});

app.get("/editadmin",function(req,res){
  if(req.cookies.email)
  {
    
  }
  else{
    res.redirect("/");
  }
})

app.post("/product/:id", function(req, res) {

  if(req.cookies.email)
  {
      products.findByIdAndRemove(
        {
          _id: req.params.id
        },
        function(err, data) {
          if (err) throw err;
          else res.redirect("/");
        }
      );
  }
  else{
    res.redirect("/");
  }
});


app.post("/cart/:id", function(req, res) {
  console.log(req.params.id);
  cart.findById({_id: req.params.id})
    .then(carts => {
      // console.log(carts);
      products.countDocuments({_id:carts.Pid},(err,count)=>
      {
        // console.log(count);
        if(count>=1){
        products.findById({_id: carts.Pid})
          .then(product => {
            product.updateOne({ Quantity: product.Quantity + carts.Quantity},{new: true})
              .then(() => {
                cart.findByIdAndRemove( {_id: req.params.id},
                  function(err, data) {
                    if (err) throw err;
                    else 
                    res.redirect("/view-product");
                  }
                );
              });
          });
        } 
      });
    });
});


app.get("/view-product", (req, res) => {
  products.find()
  .then((product) => {
    cart.find({Email: req.cookies.email})
      .then((cart) => {
          user.find({Email:req.cookies.email})
          .then((users)=>{
            console.log(users[0].Name)
            var user=users[0].Name
            res.render("view-product", {product, cart,user});
          })
          .catch(()=>{
            var user="";
            res.render("view-product",{product,cart,user});
          })
      })
      .catch(() => {
        res.render("view-product", {product,cart,user});
      });
    
  });
});

app.get("/getEdit/:id", (req, res) => {
  products
    .findById({
      _id: req.params.id
    })
    .then(product => {
      res.render("manage-product", {product});
    });
});


function removeData()
{
    setInterval( function(){
      
    },3000); 
}



app.post("/addToCart", (req, res) => {
  if (req.cookies.email) 
  {
    user.findOne({Email:req.cookies.email})
    .then(users=>{

    if(users && req.cookies.email==users.Email){
    console.log("Aagay")
    products.findById({_id: req.body.id})
      .then(product => {
        cart.countDocuments({Pid:req.body.id},(err,count)=>{
          if(count>=1)
          {
              cart.findOne({Pid:req.body.id})
              .then((Carts)=>{
                if(req.body.qty>0)
                {
              cart.update({Pid:req.body.id},{ $set:{Quantity: +Carts.Quantity + +req.body.qty, TotalCost: +Carts.TotalCost + +(+req.body.qty* +Carts.Price)} },{new:true} )
              .then(()=>{
                cart.find({Pid:req.body.id})
                .then(()=>{
                  if(req.body.qty>0 && product.Quantity>0 && req.body.qty>0 && req.body.qty<=product.Quantity){
                    product.updateOne({Quantity: product.Quantity - req.body.qty} ,{ new: true })
                    .then(() => {
                      res.redirect("/view-product");
                    });
                  }
                })
                
              })
              }
              else{
                res.send({error: 'qtyError'})
             }
            })
          }

          else{

            if(product.Quantity>0 && req.body.qty>0 && req.body.qty<=product.Quantity)
            { 
                var cartProduct = new cart({
                  Pid: req.body.id,
                  Name: product.Name,
                  Desc: product.Desc,
                  Price: product.Price,
                  Quantity: req.body.qty,
                  Email: req.cookies.email,
                  TotalCost:req.body.qty*product.Price
                });
                cartProduct.save()
                  .then(() => {
                    product.updateOne({Quantity: product.Quantity - req.body.qty} ,{ new: true })
                      .then(() => {
                        res.redirect("/view-product");
                      });
                  })
                  .catch(error => {
                    console.log(error);
                  });
            }
            else{
               res.send({error: 'qtyError'})
            }
          }
        })

    })
  }
  else{
    res.send({error:'toLogin'})
  }
  })
  }
  else{
  console.log("asd")
  res.send({error:'toLogin'})
  }
})

app.get("/login/:id", (req, res) => {
  console.log(req.params );
  res.render('login',{data:req.params.id});
});

app.post("/updateProduct/:pid",(req,res)=>{
  
    products.findByIdAndUpdate({_id:req.params.pid},req.body,{new:true})
    .then(()=>{
      res.redirect("/");
     })
  
  // else{
  //   products.findById({_id:req.body.pid})
  //   .then(()=>{
  //     res.redirect("/sdafsgfdhjytyredcvg")
  //   })
  // } 
});




app.post("/checkUser/:id", (req, res) => {
  if(!req.body.email || !req.body.pwd)
  {
    res.send({error:"empty"});
  }
  else if(req.params.id==='0')
  {
    var email = req.body.email;
    var password = req.body.pwd;

    user.findOne({Email: email})
      .then(loginuser => {
        if (loginuser.Password == password) {
          res.cookie("email", email,{maxAge:3600000, httpOnly:true});
          res.send({success:"success"});
        } 
        else {
          res.send({error:"wrong"});
        }
      })
      .catch(()=>{
        res.send({error:"wrong"});
      })
  }
  else if(req.params.id==='1'){
    var email = req.body.email;
    var password = req.body.pwd;

    admin.findOne({Email: email})
      .then(loginuser => {
        if(loginuser){
        if (loginuser.Password == password) {
          res.cookie("email", email,{maxAge:3600000, httpOnly:true});
          res.send({success:"success"});
        } else {
          res.send({error:"wrong"});
        }
      }
      else{
        res.send({error:"wrong"});
      }
      })
    
      .catch(()=>{
        res.send({error:"wrong"});
      })
  }
  else{
    res.redirect("/login/0");
  }
});


app.get("/register", (req, res) => {
  res.render('register')
});


app.post("/registerUser", (req, res) => {

  if(!req.body.name || !req.body.email || !req.body.pwd1 || !req.body.pwd2 || !req.body.phone)
  {
    res.send({error:"empty"});
  }


  else if(req.body.pwd1==req.body.pwd2)
  {

    console.log(req.body.email);
    user.findOne({Email:req.body.email})
    .then((usr)=>{
      if(!usr)
      {
        admin.findOne({Email:req.body.email})
        .then((admins)=>{
          if(!admins)
          {
            var users = new user({
              Name: req.body.name,
              Email: req.body.email,
              Password: req.body.pwd1,
              Phone: req.body.phone
            });
            users.save()
            .then(() => {
              res.send({success:"added"});
            });
          }
          else{
            res.send({error:"admin"});
          }
        })

      }

      else{
        res.send({error:"already"});
      }

    })

  }
  else if(req.body.pwd1!=req.body.pwd2){
    res.send({error:"mismatch"});
  }
})


app.get('/logOut',(req,res)=>{
   res.clearCookie("email");
   res.redirect('/view-product');
});

app.get('/logOutAdmin',(req,res)=>{
  res.clearCookie("email");
  res.redirect("/");
})


app.get('/checkOut',(req,res)=>{
  cart.find({Email:req.cookies.email})
  .then((c)=>{
    var sum=0;
    for(var i=0;i<c.length;i++)
    {
      sum+=c[i].TotalCost;
    }
    res.render('cart',{c,sum});
  })
})


app.post('/pay',(req,res)=>{
  user.findOne({Email:req.cookies.email})
  .then((d)=>{
    cart.find({Email:req.cookies.email})
    .then((c)=>{
        for(var i=0;i<c.length;i++)
        {
          checkoutUser = new checkout({
            Name:c[i].Name,
            Desc:c[i].Desc,
            Price:c[i].Price,
            CartId: c[i]._id,
            PId:c[i].Pid,
            Quantity:c[i].Quantity,
            Email:c[i].Email,
            userName:d.Name,
            TotalCost:c[i].TotalCost,
            Date:Date.now()
          })
          checkoutUser.save()
        .then((product)=>{
          cart.findByIdAndRemove(product.CartId)
          .then(()=>{
            res.send({error:'Done'})    
          })
          .catch((error)=>{
            // console.log(error)
          })
        })
        .catch((error)=>{
          // console.log(error)
        })
      }
    })
  })
})



app.get('/order-panel',(req,res)=>{
  checkout.find()
  .then((order)=>{
      res.render('order-panel',{order});
    })
  })

app.get('/checkadmin', function(req, res)
{
  if(req.cookies.email)
  {
      admin.findOne({Email:req.cookies.email})
      .then((admins)=>{
        if(admins)
        res.send({code:200,uname:admins.Name})
        else
        res.send({error:"toLogin"});
      })
  }
  else{
    res.send({error:"toLogin"});
  }
  console.log(req.cookies.email);
})

app.get('/checkEdit',function(req,res){
  if(req.cookies.email)
  {
    res.send({code:200});
  }
  else{
    res.send({error:"toLogin"});
  }
})


app.listen(7000, () => {
  console.log("Connected");
});
