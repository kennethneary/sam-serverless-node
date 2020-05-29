const log = require('lambda-log');
const { DocumentClient } = require('aws-sdk/clients/dynamodb');

const docClient = new DocumentClient();
const tableName = process.env.SAMPLE_TABLE;

exports.putItemHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(
            `postMethod only accepts POST method, you tried: ${event.httpMethod} method.`
        );
    }
    log.info('received:', event);

    const body = JSON.parse(event.body);
    const { id, name } = body;

    const params = {
        TableName: tableName,
        Item: {
            id,
            name,
        },
    };
    await docClient.put(params).promise();

    const response = {
        statusCode: 200,
    };

    log.info(
        `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
    );
    return response;
};
