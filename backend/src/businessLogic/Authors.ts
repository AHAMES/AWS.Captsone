import { AuthorItem } from '../models/AuthorItem'
import { createLogger } from '../utils/logger'
import { parseUserId } from '../auth/utils'
import { AuthorsAccess } from '../dataLayer/AuthorsAccess'
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
