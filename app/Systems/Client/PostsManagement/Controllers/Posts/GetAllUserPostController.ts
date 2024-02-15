import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import returnStatement from 'App/Common/Helpers/ResponseStatement'
import PostActions from '../../Actions/PostActions';
// import { ERROR, SUCCESS, SOMETHING_WENT_WRONG } from 'App/Common/Helpers/Messages/SystemMessages'
// import Sentry from '@ioc:Adonis/Addons/Sentry'

export default class GetAllUserPostController {
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
  public async handle({ response,auth }: HttpContextContract) {
    try {
      const user = auth.user;
      const subscriptions = await user!.related('subscriptions').query();            
      const contents = await PostActions.fetchUserContents(subscriptions)

      return returnStatement({
        response, body: [contents],
        status: this.status.SUCCESS,
        message:"Contents fetched successfully",
      })

    } catch (GetAllUserPostControllerError) {
      console.log(
        '🚀 ~ GetAllUserPostControllerError.handle GetAllUserPostControllerError ->',
        GetAllUserPostControllerError
      )

      // Sentry.captureException(GetAllUserPostControllerError)

      return returnStatement({
        response, message: JSON.stringify(GetAllUserPostControllerError),
        status: this.status.INTERNAL_SERVER_ERROR
    })
    }
  }
}
