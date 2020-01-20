import { BookItem } from '../models/BookItem'
import { createLogger } from '../utils/logger'
import { BooksAccess } from '../dataLayer/BooksAccess'
import { AuthorsAccess } from '../dataLayer/AuthorsAccess'
import { UpdateBookRequest } from '../requests/UpdateBookRequest'
import * as uuid from 'uuid'

const logger = createLogger('Books BLL')

const authorsAccess = new AuthorsAccess()
const booksAccess = new BooksAccess()

export async function createBook(newItem: BookItem): Promise<BookItem> {
  const author = await authorsAccess.getAuthor(newItem.authorId)
  if (author == null) {
    return null
  }
  const bookId = uuid.v4()
  newItem.bookId = bookId
  logger.info('createBook attempting to create book')
  return await booksAccess.createBook(newItem)
}

export async function getBooks(): Promise<BookItem[]> {
  logger.info('get Books ')
  return await booksAccess.getBooks()
}

export async function getBook(bookId: string): Promise<BookItem> {
  logger.info('get book ')
  return await booksAccess.getBook(bookId)
}

export async function getBookByAuthor(authorId: string): Promise<BookItem[]> {
  const author = await authorsAccess.getAuthor(authorId)
  if (author == null) {
    return null
  }
  logger.info('createBook attempting to create book')
  return await booksAccess.getBookByAuthor(authorId)
}

export async function updateBook(request: UpdateBookRequest, bookId: string) {
  const book = await booksAccess.getBook(bookId)
  if (book == null) {
    return null
  }
  logger.info('update Book ')

  return await booksAccess.updateBook(request, bookId, book.authorId)
}
