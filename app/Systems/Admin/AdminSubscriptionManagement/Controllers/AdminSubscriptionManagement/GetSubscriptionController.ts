import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import returnStatement from 'App/Common/Helpers/ResponseStatement';
import SubscriptionActions from 'App/Systems/Client/Subscription/Actions/SubscriptionActions';


// import Sentry from '@ioc:Adonis/Addons/Sentry'

export default class GetSubscriptionController {
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
      const subscription = await SubscriptionActions.getSubscriptionRecordById(id);
      
      return returnStatement({
          response, body: [subscription],
          message: "Subscription fetched successfully", 
          status: this.status.SUCCESS
      })

    } catch (GetSubscriptionControllerError) {
      console.log(
        '🚀 ~ GetSubscriptionControllerError.handle GetSubscriptionControllerError ->',
        GetSubscriptionControllerError
      )

      // Sentry.captureException(GetSubscriptionControllerError)

      return returnStatement({
        response,
        status:this.status.INTERNAL_SERVER_ERROR, 
        message:JSON.stringify(GetSubscriptionControllerError)})
    }
  }
}
