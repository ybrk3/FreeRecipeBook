import View from './view';
import icons from 'url:../../img/icons.svg';

class PreviewView extends View {
  _parentEl = '';

  _generateMarkup() {
    //Get current (clicked) id
    const curId = window.location.hash.slice(1);
    return `
        <li class="preview">
            <a class="preview__link ${
              this._data.id === curId ? 'preview__link--active' : ''
            }" href="#${this._data.id}">
              <figure class="preview__fig">
                <img src="${this._data.imageUrl}" alt="Test" />
              </figure>
              <div class="preview__data">
                <h4 class="preview__title">${this._data.title}</h4>
                <p class="preview__publisher">${this._data.publisher}</p>
                <div class="preview__user-generated ${
                  this._data.key ? '' : 'hidden'
                }">
                  <svg>
                    <use href="${icons}#icon-user"></use>
                  </svg>
                </div>
              </div>
            </a>
        </li>
    `;
  }
}

export default new PreviewView();
