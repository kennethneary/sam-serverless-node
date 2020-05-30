const log = require('lambda-log');
const dbUtils = require('../utils/db-utils');

const tableName = process.env.SAMPLE_TABLE;

exports.getAllItemsHandler = async (event) => {
    log.info('received:', event);

    if (event.httpMethod !== 'GET') {
        throw new Error(
            `getAllItems only accept GET method, you tried: ${event.httpMethod}`
        );
    }

    const docClient = dbUtils.getDdbConnection();
    const params = {
        TableName: tableName,
    };
    const data = await docClient.scan(params).promise();
    const items = data.Items;
    const response = {
        statusCode: 200,
        body: JSON.stringify(items),
    };

    log.info(
        `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
    );
    return response;
};
