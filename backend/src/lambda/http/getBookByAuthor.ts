import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'

import { getBookByAuthor } from '../../businessLogic/Books'
import { BookItem } from '../../models/BookItem'
import { createLogger } from '../../utils/logger'
const logger = createLogger('Get All Authors')
export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('getting specific author')

  const authorId = event.pathParameters.authorId
  const BookItems: BookItem[] = await getBookByAuthor(authorId)
  const items = JSON.parse(JSON.stringify(BookItems))
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
