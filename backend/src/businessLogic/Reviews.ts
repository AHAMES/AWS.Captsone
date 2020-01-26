import { UserReviewItem } from '../models/UserReviewItem'
import { createLogger } from '../utils/logger'
import { BooksAccess } from '../dataLayer/BooksAccess'
//import { AuthorsAccess } from '../dataLayer/AuthorsAccess'
import { ReviewAccess } from '../dataLayer/ReviewAccess'
import { parseUserId } from '../auth/utils'
import { UserReviewItemDisplay } from '../models/UserReviewItemDisplay'
import { AuthorsAccess } from '../dataLayer/AuthorsAccess'
const logger = createLogger('Review BLL')

const authorsAccess = new AuthorsAccess()
const booksAccess = new BooksAccess()
const reviewAccess = new ReviewAccess()

export async function createReview(
  newItem: UserReviewItem,
  jwkToken
): Promise<UserReviewItem> {
  const userId = parseUserId(jwkToken)
  logger.info('CreateReview: CheckuserID ' + userId)

  newItem.userId = userId
  logger.info('CreateReview attempting to create a review')
  return await reviewAccess.createReview(newItem)
}

export async function deleteReview(bookId, jwkToken) {
  const userId = parseUserId(jwkToken)
  logger.info('getReview: CheckuserID ' + userId)

  return await reviewAccess.deleteReview(bookId, userId)
}

/*export async function getReview(bookId, jwkToken): Promise<UserReviewItem> {
  const userId = parseUserId(jwkToken)
  logger.info('getReview: CheckuserID ' + userId)
  const response = reviewAccess.getReview(bookId, userId)
  logger.info('getReview: Item found ' + response)
  return await response
}*/

export async function updateReview(bookId, jwkToken, reviewRate) {
  const book = await booksAccess.getBook(bookId)
  if (book == null) {
    return null
  }

  const userId = parseUserId(jwkToken)
  logger.info('updateReview: CheckuserID ' + userId)

  /*const review = await reviewAccess.getReview(bookId, userId)
  if (review == null) {
    return null
  }*/

  return await reviewAccess.updateReview(bookId, userId, reviewRate)
}

export async function getUserReviews(jwkToken) {
  const userId = parseUserId(jwkToken)
  logger.info('getUserReviews: CheckuserID ' + userId)
  let response: UserReviewItemDisplay[] = []
  const reviews = await reviewAccess.getAllUserReviews(userId)
  for (let i = 0; i < reviews.length; i++) {
    const bookData = await booksAccess.getBook(reviews[i].bookId)

    const authorData = await authorsAccess.getAuthor(bookData.authorId)
    if (
      typeof authorData === 'undefined' ||
      typeof authorData === null ||
      typeof bookData === 'undefined' ||
      typeof bookData === null
    ) {
      continue
    }
    response.push({
      reviewData: reviews[i],
      bookData: {
        AuthorName: authorData.name,
        BookName: bookData.name,
        genre: bookData.genre
      }
    })
  }
  return response
}

export async function getBookReviews(bookId) {
  const book = await booksAccess.getBook(bookId)
  if (book == null) {
    return null
  }

  return await reviewAccess.getAllReviews(bookId)
}
