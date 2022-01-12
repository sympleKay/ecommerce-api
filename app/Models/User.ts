import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, column, beforeCreate, beforeSave, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Product from 'App/Models/Product'
import { v4 } from 'uuid'

export default class User extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column()
  public id: number

  @column({ isPrimary: true })
  public uid: string

  @column()
  public username: string

  @column()
  public email: string

  @column()
  public rememberMeToken?: string

  @column()
  public type: string

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public address: string

  @column()
  public contactNumber: string

  @column()
  public status: string

  @column()
  public avatar: string | null

  @column({ serializeAs: null })
  public password: string

  @column()
  public token: number

  @hasMany(() => Product)
  public userProducts: HasMany<typeof Product>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  @beforeCreate()
  public static assignUuid (user: User) {
    user.uid = v4()
  }

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
