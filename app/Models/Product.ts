import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'
import ProductCategory from 'App/Models/ProductCategory'
import ProductSubCategory from 'App/Models/ProductSubCategory'
import { v4 } from 'uuid'

export default class Product extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column()
  public id: number

  @column({ isPrimary: true })
  public uid: string

  @column()
  public userId: number

  @column()
  public userUid: string

  @column()
  public dayType: string

  @column()
  public productCategoryId: number

  @column()
  public productCategoryUid: string

  @column()
  public productSubCategoryId: number

  @column()
  public productSubCategoryUid: string

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public address: string

  @belongsTo(() => User)
  public productOwner: BelongsTo<typeof User>

  @belongsTo(() => ProductCategory)
  public productCategory: BelongsTo<typeof ProductCategory>

  @belongsTo(() => ProductSubCategory)
  public productSubCategory: BelongsTo<typeof ProductSubCategory>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  @beforeCreate()
  public static assignUuid (product: Product) {
    product.uid = v4()
  }
}
