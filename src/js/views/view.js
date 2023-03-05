import { mark } from 'regenerator-runtime';
import icons from 'url:../../img/icons.svg';
//this is the base class for other view classes and it contains common variables
export default class View {
  _data;

  _clear() {
    this._parentEl.innerHTML = '';
  }
  /**
   * Render the received object to the DOM
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, create markup string instead of rendering to the DOM
   * @returns {undefined | string} A markup string is returned if render=false
   * @this {Object} View instance
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;

    //get new markup
    const newMarkup = this._generateMarkup();
    //Get the DOM elements from new markup
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    //get all elements from NOD elements and convert them to Array
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    //get current element
    const curElements = Array.from(this._parentEl.querySelectorAll('*'));

    //iterate all elements and check whether is changed or not and if so, change their textes and attribute
    newElements.forEach((newEl, i) => {
      //by using index number of iteration, getting current element to compare it with new element
      const curEl = curElements[i];
      //UPDATES CHANGED TEXT
      //if there is text, nodevalue is not null so in order not to change all recipe class we are using this feature with condition of whether changes occured or not.
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      )
        //we are setting new elements text content to current element's text content
        curEl.textContent = newEl.textContent;

      //UPDATES CHANGED ATTRIBUTES
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  //Spinner method
  renderSpinner() {
    const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
  `;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
              <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
              <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${this._message}</p>
      </div>`;
    this._clear();
    this._parentEl.insertAdjacentHTML('afterbegin', markup);
  }
}
