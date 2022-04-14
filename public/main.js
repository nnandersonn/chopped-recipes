


console.log('js connected')


const  getRecipeButton = document.getElementById('get-recipes')
const backExitButton = document.getElementById('back-exit-button')
const flipCardInner = document.querySelector('.flip-card-inner')
const frontRecipeListSection = document.getElementById('front-recipe-list-section')
const addRecipeButton = document.getElementById('add-recipe-button')

const ingredientSection = document.getElementById('back-ingredients')
const mainCardTitle = document.getElementById('back-title')
const instructionSection = document.getElementById('back-instructions')
const editButtonSection = document.getElementById('edit-recipe-section')
const submitRecipeSection = document.getElementById('submit-recipe-section')
const deleteButtonSection = document.getElementById('delete-recipe-section')

// let allRecipes = null



const deleteRecipe = (recipe_id) =>{
    console.log('my recipe id is', recipe_id)
    axios.delete(`api/recipe/${recipe_id}`)
        .then(()=>{
            console.log('recipe deleted!')
            flipCard()
            fetchRecipes()
        })
        .catch(err=> console.log(err))
    
}

const editRecipe = (recipe_id, recipe_title, ingredients, instructions ) => {
    flipCard360()
    editButtonSection.innerHTML = ''
    deleteButtonSection.innerHTML = ''
    submitRecipeSection.innerHTML = '<button id="make-changes-button">Make Changes</button>'
    const makeChangesButton = document.getElementById('make-changes-button')


    mainCardTitle.innerHTML = `<input type="text" id="edited-title" value="${recipe_title}">`
    ingredientSection.innerHTML =`<textarea id="edited-ingredients">${ingredients}</textarea>`
    instructionSection.innerHTML =`<textarea id="edited-instructions">${instructions}</textarea>`


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
    console.log(recipe_title, ingredients, instructions)
    console.log('This is my recipe', recipe)
    editButtonSection.innerHTML = `<button onclick="editRecipe('${recipe_id}', '${recipe_title}', '${ingredients}', '${instructions}')">Edit Recipe</button>`
    deleteButtonSection.innerHTML = `<button onclick="deleteRecipe('${recipe_id}')">Delete Recipe</button>`
    ingredients = ingredients.split(',').join(`<br>`)
    instructions = instructions.split(',').join(`<br>`)
    
    mainCardTitle.innerHTML = `<p>${recipe_title}</p>`
    ingredientSection.innerHTML = `<p>${ingredients}</p>`
    instructionSection.innerHTML = `<p>${instructions}</p>`
    
}

const createTitleButton = (arr) => {
    // allRecipes = arr
    console.log('running create title button', arr)
    for(let i = 0; i < arr.length; i++){
        const recipeTitleButton = document.createElement('button')
        recipeTitleButton.textContent = `${arr[i].recipe_title}`
        recipeTitleButton.addEventListener('click', () => displayRecipe(arr[i]))
        frontRecipeListSection.appendChild(recipeTitleButton)
    }
    

}

const displayInputField = () => {
    mainCardTitle.innerHTML = '<input type="text" placeholder="Enter title here" id="title-input">'
    ingredientSection.innerHTML ='<textarea placeholder="Enter Ingredients here" id="ingredient-textarea"></textarea>'
    instructionSection.innerHTML ='<input type="text" placeholder="enter instructions here" id="instruction-input"> '
    flipCard()
    submitRecipeSection.innerHTML = '<button id="submit-recipe-button">Submit Recipe</button>'

    const submitRecipeButton = document.getElementById('submit-recipe-button')

    submitRecipeButton.addEventListener('click', ()=> {
        const inputTitle = document.getElementById('title-input').value
        const inputIngredients = document.getElementById('ingredient-input').value
        const inputInstructions = document.getElementById('instruction-input').value
        console.log(inputTitle, inputIngredients, inputInstructions)
        const newRecipe = {title: inputTitle, ingredients: inputIngredients, instructions: inputInstructions}

        axios.post('/api/addrecipe', newRecipe)
            .then(()=> {
                console.log('axios .then ran in main.js')
                fetchRecipes()
                flipCard()
            })
            .catch(err => console.log(err))
            
    })

}

const submitChanges = (id, title, ingredients, instructions)=>{
    console.log('id, title, ingredients, instructions', id, title, ingredients, instructions)
    
    axios.put(`/api/recipe/${id}`, {title, ingredients, instructions})
        .then(()=> {
            flipCard()
            fetchRecipes()
        })
        .catch(err=>console.log(err))

}


const fetchRecipes = ()=>{
    console.log('fetching all recipes')
    

    axios.get('/api/getrecipes')
        .then(res => {
            frontRecipeListSection.innerHTML = ''
            createTitleButton(res.data)
        })
        .catch(err => {
            console.log(err)
        })

}


getRecipeButton.addEventListener('click', fetchRecipes)
backExitButton.addEventListener('click', flipCard)
addRecipeButton.addEventListener('click', displayInputField)


function flipCard(){
    flipCardInner.classList.toggle("flip")
    editButtonSection.innerHTML = ``
    deleteButtonSection.innerHTML = ``
    submitRecipeSection.innerHTML = ``
    flipCardInner.classList.remove("flip360")
}
function flipCard360(){
    flipCardInner.classList.toggle("flip360")
    // flipCardInner.classList.toggle("flip")
}
