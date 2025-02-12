import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const lambdaHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const table = process.env.TableName;
  if (event.httpMethod !== "GET") {
    throw new Error(
      `getAllItems only accept GET method, you tried: ${event.httpMethod}`
    );
  }
  // All log statements are written to CloudWatch
  console.info("received:", event);

  const command = new GetCommand({
    TableName: "items-dev",
    Key: {
      id: "1",
    },
  });

  const data = await docClient.send(command);

  console.info("data:", data);

  const response = {
    statusCode: 200,
    body: JSON.stringify(data.Item),
  };

  // All log statements are written to CloudWatch
  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
