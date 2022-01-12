import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Users extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.uuid('uid').notNullable()
      table.string('username', 225).unique().notNullable()
      table.string('email', 225).unique().notNullable()
      table.string('password', 180).notNullable()
      table.string('remember_me_token').nullable()
      table.enum('type', ['super_admin', 'admin', 'customer']).notNullable()
      table.string('first_name', 225).notNullable()
      table.string('last_name', 225).notNullable()
      table.text('address').notNullable()
      table.string('contact_number', 225).unique().notNullable()
      table.enu('status', ['active', 'inactive']).defaultTo('active').notNullable()
      table.string('avatar', 225)
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
