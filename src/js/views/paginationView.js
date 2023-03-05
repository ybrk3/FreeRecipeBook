import View from './view';
import icons from 'url:../../img/icons.svg';
import { RESULT_PER_PAGE } from '../config';

class PaginationView extends View {
  _parentEl = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentEl.addEventListener('click', function (e) {
      //Catching the parent element
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      //Catching the page number from data attribute and set it as a parameter which then be used while slicing the search results
      const goToPage = +btn.dataset.gotopage;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    //Getting total page number
    const numPages = Math.ceil(this._data.results.length / RESULT_PER_PAGE);
    //Page 1,and there are other pages
    if (this._data.page === 1 && numPages > 1) {
      return this.#createNextButton();
    }

    //Last page
    if (this._data.page === numPages) {
      return this.#createPrevButton();
    }

    //Other pages(pages between first and last page)
    if (this._data.page > 1 && this._data.page < numPages)
      return `
        ${this.#createPrevButton()}
        ${this.#createNextButton()}
    `;
    //Page 1, and there are NO pages
    return '';
  }

  #createPrevButton() {
    return `
    <button data-goToPage="${
      this._data.page - 1
    }" class="btn--inline pagination__btn--prev">
        <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${this._data.page - 1}</span>
    </button>
    `;
  }
  #createNextButton() {
    return `
    <button data-goToPage="${
      this._data.page + 1
    }" class="btn--inline pagination__btn--next">
        <span>Page ${this._data.page + 1}</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
    </button>
    `;
  }
}

export default new PaginationView();
