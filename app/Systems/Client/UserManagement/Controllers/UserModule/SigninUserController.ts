import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserSignInValidator from '../../Validators/UserModule/UserSignInValidator'
import returnStatement, { ResponseBody } from 'App/Common/Helpers/ResponseStatement'
import Hash from "@ioc:Adonis/Core/Hash"
import UserActions from '../../Actions/UserActions'
import { UserLoginInterface } from '../../TypeChecking/User/UserInterface'
import { DateTime } from 'luxon'


// import Sentry from '@ioc:Adonis/Addons/Sentry'


export default class SigninUserController {
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
  public async handle({ request, response, auth }: HttpContextContract) {
    try {

      try {
        await request.validate(UserSignInValidator)
      } catch (validationError) {

          return response.status(this.status.ERROR).send(ResponseBody({
              body: [],
              status: this.status.ERROR,
              message: validationError.messages
          }))
      }
      const {email,password} = <UserLoginInterface>request.body();
      const user = await UserActions.getUserRecordByEmail(email)
      if (!user) {
          return response.status(this.status.NOT_FOUND).send(ResponseBody({
              message: "Invalid Credentials",
              status: this.status.NOT_FOUND
          }))
      }

      const passwordMatch = await Hash.verify(user.password,password);
      if (!passwordMatch) {
          return response.status(this.status.UNAUTHORIZED_REQUEST).send(ResponseBody({
              message: "Invalid Credentials",
              status: this.status.UNAUTHORIZED_REQUEST
          }))
      }
      user.isActive = true;
      user.lastLogin = DateTime.now()
      await user.save()

      const token = await auth.use('api').generate(user);
      return returnStatement({
          response, body: [{
              id: user.id,
              token
          }],
          status: this.status.SUCCESS,
          message: "user login successful",
      })
      
    } catch (SigninUserControllerError) {
      console.log(
        '🚀 ~ SigninUserControllerError.handle SigninUserControllerError ->',
        SigninUserControllerError
      )

      // Sentry.captureException(SigninUserControllerError)

      return response.status(this.status.INTERNAL_SERVER_ERROR).send({
        body: [],
        message: JSON.stringify(SigninUserControllerError),
        status: this.status.INTERNAL_SERVER_ERROR
    })
    }
  }
}
