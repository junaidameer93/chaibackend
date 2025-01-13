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

//test comiit 

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}!`) 
})
