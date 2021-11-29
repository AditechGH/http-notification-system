# HTTP notification system utilizing AWS SNS and NestJS Framework.

## Setup

### Installation

```bash
$ npm install
```

### Environmental Setup

#### Properties (.env)

- Below are some example values for the environment file `.env`
- `PORT` is the port that this application will listen on
- `AWS_REGION` is the location of your VPC
- `AWS_ARN` When a topic is created, Amazon SNS will assign a unique ARN(Amazon Resource Name) to the topic, which include the service name (SNS), region, AWS ID of the user and the topic name. The ARN will return as part of the API call to create a topic. The following is the ARN for a topic named "`mytopic`" created by a user with the AWS account ID "`1234567890121`" and hosted in the "`US East region`":  `arn:aws:sns:us-east-1:1234567890123456:mytopic`. Using the above ARN as an example, we will only be adding `arn:aws:sns:us-east-1:1234567890123456:` as our environment variable.

For more information on how to create topics on Amazon SNS, see [Getting Started with Amazon SNS](https://docs.aws.amazon.com/sns/latest/dg/sns-getting-started.html)

```properties
  PORT=3000
  AWS_REGION="us-east-1"
  AWS_ARN="arn:aws:sns:us-east-1:1234567890123456:"
```
#### Credentials

AWS SDK will be looking for credentials. The AWS credentials data is saved in a shared file used by the SDK. The shared credentials file is named "`credentials`". Where you keep the shared credentials file depends on your operating system:
- The shared credentials file on Linux, Unix, and macOS: ~/.aws/credentials 
- The shared credentials file on Windows: C:\Users\USER_NAME\ .aws\credentials

If you do not already have a shared credentials file, see [Getting Your Credentials](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/getting-your-credentials.html). Once you follow those instructions, you should see text similar to the following in the credentials file, where `<YOUR_ACCESS_KEY_ID>` is your access key ID and `<YOUR_SECRET_ACCESS_KEY>` is your secret access key: 

```credentials
  [sns_profile]
  aws_access_key_id = <YOUR_ACCESS_KEY_ID>
  aws_secret_access_key = <YOUR_SECRET_ACCESS_KEY>
  region = <AWS_REGION>
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## API Enpoints

### Registered topic names
- topic1
- topic2

### Base URL
- http://localhost:3000

### Subscribe Endpoint

- method: `POST`
- URL: `/subscribe/{topic}`

#### Sample Request Body

```json
  {
      "url": "http://mysubscriber.test"
  }
```
#### Sample Request Headers

```json
    {
        "Content-Type: application/json"
    }
```
#### Sample Respone

```json
  {
      "url": "http://mysubscriber.test",
      "topic": "topic1"
  }
```

#### Expample 1 - valid topic and URL

##### Request
```bash
  curl --location --request POST 'http://localhost:3000/subscribe/topic1' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "url": "http://google.com"
  }'
```
##### Response
```json
  {
      "topic": "topic1",
      "url": "http://google.com"
  }
```

#### Expample 2 - invalid URL

##### Request
```bash
  curl --location --request POST 'http://localhost:3000/subscribe/topic1' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "url": "vialung"
  }'
```
##### Response
```json
  {
    "status": 400,
    "error": "InvalidParameter"
  }
```

#### Expample 3 - invalid Topic

##### Request
```bash
  curl --location --request POST 'http://localhost:3000/subscribe/topic3' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "url": "http://google.com"
  }'
```
##### Response
```json
  {
    "status": 404,
    "error": "NotFound"
  }
```

### Publish Endpoint

- method: `POST`
- URL: `/publish/{topic}`

#### Sample Request Body

```json
  {
      "message": "{url: 'http://mysubscriber.test' }"
  }
```
#### Sample Request Headers

```json
    {
        "Content-Type: application/json"
    }
```
#### Sample Respone

```json
  "0e235ad7-6314-533b-b2f1-00c95eef87b0"
```

#### Expample 1 - valid topic

##### Request
```bash
  curl --location --request POST 'http://localhost:3000/publish/topic1' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "message": {"hello": "world"}
  }'
```
##### Response
```json
  "7019afbe-3efb-5992-9003-f5a38a4a48f5"
```

#### Expample 2 - invalid topic

##### Request
```bash
  curl --location --request POST 'http://localhost:3000/publish/topic3' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      "message": {"hello": "world"}
  }'
```
##### Response
```json
  {
    "status": 404,
    "error": "NotFound"
  }
```

#### Expample 3 - empty body

##### Request
```bash
  curl --location --request POST 'http://localhost:3000/publish/topic3' \
  --header 'Content-Type: application/json' \
  --data-raw '{
      
  }'
```
##### Response
```json
  {
    "status": 400,
    "error": "ValidationError"
  }
```

## License

Nest is [MIT licensed](LICENSE).
