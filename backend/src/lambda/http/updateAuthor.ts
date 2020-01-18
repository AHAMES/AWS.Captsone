import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

//import { UpdateBookRequest } from '../../requests/UpdateBookRequest'

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  //const bookId = event.pathParameters.bookId
  //const updatedBook: UpdateBookRequest = JSON.parse(event.body)
  console.log(event)
  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
  return undefined
}
