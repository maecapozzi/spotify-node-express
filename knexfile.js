require('dotenv').config()

module.exports = {
  client: 'mysql',
  development: {
    client: 'mysql',
    connection: {
      user: process.env.DEV_DB_USER,
      password: process.env.DEV_DB_PASSWORD,
      database: 'earworm_development'
    }
  },
  production: {
    client: 'mysql',
    connection: {
      host: "https://spotify-viz-api.herokuapp.com",
      user: process.env.DEV_DB_USER,
      password: process.env.DEV_DB_PASSWORD,
      database: 'earworm_production'
    }
  }
}
