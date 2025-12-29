const EFFECTS = [
  {
    name: 'none',
    style: 'none',
    min: 0,
    max: 100,
    step: 1,
    unit: '',
  },
  {
    name: 'chrome',
    style: 'grayscale',
    min: 0,
    max: 1,
    step: 0.1,
    unit: '',
  },
  {
    name: 'sepia',
    style: 'sepia',
    min: 0,
    max: 1,
    step: 0.1,
    unit: '',
  },
  {
    name: 'marvin',
    style: 'invert',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
  },
  {
    name: 'phobos',
    style: 'blur',
    min: 0,
    max: 3,
    step: 0.1,
    unit: 'px',
  },
  {
    name: 'heat',
    style: 'brightness',
    min: 1,
    max: 3,
    step: 0.1,
    unit: '',
  },
];

const DEFAULT_EFFECT = EFFECTS[0];
let chosenEffect = DEFAULT_EFFECT;

const imageElement = document.querySelector('.img-upload__preview img');
const effectsElement = document.querySelector('.effects');
const sliderElement = document.querySelector('.effect-level__slider');
const sliderContainerElement = document.querySelector('.img-upload__effect-level');
const effectLevelElement = document.querySelector('.effect-level__value');

const isDefault = () => chosenEffect === DEFAULT_EFFECT;

const showSlider = () => {
  sliderContainerElement.classList.remove('hidden');
};

const hideSlider = () => {
  sliderContainerElement.classList.add('hidden');
};

const onSliderUpdate = () => {
  const sliderValue = sliderElement.noUiSlider.get();
  if (isDefault()) {
    imageElement.style.filter = DEFAULT_EFFECT.style;
  } else {
    imageElement.style.filter = `${chosenEffect.style}(${sliderValue}${chosenEffect.unit})`;
  }
  effectLevelElement.value = sliderValue;
};

hideSlider();

const updateSlider = () => {
  if (isDefault()) {
    hideSlider();
    imageElement.style.filter = DEFAULT_EFFECT.style;
    return;
  }

  showSlider();

  if (!sliderElement.noUiSlider) {
    noUiSlider.create(sliderElement, {
      range: {
        min: DEFAULT_EFFECT.min,
        max: DEFAULT_EFFECT.max,
      },
      start: DEFAULT_EFFECT.max,
      step: DEFAULT_EFFECT.step,
      connect: 'lower',
      format: {
        to: function (value) {
          if (Number.isInteger(value)) {
            return value.toFixed(0);
          }
          return value.toFixed(1);
        },
        from: function (value) {
          return parseFloat(value);
        },
      },
    });

    sliderElement.noUiSlider.on('update', onSliderUpdate);

    const handle = sliderElement.querySelector('.noUi-handle');
    handle.setAttribute('tabindex', '0');

    handle.addEventListener('keydown', (evt) => {
      const currentValue = parseFloat(sliderElement.noUiSlider.get());
      const step = chosenEffect.step;

      if (evt.key === 'ArrowLeft') {
        evt.preventDefault();
        sliderElement.noUiSlider.set(currentValue - step);
      }

      if (evt.key === 'ArrowRight') {
        evt.preventDefault();
        sliderElement.noUiSlider.set(currentValue + step);
      }
    });
  }

  sliderElement.noUiSlider.updateOptions({
    range: {
      min: chosenEffect.min,
      max: chosenEffect.max,
    },
    start: chosenEffect.max,
    step: chosenEffect.step,
  });

  const sliderHandle = sliderElement.querySelector('.noUi-handle');
  if (sliderHandle) {
    sliderHandle.setAttribute('tabindex', '0');
  }
};

const onEffectsChange = (evt) => {
  if (!evt.target.classList.contains('effects__radio')) {
    return;
  }

  evt.target.blur();

  chosenEffect = EFFECTS.find((effect) => effect.name === evt.target.value);
  imageElement.className = `effects__preview--${chosenEffect.name}`;
  updateSlider();

  const sliderHandle = sliderElement.querySelector('.noUi-handle');
  if (sliderHandle) {
    sliderHandle.focus();
  }
};

const resetEffects = () => {
  chosenEffect = DEFAULT_EFFECT;
  updateSlider();
};

effectsElement.addEventListener('change', onEffectsChange);

export { resetEffects };
