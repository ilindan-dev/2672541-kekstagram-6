import { renderThumbnails } from './thumbnail.js';
import { renderGallery } from './gallery.js';
import { getData } from './api.js';
import { showAlert, debounce } from './util.js';
import { setUserFormSubmit, hideModal } from './form.js';
import { initFilter, getFilteredPictures } from './filter.js';
import './form.js';

getData()
  .then((data) => {

    const debouncedRenderThumbnails = debounce((filterData) => {
      const pictures = document.querySelectorAll('.picture');
      pictures.forEach((picture) => picture.remove());
      renderThumbnails(filterData);
    });

    initFilter(data, debouncedRenderThumbnails);

    renderGallery(getFilteredPictures());
  })
  .catch((err) => {
    showAlert(err.message);
  });

setUserFormSubmit(hideModal);
