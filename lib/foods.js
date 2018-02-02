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

const getPage = ()  =>  {
  var urlParts = document.URL.split('/')
  var lastSegment = urlParts.pop() || urlParts.pop()
  return lastSegment
}

const renderFood = (food, meal=null) => {
  var page = getPage()
  if(page == "foods.html") {
    $('#food-table tr:first').after(`<tr data-food=${food.id}>
      <td contenteditable="true" class='name'>${food.name}</td>
      <td contenteditable="true" class='calories'>${food.calories}</td>
      <td class='delete-icon'><img src='assets/delete.png' alt='delete'>
    </tr>`)
    $('.delete-icon').on("click", deleteFood)
  } else {
      if (meal != null) {
        var tableName = meal
        $(`#${tableName} tr:first`).after(`<tr data-food=${food.id}>
          <td contenteditable="true" class='name'>${food.name}</td>
          <td contenteditable="true" class='calories'>${food.calories}</td>
          <td class='delete-icon'><img src='assets/delete.png' alt='delete'>
        </tr>`)
      }
      else {
        var tableName = 'available-food-table'
        $(`#${tableName} tr:first`).after(`<tr data-food=${food.id}>
          <td contenteditable="true" class='name'>${food.name}</td>
          <td contenteditable="true" class='calories'>${food.calories}</td>
          <td class='checkbox'><input type="checkbox"></td>
        </tr>`)
      }
  }
}


const addNewFood = (event) => {
  event.preventDefault()
  var newName = $("#new-food-name").val(),
      newCalories = $("#new-food-calorie-count").val(),
      body = {food: {name: newName, calories: newCalories}}
  makeRequest('POST', '', body)
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
  makeRequest('DELETE', id)
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

const makeRequest = (method, id, body) => {
  return fetch(`${url}api/v1/foods/${id}`, {
    method: `${method}`,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })
}

const editFood = (event) => {
  var row = event.target.closest('tr')
  var id = row.dataset.food
  var nameContent = row.childNodes[1].textContent
  var calorieContent = row.childNodes[3].textContent
  var body = {food: { name: nameContent, calories: calorieContent}}
  makeRequest('PATCH', id, body)
  .then((response) => handleResponse(response))
  .catch((error) => console.error({error}))
}



const filterFoods = () =>  {
  var page = getPage()
  console.log(page)
    if (page == "foods.html") {
    $('#food-table').filter((search) => {
      var input = $('#search-term').val().toLowerCase()
      var rows = $('#food-table > tbody > tr')
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
  } else {
    $('#available-food-table').filter((search) => {
      var input = $('#diary-search-term').val().toLowerCase()
      var rows = $('#available-food-table > tbody > tr')
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
}

$('#search-term').on('keyup', filterFoods)

$(document).ready(() => {
  getFoods()
})

export * from './foods.js'
module.exports = {getFoods, filterFoods, renderFood}
