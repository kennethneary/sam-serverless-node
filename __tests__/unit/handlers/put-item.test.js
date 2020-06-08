const { DocumentClient } = require('aws-sdk/clients/dynamodb');
const lambda = require('../../../src/handlers/put-item');

describe('Test putItemHandler', () => {
    let putSpy;

    beforeAll(() => {
        putSpy = jest.spyOn(DocumentClient.prototype, 'put');
    });

    afterAll(() => {
        putSpy.mockRestore();
    });

    it('should add id to the table', async () => {
        const returnedItem = { id: 'id1', name: 'name1' };

        putSpy.mockReturnValue({
            promise: () => Promise.resolve(returnedItem),
        });

        const event = {
            httpMethod: 'POST',
            body: '{"id": "id1","name": "name1"}',
        };

        const result = await lambda.putItemHandler(event);
        const expectedResult = {
            statusCode: 200,
        };

        expect(result).toBeDefined();
        expect(result.statusCode).toEqual(expectedResult.statusCode);
        expect(result.body).toBeDefined();
    });
});
