import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('email').notNullable()
      table.string('firstname').notNullable()
      table.string('lastname').notNullable()
      table.string('password').notNullable()
      table.boolean('is_admin').defaultTo(false)
      table.boolean('is_active').defaultTo(false)
      table.timestamp('last_login',{useTz: true})


      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
