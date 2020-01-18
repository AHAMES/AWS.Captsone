import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

import { createLogger } from '../../utils/logger'
import { CreateAuthorRequest } from '../../requests/CreateAuthorRequest'
import { AuthorItem } from '../../models/AuthorItem'
import { createAuthor } from '../../businessLogic/Authors'

const logger = createLogger('createTodo')
export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  //const newTodo: CreateTodoRequest = JSON.parse(event.body)

  const newAuther: CreateAuthorRequest = JSON.parse(event.body)
  logger.info('attempting to create an author', newAuther)
  console.log(event)
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const ItemDetails: AuthorItem = {
    authorId: null,
    createdAt: new Date().toISOString(),
    name: newAuther.name,
    attachmentUrl: ''
  }

  const newItem: AuthorItem = await createAuthor(ItemDetails, jwtToken)

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
