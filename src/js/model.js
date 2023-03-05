import { async } from 'regenerator-runtime';
import { API_URL, SEARCH_API_URL, RESULT_PER_PAGE, API_KEY } from './config.js';
import { getJSON, sendJSON } from './helpers.js';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1, // as a default it will render first page
  },
  bookmark: [],
  recipes: [],
};
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    cookingTime: recipe.cooking_time,
    imageUrl: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && { key: recipe.key }), //If it has Key it will be stored
  };
};
export const loadRecipe = async function (id) {
  try {
    //Below method from helpers
    const data = await getJSON(`${API_URL}${id}?key=${API_KEY}`);

    state.recipe = createRecipeObject(data);
    state.search.page = 1;
    //While loading recipe, checking whether bookmarked or not
    //it remains recipe as bookmarked as reclicking for recipe details
    if (state.bookmark.some(b => b.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (err) {
    throw err;
  }
};

export const loadSearchResults = async function (query) {
  try {
    const data = await getJSON(`${SEARCH_API_URL}${query}&key=${API_KEY}`);
    state.search.query = query;
    state.search.results = data.data.recipes.map(rec => {
      return {
        id: rec.id,
        imageUrl: rec.image_url,
        publisher: rec.publisher,
        title: rec.title,
        ...(rec.key && { key: rec.key }), //If it has Key it will be stored
      };
    });
  } catch (err) {
    throw err;
  }
};

//As per number of items in per page, get and set data
export const getSearchResultsPage = function (page = state.search.page) {
  // Parameter will be used when pagination click event is triggered
  state.search.page = page;
  const start = (page - 1) * RESULT_PER_PAGE;
  const end = page * RESULT_PER_PAGE;
  return state.search.results.slice(start, end);
};

export const updateServing = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

//Save bookmarked recipes to Local Storage
const persistBookmark = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmark));
};

export const addBookmark = function (recipe) {
  //Add recipe to bookmark array
  state.bookmark.push(recipe);

  //Add bookmarker to recipe to check whether it's bookmarked or not and to be used in recipeView and while removing the bookmark
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  //Save updated bookmarked recipes to local storage
  persistBookmark();
};

export const removeBookmark = function (id) {
  //Delete bookmark
  const index = state.bookmark.findIndex(b => b.id === id);
  state.bookmark.splice(index, 1);

  //Mark current recipe as Not bookmarked
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  //Save updated bookmarked recipes to local storage
  persistBookmark();
};

export const uploadRecipe = async function (newRecipe) {
  //Set ingredients and check their format
  //Convert it back to array in order to filter and to create new array map it
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        const ingArr = ing[1].replaceAll(' ', '').split(',');
        //Format must be as '','',''
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient format! Please follow the correct format.'
          );
        const [quantity, Unit, Description] = ingArr;
        //if there is no qty, it will return null
        return { quantity: quantity ? +quantity : null, Unit, Description };
      });
    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await sendJSON(
      `${SEARCH_API_URL}${recipe.title}&key=${API_KEY}`,
      recipe
    );
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};

//Get bookmarked recipes from local storage
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmark = JSON.parse(storage);
};
init();

const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
//  clearBookmarks();
