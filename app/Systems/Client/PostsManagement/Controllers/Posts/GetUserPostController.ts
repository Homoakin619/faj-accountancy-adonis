import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import returnStatement from 'App/Common/Helpers/ResponseStatement'
import PostActions from '../../Actions/PostActions'
import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'

export default class GetUserPostController {
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
  public async handle({ response,params,auth }: HttpContextContract) {
    try {
      
      const user = auth.user;
      const content = await PostActions.fetchUserContent(params.id,user!)
      
      if (!content) {
          return returnStatement({
              response, body: [], 
              message: "Content not available for user, kindly subscribe to gain access", 
              status: this.status.NOT_FOUND
          })
      }
      
      return returnStatement({
          response, body: [content], 
          message: "Content fetched successfully", 
          status: this.status.SUCCESS
      })

    } catch (GetUserPostControllerError) {
      console.log(
        '🚀 ~ GetUserPostControllerError.handle GetUserPostControllerError ->',
        GetUserPostControllerError
      )

      // Sentry.captureException(GetUserPostControllerError)

      return returnStatement({
        response, message: JSON.stringify(GetUserPostControllerError),
        status: this.status.INTERNAL_SERVER_ERROR
    })
    }
  }
}
