import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import { CreateUserReviewRequest } from '../../requests/CreateUserReviewRequest'
import { createLogger } from '../../utils/logger'
import { UserReviewItem } from '../../models/UserReviewItem'
import { createReview } from '../../businessLogic/Reviews'
const logger = createLogger('createReview')
export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const newReview: CreateUserReviewRequest = JSON.parse(event.body)
  logger.info('Attempting to create a review')

  const ItemDetails: UserReviewItem = {
    bookId: newReview.bookId,
    userId: '',
    createdAt: new Date().toISOString(),
    reviewRate: newReview.reviewRate
  }
  const newItem: UserReviewItem = await createReview(ItemDetails, jwtToken)
  /*if (newItem == null) {
    logger.info('creation failed book does not exist')

    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: newItem
      })
    }
  }
  if (newItem.createdAt == 'X') {
    logger.info(
      'creation failed, user already reviewed the book, look into updating it instead'
    )

    return {
      statusCode: 409,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: newItem
      })
    }
  }*/
  logger.info('created Item', newItem)
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      item: newItem
    })
  }
  return undefined
}
