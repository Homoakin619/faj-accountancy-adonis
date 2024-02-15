import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AdminMiddleware {
  public async handle({response,auth}: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL

    if(!auth.user!.isAdmin) {
     return response.redirect('/unauthorized')
    }

    await next()
  }
}
