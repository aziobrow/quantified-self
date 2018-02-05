const helperFile = require('./helper.js')

const getFoods = () =>  {
  fetch(`${helperFile.url}api/v1/foods`)
  .then((response) => helperFile.handleResponse(response))
  .then((foods) => getEachFood(foods))
  .catch((error) => console.error ({ error }))
}

const getEachFood = (foodData) => {
  foodData.forEach((food) => {
    renderFood(food)
  })
}

const getPage = ()  =>  {
  let urlParts = document.URL.split('/')
  let lastSegment = urlParts.pop() || urlParts.pop()
  return lastSegment
}

const renderFood = (food, meal=null) => {
  let page = getPage()
  if(page == "foods.html") {
    $('#food-table tr:first').after(`<tr data-food=${food.id}>
      <td contenteditable="true" class='name'>${food.name}</td>
      <td contenteditable="true" class='calories'>${food.calories}</td>
      <td class='delete-icon'><img src='assets/delete.png' alt='delete'>
    </tr>`)
    $('.delete-icon').on("click", deleteFood)
  } else {
      if (meal != null) {
        let tableName = meal
        $(`#${tableName} tr:first`).after(`<tr data-food=${food.id}>
          <td contenteditable="true" class='name'>${food.name}</td>
          <td contenteditable="true" class='calories'>${food.calories}</td>
          <td class='delete-icon'><img src='assets/delete.png' alt='delete'>
        </tr>`)
      }
      else {
        let tableName = 'available-food-table'
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
  let newName = $("#new-food-name").val(),
      newCalories = $("#new-food-calorie-count").val(),
      body = {food: {name: newName, calories: newCalories}}
  makeRequest('POST', '', body)
  .then((response) => helperFile.handleResponse(response))
  .then((food) => renderFood(food))
  .catch((error) => console.error({error}))
  $("#new-food-form").trigger('reset')
}

$("#new-food-button").on("click", addNewFood)

const deleteFood = (event) => {
  event.preventDefault()
  let row = event.target.closest('tr')
  let id = row.dataset.food
  makeRequest('DELETE', id)
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
  return fetch(`${helperFile.url}api/v1/foods/${id}`, {
    method: `${method}`,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })
}

const editFood = (event) => {
  let row = event.target.closest('tr')
  let id = row.dataset.food
  let nameContent = row.childNodes[1].textContent
  let calorieContent = row.childNodes[3].textContent
  let body = {food: { name: nameContent, calories: calorieContent}}
  makeRequest('PATCH', id, body)
  .then((response) => helperFile.handleResponse(response))
  .catch((error) => console.error({error}))
}

const filterFoods = () => {
  $(".filterable").filter((search) => {
    let input = $('#search-term').val().toLowerCase()
    let rows = $(".filterable").find('tbody > tr')
    for (let i=1; i < rows.length; i++) {
      let td = rows[i].getElementsByTagName("td")[0]
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

export * from './foods.js'
module.exports = {getFoods, renderFood, getPage}
