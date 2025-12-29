const PICTURES_COUNT = 10;
const Filter = {
  DEFAULT: 'filter-default',
  RANDOM: 'filter-random',
  DISCUSSED: 'filter-discussed',
};

const filterElement = document.querySelector('.img-filters');
let currentFilter = Filter.DEFAULT;
let pictures = [];

const sortRandom = () => Math.random() - 0.5;

const sortDiscussed = (pictureA, pictureB) =>
  pictureB.comments.length - pictureA.comments.length;

const getFilteredPictures = () => {
  switch (currentFilter) {
    case Filter.RANDOM:
      return [...pictures].sort(sortRandom).slice(0, PICTURES_COUNT);
    case Filter.DISCUSSED:
      return [...pictures].sort(sortDiscussed);
    default:
      return [...pictures];
  }
};

const setOnFilterClick = (cb) => {
  filterElement.addEventListener('click', (evt) => {

    const clickedButton = evt.target.closest('.img-filters__button');

    if (!clickedButton) {
      return;
    }

    const activeFilter = filterElement.querySelector('.img-filters__button--active');
    if (activeFilter) {
      activeFilter.classList.remove('img-filters__button--active');
    }

    clickedButton.classList.add('img-filters__button--active');

    currentFilter = clickedButton.id;

    cb(getFilteredPictures());
  });
};

const initFilter = (loadedPictures, cb) => {
  filterElement.classList.remove('img-filters--inactive');
  pictures = [...loadedPictures];
  currentFilter = Filter.DEFAULT;

  const defaultBtn = filterElement.querySelector(`#${Filter.DEFAULT}`);
  if (defaultBtn) {
    const activeFilter = filterElement.querySelector('.img-filters__button--active');
    if (activeFilter) {
      activeFilter.classList.remove('img-filters__button--active');
    }
    defaultBtn.classList.add('img-filters__button--active');
  }

  setOnFilterClick(cb);
};

export { initFilter, getFilteredPictures };
