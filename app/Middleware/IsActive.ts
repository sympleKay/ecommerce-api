import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class IsActive {
  public async handle ({ response, auth}: HttpContextContract, next: () => Promise<void>) {
    const userState = auth.user?.status
    if (userState === 'inactive') {
      return response.status(401).json({
        status: 'failed',
        msg: 'User not active',
      })
    }
    await next()
  }
}
