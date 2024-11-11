
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");

const employee = require("./routes/employee.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/EmployeeDetails";

main().then(() => {
    console.log("connected to DB")
}).catch((err) =>{
        console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUnintialized: true,
    cookie: {
        expires:Date.now() + 7 *24 *60 * 60 *1000,
        maxAge: 7 *24 *60 * 60 *1000,
        httpOnly: true,
    },
}

app.get("/", (req,res) =>{
    res.send("Hi anandita");
});

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next) =>{
    res.locals.success = req.flash("success");
    res.locals.currUser = req.user;
    next();
})

// app.get("/demouser", async(req,res) => {
//     let fakeUser = new User({
//         email: "hukumGupta@gmail.com",
//         username: "Hukum Gupta",
//     });

//     let registeredUser = await User.register(fakeUser,"hukumGupta123");
//     res.send(registeredUser);
// });

app.use("/employeeHub",employee);




// landing route
// app.get("/employeeHub", (req,res) =>{
//     res.render("employes/index.ejs");
// })

// employeeList rout
// app.get("/employeeList",wrapAsync(async(req,res) => {
//     const allEmployees = await Employee.find({});
//     res.render("employes/employeeList.ejs",{allEmployees});
// }));

// new route
// app.get("/employeeHub/new", (req,res) => {
//     res.render("employes/new.ejs");
// })

// create new employee
// app.post("/employeeHub",validateEmployee, wrapAsync(async(req,res,next) => {
//         const newEmployee = new Employee(req.body.employee);
//         await newEmployee.save();
//         res.redirect("/employeeList");
   
// }));

// edit route
// app.get("/employeeList/:id/edit", wrapAsync(async(req,res) =>{
//     let {id} = req.params;
//     const employee = await Employee.findById(id);
//     res.render("employes/edit.ejs",{employee});
// }));

// dashboard page
// app.get("/employeeHub/:id/dashboard",wrapAsync(async(req,res) =>{
//     let {id} = req.params;
//     const employee = await Employee.findById(id);
//     res.render("employes/dashboard.ejs",{employee})

// }));

// upadate route
// app.put("/employeeList/:id/dashboard",validateEmployee, wrapAsync(async(req,res,next) =>{
//     let {id} = req.params;
//     await Employee.findByIdAndUpdate(id,{...req.body.employee});
//     res.redirect(`/employeeList`);
// }))


// delete route
// app.get("/employeeList/:id/delete",wrapAsync( async(req,res,next) =>{
//     let {id} = req.params;
//     let deletedListing = await Employee.findByIdAndDelete(id);
//     console.log(deletedListing);
//     res.redirect("/employeeList");
// }));


// app.get("/testEmployee", async(req,res) => {
//     let sampleEmployee = new Employee({
//         name: "Kim-soo-hyun",
//         email: "soo-hun@gmail.com",
//         mobile: 123456789,
//         designation: "Engineer",
//         gender: "Male",
//         course: "B Tech",
//     });
//     await sampleEmployee.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// })

app.all("*", (req,res,next) =>{
    next(new ExpressError(404,"page not found"));
});

app.use((err,req,res,next) =>{
    let {statusCode = 500, message = "something went wrong"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", {message});
});

app.listen(2002, () =>{
    console.log("Welcome to emoployee web page");
});
