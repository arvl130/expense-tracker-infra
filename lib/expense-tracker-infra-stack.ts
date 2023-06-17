import * as cdk from "aws-cdk-lib"
import * as lambda from "aws-cdk-lib/aws-lambda"
import * as lambdaNodeJs from "aws-cdk-lib/aws-lambda-nodejs"
import * as cloudfront from "aws-cdk-lib/aws-cloudfront"
import * as cloudfrontOrigins from "aws-cdk-lib/aws-cloudfront-origins"
import * as s3 from "aws-cdk-lib/aws-s3"
import * as s3Notifications from "aws-cdk-lib/aws-s3-notifications"
import { Construct } from "constructs"

export class ExpenseTrackerInfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const assetsBucket = new s3.Bucket(this, "AssetsBucket")
    const assetsCdn = new cloudfront.Distribution(this, "AssetsCdn", {
      defaultBehavior: {
        origin: new cloudfrontOrigins.S3Origin(assetsBucket),
      },
    })

    const invalidatorLambda = new lambdaNodeJs.NodejsFunction(
      this,
      "CacheInvalidator",
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        environment: {
          CLOUDFRONT_DISTRIB_ID: assetsCdn.distributionId,
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
