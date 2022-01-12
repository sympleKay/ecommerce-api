import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import ProductSubCategory from 'App/Models/ProductSubCategory'
import Product from 'App/Models/Product'
import { v4 } from 'uuid'

export default class ProductCategory extends BaseModel {
  public static selfAssignPrimaryKey = true

  @column()
  public id: number

  @column({ isPrimary: true })
  public uid: string

  @column()
  public name: string

  @column()
  public status: boolean | number

  @hasMany(() => ProductSubCategory)
  public subCategories: HasMany<typeof ProductSubCategory>

  @hasMany(() => Product)
  public categoryProducts: HasMany<typeof Product>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  @beforeCreate()
  public static assignUuid (productCategory: ProductCategory) {
    productCategory.uid = v4()
  }
}
