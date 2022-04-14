const express = require('express')
const cors = require('cors')
const app = express()
const path = require('path')
const exp = require('constants')
const {PORT} = process.env
const {fetchAllRecipes, insertNewRecipe, deleteRecipe, updateRecipe} = require('./controller.js')
app.use(express.json())
app.use(express.static('public'))
app.use(cors())

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
})

const port = process.env.PORT || 3000

app.listen(port, ()=> {
    console.log(`Listening on port ${port}`)
})

app.get('/api/getrecipes', fetchAllRecipes)

app.post('/api/addrecipe', insertNewRecipe)

app.delete('/api/recipe/:id', deleteRecipe)

app.put('/api/recipe/:id', updateRecipe)