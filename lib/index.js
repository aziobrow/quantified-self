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
    addIdstoTables(meal)
}

const addIdstoTables = (meal) => {
  var mealId = meal.id
  var mealName = meal.name
  var mealTable = document.getElementById(mealName)
  mealTable.dataset.meal = mealId
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
  $('#available-food-table').find('input[type=checkbox]:checked').removeAttr('checked')
})

$('.calories').on('click', function(event)  {
  // var values = $(`#${tableId} td.calories`).get()

  var table, rows, switching, i, first, second, shouldSwitch, dir, switchcount = 0
  var table = event.target.closest('table')
  switching = true;
  // Set the sorting direction to ascending:
  dir = "asc";
  /* Make a loop that will continue until
  no switching has been done: */
  while (switching) {
    // Start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName('tr');
    /* Loop through all table rows (except the
    first, which contains table headers): */
    for (i = 1; i < (rows.length - 3); i++) {
      // Start by saying there should be no switching:
      shouldSwitch = false;
      /* Get the two elements you want to compare,
      one from current row and one from the next: */
      // x = rows[i].getElementsByTagName("TD")[n];
      // y = rows[i + 1].getElementsByTagName("TD")[n];
      first = rows[i].getElementsByTagName('td')[1].innerHTML
      second = rows[i+1].getElementsByTagName('td')[1].innerHTML
      /* Check if the two rows should switch place,
      based on the direction, asc or desc: */
      if (dir == "asc") {
        if (first > second) {
          // If so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      } else if (dir == "desc") {
        if (first < second) {
          // If so, mark as a switch and break the loop:
          shouldSwitch= true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      /* If a switch has been marked, make the switch
      and mark that a switch has been done: */
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      // Each time a switch is done, increase this count by 1:
      switchcount ++;
    } else {
      /* If no switching has been done AND the direction is "asc",
      set the direction to "desc" and run the while loop again. */
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
})



$(document).ready(() => {
  foodFile.getFoods()
  getMeals()
})
