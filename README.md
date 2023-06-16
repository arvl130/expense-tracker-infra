# Expense Tracker (Infrastructure)

This is an [AWS CDK](https://aws.amazon.com/cdk/) project for setting up the AWS infrastructure needed to run my [Expense Tracker](https://github.com/arvl130/expense-tracker) app. The infrastructure includes:

- the storage bucket for storing the images,
- the CDN for caching uploaded images, and
- the function for invalidating the CDN cache.

For now, only the cache invalidator will be created automatically. See the [TODO](https://github.com/arvl130/expense-tracker-infra/issues/1) list for pending features.

## Setup

To setup this project, you will need to create an S3 bucket, and a CloudFront distribution for serving the bucket through the [AWS Management Console](https://console.aws.amazon.com/console/home). Save the S3 bucket name, the CloudFront distribution ID, and the CloudFront distribution domain name after they have been created.

Clone this repository.

```sh
$ git clone https://github.com/arvl130/expense-tracker-infra.git
$ cd expense-tracker-infra
```

Create a `.env` file using the template provided. Enter the S3 bucket name, the CloudFront distribution ID, and the CloudFront distribution domain name in the file following the template's format.

```sh
$ cp .env.template .env
$ vi .env
```

By default, this project will use your default AWS account/region to deploy the CloudFormation stack. To configure a default AWS account on your computer, you may use the [AWS CLI](https://aws.amazon.com/cli).

Run the following command to deploy the stack.

```sh
$ npm run cdk deploy
```

Deploying the project may take a while. Once it's deployed, you may now use the CloudFront distribution and the S3 bucket created on the Expense Tracker app.

## Other commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `npm run cdk deploy` deploy the stack to your default AWS account/region
- `npm run cdk destroy` remove the stack from your default AWS account/region
- `npm run cdk diff` compare deployed stack with current state
- `npm run cdk synth` emits the synthesized CloudFormation template
