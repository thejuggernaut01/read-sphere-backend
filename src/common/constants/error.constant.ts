export const ERROR_CONSTANT = {
  AUTH: {
    REGISTER_FAILED: 'Registration failed, please try again',
    LOGIN_FAILED: 'Invalid credentials, please try again',
    EMAIL_VERIFICATION_FAILED: 'Email verification failed, please try again',
    PASSWORD_RESET_EMAIL_FAILED: 'Failed to send password reset email',
    PASSWORD_RESET_FAILED: 'Password reset failed, please try again',
    RESEND_VERIFICATION_EMAIL_FAILED:
      'Failed to resend verification email, please try again later',
    ACCOUNT_DEACTIVATION_FAILED:
      'Failed to deactivate account, please try again',
    LOGOUT_FAILED: 'Failed to log out, please try again',
    ACCOUNT_LOCKED: 'Account is locked, please contact support',
    UNAUTHORIZED: 'Unauthorized access, please log in',
    USER_EXISTS: 'User already exists.',
    USER_DOES_NOT_EXIST: 'User does not exist.',
    EXPIRED_SESSION: 'Session expired. Please log in again.',
  },
  OTP: {
    INVALID: 'Invalid OTP, please try again',
    EXPIRED: 'OTP has expired, please request a new one',
    VERIFICATION_FAILED: 'Failed to verify OTP, please try again',
    GENERATION_FAILED: 'Failed to generate OTP, please try again',
  },
  USER: {
    GET_CURRENT_USER_FAILED: 'Failed to retrieve user data',
    UPDATE_USER_PROFILE_FAILED: 'Failed to update profile, please try again',
    DELETE_USER_FAILED: 'Failed to delete user, please try again',
    NOT_FOUND: 'User not found',
  },
  BOOK: {
    ADD_BOOK_FAILED: 'Failed to add book to your collection, please try again',
    DELETE_BOOK_FAILED: 'Failed to remove book from your collection',
    UPDATE_BOOK_DETAILS_FAILED:
      'Failed to update book details, please try again',
    BOOK_UPLOAD_FAILED: 'Failed to upload book, please try again',
    BOOK_SHARE_FAILED: 'Failed to share book, please try again',
    BOOK_NOT_FOUND: 'Book not found',
  },
  COLLECTION: {
    CREATE_COLLECTION_FAILED: 'Failed to create book collection',
    DELETE_COLLECTION_FAILED: 'Failed to delete book collection',
    UPDATE_COLLECTION_FAILED: 'Failed to update book collection',
    ADD_BOOK_TO_COLLECTION_FAILED: 'Failed to add book to collection',
    REMOVE_BOOK_FROM_COLLECTION_FAILED: 'Failed to remove book from collection',
    COLLECTION_NOT_FOUND: 'Book collection not found',
  },
  READING_LIST: {
    CREATE_READING_LIST_FAILED: 'Failed to create reading list',
    DELETE_READING_LIST_FAILED: 'Failed to delete reading list',
    UPDATE_READING_LIST_FAILED: 'Failed to update reading list',
    ADD_BOOK_TO_READING_LIST_FAILED: 'Failed to add book to reading list',
    REMOVE_BOOK_FROM_READING_LIST_FAILED:
      'Failed to remove book from reading list',
    READING_LIST_NOT_FOUND: 'Reading list not found',
  },
  CIRCLE: {
    CREATE_CIRCLE_FAILED: 'Failed to create book circle',
    DELETE_CIRCLE_FAILED: 'Failed to delete book circle',
    JOIN_CIRCLE_FAILED: 'Failed to join the book circle',
    LEAVE_CIRCLE_FAILED: 'Failed to leave the book circle',
    CIRCLE_NOT_FOUND: 'Book circle not found',
  },
  GENERAL: {
    SERVER_ERROR: 'Internal server error, please try again later',
    NOT_FOUND: 'Resource not found',
    VALIDATION_ERROR: 'Validation failed, check your input',
    FORBIDDEN: 'You do not have permission to perform this action',
    BAD_REQUEST: 'Bad request, please check your input',
    CONFLICT: 'Conflict, the request could not be completed',
    RATE_LIMIT: 'Too many requests, please try again later',
    TOKEN: 'Invalid or expired token',
    ERROR: 'An error occurred, please log in again',
  },
  EMAIL: {
    FAILED_TO_SEND: 'Failed to send the email. Please try again later.',
    INVALID_RECIPIENT: 'The recipient email is invalid.',
  },
};
