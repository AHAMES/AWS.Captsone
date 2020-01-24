import 'source-map-support/register'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
const XAWS = AWSXRay.captureAWS(AWS)
import { parseUserId } from '../../auth/utils'
import { createLogger } from '../../utils/logger'
const logger = createLogger('General Image URL')

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'

interface bucketBody {
  bucketName: string
}
const expires = process.env.SIGNED_URL_EXPIRATION
const region = process.env.BUCKET_REGION
export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const body: bucketBody = JSON.parse(event.body)
  const bucketId = body.bucketName
  logger.info('Generating url ')
  const userId = parseUserId(jwtToken)
  const itemId = event.pathParameters.itemId
  let bucketName = ''
  if (bucketId == 'book') {
    bucketName = process.env.BOOKS_S3_BUCKET
  } else if (bucketId == 'author') {
    bucketName = process.env.AUTHORS_S3_BUCKET
  } else {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: ''
    }
  }
  const s3 = new XAWS.S3({
    signatureVersion: 'v4',
    region: region,
    params: { Bucket: bucketName }
  })

  var params = {
    Bucket: bucketName,
    Key: itemId,
    Expires: parseInt(expires)
  }

  logger.info('generateUploadUrl Params ', params)
  const url = await s3.getSignedUrl('putObject', params)
  logger.info('generated URL for user ' + userId, { url })
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl: url
    })
  }
}
