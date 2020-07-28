// PORT
process.env.PORT = process.env.PORT || 3000;

// ENVIRONMENT
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// TOKEN EXPIRATION
process.env.TOKEN_EXPIRATION = 60 * 60 * 24 * 30;

// TOKEN SEED
process.env.TOKEN_SEED = process.env.TOKEN_SEED || 'este-es-el-seed-de-desarrollo';

// DATABASE
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;