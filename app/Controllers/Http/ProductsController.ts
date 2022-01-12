import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Product from 'App/Models/Product'
import ProductCategory from 'App/Models/ProductCategory'
import ProductSubCategory from 'App/Models/ProductSubCategory'
import { productRequest } from 'App/utils/validator.util'
import { httpStatusResponse } from 'App/utils/response.util'
import { DateTime } from 'luxon'

export default class ProductsController {
  public async store ({ request, response, auth}: HttpContextContract) {
    //   Validate User's Request
    const payload = await productRequest(request.body())
    const { dayType, productCategoryUid, productSubCategoryUid, title, description, address } = payload

    const category = await ProductCategory.find(productCategoryUid)
    const subCategory = await ProductSubCategory.find(productSubCategoryUid)

    if (category?.deletedAt !== null || subCategory?.deletedAt !== null) {
      return httpStatusResponse(response, 403, 'failed', 'You can not add product to this categories')
    }
    // Save category after validation is successfully

    const newProduct = new Product()
    newProduct.userId = Number(auth.user?.id)
    newProduct.userUid = String(auth.user?.uid)
    newProduct.dayType = dayType
    newProduct.productCategoryUid = productCategoryUid
    newProduct.productSubCategoryUid = productSubCategoryUid
    newProduct.title = title
    newProduct.description = description
    newProduct.address = address

    const saveProduct = await newProduct.save()

    if (saveProduct) {
      return httpStatusResponse(response, 201, 'success', 'Product created successfully...', saveProduct)
    }
    return httpStatusResponse(response, 500, 'failed', 'Could not create product')
  }

  public async show ({ response }: HttpContextContract) {
    const products = await Product
      .query()
      .where({ deletedAt: null })
      .preload('productOwner')
      .preload('productCategory')
      .preload('productSubCategory')

    if (products) {
      return httpStatusResponse(response, 200, 'success', 'Products', products)
    }
    return httpStatusResponse(response, 500, 'failed', 'Could not fetch products')
  }

  public async showByUid ({ request, response }: HttpContextContract) {
    const { uid } = request.params()
    const product = await Product
      .query()
      .where({ uid })
      .preload('productOwner')
      .preload('productCategory')
      .preload('productSubCategory')

    if (product.length > 0 && product[0].deletedAt === null) {
      return httpStatusResponse(response, 200, 'success', 'Product record', product[0])
    }

    if (product.length === 0 || product[0].deletedAt !== null) {
      return httpStatusResponse(response, 404, 'failed', 'Product found', [])
    }

    return httpStatusResponse(response, 500, 'failed', 'Could not fetch category')
  }

  public async showByCurrentUser ({ auth, response }: HttpContextContract) {
    const product = await Product
      .query()
      .where({ user_uid: auth.user?.uid })
      .preload('productOwner')
      .preload('productCategory')
      .preload('productSubCategory')

    if (product.length > 0 && product[0].deletedAt === null) {
      return httpStatusResponse(response, 200, 'success', 'Product record', product[0])
    }

    if (product.length === 0 || product[0].deletedAt !== null) {
      return httpStatusResponse(response, 404, 'failed', 'Product not found')
    }

    return httpStatusResponse(response, 500, 'failed', 'Could not fetch product')
  }

  public async update ({ request, response, auth }: HttpContextContract) {
    const { uid } = request.params()
    const {
      dayType,
      productCategoryUid,
      productSubCategoryUid,
      title,
      description,
      address,
    } = request.body()

    const product = await Product.find(uid)
    if (!product) {
      return httpStatusResponse(response, 404, 'failed', 'Product not found')
    }

    if (product.userUid !== String(auth.user?.uid)) {
      return httpStatusResponse(response, 401, 'failed', 'Authorized access to update product')
    }

    if (productCategoryUid || productSubCategoryUid) {
      const category = await ProductCategory.find(productCategoryUid)
      const subCategory = await ProductSubCategory.find(productSubCategoryUid)

      if (!category) {
        return httpStatusResponse(response, 404, 'failed', 'Category not found')
      }

      if (!subCategory) {
        return httpStatusResponse(response, 404, 'failed', 'Sub-category not found')
      }

      product.dayType = dayType || product.dayType
      product.title = title || product.title
      product.description = description || product.description
      product.address = address || product.address
      product.productCategoryUid = category.uid || product.productCategoryUid
      product.productCategoryId = category.id || product.productCategoryId
      product.productSubCategoryUid = subCategory.uid || product.productSubCategoryUid
      product.productSubCategoryId = subCategory.id || product.productSubCategoryId

      const save = await product.save()
      if (save) {
        return httpStatusResponse(response, 200, 'success', 'Product updated', save)
      }
    }

    product.dayType = dayType || product.dayType
    product.title = title || product.title
    product.description = description || product.description
    product.address = address || product.address

    const save = await product.save()

    if (save) {
      return httpStatusResponse(response, 200, 'success', 'Sub-category updated', save)
    }

    return httpStatusResponse(response, 500, 'failed', 'Could not update subCategory')
  }

  public async destroy ({ request, response, auth }: HttpContextContract) {
    const { uid } = request.params()

    const product = await Product.find(uid)
    if (!product) {
      return httpStatusResponse(response, 404, 'failed', 'Product does not exist')
    }

    if (product.userUid !== String(auth.user?.uid)) {
      return httpStatusResponse(response, 401, 'failed', 'Authorized access to delete product')
    }

    const delProduct = await Product
      .query()
      .where({ uid })
      .update({ deletedAt: DateTime.now().toSQL({ includeOffset: false }) })
    if (delProduct) {
      return httpStatusResponse(response, 204, 'success', 'Product deleted')
    }
  }
}
