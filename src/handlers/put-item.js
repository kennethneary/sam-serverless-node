const log = require('lambda-log');
const dbUtils = require('../utils/db-utils');

const tableName = process.env.SAMPLE_TABLE;

exports.putItemHandler = async (event) => {
    log.info('received:', event);

    if (event.httpMethod !== 'POST') {
        throw new Error(
            `postMethod only accepts POST method, you tried: ${event.httpMethod} method.`
        );
    }

    const docClient = dbUtils.getDdbConnection();
    log.info('tableName:', tableName);

    const body = JSON.parse(event.body);
    const { id, name } = body;
    const params = {
        TableName: tableName,
        Item: {
            id,
            name,
        },
    };
    log.info('before docClient:');
    await docClient.put(params).promise();
    log.info('after docClient:');
    const response = {
        statusCode: 200,
    };

    log.info(
        `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
    );
    return response;
};
