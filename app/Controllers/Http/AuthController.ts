import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

import { signupRequest, signinRequest } from 'App/utils/validator.util'
import { httpStatusResponse } from 'App/utils/response.util'

export default class AuthController {
  public async signup ({ request, response }: HttpContextContract) {
    //   Validate User's Request
    const payload = await signupRequest(request.body())
    // Save user after validation is successfully
    const newUser = await User.create(payload)
    return httpStatusResponse(response, 201, 'success', 'User created successfully...', newUser)
  }

  public async signin ({ request, response, auth }: HttpContextContract) {
    //   Validate User's Request
    const payload = await signinRequest(request.body())

    const { email, password } = payload

    const token = await auth.use('api').attempt(email, password, {
      expiresIn: '30 days',
    })

    return httpStatusResponse(response, 200, 'success', 'Login successful', token)
  }

  public async currentUser ({ response, auth }: HttpContextContract) {
    try {
      const user = await User.query().where({
        uid: auth.user?.uid,
      })
        .preload('userProducts', (products) => {
          products.preload('productCategory', (category) => {
            category.preload('subCategories')
          }).preload('productSubCategory')
        })
      return httpStatusResponse(response, 200, 'success', 'Current User', user[0])
    } catch (error) {
      console.log(error)
      return httpStatusResponse(response, 500, 'failed', 'Server Error')
    }
  }

  public async logout ({ response, auth }: HttpContextContract) {
    await auth.use('api').revoke()

    return httpStatusResponse(response, 200, 'success', 'User logged out')
  }
}
