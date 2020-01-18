import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import { UpdateAuthorRequest } from '../../requests/UpdateAuthorRequest'
import { updateAuthor } from '../../businessLogic/Authors'
import { createLogger } from '../../utils/logger'
const logger = createLogger('update todo endpoint')

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log(event)
  const authorId = event.pathParameters.authorId
  const updatedTodo: UpdateAuthorRequest = JSON.parse(event.body)

  logger.info('attempting to update an item', updatedTodo)
  await updateAuthor(
    {
      name: updatedTodo.name
    },
    authorId
  )
  logger.info('updated item', { authorId })
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
