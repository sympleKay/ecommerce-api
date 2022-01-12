import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, belongsTo, BelongsTo, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import ProductCategory from 'App/Models/ProductCategory'
import Product from 'App/Models/Product'
import { v4 } from 'uuid'

export default class ProductSubCategory extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column()
  public id: number

  @column({ isPrimary: true })
  public uid: string

  @column()
  public name: string

  @column()
  public productCategoryId: number

  @column()
  public productCategoryUid: string

  @column()
  public status: boolean | number

  @belongsTo(() => ProductCategory)
  public productCategory: BelongsTo<typeof ProductCategory>

  @hasMany(() => Product)
  public products: HasMany<typeof Product>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  @beforeCreate()
  public static assignUuid (productSubCategory: ProductSubCategory) {
    productSubCategory.uid = v4()
  }
}
