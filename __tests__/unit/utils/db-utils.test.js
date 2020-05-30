const { DocumentClient } = require('aws-sdk/clients/dynamodb');
const { Endpoint } = require('aws-sdk');
const dbUtils = require('../../../src/utils/db-utils');

jest.mock('aws-sdk/clients/dynamodb');

describe('Test db-utils-test', () => {
    afterAll(() => {
        DocumentClient.mockRestore();
    });

    it('local db connection', () => {
        process.env.ENVIRONMENT = 'local';
        const result = dbUtils.getDdbConnection();

        expect(result).toBeTruthy();

        const endpoint = new Endpoint('http://dynamodb:8000/');
        expect(DocumentClient).toBeCalled();
        expect(DocumentClient).toBeCalledWith({ endpoint });
    });

    it('aws db connection', () => {
        process.env.ENVIRONMENT = 'aws';
        const result = dbUtils.getDdbConnection();

        expect(result).toBeTruthy();

        expect(DocumentClient).toBeCalled();
        expect(DocumentClient).toBeCalledWith();
    });
});
