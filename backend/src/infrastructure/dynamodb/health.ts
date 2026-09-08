import { DescribeTableCommand, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { config } from '../../config';

const client = new DynamoDBClient({
  region: config.aws.region,
});

export async function checkDynamoDBHealth(): Promise<boolean> {
  try {
    await client.send(
      new DescribeTableCommand({
        TableName: config.aws.tableName,
      }),
    );
    return true;
  } catch {
    return false;
  }
}
