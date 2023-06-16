import "dotenv/config"
import * as cdk from "aws-cdk-lib"
import * as lambda from "aws-cdk-lib/aws-lambda"
import * as lambdaNodeJs from "aws-cdk-lib/aws-lambda-nodejs"
import * as cloudfront from "aws-cdk-lib/aws-cloudfront"
import * as s3 from "aws-cdk-lib/aws-s3"
import * as s3Notifications from "aws-cdk-lib/aws-s3-notifications"
import { Construct } from "constructs"

export class ExpenseTrackerInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
    const { S3_BUCKET_NAME, CLOUDFRONT_DISTRIB_ID, CLOUDFRONT_DOMAIN_NAME } =
      process.env

    if (typeof S3_BUCKET_NAME !== "string" || S3_BUCKET_NAME === "")
      throw new Error("Missing or invalid bucket name")

    if (
      typeof CLOUDFRONT_DISTRIB_ID !== "string" ||
      CLOUDFRONT_DISTRIB_ID === ""
    )
      throw new Error("Missing or invalid cdn distribution id")

    if (
      typeof CLOUDFRONT_DOMAIN_NAME !== "string" ||
      CLOUDFRONT_DOMAIN_NAME === ""
    )
      throw new Error("Missing or invalid cdn domain name")

    const assetsBucket = s3.Bucket.fromBucketName(
      this,
      "AssetsBucket",
      S3_BUCKET_NAME
    )

    const assetsCdn = cloudfront.Distribution.fromDistributionAttributes(
      this,
      "AssetsCdn",
      {
        domainName: CLOUDFRONT_DOMAIN_NAME,
        distributionId: CLOUDFRONT_DISTRIB_ID,
      }
    )

    const invalidatorLambda = new lambdaNodeJs.NodejsFunction(
      this,
      "CacheInvalidator",
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        environment: {
          CLOUDFRONT_DISTRIB_ID,
        },
      }
    )

    assetsBucket.addEventNotification(
      s3.EventType.OBJECT_REMOVED_DELETE,
      new s3Notifications.LambdaDestination(invalidatorLambda)
    )
    assetsCdn.grantCreateInvalidation(invalidatorLambda)
  }
}
