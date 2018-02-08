/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _main = __webpack_require__(1);

	var style = _interopRequireWildcard(_main);

	var _foods = __webpack_require__(5);

	var foodFile = _interopRequireWildcard(_foods);

	var _meals = __webpack_require__(7);

	var mealFile = _interopRequireWildcard(_meals);

	var _helper = __webpack_require__(6);

	var helperFile = _interopRequireWildcard(_helper);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	var dir;
	var originalTable;

	var getMeals = function getMeals() {
	  fetch(helperFile.url + 'api/v1/meals').then(function (response) {
	    return helperFile.handleResponse(response);
	  }).then(function (meals) {
	    return getEachMeal(meals);
	  }).catch(function (error) {
	    return console.error({ error: error });
	  });
	};

	var getEachMeal = function getEachMeal(mealData) {
	  mealData.forEach(function (meal) {
	    setUpButton(meal);
	    renderMeals(meal);
	  });
	};

	var setUpButton = function setUpButton(meal) {
	  $('#meal-buttons').append('<button class=\'add-to-meal\' data-meal=' + meal.id + '>\n      ' + meal.name + '\n    </button></br>');
	  addIdstoTables(meal);
	};

	var addIdstoTables = function addIdstoTables(meal) {
	  var mealId = meal.id;
	  var mealName = meal.name;
	  var mealTable = document.getElementById(mealName);
	  mealTable.dataset.meal = mealId;
	};

	$("#redirect-to-foods").on("click", function () {
	  window.location.href = "https://aziobrow.github.io/quantified-self/foods.html";
	});

	$("#meal-buttons").on("click", function (event) {
	  var mealId = event.target.dataset.meal;
	  event.preventDefault();
	  addFoodToMeal(mealId);
	  $('#available-food-table').find('input[type=checkbox]:checked').removeAttr('checked');
	});

	var addFoodToMeal = function addFoodToMeal(mealId) {
	  var FoodIds = getCheckedFoods();
	  var addCount = 0;
	  FoodIds.forEach(function (foodId) {
	    fetch(helperFile.url + 'api/v1/meals/' + mealId + '/foods/' + foodId, {
	      method: 'POST',
	      headers: {
	        "Content-Type": "application/json"
	      }
	    }).then(function () {
	      return addCount++;
	    }).then(function () {
	      if (addCount == FoodIds.length) {
	        getMealFoods(mealId);
	      }
	    }).catch(function (error) {
	      return console.error({ error: error });
	    });
	  });
	};

	var getCheckedFoods = function getCheckedFoods(event) {
	  var checkedFoods = $("#available-food-table input:checkbox:checked"),
	      checkedFoodIds = [];
	  for (var i = 0; i < checkedFoods.length; i++) {
	    checkedFoodIds.push(checkedFoods[i].closest('tr').dataset.food);
	  }
	  return checkedFoodIds;
	};

	$('.calories').on('click', function (event) {
	  sortTable(event);
	});

	var sortTable = function sortTable(event) {
	  var table = void 0,
	      rows = void 0,
	      switching = void 0,
	      i = void 0,
	      first = void 0,
	      second = void 0,
	      shouldSwitch = void 0,
	      switchcount = 0;
	  table = event.target.closest('table');
	  switching = true;

	  if (!dir) {
	    originalTable = $('#' + table.id).clone(true)[0];
	  }

	  if (!dir || dir == "orig") {
	    dir = "asc";
	  } else if (dir == 'asc') {
	    dir = "desc";
	  } else {
	    dir = "orig";
	  }

	  while (switching) {
	    switching = false;
	    rows = table.getElementsByTagName('tr');
	    if (table.id == 'available-food-table') {
	      var rowCount = rows.length;
	    } else {
	      var rowCount = rows.length - 3;
	    }
	    for (i = 1; i < rowCount; i++) {
	      shouldSwitch = false;
	      first = rows[i].getElementsByTagName('td')[1].innerHTML;
	      second = rows[i + 1].getElementsByTagName('td')[1].innerHTML;
	      if (dir == "asc") {
	        if (first > second) {
	          shouldSwitch = true;
	          break;
	        }
	      } else if (dir == "desc") {
	        if (first < second) {
	          shouldSwitch = true;
	          break;
	        }
	      } else {
	        rows[i].parentNode.parentNode.replaceWith(originalTable);
	        var newTable = $('#' + table.id).clone(true)[0];
	        rows[i].parentNode.parentNode.replaceWith(newTable);
	        return false;
	      }
	    }
	    if (shouldSwitch) {
	      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
	      switching = true;
	      switchcount++;
	    } else {
	      if (switchcount == 0 && dir == "asc") {
	        dir = "desc";
	        switching = true;
	      }
	    }
	  }
	};

	$("th.calories").hover(function () {
	  $(this).css("color", "white");
	}, function () {
	  $(this).css("color", "black");
	});

	$(document).ready(function () {
	  getFoods();
	  var page = getPage();
	  if (page != 'foods.html') {
	    getMeals();
	  }
	});

	// Dependent upon Food and Meal files

	var getPage = function getPage() {
	  var urlParts = document.URL.split('/');
	  var lastSegment = urlParts.pop() || urlParts.pop();
	  return lastSegment;
	};

	var renderFood = function renderFood(food) {
	  var meal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

	  var page = getPage();
	  if (page == "foods.html") {
	    foodFile.renderFoodTableContent(food);
	    $('.delete-icon').on("click", deleteFood);
	  } else {
	    if (meal != null) {
	      mealFile.renderMealTableContent(food, meal);
	      $('.delete-from-meal-icon').unbind().on("click", deleteMealFood);
	    } else {
	      mealFile.renderAvailableFoodTableContent(food);
	    }
	  }
	};

	var renderMeals = function renderMeals(meal) {
	  var tableName = meal.name;
	  meal.foods.forEach(function (food) {
	    renderFood(food, tableName);
	  });
	  mealFile.calculateTotalCalories(tableName);
	  mealFile.calculateCalorieSummary();
	};

	var getFoods = function getFoods() {
	  $('#food-table tr > td').remove();
	  fetch(helperFile.url + 'api/v1/foods').then(function (response) {
	    return helperFile.handleResponse(response);
	  }).then(function (foods) {
	    return getEachFood(foods);
	  }).catch(function (error) {
	    return console.error({ error: error });
	  });
	};

	var getEachFood = function getEachFood(foodData) {
	  foodData.forEach(function (food) {
	    renderFood(food);
	  });
	};

	var addNewFood = function addNewFood(event) {
	  event.preventDefault();
	  var newName = $("#new-food-name"),
	      newNameValidation = newName.next(".validation-message"),
	      newNameValue = newName.val().toUpperCase(),
	      newCalories = $("#new-food-calorie-count"),
	      newCaloriesValidation = newCalories.next(".validation-message"),
	      newCaloriesValue = $("#new-food-calorie-count").val(),
	      body = { food: { name: newNameValue, calories: newCaloriesValue } },
	      isValid = true;
	  isValid = setValidation(newNameValue, newNameValidation) && isValid;
	  isValid = setValidation(newCaloriesValue, newCaloriesValidation) && isValid;
	  if (isValid && !foodFile.getFoodNames().includes(newName)) {
	    foodFile.makeRequest('POST', '', body).then(function (response) {
	      return helperFile.handleResponse(response);
	    }).then(function () {
	      return getFoods();
	    }).catch(function (error) {
	      return console.error({ error: error });
	    });
	    $("#new-food-form").trigger('reset');
	  }
	};

	var setValidation = function setValidation(value, validation, isValid) {
	  if (value == "") {
	    validation.show();
	    return false;
	  } else {
	    validation.hide();
	    return true;
	  }
	};

	var deleteFood = function deleteFood(event) {
	  event.preventDefault();
	  var row = event.target.closest('tr');
	  var id = row.dataset.food;
	  foodFile.makeRequest('DELETE', id).then(function () {
	    return getFoods();
	  }).catch(function (error) {
	    return console.error({ error: error });
	  });
	};

	var getMealFoods = function getMealFoods(mealId) {
	  $('table[data-meal=' + mealId + '] .meal-food-info').remove();
	  fetch(helperFile.url + 'api/v1/meals/' + mealId + '/foods').then(function (response) {
	    return helperFile.handleResponse(response);
	  }).then(function (meal) {
	    return renderMeals(meal);
	  });
	};

	var deleteMealFood = function deleteMealFood(event) {
	  event.preventDefault();
	  var foodId = event.target.closest('tr').dataset.food,
	      mealId = event.target.closest('table').dataset.meal;
	  fetch(helperFile.url + 'api/v1/meals/' + mealId + '/foods/' + foodId, {
	    method: 'DELETE',
	    headers: {
	      "Content-Type": "application/json"
	    }
	  }).then(function () {
	    return getMealFoods(mealId);
	  }).catch(function (error) {
	    return console.error({ error: error });
	  });
	};

	$("#new-food-button").on("click", addNewFood);

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./node_modules/css-loader/index.js!./main.css", function() {
				var newContent = require("!!./node_modules/css-loader/index.js!./main.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "* {\n  font-family: 'Quicksand', sans-serif;\n}\n\nbody {\n  background: #D8DBE2;\n  padding: 15px;\n  display: flex;\n  flex-direction: column;\n}\n\nimg {\n  height: 25px;\n  cursor: pointer;\n}\n\ntable {\n  text-align: center;\n}\n\ntd {\n  width: 170px;\n  padding: 15px;\n  font-size: 80%;\n  border: 1px solid black;\n}\n\nh1  {\n  color: #1B1B1E;\n}\n\nth {\n  padding: 10px;\n  font-size: 16px;\n  color: #0c0c0c;\n  min-width: 120px;\n  background: #828A95;\n  border: 1px solid black;\n\n}\n\ntr {\n  border: 2px solid #0c0c0c;\n  background: #A9BCD0;\n}\n\nbutton  {\n  padding: 3px 5px;\n  text-transform: uppercase;\n  cursor: pointer;\n  border-radius: 3px;\n  transition: all 0.3s;\n}\n\nbutton:hover  {\n  background-color: #58A4B0;\n  color: white;\n}\n\ninput[type=text]  {\n  border-radius: 3px;\n  -webkit-box-shadow:\n    inset 0 0 8px  rgba(0,0,0,0.1),\n          0 0 16px rgba(0,0,0,0.1);\n  padding-left: 5px;\n}\n\n.validation-message {\n  display: none;\n  color: #CD5C5C;\n}\n\n.entire-add-foods-container {\n  display: flex;\n  flex-direction: row;\n  justify-content: center;\n  border: 2px solid black;\n  margin-bottom: 30px;\n  background-color: #373F51;\n}\n\n.new-and-filter-container {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-around;\n  margin-bottom: 10px;\n}\n\n.add-foods-container {\n  display: flex;\n  flex-direction: row;\n  justify-content: space-around;\n}\n\n.manage-foods-container {\n  display: flex;\n  margin: 40px;\n  flex-direction: column;\n}\n\n.add-meal-selections  {\n  display: flex;\n  flex-direction: column;\n  text-align: center;\n  justify-content: center;\n  margin-left: 50px;\n}\n\n.label {\n  display: inline-block;\n  margin: 10px;\n  font-size: 20px;\n  font-weight: 600;\n  color: #58A4B0;\n}\n\n.add-to-meal {\n  margin: 15px;\n}\n.add-foods-container  {\n  vertical-align: middle;\n}\n\n.left-container {\n  float: left;\n  width: 50%;\n  text-align: center;\n}\n\n.right-container {\n  float: right;\n  width: 50%;\n  text-align: center;\n}\n\n.totals-container {\n  text-align: center;\n}\n\n.create-foods-container {\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n}\n\n#Breakfast, #Lunch, #Dinner, #Snack, #calorie-summary  {\n  margin: auto;\n  padding: 30px;\n}\n\n#redirect-to-foods, #diary-search-term  {\n  margin-left: 10px;\n  margin-right: 15px;\n  height: 20px;\n  margin-top: 13px;\n  display: flex;\n}\n\n#diary-search-term  {\n  width: 30%;\n}\n\n#new-food-name, #new-food-calorie-count  {\n  margin-bottom: 10px;\n}\n\n#search-term  {\n  height: 20px;\n  width: 30%;\n  margin-top: 15px;\n}\n\n#new-food-button  {\n  margin-bottom: 15px;\n}\n\n.totals {\n  background: #C0C0C0;\n}\n\n#redirect-to-diary  {\n  margin-bottom: 15px;\n  margin-top: 18px;\n}\n", ""]);

	// exports


/***/ }),
/* 3 */
/***/ (function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _helper = __webpack_require__(6);

	var helperFile = _interopRequireWildcard(_helper);

	var _meals = __webpack_require__(7);

	var mealFile = _interopRequireWildcard(_meals);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	var getFoodNames = function getFoodNames() {
	  return $('#food-table').find('tr').map(function (i, row) {
	    if (i != 0) {
	      return $(row).find('.name').text().toUpperCase();
	    }
	  }).toArray();
	};

	$("#food-table").keypress(function (event) {
	  if (event.which == 13) {
	    event.preventDefault();
	    event.target.blur();
	    editFood(event);
	  }
	});

	var makeRequest = function makeRequest(method, id, body) {
	  return fetch(helperFile.url + 'api/v1/foods/' + id, {
	    method: '' + method,
	    headers: {
	      "Content-Type": "application/json"
	    },
	    body: JSON.stringify(body)
	  });
	};

	var editFood = function editFood(event) {
	  var row = event.target.closest('tr');
	  var id = row.dataset.food;
	  var nameContent = row.childNodes[1].textContent;
	  var calorieContent = row.childNodes[3].textContent;
	  var body = { food: { name: nameContent, calories: calorieContent } };
	  makeRequest('PATCH', id, body).then(function (response) {
	    return helperFile.handleResponse(response);
	  }).catch(function (error) {
	    return console.error({ error: error });
	  });
	};

	var filterFoods = function filterFoods() {
	  $(".filterable").filter(function (search) {
	    var input = $('#search-term').val().toLowerCase();
	    var rows = $(".filterable").find('tbody > tr');
	    for (var i = 1; i < rows.length; i++) {
	      var td = rows[i].getElementsByTagName("td")[0];
	      if (td) {
	        if (td.innerHTML.toLowerCase().indexOf(input) > -1) {
	          rows[i].style.display = "";
	        } else {
	          rows[i].style.display = "none";
	        }
	      }
	    }
	  });
	};

	var renderFoodTableContent = function renderFoodTableContent(food) {
	  $('#food-table tr:first').after('<tr data-food=' + food.id + '>\n    <td contenteditable="true" class=\'name\'>' + food.name.toUpperCase() + '</td>\n    <td contenteditable="true" class=\'calories\'>' + food.calories + '</td>\n    <td class=\'delete-icon\'><img src=\'assets/delete.png\' alt=\'delete\'>\n  </tr>');
	};

	$('#search-term').on('keyup', filterFoods);

	$("#redirect-to-diary").on("click", function () {
	  window.location.href = "https://aziobrow.github.io/quantified-self/";
	});

	module.exports = { getFoodNames: getFoodNames, renderFoodTableContent: renderFoodTableContent, makeRequest: makeRequest };

/***/ }),
/* 6 */
/***/ (function(module, exports) {

	'use strict';

	var url = 'https://enigmatic-ravine-22013.herokuapp.com/';

	var handleResponse = function handleResponse(response) {
	  return response.json().then(function (json) {
	    if (!response.ok) {
	      var error = {
	        status: response.status,
	        statusText: response.statusText
	      };
	      return Promise.reject(error);
	    }
	    return json;
	  });
	};

	module.exports = { handleResponse: handleResponse, url: url };

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _helper = __webpack_require__(6);

	var helperFile = _interopRequireWildcard(_helper);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	var renderMealTableContent = function renderMealTableContent(food, meal) {
	  var tableName = meal;
	  $('#' + tableName + ' tr:first').after('<tr data-food=' + food.id + ' class="meal-food-info">\n    <td class=\'name\'>' + food.name.toUpperCase() + '</td>\n    <td class=\'calories\'>' + food.calories + '</td>\n    <td class=\'delete-from-meal-icon\'><img src=\'assets/delete.png\' alt=\'delete\'>\n  </tr>');
	};

	var renderAvailableFoodTableContent = function renderAvailableFoodTableContent(food) {
	  $('#available-food-table tr:first').after('<tr data-food=' + food.id + '>\n    <td class=\'name\'>' + food.name.toUpperCase() + '</td>\n    <td class=\'calories\'>' + food.calories + '</td>\n    <td class=\'checkbox\'><input type="checkbox"></td>\n  </tr>');
	};

	var calculateTotalCalories = function calculateTotalCalories(tableName) {
	  var mealTable = document.getElementById(tableName);
	  var calories = mealTable.getElementsByClassName("calories");
	  var sum = 0;

	  for (var i = 0; i < calories.length; i++) {
	    var value = calories[i].innerHTML;
	    if (!isNaN(value) && value.length != 0) {
	      sum += parseFloat(value);
	    }
	  }
	  var totalCaloriesDisplay = mealTable.getElementsByClassName('total-calories')[0];
	  totalCaloriesDisplay.innerHTML = sum;
	  calculateRemainingCalories(mealTable, totalCaloriesDisplay.innerHTML);
	};

	var calculateRemainingCalories = function calculateRemainingCalories(table, totalCalories) {
	  var startingCalories = void 0;

	  switch (table.id) {
	    case 'Snack':
	      startingCalories = 200;
	      break;
	    case 'Breakfast':
	      startingCalories = 400;
	      break;
	    case 'Lunch':
	      startingCalories = 600;
	      break;
	    case 'Dinner':
	      startingCalories = 800;
	  }
	  var remainingCaloriesDisplay = table.getElementsByClassName('remaining-calories')[0];
	  remainingCaloriesDisplay.innerHTML = startingCalories - totalCalories;
	  styleRemainingCalories(remainingCaloriesDisplay);
	};

	var styleRemainingCalories = function styleRemainingCalories(remainingCalories) {
	  if (remainingCalories.innerHTML >= 0) {
	    remainingCalories.parentElement.style.backgroundColor = "#79B473";
	  } else {
	    remainingCalories.parentElement.style.backgroundColor = "#CD5C5C";
	  }
	};

	var calculateCalorieSummary = function calculateCalorieSummary() {
	  var totalSum = 0;
	  $('.total-calories').each(function (calorieCount) {
	    var value = $(this).context.innerHTML;
	    var convertToNumber = parseInt(value);
	    totalSum += convertToNumber;
	  });

	  var goalCalories = $('#goal-calories-total').text();
	  var remainingCalories = $('#remaining-calories-total');
	  $('#total-calories-total').text(totalSum);
	  remainingCalories.text(goalCalories - totalSum);
	  styleRemainingCalories(remainingCalories[0]);
	};

	module.exports = { renderMealTableContent: renderMealTableContent, renderAvailableFoodTableContent: renderAvailableFoodTableContent,
	  calculateTotalCalories: calculateTotalCalories, calculateCalorieSummary: calculateCalorieSummary };

/***/ })
/******/ ]);