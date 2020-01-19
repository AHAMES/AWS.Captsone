import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'

import { getBook } from '../../businessLogic/Books'
import { BookItem } from '../../models/BookItem'
import { createLogger } from '../../utils/logger'
const logger = createLogger('Get book by book ID')
export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('getting specific book')

  const bookId = event.pathParameters.bookId
  const bookItems: BookItem = await getBook(bookId)
  const items = JSON.parse(JSON.stringify(bookItems))
  console.log(event)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      items
    })
  }
}
