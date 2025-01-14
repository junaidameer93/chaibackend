const express = require('express')
require('dotenv').config()
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/about', (req, res) => {
    res.send('About Us')
})

app.get('/login', (req, res) => {
    res.send('<h1>Login here</h1>')
})

app.get('/register', (req, res) => {
    res.send('<h1>Register here</h1>')
})

const user = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  age: 29,
  isActive: true,
  roles: ["user", "admin"],
  address: {
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    zip: "10001"
  }
};

app.get('/user', (req, res) => {
  res.json(user);
})
//test comiit 222

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`) 
})
