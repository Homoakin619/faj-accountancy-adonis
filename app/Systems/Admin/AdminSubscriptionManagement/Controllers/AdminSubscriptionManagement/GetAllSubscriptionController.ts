import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

// import Sentry from '@ioc:Adonis/Addons/Sentry'
import returnStatement from 'App/Common/Helpers/ResponseStatement'
import SubscriptionActions from 'App/Systems/Client/Subscription/Actions/SubscriptionActions'

export default class GetAllSubscriptionController {
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
  public async handle({ response }: HttpContextContract) {
    try {

      const subscriptions = await SubscriptionActions.getAllSubscriptions();
            
      return returnStatement({
          response, body: [subscriptions],
          message: "Subscription fetched successfully", 
          status: this.status.SUCCESS
      })

    } catch (GetAllSubscriptionControllerError) {
      console.log(
        '🚀 ~ GetAllSubscriptionControllerError.handle GetAllSubscriptionControllerError ->',
        GetAllSubscriptionControllerError
      )

      // Sentry.captureException(GetAllSubscriptionControllerError)

      return returnStatement({
        response,
        status:this.status.INTERNAL_SERVER_ERROR, 
        message:JSON.stringify(GetAllSubscriptionControllerError)})
    }
  }
}
