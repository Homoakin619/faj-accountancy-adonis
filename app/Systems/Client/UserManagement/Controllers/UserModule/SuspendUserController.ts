import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { ERROR, SUCCESS, SOMETHING_WENT_WRONG } from 'App/Common/Helpers/Messages/SystemMessages'
import Sentry from '@ioc:Adonis/Addons/Sentry'

export default class SuspendUserController {
  /*
  |--------------------------------------------------------------------------------
  | Status Codes
  |--------------------------------------------------------------------------------
  |
  */
  private ok = HttpStatusCodeEnum.OK
  private internalServerError = HttpStatusCodeEnum.INTERNAL_SERVER_ERROR

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
  public async handle({ response }: HttpContextContract) {
    try {

      return response.status(this.ok).send({
        status_code: this.ok,
        status: SUCCESS,
        message: '',
      })
    } catch (SuspendUserControllerError) {
      console.log(
        '🚀 ~ SuspendUserControllerError.handle SuspendUserControllerError ->',
        SuspendUserControllerError
      )

      Sentry.captureException(SuspendUserControllerError)

      return response.status(this.internalServerError).send({
        status_code: this.internalServerError,
        status: ERROR,
        message: SOMETHING_WENT_WRONG,
      })
    }
  }
}
