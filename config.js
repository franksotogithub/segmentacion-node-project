const config = module.exports;

config.express = {
    port: 3002,
    ip: '192.168.34.39'
};

config.mongodb = {
    connect: 'mongodb://localhost:27017/segmentacion'
};

config.jwt_token={
    secret_key: 'worldisfullofdevelopers',
    expire_time:'3600000',
};