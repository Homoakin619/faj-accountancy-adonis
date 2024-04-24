import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import returnStatement from 'App/Common/Helpers/ResponseStatement';
import PostActions from 'App/Systems/Client/PostsManagement/Actions/PostActions';



// import Sentry from '@ioc:Adonis/Addons/Sentry'

export default class UnpublishPostController {
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

      const id = <number>params.id;
      const content = await PostActions.unpublishContent(id);
      
      return returnStatement({
          response, body: [{content: content!.id, title: content?.title}], 
          message: "Content unpublished successfully", 
          status: this.status.SUCCESS
      })

    } catch (UnpublishPostControllerError) {
      console.log(
        '🚀 ~ UnpublishPostControllerError.handle UnpublishPostControllerError ->',
        UnpublishPostControllerError
      )

      // Sentry.captureException(UnpublishPostControllerError)

      return returnStatement({
        response, message: JSON.stringify(UnpublishPostControllerError),
        status: this.status.INTERNAL_SERVER_ERROR
    })
    }
  }
}
