// PORT
process.env.PORT = process.env.PORT || 3000;

// ENVIRONMENT
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// DATABASE
let urlDB;
// if (process.env.NODE_ENV === 'dev') {
//     urlDB = 'mongodb://localhost:27017/cafe'
// } else {
urlDB = 'mongodb+srv://node-dlcv:CIm06RCF2ufOqwBb@cluster0.x8xwn.mongodb.net/cafe'
    //}

process.env.URLDB = urlDB;