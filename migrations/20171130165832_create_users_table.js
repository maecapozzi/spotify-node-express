exports.up = function (knex) {
  return knex.schema.createTable('users', function (t) {
    t.increments('id').primary()
    t.string('spotify_id').notNullable().defaultTo('')
    t.string('access_token').notNullable().defaultTo('')
    t.string('refresh_token').notNullable().defaultTo('')
    t.string('session_id').notNullable().defaultTo('')
    t.timestamps(false, true)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTableIfExists('users')
}
