// Функция для проверки длины строки
const checkStringLength = (string, maxLength) => string.length <= maxLength;

// Функция для проверки палиндрома
const isPalindrome = (string) => {
  const normalizedString = string.replaceAll(' ', '').toLowerCase();
  let reversedString = '';

  for (let i = normalizedString.length - 1; i >= 0; i--) {
    reversedString += normalizedString[i];
  }

  return normalizedString === reversedString;
};

// Функция извлечения чисел
const extractNumber = (arg) => {
  const string = arg.toString();
  let result = '';

  for (let i = 0; i < string.length; i++) {
    if (!Number.isNaN(parseInt(string[i], 10))) {
      result += string[i];
    }
  }

  return parseInt(result, 10);
};
