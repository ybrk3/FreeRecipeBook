import View from './view';
import icons from 'url:../../img/icons.svg';
import { RESULT_PER_PAGE } from '../config';

class AddRecipeView extends View {
  _parentEl = document.querySelector('.upload'); //which is to be used
  _message = 'Recipe was successfully uploaded!';

  _window = document.querySelector('.add-recipe-window');

  _overlay = document.querySelector('.overlay');
  _btnClose = document.querySelector('.btn--close-modal');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');

  //We do not need to use Controller so as soon as page loaded we would like handle this evenet. Therefore we use them in constructor which will work through import in controller
  constructor() {
    super(); //which is for View.js
    //When we load page through import on Control.js, below handlers will be caught
    this._addHandlerShowWindow();
    this._addHandlerHidewindow();
  }

  toggleWindow() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  //Handler for opening add recipe window
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }
  //Handler for closing add recipe window
  _addHandlerHidewindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  //Handler for upload new recipe
  addHandlerUpload(handler) {
    this._parentEl.addEventListener('submit', function (e) {
      e.preventDefault();
      //Getting Form Data and spread them into Array
      const dataArr = [...new FormData(this)];
      //Transform Entries to Object
      const data = Object.fromEntries(dataArr);
      //handler accepts data to set in to recipes in Model.js through Controller.js
      handler(data);
    });
  }

  _generateMarkup() {}
}

export default new AddRecipeView();
