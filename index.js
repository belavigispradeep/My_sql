const { faker } = require("@faker-js/faker");
const mysql = require("mysql2");
const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const methodOverride =require("method-override");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "delta_app",
  password: "Pradeep@123456",
});

let getRandomUser = () => {
  return [
    faker.string.uuid(),
    faker.internet.userName(),
    faker.internet.email(),
    faker.internet.password(),
  ];
};

app.get("/", (req, res) => {
  let q = "SELECT count(*) FROM user";
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let count = result[0]["count(*)"];
      res.render("index.ejs", { count });
    });
  } catch (err) {
    console.log(err);
    res.send("Cought some error in data base...");
  }
});
app.get("/user", (req, res) => {
  let q = "SELECT * FROM user";
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let results=result;
      res.render("format.ejs",{results});
    });
  } catch (err) {
    console.log("Cought some error in data base...");
  }
});
app.get("/user/:id/edit",(req,res)=>{
  let {id} = req.params;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user=result[0];
      console.log(user);
      res.render("edit.ejs",{user});
    });
    } catch (err) {
      console.log("Cought some error in data base...");
      }
});
app.patch("/user/:id",(req,res)=>{
  let {id} = req.params;
  let {password:formPassword ,username:newUsername}=req.body;
  let q = `SELECT * FROM user WHERE id = '${id}'`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user=result[0];
      // console.log(formPassword);
      // console.log(user.password);
      if(formPassword != user.password){
        res.send("Password is not correct");
      }
      else{
        let q2 = `UPDATE user SET username = '${newUsername}' WHERE id = '${id}'`;
        try{
          connection.query(q2, (err, result) => {
            if (err) throw err;
            res.redirect("/user");
            });
        }catch(err){
          console.log("Cought some error in data base...");
        }
      }
      });
    }catch(err){
      console.log("Cought some error in data base...");
    }
});



app.listen(port, () => {
  console.log(`app listen to the port ${port}`);
});
