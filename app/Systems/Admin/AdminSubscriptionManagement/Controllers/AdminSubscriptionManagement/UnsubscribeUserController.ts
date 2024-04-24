import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import returnStatement from 'App/Common/Helpers/ResponseStatement'
import SubscriptionActions from 'App/Systems/Client/Subscription/Actions/SubscriptionActions'

// import Sentry from '@ioc:Adonis/Addons/Sentry'

export default class UnsubscribeUserController {
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
  public async handle({ response,params }: HttpContextContract) {
    try {

      const {user_id: userId,id: subscriptionId} = params;
      const subscription = await SubscriptionActions.unsubscribeUser(userId,subscriptionId);
      
      return returnStatement({
          response, body: [subscription],
          message: "Subscription made successfully", 
          status: this.status.SUCCESS
      })
    } catch (UnsubscribeUserControllerError) {
      console.log(
        '🚀 ~ UnsubscribeUserControllerError.handle UnsubscribeUserControllerError ->',
        UnsubscribeUserControllerError
      )

      // Sentry.captureException(UnsubscribeUserControllerError)

      return returnStatement({
        response,
        status:this.status.INTERNAL_SERVER_ERROR, 
        message:JSON.stringify(UnsubscribeUserControllerError)})
    }
  }
}
