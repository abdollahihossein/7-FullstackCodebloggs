const express = require("express");
// const requireAuth = require('../middleware/requireAuth')

const recordRoutes = express.Router();
const dbo = require("../db/conn");
const ObjectId = require("mongodb").ObjectId;

// recordRoutes.use(requireAuth)

// This section will help you get a single user by email: Main Page - Home Page
recordRoutes.route("/user/:email").get(function (req, res) {
  let db_connect = dbo.getDb("Codebloggs");

  let myquery = { email: req.params.email };
  
  db_connect
      .collection("Users")
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
      });
});

// This section will help you create a new Post: Main Page
recordRoutes.route("/post").post(function (req, response) {
  let db_connect = dbo.getDb("Codebloggs");

  let myDate = new Date().toLocaleString("en-GB", { hour12: false }, {timeZone: "Canada/Montreal"})
  let myobj = {
    content: req.body.content,
    user_id: req.body.user_id,
    likes: 0,
    time_stamp: myDate,
    Comments: []
  }

  db_connect.collection("Posts").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(myobj);
  })
});

// This section will give you user information: Number of total posts - Date of last post: Home Page - Network Page
recordRoutes.route("/userinfo/:id").get(function (req, res) {
  let db_connect = dbo.getDb("Codebloggs");

  let myquery = { user_id: req.params.id };

  db_connect
    .collection("Posts")
    .find(myquery)
    .sort({time_stamp: -1})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json({
        number_of_total_posts: result.length,
        date_of_last_post: result[0].time_stamp
      });
    });
});

// This section will help you get a list of all posts by user id: Home Page - Network Page
recordRoutes.route("/all-post/:id").get(function (req, res) {
  let db_connect = dbo.getDb("Codebloggs");

  let myquery = { user_id: req.params.id };

  db_connect
    .collection("Posts")
    .find(myquery)
    .sort({time_stamp: -1})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you get a single post by post id: Home Page - Bloggs Page
recordRoutes.route("/post/:id").get(function (req, res) {
  let db_connect = dbo.getDb("Codebloggs");

  let myquery = { _id: ObjectId(req.params.id) };

  db_connect
      .collection("Posts")
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
      });

});

// This section will help you get a list of all posts: Bloggs Page
recordRoutes.route("/all-post").get(function (req, res) {
  let db_connect = dbo.getDb("Codebloggs");

  db_connect
    .collection("Posts")
    .find({})
    .sort({time_stamp: -1})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you get a single user by id: Bloggs Page
recordRoutes.route("/users/:id").get(function (req, res) {
  let db_connect = dbo.getDb("Codebloggs");

  let myquery = { _id: ObjectId(req.params.id) };

  db_connect
      .collection("Users")
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
      });
});

// This section will help you get a list of all users: Network Page
recordRoutes.route("/users").get(function (req, res) {
  let db_connect = dbo.getDb("Codebloggs");

  db_connect
    .collection("Users")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you delete a user by ID
recordRoutes.route("/delete-user/:id").delete((req, res) => {
  let db_connect = dbo.getDb("Codebloggs");

  let myquery = { _id: ObjectId(req.params.id) };

  db_connect.collection("Users").deleteOne(myquery, function (err, result) {
    if (err) throw err;
    res.send("A user deleted successfully!");
  });
});

// This section will help you update a user by ID
recordRoutes.route("/update-user/:id").put(function (req, response) {
  let db_connect = dbo.getDb("Codebloggs");

  let myquery = { _id: ObjectId( req.params.id )};
  let newvalues = {
    $set: {
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      birthday: req.body.dateOfBirth.slice(0,10),
      email: req.body.email,
      status: req.body.status,
      location: req.body.location,
      occupation: req.body.occupation,
      auth_level: req.body.auth_level
    },
  };

  db_connect
    .collection("Users")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 user updated");
      response.json(res);
    });
});

// This section will help you delete all the posts of a user
recordRoutes.route("/delete-allposts/:id").delete((req, res) => {
  let db_connect = dbo.getDb("Codebloggs");

  let myquery = { user_id: req.params.id };

  db_connect.collection("Posts").deleteMany(myquery, function (err, result) {
    if (err) throw err;
    res.send("All the posts of this user was deleted!");
  });
});

// This section will help you delete a post by ID
recordRoutes.route("/delete-post/:id").delete((req, res) => {
  let db_connect = dbo.getDb("Codebloggs");

  let myquery = { _id: ObjectId(req.params.id) };

  db_connect.collection("Posts").deleteOne(myquery, function (err, result) {
    if (err) throw err;
    res.send("A post deleted successfully!");
  });
});

module.exports = recordRoutes;