import { UserReviewItem } from '../models/UserReviewItem'
import { createLogger } from '../utils/logger'
import { BooksAccess } from '../dataLayer/BooksAccess'
//import { AuthorsAccess } from '../dataLayer/AuthorsAccess'
import { ReviewAccess } from '../dataLayer/ReviewAccess'
import { parseUserId } from '../auth/utils'
const logger = createLogger('Review BLL')

//const authorsAccess = new AuthorsAccess()
const booksAccess = new BooksAccess()
const reviewAccess = new ReviewAccess()

export async function createReview(
  newItem: UserReviewItem,
  jwkToken
): Promise<UserReviewItem> {
  const book = await booksAccess.getBook(newItem.bookId)
  if (book == null) {
    return null
  } else {
    const userId = parseUserId(jwkToken)
    logger.info('CreateReview: CheckuserID ' + userId)

    const review = reviewAccess.getReview(newItem.bookId, userId)
    logger.info('CreateReview: check if exists ', { review })
    if (Object.keys(review).length != 0) {
      return {
        bookId: newItem.bookId,
        reviewRate: -1,
        userId: userId,
        createdAt: 'X'
      }
    } else {
      newItem.userId = userId
      logger.info('CreateReview attempting to create a review')
      return await reviewAccess.createReview(newItem)
    }
  }
}

export async function deleteReview(bookId, jwkToken) {
  const book = await booksAccess.getBook(bookId)
  if (book == null) {
    return null
  }
  const userId = parseUserId(jwkToken)
  logger.info('getReview: CheckuserID ' + userId)

  const review = await reviewAccess.getReview(bookId, userId)
  if (review == null) {
    return null
  }
  return await reviewAccess.deleteReview(bookId, userId)
}

export async function getReview(bookId, jwkToken): Promise<UserReviewItem> {
  const book = await booksAccess.getBook(bookId)
  if (book == null) {
    return null
  }

  logger.info('getReview: Book found ' + book)
  const userId = parseUserId(jwkToken)
  logger.info('getReview: CheckuserID ' + userId)
  const response = reviewAccess.getReview(bookId, userId)
  logger.info('getReview: Item found ' + response)
  return await response
}

export async function updateReview(bookId, jwkToken, reviewRate) {
  const book = await booksAccess.getBook(bookId)
  if (book == null) {
    return null
  }

  const userId = parseUserId(jwkToken)
  logger.info('updateReview: CheckuserID ' + userId)

  const review = await reviewAccess.getReview(bookId, userId)
  if (review == null) {
    return null
  }

  return await reviewAccess.updateReview(bookId, userId, reviewRate)
}

export async function getUserReviews(jwkToken) {
  const userId = parseUserId(jwkToken)
  logger.info('getUserReviews: CheckuserID ' + userId)

  return await reviewAccess.getAllUserReviews(userId)
}

export async function getBookReviews(bookId) {
  const book = await booksAccess.getBook(bookId)
  if (book == null) {
    return null
  }

  return await reviewAccess.getAllReviews(bookId)
}
