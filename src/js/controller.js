import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView..js';

import 'core-js/stable'; //npm i core-js (polyfilling)
import 'regenerator-runtime/runtime'; //npm i regenerator-runtime (polyfilling)
import { async } from 'regenerator-runtime';
import { ResultsView } from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import { MODAL_CLOSE_SEC } from './config.js';

const controlRecipe = async function () {
  try {
    //getting the id shown on the hash part of link
    const id = window.location.hash.slice(1); //slice removes the '#'
    //guard clause for welcome page, otherwise it give error due to there is no id selected
    if (!id) return;
    //spinner before loading completed
    recipeView.renderSpinner();
    //Update results viewto mark selectedsearch result
    resultsView.update(model.getSearchResultsPage());
    //get data and set it to the object
    await model.loadRecipe(id);

    //render recipe
    recipeView.render(model.state.recipe);

    //Render bookmarks
    bookmarksView.update(model.state.bookmark);
  } catch (err) {
    recipeView.renderError();
  }
};
const controlSearchResults = async function () {
  try {
    // 1) Get query
    const query = searchView.getQuery();
    if (!query) return;
    //Spinner
    resultsView.renderSpinner();
    // 2) Load search results
    await model.loadSearchResults(query);

    // 3) Render results
    resultsView.render(model.getSearchResultsPage());

    //4) Render pagination
    paginationView.render(model.state.search);
  } catch (err) {
    resultsView.renderError();
  }
};

const controlPagination = function (goToPage) {
  // 1) Render results
  resultsView.render(model.getSearchResultsPage(goToPage));

  // 2) Render pagination
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  //Update Recipe Servings (in state)
  model.updateServing(newServings);
  //Update the Recipe View
  //recipeView.render(model.state.recipe) => which is re-loading all page
  recipeView.update(model.state.recipe);
};
const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) {
    //add bookmarked recipe to state
    model.addBookmark(model.state.recipe);
  } else model.removeBookmark(model.state.recipe.id);

  //Change view of bookmark button
  recipeView.update(model.state.recipe);

  //Render bookmarks
  bookmarksView.render(model.state.bookmark);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmark);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    //Show loading spinner
    addRecipeView.renderSpinner();

    //Upload new Recipe
    await model.uploadRecipe(newRecipe);

    //Render recipe
    recipeView.render(model.state.recipe);

    //Render succes message
    addRecipeView.renderMessage();

    //Render bookmark
    bookmarksView.render(model.state.bookmark);

    //Change ID in URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //Close form window
    setTimeout(() => {
      addRecipeView.toggleWindow;
    }, MODAL_CLOSE_SEC * 10);
  } catch (err) {
    addRecipeView.renderError(err.message);
  }
};
const init = function () {
  recipeView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};

init();
