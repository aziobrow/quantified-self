import * as Style from '../main.css'
import * as Foods from './foods.js'

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
    renderMeals(meal)
  })
}

const renderMeals= (meal) => {
  var tableName = meal.name
  meal.foods.forEach((food) => {
    $(`#${tableName} tr:first`).after(`<tr data-food=${food.id}>
      <td contenteditable="true" class='name'>${food.name}</td>
      <td contenteditable="true" class='calories'>${food.calories}</td>
      <td class='delete-icon'><img src='assets/delete.png' alt='delete'>
    </tr>`)
  })
  calculateCalories(tableName)
}

const calculateCalories = (tableName)  =>  {
  var mealTable = document.getElementById(tableName)
  var calories = mealTable.getElementsByClassName("calories")
  var sum = 0

  for (var i = 0; i < calories.length; i++) {
    var value = calories[i].innerHTML
    if(!isNaN(value) && value.length != 0) {
        sum += parseFloat(value)
    }
  }
  mealTable.getElementsByClassName('total-calories')[0].innerHTML = sum
}

$(document).ready(() => {
  getMeals()
})
