const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool();

pool.on('connect', () => {
    console.log('Client connected to database.');
});
pool.on('release', () => {
    console.log('Client released from database.');
});

module.exports = {
    connect: (config) => pool.connect(config),
    query: (text, params) => pool.query(text, params),
    release: () => pool.release()
};
