import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult
} from 'aws-lambda'

//import { CreateTodoRequest } from '../../requests/CreateBookRequest'

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  //const newTodo: CreateTodoRequest = JSON.parse(event.body)
  console.log(event)
  // TODO: Implement creating a new TODO item
  return undefined
}
