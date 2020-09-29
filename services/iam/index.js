const path = require('path');

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

// TODO: break code up in to logical blocks outside of index

function authenticateToken(call, callback) {
    const {
        token
    } = call.request;

    //TODO: actual validation of JWT token w/ secret in process.env
    callback(
        null,
        {
            user: {
                username: 'authenticate-token-response-user-username',
                email: 'authenticate-token-response-user-email'
            },
            token
        }
    );
}

function authenticateUser(call, callback) {
    const {
        password,
        email
    } = call.request;

    //TODO: actual authentication for email + password and encode JWT with secret in process.env
    callback(
        null,
        {
            user: {
                username: 'authenticate-user-response-user-username',
                email: email
            },
            token: 'authenticate-user-response-token'
        }
    );
}

const packageDefinition = protoLoader.loadSync(
    path.join(__dirname, '..', '..', 'protos', 'iam.proto'),
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });

const iamProto = grpc.loadPackageDefinition(packageDefinition).grpc_poc;

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
    const server = new grpc.Server();

    // we can make this a little more sophisticated
    // sticking to the basics for this POC
    server.addService(iamProto.Auth.service, {
        authenticateToken,
        authenticateUser
    });

    // TODO: grab this from process.ENV
    server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
    server.start();
}

main();