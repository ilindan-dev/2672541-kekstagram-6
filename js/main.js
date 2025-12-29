const PHOTO_COUNT = 25;
const AVATAR_COUNT = 6;
const LIKE_MIN_COUNT = 15;
const LIKE_MAX_COUNT = 200;
const COMMENT_COUNT = 30;

const COMMENT_LINES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const DESCRIPTIONS = [
  'Улетаю в отпуск! Не ищите меня до февраля. #trip #travel #airport',
  'Типичный вечер пятницы: деплой на прод. #coding #developer #friday',
  'Код пишется, кофе пьется. Идеальный баланс. #coffee #work #setup',
  'Когда забыл точку с запятой в JS и ищешь ошибку 2 часа... #bug #javascript #pain',
  'Мой верный напарник по программированию. #cat #programmerslife',
  'Вид из окна просто космос! #nature #view #beautiful',
  'Решил выучить новый фреймворк. Пожелайте удачи. #study #learning #geek',
  'Встреча с коллегами. Обсуждаем архитектуру нового проекта. #meeting #team #work',
  'Наконец-то выходные! Можно просто поспать. #weekend #sleep #chill',
  'No filter, just pure CSS. #style #web #design',
];

const NAMES = [
  'Илья', 'Джон Пик', 'Кекс', 'Разработчик', 'Тот Самый', 'То чье имя нельзя говорить',
  'Админ', 'Наставник', 'Студент', 'Хацкер', 'Юзер228', 'Анонимус', 'RВасилий)'
];

const getRandomInteger = (a, b) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const getRandomArrayElement = (items) => items[getRandomInteger(0, items.length - 1)];

const createIdGenerator = () => {
  let lastGeneratedId = 0;
  return () => {
    lastGeneratedId += 1;
    return lastGeneratedId;
  };
};

const generateCommentId = createIdGenerator();

const createMessage = () => Array.from(
  { length: getRandomInteger(1, 2) },
  () => getRandomArrayElement(COMMENT_LINES)
).join(' ');

const createComment = () => ({
  id: generateCommentId(),
  avatar: `img/avatar-${getRandomInteger(1, AVATAR_COUNT)}.svg`,
  message: createMessage(),
  name: getRandomArrayElement(NAMES),
});

const createPicture = (index) => ({
  id: index,
  url: `photos/${index}.jpg`,
  description: getRandomArrayElement(DESCRIPTIONS),
  likes: getRandomInteger(LIKE_MIN_COUNT, LIKE_MAX_COUNT),
  comments: Array.from(
    { length: getRandomInteger(0, COMMENT_COUNT) },
    createComment
  ),
});

const getPictures = () => Array.from(
  { length: PHOTO_COUNT },
  (_, pictureIndex) => createPicture(pictureIndex + 1)
);

getPictures();
