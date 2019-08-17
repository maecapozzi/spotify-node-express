require('dotenv').config()

module.exports = {
  development: {
    connection: {
      user: process.env.DEV_DB_USER,
      password: process.env.DEV_DB_PASSWORD,
      database: 'earworm_development'
    }
  },
  production: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      user: process.env.PROD_DB_USER,
      password: process.env.PROD_DB_PASSWORD,
      database: 'earworm_production'
    }
  }
}
