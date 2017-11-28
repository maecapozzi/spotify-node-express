const knex = require('./db')

module.exports = {
  findOrCreateUser (spotify_id, access_token, refresh_token) {
    knex.transaction(trx => {
      trx('users').where('spotify_id', spotify_id).then(res => {
        if (res.length === 0) {
          return knex('users')
          .insert({
            spotify_id,
            access_token,
            refresh_token
          })
        } else {
          return knex('users')
          .where('spotify_id', spotify_id)
            .update({
              access_token,
              refresh_token
            })
        }
      })
    })
  },

  setSessionId (spotify_id, session_id) {
    console.log(session_id)
    knex.transaction(trx => {
      trx('users').where('spotify_id', spotify_id).then(res => {
        return knex('users')
          .update({
            session_id
          })
      })
    })
  },

  getAccessToken (spotify_id) {
    return knex('users').where('spotify_id', spotify_id).then(res => {
      console.log(res)
    })
  }
}
