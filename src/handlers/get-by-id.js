const log = require('lambda-log');
const { DocumentClient } = require('aws-sdk/clients/dynamodb');

const docClient = new DocumentClient();
const tableName = process.env.SAMPLE_TABLE;

exports.getByIdHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(
            `getMethod only accept GET method, you tried: ${event.httpMethod}`
        );
    }
    log.info('received:', event);

    const { id } = event.pathParameters;

    const params = {
        TableName: tableName,
        Key: {
            id,
        },
    };
    const data = await docClient.get(params).promise();
    const item = data.Item;

    const response = {
        statusCode: 200,
        body: JSON.stringify(item),
    };

    log.info(
        `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
    );
    return response;
};
