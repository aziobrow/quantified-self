import * as helperFile from './helper.js'
import * as mealFile from './meals.js'

const getFoodNames = () => {
return $('#food-table').find('tr').map((i, row) => {
    if(i != 0){
      return $(row).find('.name').text().toUpperCase()
    }
  }).toArray()
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

const renderFoodTableContent = (food) =>{
  $('#food-table tr:first').after(`<tr data-food=${food.id}>
    <td contenteditable="true" class='name'>${food.name.toUpperCase()}</td>
    <td contenteditable="true" class='calories'>${food.calories}</td>
    <td class='delete-icon'><img src='assets/delete.png' alt='delete'>
  </tr>`)
}

$('#search-term').on('keyup', filterFoods)

$("#redirect-to-diary").on( "click", function() {
  window.location.href = "https://aziobrow.github.io/quantified-self/"
})

module.exports = { getFoodNames, renderFoodTableContent, makeRequest }
