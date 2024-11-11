const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {isLoggedIn} = require("../middleware.js");
const multer = require('multer');
const {storage} =require("../cloudConfig.js");
const upload = multer({storage});
const {employeeSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const employeeController = require("../controller/employee.js");

const validateEmployee =  async(req,res,next) =>{

    let {error} = employeeSchema.validate(req.body);
    if(error){
        console.log(error);
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{
        next();
    }
}


// landing route
router.get("/", isLoggedIn,(req,res) =>{
  
    res.render("employes/index.ejs");
})

// employeeList rout
router.get("/employeeList", isLoggedIn,wrapAsync(employeeController.List));

// new route
router.get("/new",isLoggedIn,employeeController.renderNewForm)

// create new employee
router.post("/",isLoggedIn,validateEmployee, upload.single('employee[image]'),wrapAsync(employeeController.creteNewEmployee));

// edit route
router.get("/employeeList/:id/edit", isLoggedIn, wrapAsync(employeeController.renderEditForm));


// upadate route
router.put("/employeeList/:id",validateEmployee, wrapAsync(employeeController.updateInfo))


// delete route
router.get("/employeeList/:id/delete", isLoggedIn,wrapAsync(employeeController.deleteEmployee));

router.get("/login",(req,res) =>{
    res.render("../views/admin/login");
})

router.post("/admin",
    passport.authenticate("local",
        { failureRedirect: '/employeeHub/login', 
            failureFlash: true}), 
            async(req,res) =>{

            res.redirect("/employeeHub");
})

router.get("/logout",(req,res,next) =>{
    req.logout((err) =>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect("/employeeHub/login");
    })
})

module.exports = router;
