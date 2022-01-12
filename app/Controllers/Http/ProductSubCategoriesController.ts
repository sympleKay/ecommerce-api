import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'
import ProductSubCategory from 'App/Models/ProductSubCategory'
import ProductCategory from 'App/Models/ProductCategory'
import { subCategoryRequest } from 'App/utils/validator.util'
import { httpStatusResponse } from 'App/utils/response.util'
export default class ProductSubCategoriesController {
  public async store ({ request, response}: HttpContextContract) {
    //   Validate User's Request
    const payload = await subCategoryRequest(request.body())
    // Save category after validation is successfully
    const product = await ProductCategory.find(payload.productCategoryUid)
    if (product?.deletedAt !== null) {
      return httpStatusResponse(response, 404, 'failed', 'Product category does not exist')
    }
    const newSubCategory = await ProductSubCategory.create(payload)
    if (newSubCategory) {
      return httpStatusResponse(response, 201, 'success', 'Sub-category created successfully...', newSubCategory)
    }
    return httpStatusResponse(response, 500, 'failed', 'Could not create Sub-category')
  }

  public async show ({ response}: HttpContextContract) {
    const subCategories = await ProductSubCategory
      .query()
      .where({deletedAt: null})
      .preload('productCategory')
      .preload('products')

    if (subCategories) {
      return httpStatusResponse(response, 200, 'success', 'Sub-categories', subCategories)
    }
    return httpStatusResponse(response, 500, 'failed', 'Could not fetch Sub-category')
  }

  public async showByUid ({ request, response }: HttpContextContract) {
    const { uid } = request.params()
    const subCategory = await ProductSubCategory
      .query()
      .where({ uid })
      .preload('productCategory')
      .preload('products')

    if (subCategory.length > 0 && subCategory[0].deletedAt === null) {
      return httpStatusResponse(response, 200, 'success', 'Sub-category record', subCategory[0])
    }

    if (subCategory.length === 0 || subCategory[0].deletedAt !== null) {
      return httpStatusResponse(response, 404, 'failed', 'No sub-category found', [])
    }

    return httpStatusResponse(response, 500, 'failed', 'Could not fetch category')
  }

  public async update ({ request, response }: HttpContextContract) {
    const { uid } = request.params()
    const { name, status, productCategoryUid } = request.body()

    const updateSubCategory = await ProductSubCategory.find(uid)
    if (!updateSubCategory || updateSubCategory.deletedAt !== null) {
      return httpStatusResponse(response, 404, 'failed', 'Sub-category not found')
    }

    if (productCategoryUid) {
      const findCategory = await ProductCategory.find(productCategoryUid)
      if (!findCategory || findCategory.deletedAt !== null) {
        return httpStatusResponse(response, 404, 'failed', 'Category not found')
      }
      updateSubCategory.name = name || updateSubCategory.name
      updateSubCategory.status = status ? 1 : 0 || updateSubCategory.status
      updateSubCategory.productCategoryUid = findCategory.uid || updateSubCategory.productCategoryUid
      updateSubCategory.productCategoryId = findCategory.id || updateSubCategory.productCategoryId

      const save = await updateSubCategory.save()

      if (save) {
        return httpStatusResponse(response, 200, 'success', 'Sub-category updated', save)
      }
    }

    updateSubCategory.name = name || updateSubCategory.name
    updateSubCategory.status = typeof status === 'undefined' ? updateSubCategory.status : status

    const save = await updateSubCategory.save()

    if (save) {
      return httpStatusResponse(response, 200, 'success', 'Sub-category updated', save)
    }

    return httpStatusResponse(response, 500, 'failed', 'Could not update subCategory')
  }

  public async destroy ({ request, response }: HttpContextContract) {
    const { uid } = request.params()
    const subCategory = await ProductSubCategory
      .query()
      .where({ uid })
      .update({ deletedAt: DateTime.now().toSQL({ includeOffset: false }) })
    if (subCategory) {
      return httpStatusResponse(response, 204, 'success', 'Sub-category deleted')
    }
  }
}
