import * as style from '../main.css'
import * as foodFile from './foods.js'
import * as mealFile from './meals.js'
import * as helperFile from './helper.js'

var dir;
var originalTable;

const getMeals = () => {
  fetch(`${helperFile.url}api/v1/meals`)
  .then((response) => helperFile.handleResponse(response))
  .then((meals) => setUpButtons(meals))
  .catch((error) => console.error({ error }))
}

const fetchMealFoods = () => {
  fetch(`${helperFile.url}api/v1/meals`)
  .then((response) => helperFile.handleResponse(response))
  .then((meals) => getEachMeal(meals))
  .catch((error) => console.error({ error }))
}

const getEachMeal = (mealData) => {
  mealData.forEach((meal) => {
    fetch(`${helperFile.url}api/v1/meals/${meal.id}/foods`)
    .then((response) => helperFile.handleResponse(response))
    .then((mealfoods) => renderMeals(mealfoods))
    .catch((error) => console.error({ error }))
  })
}

const setUpButtons = (meals) => {
  meals.forEach((meal) => {
    $('#meal-buttons').append(
      `<button class='add-to-meal' data-meal=${meal.id}>
        ${meal.name}
      </button></br>`)
      addIdstoTables(meal)
  })
}

const addIdstoTables = (meal) => {
  let mealId = meal.id
  let mealName = meal.name
  let mealTable = document.getElementById(mealName)
  mealTable.dataset.meal = mealId
}

$("#redirect-to-foods").on( "click", function() {
  window.location.href = "https://aziobrow.github.io/quantified-self/foods.html"
})

$("#meal-buttons").on("click", function(event) {
  let mealId = event.target.dataset.meal
  event.preventDefault()
  addFoodToMeal(mealId)
  $('#available-food-table').find('input[type=checkbox]:checked').removeAttr('checked')
})

const addFoodToMeal = (mealId) => {
  let FoodIds = getCheckedFoods()
  let addCount = 0
  FoodIds.forEach(foodId => {
    fetch(`${helperFile.url}api/v1/meals/${mealId}/foods/${foodId}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(() => addCount++)
    .then(() => {
      if(addCount == FoodIds.length){
        getMealFoods(mealId)
      }
    })
    .catch((error) => console.error({error}))
  })
}

const getCheckedFoods = (event) => {
  let checkedFoods = $("#available-food-table input:checkbox:checked"),
      checkedFoodIds = []
  for (let i = 0; i < checkedFoods.length; i++) {
    checkedFoodIds.push(checkedFoods[i].closest('tr').dataset.food)
  }
  return checkedFoodIds
}

$('.calories').on('click', function(event)  {
  sortTable(event)
})

const sortTable = (event) => {
  let table, rows, switching, i, first, second, shouldSwitch, switchcount = 0
  table = event.target.closest('table')
  switching = true

  if (!dir) {
    originalTable = $(`#${table.id}`).clone(true)[0]
  }

  if (!dir || dir == "orig") {
    dir = "asc"
  } else if (dir == 'asc')  {
    dir = "desc"
  } else {
    dir = "orig"
  }

  while (switching) {
    switching = false
    rows = table.getElementsByTagName('tr')
    if (table.id == 'available-food-table') {
      var rowCount = rows.length
    } else {
      var rowCount = rows.length - 3
    }
    for (i = 1; i < rowCount; i++) {
      shouldSwitch = false;
      first = rows[i].getElementsByTagName('td')[1].innerHTML
      second = rows[i+1].getElementsByTagName('td')[1].innerHTML
      if (dir == "asc") {
        if (first > second) {
          shouldSwitch= true
          break
        }
      } else if (dir == "desc") {
        if (first < second) {
          shouldSwitch= true
          break
        }
      } else {
        rows[i].parentNode.parentNode.replaceWith(originalTable)
        var newTable = $(`#${table.id}`).clone(true)[0]
        rows[i].parentNode.parentNode.replaceWith(newTable)
        return false
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true
      switchcount ++
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc"
        switching = true
      }
    }
  }
}

$("th.calories").hover(function() {
    $(this).css("color", "white")
  }, function() {
    $(this).css("color", "black")
  })

$(document).ready(() => {
  getFoods()
  let page = getPage()
  if (page != 'foods.html'){
    getMeals()
    fetchMealFoods()
  }
})

// Dependent upon Food and Meal files

const getPage = ()  =>  {
  let urlParts = document.URL.split('/')
  let lastSegment = urlParts.pop() || urlParts.pop()
  return lastSegment
}

const renderFood = (food, meal=null) => {
  let page = getPage()
  if(page == "foods.html") {
    foodFile.renderFoodTableContent(food)
    $('.delete-icon').on("click", deleteFood)
  } else {
      if (meal != null) {
        mealFile.renderMealTableContent(food, meal)
        $('.delete-from-meal-icon').unbind().on("click", deleteMealFood)
      } else {
        mealFile.renderAvailableFoodTableContent(food)
      }
  }
}

const renderMeals = (meal) => {
  let tableName = meal.name
  if (meal.foods) {
    meal.foods.forEach((food) => {
      renderFood(food, tableName)
    })
  }
  mealFile.calculateTotalCalories(tableName)
  mealFile.calculateCalorieSummary()
}

const getFoods = () =>  {
  $('#food-table tr > td').remove()
  fetch(`${helperFile.url}api/v1/foods`)
  .then((response) => helperFile.handleResponse(response))
  .then((foods) => getEachFood(foods))
  .catch((error) => console.error ({ error }))
}

const getEachFood = (foodData) => {
  foodData.forEach((food) => {
    renderFood(food)
  })
}

const addNewFood = (event) => {
  event.preventDefault()
  let newName = $("#new-food-name"),
      newNameValidation =  newName.next(".validation-message"),
      newNameValue = newName.val().toUpperCase(),
      newCalories = $("#new-food-calorie-count"),
      newCaloriesValidation = newCalories.next(".validation-message"),
      newCaloriesValue = $("#new-food-calorie-count").val(),
      body = {food: {name: newNameValue, calories: newCaloriesValue}},
      isValid = true
  isValid = setValidation(newNameValue, newNameValidation) && isValid
  isValid = setValidation(newCaloriesValue, newCaloriesValidation) && isValid
  if (isValid && !(foodFile.getFoodNames()).includes(newName)){
    foodFile.makeRequest('POST', '', body)
    .then((response) => helperFile.handleResponse(response))
    .then(() => getFoods())
    .catch((error) => console.error({error}))
    $("#new-food-form").trigger('reset')
  }
}

const setValidation = (value, validation, isValid) => {
  if (value == "") {
    validation.show()
    return false
  } else {
    validation.hide()
    return true
  }
}

const deleteFood = (event) => {
  event.preventDefault()
  let row = event.target.closest('tr')
  let id = row.dataset.food
  foodFile.makeRequest('DELETE', id)
  .then(() => getFoods())
  .catch((error) => console.error({error}))
}

const getMealFoods = (mealId) => {
  $(`table[data-meal=${mealId}] .meal-food-info`).remove()
  fetch(`${helperFile.url}api/v1/meals/${mealId}/foods`)
  .then(response => helperFile.handleResponse(response))
  .then(meal => renderMeals(meal))
}

const deleteMealFood = (event) => {
  event.preventDefault()
  let foodId = event.target.closest('tr').dataset.food,
      mealId = event.target.closest('table').dataset.meal
  fetch(`${helperFile.url}api/v1/meals/${mealId}/foods/${foodId}`, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(() => getMealFoods(mealId))
  .catch((error) => console.error({error}))
}

$("#new-food-button").on("click", addNewFood)
