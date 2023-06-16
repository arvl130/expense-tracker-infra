import {
  CloudFrontClient,
  CreateInvalidationCommand,
} from "@aws-sdk/client-cloudfront"
import { S3Event } from "aws-lambda"
import { v4 as uuidv4 } from "uuid"

export async function handler(event: S3Event) {
  const objectKey = event.Records[0].s3.object.key
  const { CLOUDFRONT_DISTRIB_ID } = process.env

  if (typeof CLOUDFRONT_DISTRIB_ID !== "string" || CLOUDFRONT_DISTRIB_ID === "")
    throw new Error("Missing or invalid distribution id")

  if (typeof objectKey !== "string" || objectKey === "")
    throw new Error("Missing or invalid object key")

  console.log(`Invalidating object with key: /${objectKey}`)
  const client = new CloudFrontClient({})
  const command = new CreateInvalidationCommand({
    DistributionId: CLOUDFRONT_DISTRIB_ID,
    InvalidationBatch: {
      Paths: {
        Quantity: 1,
        Items: [`/${objectKey}`],
      },
      CallerReference: uuidv4(),
    },
  })

  await client.send(command)
}
