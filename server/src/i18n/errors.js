'use strict';

/** @type {Record<string, Record<string, { message: string; action: string }>>} */
const errorMessages = {
  uk: {
    notFound: {
      message: 'Сторінку або ресурс не знайдено.',
      action: 'Перевірте адресу та спробуйте ще раз.',
    },
    badRequest: {
      message: 'Запит містить некоректні дані.',
      action: 'Перевірте введені дані та повторіть запит.',
    },
    internal: {
      message: 'На сервері сталася помилка.',
      action: 'Спробуйте пізніше або зверніться до підтримки.',
    },
  },
  en: {
    notFound: {
      message: 'The page or resource was not found.',
      action: 'Check the address and try again.',
    },
    badRequest: {
      message: 'The request contains invalid data.',
      action: 'Review the submitted data and try again.',
    },
    internal: {
      message: 'Something went wrong on our end.',
      action: 'Please try again later or contact support.',
    },
  },
};

/**
 * Визначає мову зі значення заголовка Accept-Language.
 * Якщо заголовок починається з 'en' — повертає 'en', інакше 'uk'.
 *
 * @param {string | undefined} acceptLanguage
 * @returns {'uk' | 'en'}
 */
function detectLang(acceptLanguage) {
  if (typeof acceptLanguage === 'string' && acceptLanguage.trim().toLowerCase().startsWith('en')) {
    return 'en';
  }
  return 'uk';
}

/**
 * Повертає локалізоване повідомлення { message, action } за HTTP-статусом.
 *
 * @param {number} status
 * @param {'uk' | 'en'} lang
 * @returns {{ message: string; action: string }}
 */
function getErrorText(status, lang) {
  const dict = errorMessages[lang] ?? errorMessages.uk;

  if (status === 404) return dict.notFound;
  if (status >= 400 && status < 500) return dict.badRequest;
  return dict.internal;
}

module.exports = { detectLang, getErrorText };
