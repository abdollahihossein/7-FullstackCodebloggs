const dbo = require("../db/conn");
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken')
let i = 1

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '1d' })
}

// login a user
const loginUser = async (req, res) => {
  let db_connect = dbo.getDb("Codebloggs");

  let email = req.body.email
  let password = req.body.password

  // validation
  if (!email || !password) {
    res.status(404).json({error: 'All fields must be filled'})
    return
  }

  let count = await db_connect.collection("Users").countDocuments({email})
  if (count == 0) {
    res.status(405).json({error: 'Incorrect email'})
    return
  }

  let user = await db_connect.collection("Users").find({email}).toArray()

  const match = await bcrypt.compare(password, user[0].password)
  if (!match) {
    res.status(406).json({error: 'Incorrect password'})
    return
  }

  // create a token and store in Database
  const token = createToken(user[0]._id)

  let myquery = { user: email };
  db_connect.collection("Sessions").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
  });

  let myDate = new Date().toLocaleString("en-GB", { hour12: false }, {timeZone: "Canada/Montreal"})
  let myobj = {
    createdAt: new Date(),
    session_id: token,
    session_date: myDate,
    user: email
  }
  db_connect.collection("Sessions").insertOne(myobj, function (err, result) {
    if (err) throw err;
  })
  db_connect.collection("Sessions").createIndex({ "createdAt": i }, { expireAfterSeconds: 60 * 60 * 24 })
  i++

  res.cookie("token", token, { maxAge: 1000 * 60 * 60 * 24 })
  res.status(200).json(email)
}

// signup a user
const signupUser = async (req, res) => {
  let db_connect = dbo.getDb("Codebloggs");

  let first_name = req.body.firstName
  let last_name = req.body.lastName
  let birthday = req.body.dateOfBirth.slice(0,10)
  let email = req.body.email
  let password = req.body.password
  let status = "Feeling good today!"
  let location = req.body.location
  let occupation = req.body.occupation
  let auth_level = "basic"
  
  // validation
  if (!first_name || !last_name || !birthday || !email || !password || !location || !occupation) {
    res.status(400).json({error: 'All fields must be filled'})
    return
  }
  if (!validator.isEmail(email)) {
    res.status(401).json({error: 'Email not valid'})
    return
  }
  // if (!validator.isStrongPassword(password)) {
  //   res.status(402).json({error: 'Password not strong enough'})
  //   return
  // }

  let count = await db_connect.collection("Users").countDocuments({email})

  if (count != 0) {
    res.status(403).json({error: 'Email already in use'})
    return
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt) 

  db_connect.collection("Users").insertOne({ first_name, last_name, birthday, email, password: hash, status, location, occupation, auth_level }, function (err, result) {
    if (err) throw err;
    res.status(200).json({message: "A user created successfully!"})
  });
}

module.exports = { signupUser, loginUser }