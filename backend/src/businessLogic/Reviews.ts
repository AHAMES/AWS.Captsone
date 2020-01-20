import { UserReviewItem } from '../models/UserReviewItem'
import { createLogger } from '../utils/logger'
import { BooksAccess } from '../dataLayer/BooksAccess'
//import { AuthorsAccess } from '../dataLayer/AuthorsAccess'
import { ReviewAccess } from '../dataLayer/ReviewAccess'
import { parseUserId } from '../auth/utils'
const logger = createLogger('Books BLL')

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
  }
  const userId = parseUserId(jwkToken)
  logger.info('CreateReview: CheckuserID ' + userId)
  newItem.userId = userId
  logger.info('CreateReview attempting to create a review')
  return await reviewAccess.createReview(newItem)
}
