require('dotenv').config()

const {CONNECTION_STRING} = process.env

// const { default: axios } = require("axios")
const exp = require('constants')
const { builtinModules } = require('module')
const Sequelize = require('sequelize')


const sequelize = new Sequelize(CONNECTION_STRING, {
    dialect: 'postgres',
    dialectOptions: {
        ssl:{
            rejectUnauthorized: false
        }
    }
})

module.exports = {
    fetchAllRecipes: (req, res) => {
        console.log('fetch recipes triggered on server')
        sequelize.query(`
        SELECT * FROM recipes ORDER BY recipe_title
        `)
        .then(dbRes => res.status(200).send(dbRes[0]))
        .catch(err => console.log(err))
    },

    insertNewRecipe: (req, res) => {
        const {title, ingredients, instructions} = req.body
        console.log('we are inserting new recipe', title, ingredients, instructions)
        sequelize.query(`
            INSERT INTO recipes (recipe_title, ingredients, instructions)
            Values('${title}', '${ingredients}', '${instructions}')
        `)
        .then( () => res.sendStatus(200))
        .catch(err=>console.log(err))
    },

    deleteRecipe: (req, res) => {
        const recipe_id = req.params
        console.log('recipe id received on back end', recipe_id.id)
        sequelize.query(`
            DELETE FROM recipes
            WHERE recipe_id = ${recipe_id.id}
        `)
        .then(() => res.sendStatus(200))
        .catch(err=>console.log(err))
    },

    updateRecipe: (req, res) => {
        console.log('backend update recipe hit')
        let {id} = req.params
        let {title, ingredients, instructions} = req.body
        sequelize.query(`
            UPDATE recipes
            SET recipe_title = '${title}', ingredients = '${ingredients}', instructions = '${instructions}'
            WHERE recipe_id = '${id}'
        `)
        .then(()=> res.sendStatus(200))
        .catch(err => console.log(err))
    }
}