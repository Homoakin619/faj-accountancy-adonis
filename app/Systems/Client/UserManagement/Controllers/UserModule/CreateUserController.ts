import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserRequestValidator from '../../Validators/UserModule/UserRequestValidator'
import { ResponseBody } from 'App/Common/Helpers/ResponseStatement'
import { UserRegistrationInterface } from '../../TypeChecking/User/UserInterface'
import UserActions from '../../Actions/UserActions'
import Database from '@ioc:Adonis/Lucid/Database'
import CreateUserRecordOptions from '../../TypeChecking/User/CreateUserRecordOptions'

// import Sentry from '@ioc:Adonis/Addons/Sentry'

export default class CreateUserController {
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
  public async handle({ request, response }: HttpContextContract) {
    const dbTransaction = await Database.transaction()
    try {
      try {
        await request.validate(UserRequestValidator)
      } catch (validationError) {
          return response.status(this.status.ERROR).send(ResponseBody({
              body: [],
              status: this.status.ERROR,
              message: validationError.messages
          }))
      }

      const payload = <UserRegistrationInterface>request.body()
      const Options: CreateUserRecordOptions = {
        createPayload: payload,
        dbTransactionOptions: {
          dbTransaction, useTransaction: true
        }
      }
      const user = await UserActions.createUserRecord(Options);

      await dbTransaction.commit()

      return response.status(this.status.CREATED).send(ResponseBody({
          body: [user],
          message: "User created successfully",
          status: this.status.CREATED
      }))

    } catch (CreateUserControllerError) {
      
      await dbTransaction.rollback()
      console.log(
        '🚀 ~ CreateUserControllerError.handle CreateUserControllerError ->',
        CreateUserControllerError
      )

      // Sentry.captureException(CreateUserControllerError)

      return response.status(this.status.INTERNAL_SERVER_ERROR).send(ResponseBody({
        status: this.status.INTERNAL_SERVER_ERROR,
        message: JSON.stringify(CreateUserControllerError)
    }))
    }
  }
}
