


console.log('js connected')


const getRecipeButton = document.getElementById('get-recipes')
const backExitButton = document.getElementById('back-exit-button')
const flipCardInner = document.querySelector('.flip-card-inner')
const frontRecipeListSection = document.getElementById('front-recipe-list-section')
const addRecipeButton = document.getElementById('add-recipe-button')
const flipCardFront = document.querySelector('.flip-card-front')
const flipCardBack = document.querySelector('.flip-card-back')

const ingredientSection = document.getElementById('back-ingredients')
const mainCardTitle = document.getElementById('back-title')
const instructionSection = document.getElementById('back-instructions')
const editButtonSection = document.getElementById('edit-recipe-section')
const submitRecipeSection = document.getElementById('submit-recipe-section')
const deleteButtonSection = document.getElementById('delete-recipe-section')
let recipeList = null


const deleteRecipe = (recipe_id) =>{
    axios.delete(`api/recipe/${recipe_id}`)
        .then(()=>{
            flipCard()
            fetchRecipes()
        })
        .catch(err=> console.log(err))
    
}

const editRecipe = (recipe_id) => {
    flipCard360()
    let selectedRecipe = getRecipeInfo(recipe_id)
    editButtonSection.innerHTML = ''
    deleteButtonSection.innerHTML = ''
    submitRecipeSection.innerHTML = '<button id="make-changes-button">Make Changes</button>'
    const makeChangesButton = document.getElementById('make-changes-button')

    mainCardTitle.innerHTML = `<input type="text" id="edited-title" value="${selectedRecipe.recipe_title}" required>`
    ingredientSection.innerHTML =`<textarea id="edited-ingredients">${selectedRecipe.ingredients}</textarea required>`
    instructionSection.innerHTML =`<textarea id="edited-instructions">${selectedRecipe.instructions}</textarea required>`


    makeChangesButton.addEventListener('click', ()=>{
        const editedTitle = document.getElementById('edited-title').value
        const editedIngredients = document.getElementById('edited-ingredients').value
        const editedInstructions = document.getElementById('edited-instructions').value

        submitChanges(recipe_id, editedTitle, editedIngredients, editedInstructions)
    })
}

const displayRecipe = (recipe) =>{
    flipCard()
    let {recipe_id, recipe_title, ingredients, instructions } = recipe
    editButtonSection.innerHTML = `<button onclick="editRecipe('${recipe_id}')">Edit Recipe</button>`
    deleteButtonSection.innerHTML = `<button onclick="deleteRecipe('${recipe_id}')">Delete Recipe</button>`
    
    spacedIngredients = ingredients.replace(/[\n\r]/g, '<br><br>')
    spacedInstructions = instructions.replace(/[\n\r]/g, '<br><br>')
    mainCardTitle.innerHTML = `<p>${recipe_title}</p>`
    ingredientSection.innerHTML = `<p>${spacedIngredients}</p>`
    instructionSection.innerHTML = `<p>${spacedInstructions}</p>`
    
}

const createTitleButton = (arr) => {
    for(let i = 0; i < arr.length; i++){
        const recipeTitleButton = document.createElement('button')
        recipeTitleButton.setAttribute("class", "recipe-title-button")
        recipeTitleButton.textContent = `${arr[i].recipe_title}`
        recipeTitleButton.addEventListener('click', () => displayRecipe(arr[i]))
        frontRecipeListSection.appendChild(recipeTitleButton)
    }
}

const displayInputField = () => {
    mainCardTitle.innerHTML = '<input type="text" placeholder="Enter title here..." id="title-input" required>'
    ingredientSection.innerHTML ='<textarea placeholder="Enter Ingredients here" id="ingredient-textarea" required></textarea>'
    instructionSection.innerHTML ='<textarea placeholder="Enter Instructions here" id="instruction-textarea" required></textarea>'
    flipCard()
    submitRecipeSection.innerHTML = '<button id="submit-recipe-button">Submit Recipe</button>'

    const submitRecipeButton = document.getElementById('submit-recipe-button')

    submitRecipeButton.addEventListener('click', ()=> {
        let inputTitle = document.getElementById('title-input').value
        let inputIngredients = document.getElementById('ingredient-textarea').value
        let inputInstructions = document.getElementById('instruction-textarea').value
        inputTitle = inputTitle.replace(/[']/g, `''`)
        inputIngredients = inputIngredients.replace(/[']/g, `''`)
        inputInstructions = inputInstructions.replace(/[']/g, `''`)
        const newRecipe = {title: inputTitle, ingredients: inputIngredients, instructions: inputInstructions}

        axios.post('/api/addrecipe', newRecipe)
            .then(()=> {
                fetchRecipes()
                flipCard()
            })
            .catch(err => console.log(err))      
    })
}

const submitChanges = (id, title, ingredients, instructions)=>{
    
    axios.put(`/api/recipe/${id}`, {title, ingredients, instructions})
        .then(()=> {
            flipCard()
            fetchRecipes()
        })
        .catch(err=>console.log(err))

}


const fetchRecipes = ()=>{

    axios.get('/api/getrecipes')
        .then(res => {
            frontRecipeListSection.innerHTML = ''
            createTitleButton(res.data)
            recipeList = res.data
            console.log('recipe list is -', recipeList[0].recipe_id)
        })
        .catch(err => {
            console.log(err)
        })
}

function getRecipeInfo(recipeID){
    for(let i = 0; i < recipeList.length; i++){
        if(recipeList[i].recipe_id == recipeID){
            return recipeList[i]
        }
    }
}

window.onload = fetchRecipes()
backExitButton.addEventListener('click', flipCard)
addRecipeButton.addEventListener('click', displayInputField)


function flipCard(){
    flipCardInner.classList.toggle("flip")
    editButtonSection.innerHTML = ``
    deleteButtonSection.innerHTML = ``
    submitRecipeSection.innerHTML = ``
    flipCardInner.classList.remove("flip360")
    console.log(flipCardFront)
    console.log(flipCardBack)
}
function flipCard360(){
    flipCardInner.classList.toggle("flip360")
}
