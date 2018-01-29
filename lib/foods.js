const url = 'https://quantified-self-api-ad.herokuapp.com/'

const getFoods = () =>  {
  fetch(`${url}api/v1/foods`)
  .then((response) => handleResponse(response))
  .then((foods) => getEachFood(foods))
  .catch((error) => console.error ({ error }))
}

const handleResponse = (response) =>  {
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

const getEachFood = (foodData) => {
  foodData.forEach((food) => {
    renderFood(food)
  })
}

const renderFood = (food) => {
  $('#food-table tr:first').after(`<tr>
    <td class='name'>${food.name}</td>
    <td class='calories'>${food.calories}</td>
    <td class='delete-icon'><img src='assets/delete.png' alt='delete' data-food=${food.id}>
  </tr>`)

  $('.delete-icon').on("click", deleteFood)
}


const addNewFood = (event) => {
  event.preventDefault()
  var newName = $("#new-food-name").val(),
      newCalories = $("#new-food-calorie-count").val()

  fetch(`${url}api/v1/foods`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      food: {name: newName, calories: newCalories},
      })
    })
  .then((response) => handleResponse(response))
  .then((food) => renderFood(food))
  .catch((error) => console.error({error}))
  $("#new-food-form").trigger('reset')
}

$("#new-food-button").on("click", addNewFood)

const deleteFood = (event) => {
  event.preventDefault()
  var id = event.target.dataset.food
  var row = event.target.closest('tr')
  fetch(`${url}api/v1/foods/${id}`, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then((response) => handleResponse(response))
  $(row).remove()

}

$(document).ready(() => {
  getFoods()
})

export * from './foods.js'
