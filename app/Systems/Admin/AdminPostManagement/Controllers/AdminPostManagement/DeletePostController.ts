import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import Sentry from '@ioc:Adonis/Addons/Sentry'
import PostActions from 'App/Systems/Client/PostsManagement/Actions/PostActions'
import returnStatement from 'App/Common/Helpers/ResponseStatement'

export default class DeletePostController {
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

      const id = <number>params.id;
      await PostActions.deleteContent(id);
      
      return returnStatement({
          response, body: [], 
          message: "Content deleted successfully", 
          status: this.status.NO_CONTENT
      })

    } catch (DeletePostControllerError) {
      console.log(
        '🚀 ~ DeletePostControllerError.handle DeletePostControllerError ->',
        DeletePostControllerError
      )

      // Sentry.captureException(DeletePostControllerError)

      return returnStatement({
        response, message: JSON.stringify(DeletePostController),
        status: this.status.INTERNAL_SERVER_ERROR
    })
    }
  }
}
