import { isEscapeKey } from './util.js';

const COMMENTS_PER_PORTION = 5;

const bigPictureElement = document.querySelector('.big-picture');

const bigPictureCancelElement = bigPictureElement.querySelector('.big-picture__cancel');
const commentListElement = bigPictureElement.querySelector('.social__comments');
const commentCountElement = bigPictureElement.querySelector('.social__comment-count');

const commentsLoaderElement = bigPictureElement.querySelector('.comments-loader');

const bodyElement = document.querySelector('body');

let commentsShown = 0;
let comments = [];

const createComment = ({ avatar, name, message }) => {
  const comment = document.createElement('li');
  comment.innerHTML =
    '<img class="social__picture" src="" alt="" width="35" height="35"><p class="social__text"></p>';
  comment.classList.add('social__comment');

  comment.querySelector('.social__picture').src = avatar;
  comment.querySelector('.social__picture').alt = name;
  comment.querySelector('.social__text').textContent = message;

  return comment;
};

const renderComments = () => {
  commentsShown += COMMENTS_PER_PORTION;

  if (commentsShown >= comments.length) {
    commentsLoaderElement.classList.add('hidden');
    commentsShown = comments.length;
  } else {
    commentsLoaderElement.classList.remove('hidden');
  }

  const fragment = document.createDocumentFragment();

  for (let i = commentListElement.children.length; i < commentsShown; i++) {
    const comment = comments[i];
    const commentElement = createComment(comment);
    fragment.append(commentElement);
  }

  commentListElement.append(fragment);
  commentCountElement.innerHTML = `
    <span class="social__comment-shown-count">${commentsShown}</span> из
    <span class="social__comment-total-count">${comments.length}</span> комментариев
  `;
};

const onCommentsLoaderClick = () => {
  renderComments();
};

const renderBigPicture = ({ url, likes, description }) => {
  bigPictureElement.querySelector('.big-picture__img img').src = url;
  bigPictureElement.querySelector('.big-picture__img img').alt = description;
  bigPictureElement.querySelector('.likes-count').textContent = likes;
  bigPictureElement.querySelector('.social__caption').textContent = description;
};

const openBigPicture = (data) => {
  bigPictureElement.classList.remove('hidden');
  bodyElement.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);

  renderBigPicture(data);

  comments = data.comments;

  commentsShown = 0;
  commentListElement.innerHTML = '';

  renderComments();

  commentsLoaderElement.addEventListener('click', onCommentsLoaderClick);
};

const closeBigPicture = () => {
  bigPictureElement.classList.add('hidden');
  bodyElement.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);

  commentsLoaderElement.removeEventListener('click', onCommentsLoaderClick);
};

function onDocumentKeydown(evt) {
  if (isEscapeKey(evt)) {
    evt.preventDefault();
    closeBigPicture();
  }
}

bigPictureCancelElement.addEventListener('click', () => {
  closeBigPicture();
});

export { openBigPicture };
