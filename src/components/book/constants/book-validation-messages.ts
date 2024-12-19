const BOOK_VALIDATION_MSG = {
  TITLE: {
    IS_STRING: 'Title must be a string',
    IS_NOT_EMPTY: 'Title is required',
    MIN_LENGTH: 'Title must be at least 2 characters long',
    MAX_LENGTH: 'Title must be at most 100 characters long',
  },
  DESC: {
    IS_STRING: 'Description must be a string',
    IS_NOT_EMPTY: 'Description is required',
    MIN_LENGTH: 'Description must be at least 2 characters long',
    MAX_LENGTH: 'Description must be at most 400 characters long',
  },
  RATING: {
    IS_NUMBER: 'Rating must be a number',
    IS_NOT_EMPTY: 'Rating is required',
    MIN_VALUE: 'Rating must be at least 1',
    MAX_VALUE: 'Rating must be at most 5',
  },
  AUTHOR: {
    IS_STRING: 'Author must be a string',
    IS_NOT_EMPTY: 'Author is required',
  },
  FILE_URL: {
    IS_STRING: 'File URL must be a string',
    IS_NOT_EMPTY: 'File URL is required',
    IS_URL: 'File URL must be a valid URL',
  },
  IMAGE_URL: {
    IS_STRING: 'Image URL must be a string',
    IS_NOT_EMPTY: 'Image URL is required',
    IS_URL: 'Image URL must be a valid URL',
  },
  PAGES: {
    IS_NUMBER: 'Pages must be a number',
    IS_NOT_EMPTY: 'Pages is required',
    MIN_VALUE: 'Pages must be at least 1',
  },
  LANGUAGE: {
    IS_STRING: 'Language must be a string',
    IS_NOT_EMPTY: 'Language is required',
  },
  PG: {
    IS_NUMBER: 'PG must be a number',
    IS_NOT_EMPTY: 'PG is required',
    MIN_VALUE: 'PG must be at least 1',
  },
  ISBN13: {
    IS_STRING: 'ISBN13 must be a string',
    IS_NOT_EMPTY: 'ISBN13 is required',
    IS_ISBN: 'must be an ISBN13',
  },
  PUBLICATION_DATE: {
    IS_DATE: 'Publication date must be a date',
    IS_NOT_EMPTY: 'Publication date is required',
  },
};

export { BOOK_VALIDATION_MSG };
