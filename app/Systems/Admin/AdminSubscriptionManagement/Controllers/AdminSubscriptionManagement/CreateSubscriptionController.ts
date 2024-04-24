import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import returnStatement, { ResponseBody } from 'App/Common/Helpers/ResponseStatement'
import SubscriptionInterface from 'App/Systems/Client/Subscription/TypeChecking/Subscription/SubscriptionInterface'
import SubscriptionRequestValidator from 'App/Systems/Client/Subscription/Validators/Subscription/SubscriptionRequestValidator'
import SubscriptionActions from 'App/Systems/Client/Subscription/Actions/SubscriptionActions'
import Database from '@ioc:Adonis/Lucid/Database'
import CreateSubscriptionRecordOptions from 'App/Systems/Client/Subscription/TypeChecking/Subscription/CreateSubscriptionRecordOptions'

export default class CreateSubscriptionController {
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
  public async handle({ request,response }: HttpContextContract) {
    const dbTransaction = await Database.transaction()
    try {

      try {
        await request.validate(SubscriptionRequestValidator);

    } catch (validationError) {
        return response.status(this.status.ERROR).send(ResponseBody({
            message: validationError.messages,
            status: this.status.ERROR
        }))
    }

    const payload = <SubscriptionInterface> request.body();
    const Options: CreateSubscriptionRecordOptions = {
      createPayload: payload,
      dbTransactionOptions: {
        dbTransaction: dbTransaction,
        useTransaction: true
      }
    }
    const subscription = await SubscriptionActions.createSubscriptionRecord(Options);

    await dbTransaction.commit()
    
    return returnStatement({
        response, body:[subscription],
        status:this.status.CREATED, 
        message:"Subscription created successfully"})

    } catch (CreateSubscriptionControllerError) {

      await dbTransaction.rollback()
      console.log(
        '🚀 ~ CreateSubscriptionControllerError.handle CreateSubscriptionControllerError ->',
        CreateSubscriptionControllerError
      )

      // Sentry.captureException(CreateSubscriptionControllerError)

      return returnStatement({
        response,
        status:this.status.INTERNAL_SERVER_ERROR, 
        message:JSON.stringify(CreateSubscriptionControllerError)})
    }
  }
}
