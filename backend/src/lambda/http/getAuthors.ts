import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'

import { getAuthors } from '../../businessLogic/Authors'
import { AuthorItem } from '../../models/AuthorItem'
import { createLogger } from '../../utils/logger'
const logger = createLogger('Get All Authors')
export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  logger.info('getting all authors')

  const AuthorItems: AuthorItem[] = await getAuthors()
  const items = JSON.parse(JSON.stringify(AuthorItems))
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
