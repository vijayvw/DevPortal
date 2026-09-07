import {
  DynamoDBClient,
} from '@aws-sdk/client-dynamodb';

import {
  DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb';

const region = process.env.AWS_REGION || 'ap-south-1';

const client = new DynamoDBClient({
  region,
});

export const dynamoDB =
  DynamoDBDocumentClient.from(client, {
    marshallOptions: {
      removeUndefinedValues: true,
    },
  });

export const DYNAMODB_TABLE =
  process.env.DYNAMODB_TABLE || 'DevPortal';

// Compatibility alias for reconstructed modules.
export const dynamoDb = dynamoDB;
