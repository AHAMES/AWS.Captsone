import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'

import { getBooks } from '../../businessLogic/Books'
import { BookItem } from '../../models/BookItem'
import { createLogger } from '../../utils/logger'
const logger = createLogger('Get All Books')
export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('getting all Books')

  const BookItems: BookItem[] = await getBooks()
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
