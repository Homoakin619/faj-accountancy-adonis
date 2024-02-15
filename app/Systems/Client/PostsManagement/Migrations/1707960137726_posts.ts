import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'posts'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('subscription_id').unsigned().references("id").inTable('subscriptions').notNullable()
      table.string("title").notNullable()
      table.string('description',200)
      table.boolean('is_published').defaultTo(false)
      table.text('body')
      table.string('images')
      table.string('video')

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
