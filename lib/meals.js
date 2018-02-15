import * as helperFile from './helper.js'

const renderMealTableContent = (food, meal) => {
  let tableName = meal
  $(`#${tableName} tr:first`).after(`<tr data-food=${food.id} class="meal-food-info">
    <td class='name'>${food.name.toUpperCase()}</td>
    <td class='calories'>${food.calories}</td>
    <td class='delete-from-meal-icon'><img src='assets/delete.png' alt='delete'>
  </tr>`)
}

const renderAvailableFoodTableContent = (food) => {
  $('#available-food-table tr:first').after(`<tr data-food=${food.id}>
    <td class='name'>${food.name.toUpperCase()}</td>
    <td class='calories'>${food.calories}</td>
    <td class='checkbox'><input type="checkbox"></td>
  </tr>`)
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
    case 'Snacks':
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

module.exports = { renderMealTableContent, renderAvailableFoodTableContent,
                   calculateTotalCalories, calculateCalorieSummary}
