import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'
import { updateReview } from '../../businessLogic/Reviews'
import { createLogger } from '../../utils/logger'
const logger = createLogger('updateReview endpoint')

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log(event)
  const bookId = event.pathParameters.bookId
  const authorization = event.headers.Authorization
  const reviewRate: number = JSON.parse(event.body).reviewRate
  const split = authorization.split(' ')
  const jwtToken = split[1]
  logger.info('attempting to update a review')
  const res = await updateReview(bookId, jwtToken, reviewRate)

  if (res == null) {
    logger.info(
      'creation failed, user review for this book or the book does not exist'
    )

    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: ''
      })
    }
  }
  logger.info('updated item', { bookId })
  return {
    statusCode: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Methods': 'GET, PUT, POST, DELETE, HEAD'
    },
    body: ''
  }
}
