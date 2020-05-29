const { SNS } = require('aws-sdk');

const sns = new SNS();

exports.handler = async (event) => {
    const params = {
        Message: 'Hello World!',
        Subject: 'SNS Notification from Lambda',
        TopicArn: process.env.SNS_TOPIC_ARN,
    };

    try {
        await sns.publish(params).promise();
        return {
            statusCode: 200,
            body: 'Message sent',
        };
    } catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify(err),
        };
    }
};
