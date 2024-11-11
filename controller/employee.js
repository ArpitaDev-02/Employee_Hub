const Employee = require("../models/employee.js");


module.exports.List = async(req,res) => {
    const allEmployees = await Employee.find({});
    res.render("employes/employeeList.ejs",{allEmployees});
}

module.exports.renderNewForm = (req,res) => {
    res.render("employes/new.ejs");
}

module.exports.creteNewEmployee = async(req,res,next) => {
    let url = req.file.path;
    let filename = req.file.filename;
   console.log(url);
   console.log(filename);
    // const newEmployee = new Employee(req.body.employee);
    // await newEmployee.save();
    // req.flash("success","New employee created");
    // res.redirect("/employeeHub/employeeList");
    res.send("hello");

}

module.exports.renderEditForm = async(req,res) =>{
    let {id} = req.params;
    const employee = await Employee.findById(id);
    res.render("employes/edit.ejs",{employee});
}

module.exports.updateInfo = async(req,res,next) =>{
    let {id} = req.params;
    await Employee.findByIdAndUpdate(id,{...req.body.employee});
    req.flash("success","Successfully edited");
    res.redirect(`/employeeHub/employeeList`);
}

module.exports.deleteEmployee = async(req,res,next) =>{
    let {id} = req.params;
    let deletedListing = await Employee.findByIdAndDelete(id);
    req.flash("success","successfully deleted");
    res.redirect("/employeeHub/employeeList");
}