import { renderThumbnails } from './thumbnail.js';
import { getData } from './api.js';
import { showAlert } from './util.js';
import { setUserFormSubmit, closeForm } from './form.js';

// Загружаем данные
getData(
  (photos) => {
    renderThumbnails(photos);
  },
  () => {
    showAlert('Не удалось загрузить данные. Попробуйте обновить страницу');
  }
);

setUserFormSubmit(closeForm);
