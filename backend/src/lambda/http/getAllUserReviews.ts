import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import { createLogger } from '../../utils/logger'
import { UserReviewItemDisplay } from '../../models/UserReviewItemDisplay'
import { getUserReviews } from '../../businessLogic/Reviews'
const logger = createLogger('getAllUserReviews')
export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  logger.info('Attempting to get user reviews')

  const newItems: UserReviewItemDisplay[] = await getUserReviews(jwtToken)

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
