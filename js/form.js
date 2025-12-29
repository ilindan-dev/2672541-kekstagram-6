import { isEscapeKey, showAlert } from './util.js';
import { resetScale } from './scale.js';
import { resetEffects } from './effect.js';
import { sendData } from './api.js';
import { showSuccessMessage, showErrorMessage } from './message.js';

const FILE_TYPES = ['jpg', 'jpeg', 'png'];

const MAX_HASHTAG_COUNT = 5;
const MAX_COMMENT_LENGTH = 140;
const TAG_PATTERN = /^#[a-zа-яё0-9]{1,19}$/i;

const ErrorText = {
  INVALID_PATTERN: 'Хэш-тег должен начинаться с #, состоять из букв и чисел, не длиннее 20 символов',
  INVALID_COUNT: `Нельзя указать больше ${MAX_HASHTAG_COUNT} хэш-тегов`,
  NOT_UNIQUE: 'Хэш-теги не должны повторяться',
  INVALID_LENGTH: `Длина комментария не может быть больше ${MAX_COMMENT_LENGTH} символов`,
};

const SubmitButtonText = {
  IDLE: 'Опубликовать',
  SENDING: 'Публикую...'
};

const body = document.querySelector('body');
const form = document.querySelector('.img-upload__form');
const overlay = form.querySelector('.img-upload__overlay');
const cancelButton = form.querySelector('.img-upload__cancel');
const fileField = form.querySelector('.img-upload__input');
const hashtagField = form.querySelector('.text__hashtags');
const commentField = form.querySelector('.text__description');
const submitButton = form.querySelector('.img-upload__submit');

const previewImage = form.querySelector('.img-upload__preview img');
const effectsPreviews = form.querySelectorAll('.effects__preview');

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-wrapper--error',
});

const normalizeTags = (tagString) => tagString.trim().split(' ').filter((tag) => Boolean(tag.length));
const hasValidTags = (value) => normalizeTags(value).every((tag) => TAG_PATTERN.test(tag));
const hasValidCount = (value) => normalizeTags(value).length <= MAX_HASHTAG_COUNT;
const hasUniqueTags = (value) => {
  const lowerCaseTags = normalizeTags(value).map((tag) => tag.toLowerCase());
  return lowerCaseTags.length === new Set(lowerCaseTags).size;
};
const validateComment = (value) => value.length <= MAX_COMMENT_LENGTH;

pristine.addValidator(hashtagField, hasValidCount, ErrorText.INVALID_COUNT, 3, true);
pristine.addValidator(hashtagField, hasUniqueTags, ErrorText.NOT_UNIQUE, 1, true);
pristine.addValidator(hashtagField, hasValidTags, ErrorText.INVALID_PATTERN, 2, true);
pristine.addValidator(commentField, validateComment, ErrorText.INVALID_LENGTH);

const blockSubmitButton = () => {
  submitButton.disabled = true;
  submitButton.textContent = SubmitButtonText.SENDING;
};

const unblockSubmitButton = () => {
  submitButton.disabled = false;
  submitButton.textContent = SubmitButtonText.IDLE;
};

const isTextFieldFocused = () =>
  document.activeElement === hashtagField ||
  document.activeElement === commentField;

const onDocumentKeydown = (evt) => {
  if (isTextFieldFocused()) {
    return;
  }

  const isErrorMessageExists = document.querySelector('.error');
  if (isErrorMessageExists) {
    return;
  }

  if (isEscapeKey(evt)) {
    evt.preventDefault();
    hideModal();
  }
};

const onCancelButtonClick = () => {
  hideModal();
};

const showSelectedImage = () => {
  const file = fileField.files[0];
  if (file) {
    const fileName = file.name.toLowerCase();
    const matches = FILE_TYPES.some((it) => fileName.endsWith(it));

    if (matches) {
      const url = URL.createObjectURL(file);
      previewImage.src = url;
      effectsPreviews.forEach((preview) => {
        preview.style.backgroundImage = `url('${url}')`;
      });
      return true;
    } else {
      showAlert('Неподдерживаемый формат файла. Используйте JPG или PNG.');
      return false;
    }
  }
  return false;
};


const onFileInputChange = () => {
  const isFileValid = showSelectedImage();

  if (isFileValid) {
    resetScale();
    showModal();
  }
};
function showModal() {
  overlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
  cancelButton.addEventListener('click', onCancelButtonClick);
}

function hideModal() {
  if (previewImage.src.startsWith('blob:')) {
    URL.revokeObjectURL(previewImage.src);
  }

  form.reset();
  pristine.reset();
  resetScale();
  resetEffects();

  previewImage.src = 'img/upload-default-image.jpg';
  effectsPreviews.forEach((preview) => {
    preview.style.backgroundImage = '';
  });

  overlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
  cancelButton.removeEventListener('click', onCancelButtonClick);
}

const setUserFormSubmit = (onSuccess) => {
  form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const isValid = pristine.validate();
    if (isValid) {
      blockSubmitButton();
      sendData(
        new FormData(evt.target),
        () => {
          onSuccess();
          showSuccessMessage();
          unblockSubmitButton();
        },
        () => {
          showErrorMessage();
          unblockSubmitButton();
        }
      );
    }
  });
};

fileField.addEventListener('change', onFileInputChange);

export { setUserFormSubmit, hideModal };
