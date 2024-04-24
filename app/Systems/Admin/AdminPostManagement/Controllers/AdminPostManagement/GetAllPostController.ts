import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
// import Sentry from '@ioc:Adonis/Addons/Sentry'
import PostActions from 'App/Systems/Client/PostsManagement/Actions/PostActions'
import returnStatement from 'App/Common/Helpers/ResponseStatement'

export default class GetAllPostController {
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

      const contents = await PostActions.fetchAllContents();

      return returnStatement({
          response, body: [contents], 
          message: "Contents fetched successfully", 
          status: this.status.SUCCESS
      })

    } catch (GetAllPostControllerError) {
      console.log(
        '🚀 ~ GetAllPostControllerError.handle GetAllPostControllerError ->',
        GetAllPostControllerError
      )

      // Sentry.captureException(GetAllPostControllerError)

      return returnStatement({
        response, message: JSON.stringify(GetAllPostControllerError),
        status: this.status.INTERNAL_SERVER_ERROR
    })
    }
  }
}
