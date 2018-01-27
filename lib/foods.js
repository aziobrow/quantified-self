const url = 'https://quantified-self-api-ad.herokuapp.com/'

const getFoods = () =>  {
  return fetch(`${url}api/v1/foods`)
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
  return foodData.forEach((food) => {
    renderFood(food)
  })
}

const renderFood = (food) => {
  $('#food-table tr:first').after(`<tr>
    <td class='name'>${food.name}</td>
    <td class='calories'>${food.calories}</td>
    <td class='delete-icon'><img src='assets/delete.png' alt='delete'>
  </tr>`)
}

const addNewFood = () => {
  var newName = $("#new-food-name").val(),
      newCalories = $("#new-food-calorie-count").val()

  return fetch(`${url}api/v1/foods`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      food: {name: newName, calories: newCalories},
      })
    })
  .then((response) => handleResponse(response))
  .catch((error) => console.error({error}))
  getFoods()
}

$("#new-food-button").on("click", addNewFood);

$(document).ready(() => {
  getFoods()
})

export * from './foods.js'
