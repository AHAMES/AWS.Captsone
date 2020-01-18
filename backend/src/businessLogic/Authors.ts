import { AuthorItem } from '../models/AuthorItem'
import { createLogger } from '../utils/logger'
import { parseUserId } from '../auth/utils'
import { AuthorsAccess } from '../dataLayer/AuthorsAccess'
import { UpdateAuthorRequest } from '../requests/UpdateAuthorRequest'
import * as uuid from 'uuid'

const logger = createLogger('Author BLL')
const authorsAccess = new AuthorsAccess()
export async function createAuthor(
  newItem: AuthorItem,
  jwtToken: string
): Promise<AuthorItem> {
  const userId = parseUserId(jwtToken)
  logger.info('createAuthor: Check userID ' + userId)
  const authorId = uuid.v4()
  newItem.authorId = authorId
  return await authorsAccess.createAuthor(newItem)
}

export async function getAuthors(): Promise<AuthorItem[]> {
  logger.info('get Authors ')
  return await authorsAccess.getAuthors()
}

export async function getAuthor(authorId: string): Promise<AuthorItem> {
  logger.info('get Author ')
  return await authorsAccess.getAuthor(authorId)
}

export async function updateAuthor(
  request: UpdateAuthorRequest,
  authorId: string
) {
  logger.info('update author ')

  return await authorsAccess.updateAuthor(request, authorId)
}
