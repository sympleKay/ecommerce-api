import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import Redis from '@ioc:Adonis/Addons/Redis'
import ProductCategory from 'App/Models/ProductCategory'
import { categoryRequest } from 'App/utils/validator.util'
import { httpStatusResponse } from 'App/utils/response.util'
import { DateTime } from 'luxon'

export default class ProductCategoriesController {
  public async store ({request, response }: HttpContextContract) {
    //   Validate User's Request
    const payload = await categoryRequest(request.body())
    // Save category after validation is successfully
    const newCategory = await ProductCategory.create(payload)
    if (newCategory) {
      return httpStatusResponse(response, 201, 'success', 'category created successfully...', newCategory)
    }
    return httpStatusResponse(response, 500, 'failed', 'Could not create category')
  }

  public async show ({ response, auth }: HttpContextContract) {
    // const cacheProducts = await Redis.get('products')
    // if (cacheProducts !== null) {
    //   return httpStatusResponse(response, 200, 'success', 'Category record', JSON.parse(cacheProducts))
    // }
    const category = await ProductCategory
      .query()
      .where({ deletedAt: null })
      .preload('categoryProducts', (product) => {
        product.where({user_uid: auth.user?.uid})
      })
      .preload('subCategories', (subcategories) => {
        subcategories.where({deletedAt: null})
      })
    if (category) {
      // await Redis.setex('products', 3600, JSON.stringify(category))
      return httpStatusResponse(response, 200, 'success', 'All category', category)
    }
    return httpStatusResponse(response, 500, 'failed', 'Could not fetch category')
  }

  public async showByUid ({ request, response }: HttpContextContract) {
    const { uid } = request.params()
    // const cacheProduct = await Redis.get(`product_${String(uid)}`)
    // if (cacheProduct !== null) {
    //   return httpStatusResponse(response, 200, 'success', 'Category record', JSON.parse(cacheProduct))
    // }
    const category = await ProductCategory.query().where({ uid }).preload('categoryProducts')

    if (category.length > 0 && category[0].deletedAt === null) {
      // await Redis.setex(`product_${String(category[0].uid)}`, 3600, JSON.stringify(category[0]))
      return httpStatusResponse(response, 200, 'success', 'Category record', category[0])
    }

    if (category.length === 0 || category[0].deletedAt !== null) {
      return httpStatusResponse(response, 404, 'failed', 'No category found', [])
    }

    return httpStatusResponse(response, 500, 'failed', 'Could not fetch category')
  }

  public async update ({ request, response}: HttpContextContract) {
    const { uid } = request.params()
    const { name, status } = request.body()
    const updateProductCategory = await ProductCategory.find(uid)
    if (!updateProductCategory) {
      return httpStatusResponse(response, 404, 'failed', 'Category not found')
    }
    updateProductCategory.name = name || updateProductCategory.name
    updateProductCategory.status = typeof status === 'undefined' ? updateProductCategory.status : status

    const updCategory = await updateProductCategory.save()

    return httpStatusResponse(response, 200, 'success', 'Category updated', updCategory)
  }

  public async destroy ({ request, response }: HttpContextContract) {
    const { uid } = request.params()
    const category = await ProductCategory
      .query()
      .where({ uid })
      .update({ deletedAt: DateTime.now().toSQL({ includeOffset: false }) })
    if (category) {
      return httpStatusResponse(response, 204, 'success', 'Category deleted')
    }
  }
}
