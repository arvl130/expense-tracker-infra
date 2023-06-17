# Expense Tracker (Infrastructure)

This is an [AWS CDK](https://aws.amazon.com/cdk/) project for setting up the AWS infrastructure needed to run my [Expense Tracker](https://github.com/arvl130/expense-tracker) app. The infrastructure includes:

- the storage bucket for storing the images,
- the CDN for caching uploaded images, and
- the function for invalidating the CDN cache.

## Setup

Clone this repository.

```sh
$ git clone https://github.com/arvl130/expense-tracker-infra.git
$ cd expense-tracker-infra
```

Install the project dependencies.

```sh
$ npm install
```

By default, this project will use your default AWS account/region to deploy the CloudFormation stack. To configure a default AWS account/region on your computer, you may use the [AWS CLI](https://aws.amazon.com/cli).

```sh
$ aws configure
```

Bootstrap CDK on your AWS account if you have not done so already.

```sh
$ npm run cdk bootstrap
```

Run the following command to deploy the stack. This may take a few minutes.

```sh
$ npm run cdk deploy
```

Once the stack has been deployed, you may run the following command to see your CloudFront distributions.

```sh
$ aws cloudfront list-distributions
```

Find the distribution created by the stack, and save the distribution domain name. You may now use this domain for serving images in the Expense Tracker app.

Run the following command to see your S3 buckets.

```sh
$ aws s3 ls
```

Find the storage bucket created by the stack, and save the bucket name. Likewise, you now may use this bucket for the Expense Tracker app.

## Other commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `npm run cdk deploy` deploy the stack to your default AWS account/region
- `npm run cdk destroy` remove the stack from your default AWS account/region
- `npm run cdk diff` compare deployed stack with current state
- `npm run cdk synth` emits the synthesized CloudFormation template
