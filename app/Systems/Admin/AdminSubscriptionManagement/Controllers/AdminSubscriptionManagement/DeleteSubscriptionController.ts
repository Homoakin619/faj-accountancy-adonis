import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import returnStatement from 'App/Common/Helpers/ResponseStatement';
import SubscriptionActions from 'App/Systems/Client/Subscription/Actions/SubscriptionActions';



// import Sentry from '@ioc:Adonis/Addons/Sentry'

export default class DeleteSubscriptionController {
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
  public async handle({ response, params }: HttpContextContract) {
    try {

      const id = <number>params.id
      await SubscriptionActions.deleteSubscription(id);
      
      return returnStatement({
          response,
          status: this.status.NO_CONTENT
      })

    } catch (DeleteSubscriptionControllerError) {
      console.log(
        '🚀 ~ DeleteSubscriptionControllerError.handle DeleteSubscriptionControllerError ->',
        DeleteSubscriptionControllerError
      )

      // Sentry.captureException(DeleteSubscriptionControllerError)

      return returnStatement({
        response,
        status:this.status.INTERNAL_SERVER_ERROR, 
        message:JSON.stringify(DeleteSubscriptionControllerError)})
    }
  }
}
