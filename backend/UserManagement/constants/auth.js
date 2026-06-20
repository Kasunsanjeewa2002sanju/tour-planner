// Session length after login (minimum 3 hours). Override via JWT_EXPIRES_IN in .env
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

module.exports = { JWT_EXPIRES_IN };
