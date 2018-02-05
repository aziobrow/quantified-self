import * as Style from '../main.css'
import * as Foods from './foods.js'

const foodFile = require('./foods.js')

const url = 'https://quantified-self-api-ad.herokuapp.com/'

const getMeals = () => {
  fetch(`${url}api/v1/meals`)
  .then((response) => handleResponse(response))
  .then((meals) => getEachMeal(meals))
  .catch((error) => console.error({ error }))
}

const handleResponse = (response) => {
  return response.json()
  .then(json => {
    if (!response.ok) {
      const error = {
        status: response.status,
        statusText: response.statusText,
      }
      return Promise.reject(error);
    }
    return json
  })
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
  var tableName = meal.name
  meal.foods.forEach((food) => {
    foodFile.renderFood(food, tableName)
  })
  calculateTotalCalories(tableName)
  calculateCalorieSummary()
}

const calculateTotalCalories = (tableName)  =>  {
  var mealTable = document.getElementById(tableName)
  var calories = mealTable.getElementsByClassName("calories")
  var sum = 0

  for (var i = 0; i < calories.length; i++) {
    var value = calories[i].innerHTML
    if(!isNaN(value) && value.length != 0) {
        sum += parseFloat(value)
    }
  }
  var totalCaloriesDisplay = mealTable.getElementsByClassName('total-calories')[0]
  totalCaloriesDisplay.innerHTML = sum
  calculateRemainingCalories(mealTable, totalCaloriesDisplay.innerHTML)
}

const calculateRemainingCalories = (table, totalCalories) => {
  var startingCalories;

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
  var remainingCaloriesDisplay = table.getElementsByClassName('remaining-calories')[0]
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
  var totalSum = 0
  $('.total-calories').each(function(calorieCount)  {
    let value = $(this).context.innerHTML
    let convertToNumber = parseInt(value)
    totalSum += convertToNumber
  })

  var goalCalories = $('#goal-calories-total').text()
  var remainingCalories = $('#remaining-calories-total')
  $('#total-calories-total').text(totalSum)
  remainingCalories.text(goalCalories - totalSum)
  styleRemainingCalories(remainingCalories[0])
}

$("#redirect-to-foods").on( "click", function() {
  window.location.href = "http://localhost:8080/webpack-dev-server/foods.html"
})

$('#diary-search-term').on('keyup', foodFile.filterFoods)

$("#meal-buttons").on("click", function(event) {
  event.preventDefault()
  var mealId = event.target.dataset.meal
  var checkedFoods = $("#available-food-table input:checkbox:checked")
  var checkedFoodIds = []
  for (var i = 0; i < checkedFoods.length; i++) {
    checkedFoodIds.push(checkedFoods[i].closest('tr').dataset.food)
  }
  checkedFoodIds.forEach(foodId => {
    fetch(`${foodFile.url}api/v1/meals/${mealId}/foods/${foodId}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      }
    })
    .catch((error) => console.error({error}))
  })
  fetch(`${foodFile.url}api/v1/meals/${mealId}/foods`)
  .then(response => foodFile.handleResponse(response))
  .then(meal => renderMeals(meal))
})


$(document).ready(() => {
  foodFile.getFoods()
  // getMeals()
})
