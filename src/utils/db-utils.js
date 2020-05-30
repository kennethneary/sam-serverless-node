const { DocumentClient } = require('aws-sdk/clients/dynamodb');
const { Endpoint } = require('aws-sdk');

exports.getDdbConnection = () => {
    if (process.env.ENVIRONMENT !== 'aws') {
        // connect to local dynamodb docker container
        const endpoint = new Endpoint('http://dynamodb:8000/');
        return new DocumentClient({ endpoint });
    }
    return new DocumentClient();
};
