const path = require('path');

const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

// TODO: break code up in to logical blocks outside of index
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

function main() {
    // we can make this a little more sophisticated (read process.ENV)
    // sticking to the basics for this POC
    const client = new iamProto.Auth('localhost:50051',
        grpc.credentials.createInsecure());

    client.authenticateUser({email: 'client-email', password: 'client-password'}, function(err, response) {
        console.log('client.authenticateUser:', response);
    });

    client.authenticateToken({token: 'client-token'}, function(err, response) {
        console.log('client.authenticateToken:', response);
    });
}

main();