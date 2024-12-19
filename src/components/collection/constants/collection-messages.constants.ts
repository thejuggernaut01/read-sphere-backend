const COLLECTION_VALIDATION_MSG = {
  NAME: {
    IS_STRING: 'Name must be a string',
    IS_NOT_EMPTY: 'Name is required',
    MIN_LENGTH: 'Name must be at least 2 characters long',
    MAX_LENGTH: 'Name must be at most 50 characters long',
  },
  DESC: {
    IS_STRING: 'Description must be a string',
    IS_NOT_EMPTY: 'Description is required',
    MIN_LENGTH: 'Description must be at least 2 characters long',
    MAX_LENGTH: 'Description must be at most 400 characters long',
  },
  VISIBILITY: {
    IS_STRING: 'Visibility must be a string',
    IS_NOT_EMPTY: 'Visibility is required',
  },
};

export { COLLECTION_VALIDATION_MSG };
