import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Products extends BaseSchema {
  protected tableName = 'products'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('uid').notNullable()
      table.integer('user_id').unsigned().references('id').inTable('users')
      table.uuid('user_uid').notNullable()
      table.enu('day_type', ['high', 'medium', 'low']).defaultTo('low').notNullable()
      table.integer('product_category_id').unsigned().references('id').inTable('product_categories')
      table.uuid('product_category_uid').notNullable()
      table.integer('product_sub_category_id')
        .unsigned()
        .references('id')
        .inTable('product_sub_categories')
      table.uuid('product_sub_category_uid').notNullable()
      table.string('title', 250).notNullable()
      table.text('description').notNullable()
      table.string('address', 250).notNullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.dateTime('deleted_at').nullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
