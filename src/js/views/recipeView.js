//import icons from '../img/icons.svg'; //parcel 1
import { mark } from 'regenerator-runtime';
import icons from 'url:../../img/icons.svg'; //parcel 2 which (url)is for static files
import { Fraction } from 'fractional';
import View from './view';

class RecipeView extends View {
  _parentEl = document.querySelector('.recipe');

  _errorMessage = 'We could not find that recipe. Please try another one!';
  _message = '';

  //generate markup Method
  _generateMarkup() {
    return `
<figure class="recipe__fig">
      <img src="${this._data.imageUrl}" alt="Tomato" class="recipe__img" />
      <h1 class="recipe__title">
        <span>${this._data.title}</span>
      </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${
          this._data.cookingTime
        }</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${
          this._data.servings
        }</span>
        <span class="recipe__info-text">servings</span>

        <div class="recipe__info-buttons">
          <button class="btn--tiny btn--increase-servings" data-updateTo="${
            this._data.servings - 1
          }">
            <svg>
              <use href="${icons}#icon-minus-circle"></use>
            </svg>
          </button>
          <button class="btn--tiny btn--increase-servings" data-updateTo="${
            this._data.servings + 1
          }">
            <svg>
              <use href="${icons}#icon-plus-circle"></use>
            </svg>
          </button>
        </div>
      </div>

      <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
        <svg>
          <use href="${icons}#icon-user"></use>
        </svg>
      </div>
      <button class="btn--round btn--bookmark">
        <svg class="">
          <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
        </svg>
      </button>
    </div>

    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">
        ${this._data.ingredients.map(this.#generateMarkupIngredient).join('')}
      </ul>
    </div>

    <div class="recipe__directions">
      <h2 class="heading--2">How to cook it</h2>
      <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${
          this._data.publisher
        }</span>. Please check out
        directions at their website.
      </p>
      <a
        class="btn--small recipe__btn"
        href='${this._data.sourceUrl}'
        target="_blank"
      >
        <span>Directions</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </a>
    </div>`;
  }
  //adjusting the fraction of quantity
  #generateMarkupIngredient(ing) {
    return `<li class="recipe__ingredient">
  <svg class="recipe__icon">
    <use href="${icons}#icon-check"></use>
  </svg>
  <div class="recipe__quantity">${
    !ing.quantity ? '' : new Fraction(ing.quantity)
  }</div>
  <div class="recipe__description">
    <span class="recipe__unit">${ing.unit}</span>
    ${ing.description}
  </div>
</li>
`;
  }
  //clear html Method

  addHandlerRender(handler) {
    //HashChange & load events
    //window.addEventListener('hashchange', controlRecipe); //to catch the changes on the hash
    //window.addEventListener('load', controlRecipe); //to catch the hash when link copy-paste to other tab
    ['hashchange', 'load'].forEach(ev => {
      window.addEventListener(ev, handler);
    });
  }
  addHandlerUpdateServings(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--tiny');
      if (!btn) return;
      const { updateto } = btn.dataset;
      if (+updateto > 0) handler(+updateto);
      else {
        return;
      }
    });
  }
  addHandlerBookmark(handler) {
    this._parentEl.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      //guard clause
      if (!btn) return;
      handler();
    });
  }
}

//w/o constructor, we export it as a default
export default new RecipeView();
