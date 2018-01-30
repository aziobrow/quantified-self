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
  $('#food-table tr:first').after(`<tr data-food=${food.id}>
    <td contenteditable="true" class='name'>${food.name}</td>
    <td contenteditable="true" class='calories'>${food.calories}</td>
    <td class='delete-icon'><img src='assets/delete.png' alt='delete'>
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
  var row = event.target.closest('tr')
  var id = row.dataset.food
  fetch(`${url}api/v1/foods/${id}`, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then((response) => handleResponse(response))
  .catch((error) => console.error({error}))
  $(row).remove()

}

$("#food-table").keypress((event) => {
  if (event.which == 13) {
    event.preventDefault()
    event.target.blur()
    editFood(event)
  }
})

const editFood = (event) => {
  var row = event.target.closest('tr')
  var id = row.dataset.food
  var nameContent = row.childNodes[1].textContent
  var calorieContent = row.childNodes[3].textContent
  fetch(`${url}api/v1/foods/${id}`, {
    method: 'PATCH',
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
        food: { name: nameContent, calories: calorieContent}
    })
  })
  .then((response) => handleResponse(response))
  .catch((error) => console.error({error}))
}



const filterFoods = () =>  {
  $('#food-table').filter((search) => {
    var input = $('#search-term').val().toLowerCase()
    var rows = $('#food-table > tr')

    for (var i=1; i < rows.length; i++) {
      var td = rows[i].getElementsByTagName("td")[0]
      if (td) {
        if (td.innerHTML.toLowerCase().indexOf(input) > -1) {
          rows[i].style.display = ""
        } else {
          rows[i].style.display = "none"
        }
      }
    }
  })
}

$('#search-term').on('keyup', filterFoods)

$(document).ready(() => {
  getFoods()
})

export * from './foods.js'
