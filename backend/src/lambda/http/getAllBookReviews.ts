import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import { createLogger } from '../../utils/logger'
import { UserReviewItem } from '../../models/UserReviewItem'
import { getBookReviews } from '../../businessLogic/Reviews'
const logger = createLogger('getAllUserReviews')
export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const bookId = event.pathParameters.bookId
  logger.info('Attempting to get book reviews')

  const newItems: UserReviewItem[] = await getBookReviews(bookId)

  logger.info('Items found', newItems)
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newItems
    })
  }
  return undefined
}
