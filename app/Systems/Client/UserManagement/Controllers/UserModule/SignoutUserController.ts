import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ResponseBody } from 'App/Common/Helpers/ResponseStatement';


// import Sentry from '@ioc:Adonis/Addons/Sentry'

export default class SignoutUserController {
  /*
  |--------------------------------------------------------------------------------
  | Status Codes
  |--------------------------------------------------------------------------------
  |
  */
  private status = HttpStatusCodeEnum 
  

  /*
  |--------------------------------------------------------------------------------
  | Systems
  |--------------------------------------------------------------------------------
  |
  */

  /*
  |--------------------------------------------------------------------------------
  | Handle Request
  |--------------------------------------------------------------------------------
  |
  */
  public async handle({ response, auth }: HttpContextContract) {
    try {

      auth.user!.isActive = false
      await auth.user!.save();
      auth.use("api").revoke()

      return response.status(this.status.SUCCESS).send(ResponseBody({
          status: this.status.SUCCESS,
          message: "Logout Successfully"
      }))

    } catch (SignoutUserControllerError) {
      console.log(
        '🚀 ~ SignoutUserControllerError.handle SignoutUserControllerError ->',
        SignoutUserControllerError
      )

      // Sentry.captureException(SignoutUserControllerError)

      return response.status(this.status.INTERNAL_SERVER_ERROR).send(ResponseBody({
        status: this.status.INTERNAL_SERVER_ERROR,
        message: JSON.stringify(SignoutUserControllerError)
    }))
    }
  }
}
