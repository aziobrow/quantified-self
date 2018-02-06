import * as Style from '../main.css'
import * as Foods from './foods.js'

const foodFile = require('./foods.js')
const helperFile = require('./helper.js')
var dir;
var originalTable;

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
    `<button class='add-to-meal' data-meal=${meal.id}>
      ${meal.name}
    </button></br>`)
    addIdstoTables(meal)
}

const addIdstoTables = (meal) => {
  var mealId = meal.id
  var mealName = meal.name
  var mealTable = document.getElementById(mealName)
  mealTable.dataset.meal = mealId
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
    remainingCalories.parentElement.style.backgroundColor = "#79B473"
  } else {
    remainingCalories.parentElement.style.backgroundColor = "#CD5C5C"
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
  let mealId = event.target.dataset.meal
  event.preventDefault()
  addFoodToMeal(mealId)
  getMealFoods(mealId)
  $('#available-food-table').find('input[type=checkbox]:checked').removeAttr('checked')
})

const getMealFoods = (mealId) => {
  fetch(`${helperFile.url}api/v1/meals/${mealId}/foods`)
  .then(response => helperFile.handleResponse(response))
  .then(meal => renderMeals(meal))
}

const addFoodToMeal = (mealId) => {
  let FoodIds = getCheckedFoods()
  FoodIds.forEach(foodId => {
    fetch(`${helperFile.url}api/v1/meals/${mealId}/foods/${foodId}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
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
  var table, rows, switching, i, first, second, shouldSwitch, switchcount = 0
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
    for (i = 1; i < (rows.length - 3); i++) {
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
  foodFile.getFoods()
  let page = foodFile.getPage()
  if (page != 'foods.html'){
    getMeals()
  }
})
