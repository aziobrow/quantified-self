# Quantified Self

Quantified Self is a calorie-tracking application, composed of a decoupled front-end and back-end. The front-end is built in JavaScript, JQuery, HTML, and CSS, and is hosted on Github Pages.  The application stores foods, which can be associated with meals to track calorie counts for each food, meal, and total.

The front-end production can be viewed [here](https://aziobrow.github.io/quantified-self/)

The backend can be found [here](https://github.com/dionew1/express-qs), and more details can be found in that project's ReadMe.

This was a 2.5 week partner project, and the original repository and project specifications can be found [here](http://backend.turing.io/module4/projects/quantified-self/quantified-self).

**Setup**

1) Clone the repository

`git clone https://github.com/aziobrow/quantified-self.git`

2) Change into the quantified-self directory

`cd quantified-self`

3) Install the dependencies

`npm install`

4) Spin Up the Server

`npm start`

Optionally, you can also include
`npm install webpack-dev-server --save-dev`, which will allow you to run the command `webpack-dev-server` that automatically reloads your files as they change, so that you don't have to manually rebuild every time you want to see your changes.

Once the server is running, check your localhost port to see where to visit in order to interact with the user interface in the browser.

**API**

All endpoints are RESTful and all responses are in JSON format. Some important things to note:

The base url for API endpoints are: https://enigmatic-ravine-22013.herokuapp.com
Requests are case sensitive
Params for POST and PUT requests should be passed as x-www-form-urlencoded

The following endpoints are available. All endpoints will return the data as JSON.

## Food Endpoints:

GET /api/v1/foods - returns all foods currently in the database

GET /api/v1/foods/:id - returns the food object with the specific :id you've passed in or 404 if the food is not found

POST /api/v1/foods - allows creating a new food with the parameters:
{ food: { name: "Name of food here", calories: "Calories here"} }
If food is successfully created, the food item will be returned. If the food is not successfully created, a 400 status code will be returned. Both name and calories are required fields.

PATCH /api/v1/foods/:id - allows one to update an existing food with the parameters:
{ food: { name: "Name of food here", calories: "Calories here"} }
If food is successfully updated (name and calories are required fields), the food item will be returned. If the food is not successfully updated, a 400 status code will be returned.

DELETE /api/v1/foods/:id - will delete the food with the id passed in. If the food can't be found, a 404 will be returned.


## Meal Endpoints:

GET /api/v1/meals - returns all the meals in the database along with their associated foods

GET /api/v1/meals/:meal_id/foods - returns all the foods associated with the meal with an id specified by :meal_id or a 404 if the meal is not found

POST /api/v1/meals/:meal_id/foods/:id - adds the food with :id to the meal with :meal_id
This creates a new record in the MealFoods table to establish the relationship between this food and meal. If the meal/food cannot be found, a 404 will be returned.

DELETE /api/v1/meals/:meal_id/foods/:id

## Contributing

This project welcomes contributions from the community. Contributions are
accepted using GitHub pull requests; for more information, see
[GitHub documentation - Creating a pull request](https://help.github.com/articles/creating-a-pull-request/).

For a good pull request, we ask you provide the following:

1. Include a clear description of your pull request in the description
   with the basic "what" and "why"s for the request.
2. The tests should pass as best as you can. GitHub will automatically run
   the tests as well, to act as a safety net.
3. The pull request should include tests for the change. A new feature should
   have tests for the new feature and bug fixes should include a test that fails
   without the corresponding code change and passes after they are applied.
   The command `npm run test-cov` will generate a `coverage/` folder that
   contains HTML pages of the code coverage, to better understand if everything
   you're adding is being tested.
4. If the pull request is a new feature, please include appropriate documentation
   in the `README.md` file as well.
5. To help ensure that your code is similar in style to the existing code,
   run the command `npm run lint` and fix any displayed issues.

## Contributors

Dione Wilson
Aurora Ziobrowski
