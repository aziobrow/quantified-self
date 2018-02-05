import * as Style from '../main.css'
import * as Foods from './foods.js'

const foodFile = require('./foods.js')
const helperFile = require('./helper.js')

const getMeals = () => {
  fetch(`${helperFile.url}api/v1/meals`)
  .then((response) => helperFile.handleResponse(response))
  .then((meals) => getEachMeal(meals))
  .catch((error) => console.error({ error }))
}

const getEachMeal = (mealData) => {
  mealData.forEach((meal) => {
    setUpButton(meal)
    renderMeals(meal)
  })
}

const setUpButton = (meal) => {
  $('#meal-buttons').append(
    `<button class='add-to-meal' data-meal=${meal.id}>${meal.name}</button></br>`)
}


const renderMeals= (meal) => {
  let tableName = meal.name
  meal.foods.forEach((food) => {
    foodFile.renderFood(food, tableName)
  })
  calculateTotalCalories(tableName)
  calculateCalorieSummary()
}

const calculateTotalCalories = (tableName)  =>  {
  let mealTable = document.getElementById(tableName)
  let calories = mealTable.getElementsByClassName("calories")
  let sum = 0

  for (let i = 0; i < calories.length; i++) {
    let value = calories[i].innerHTML
    if(!isNaN(value) && value.length != 0) {
        sum += parseFloat(value)
    }
  }
  let totalCaloriesDisplay = mealTable.getElementsByClassName('total-calories')[0]
  totalCaloriesDisplay.innerHTML = sum
  calculateRemainingCalories(mealTable, totalCaloriesDisplay.innerHTML)
}

const calculateRemainingCalories = (table, totalCalories) => {
  let startingCalories;

  switch (table.id) {
    case 'Snack':
      startingCalories = 200
      break;
    case 'Breakfast':
      startingCalories = 400
      break;
    case 'Lunch':
      startingCalories = 600
      break;
    case 'Dinner':
      startingCalories = 800
  }
  let remainingCaloriesDisplay = table.getElementsByClassName('remaining-calories')[0]
  remainingCaloriesDisplay.innerHTML = startingCalories - totalCalories
  styleRemainingCalories(remainingCaloriesDisplay)
}

const styleRemainingCalories = (remainingCalories) =>  {
  if (remainingCalories.innerHTML >= 0) {
    remainingCalories.parentElement.style.backgroundColor = "palegreen"
  } else {
    remainingCalories.parentElement.style.backgroundColor = "tomato"
  }
}

const calculateCalorieSummary = () => {
  let totalSum = 0
  $('.total-calories').each(function(calorieCount)  {
    let value = $(this).context.innerHTML
    let convertToNumber = parseInt(value)
    totalSum += convertToNumber
  })

  let goalCalories = $('#goal-calories-total').text()
  let remainingCalories = $('#remaining-calories-total')
  $('#total-calories-total').text(totalSum)
  remainingCalories.text(goalCalories - totalSum)
  styleRemainingCalories(remainingCalories[0])
}

$("#redirect-to-foods").on( "click", function() {
  window.location.href = "http://localhost:8080/webpack-dev-server/foods.html"
})

$("#meal-buttons").on("click", function(event) {
  event.preventDefault()
  let mealId = event.target.dataset.meal
  let checkedFoods = $("#available-food-table input:checkbox:checked")
  let checkedFoodIds = []
  for (let i = 0; i < checkedFoods.length; i++) {
    checkedFoodIds.push(checkedFoods[i].closest('tr').dataset.food)
  }
  checkedFoodIds.forEach(foodId => {
    fetch(`${helperFile.url}api/v1/meals/${mealId}/foods/${foodId}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      }
    })
    .catch((error) => console.error({error}))
  })
  fetch(`${helperFile.url}api/v1/meals/${mealId}/foods`)
  .then(response => helperFile.handleResponse(response))
  .then(meal => renderMeals(meal))
})


$(document).ready(() => {
  foodFile.getFoods()
  let page = foodFile.getPage()
  if (page != 'foods.html'){
    getMeals()
  }
})
