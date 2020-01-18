import { BookItem } from '../models/BookItem'
import { createLogger } from '../utils/logger'
import { BooksAccess } from '../dataLayer/BooksAccess'
import { AuthorsAccess } from '../dataLayer/AuthorsAccess'
//import { UpdateAuthorRequest } from '../requests/UpdateAuthorRequest'
import * as uuid from 'uuid'

const logger = createLogger('Books BLL')

const authorsAccess = new AuthorsAccess()
const booksAccess = new BooksAccess()
export async function createBook(newItem: BookItem): Promise<BookItem> {
  const bookId = uuid.v4()
  newItem.bookId = bookId
  const author = await authorsAccess.getAuthor(newItem.authorId)
  if (author == null) {
    return null
  }
  logger.info('createBook attempting to create book')
  return await booksAccess.createBook(newItem)
}
