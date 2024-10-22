export const RESPONSE_CONSTANT = {
  AUTH: {
    REGISTER_SUCCESS:
      'Registration Successful, check email for account verification code',
    LOGIN_SUCCESS: 'Login Successful',
    EMAIL_VERIFICATION_SUCCESS: 'Email verified successfully',
    PASSWORD_RESET_EMAIL_SUCCESS: 'Password Reset Email Sent Successfully',
    PASSWORD_RESET_SUCCESS: 'Password Reset Successfully',
    LOGOUT_SUCCESS: 'Logged out successfully',
    ACCOUNT_DEACTIVATION_SUCCESS: 'Account deactivated successfully',
    SEND_VERIFICATION_EMAIL_SUCCESS:
      'Verification email sent successfully, check your inbox',
  },
  OTP: {
    OTP_VALID: 'OTP Valid',
    OTP_INVALID: 'Invalid OTP provided',
    OTP_EXPIRED: 'OTP has expired, please request a new one',
  },
  USER: {
    GET_CURRENT_USER_SUCCESS: 'User data retrieved successfully',
    UPDATE_USER_PROFILE_SUCCESS: 'Profile successfully updated',
    DELETE_USER_SUCCESS: 'User deleted successfully',
  },
  BOOK: {
    ADD_BOOK_SUCCESS: 'Book added to your collection successfully',
    DELETE_BOOK_SUCCESS: 'Book removed from your collection',
    UPDATE_BOOK_DETAILS_SUCCESS: 'Book details updated successfully',
    BOOK_NOT_FOUND: 'Book not found',
    BOOK_UPLOAD_SUCCESS: 'Book uploaded successfully',
    BOOK_SHARE_SUCCESS: 'Book shared successfully',
  },
  COLLECTION: {
    CREATE_COLLECTION_SUCCESS: 'Book collection created successfully',
    DELETE_COLLECTION_SUCCESS: 'Book collection deleted successfully',
    UPDATE_COLLECTION_SUCCESS: 'Book collection updated successfully',
    ADD_BOOK_TO_COLLECTION_SUCCESS: 'Book added to your collection',
    REMOVE_BOOK_FROM_COLLECTION_SUCCESS: 'Book removed from the collection',
    COLLECTION_NOT_FOUND: 'Book collection not found',
  },
  READING_LIST: {
    CREATE_READING_LIST_SUCCESS: 'Reading list created successfully',
    DELETE_READING_LIST_SUCCESS: 'Reading list deleted successfully',
    UPDATE_READING_LIST_SUCCESS: 'Reading list updated successfully',
    ADD_BOOK_TO_READING_LIST_SUCCESS: 'Book added to reading list',
    REMOVE_BOOK_FROM_READING_LIST_SUCCESS: 'Book removed from reading list',
    READING_LIST_NOT_FOUND: 'Reading list not found',
  },
  CIRCLE: {
    CREATE_CIRCLE_SUCCESS: 'Book circle created successfully',
    DELETE_CIRCLE_SUCCESS: 'Book circle deleted successfully',
    JOIN_CIRCLE_SUCCESS: 'Successfully joined the book circle',
    LEAVE_CIRCLE_SUCCESS: 'Successfully left the book circle',
    CIRCLE_NOT_FOUND: 'Book circle not found',
  },
};