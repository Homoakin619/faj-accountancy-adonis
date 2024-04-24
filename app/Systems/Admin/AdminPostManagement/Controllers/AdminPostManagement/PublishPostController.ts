import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PostActions from 'App/Systems/Client/PostsManagement/Actions/PostActions';
import returnStatement from 'App/Common/Helpers/ResponseStatement';



// import Sentry from '@ioc:Adonis/Addons/Sentry'

export default class PublishPostController {
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
      const content = await PostActions.publishContent(id);
      
      return returnStatement({
          response, body: [{content: content!.id, title: content?.title}], 
          message: "Content published successfully", 
          status: this.status.SUCCESS
      })
    } catch (PublishPostControllerError) {
      console.log(
        '🚀 ~ PublishPostControllerError.handle PublishPostControllerError ->',
        PublishPostControllerError
      )

      // Sentry.captureException(PublishPostControllerError)

      return returnStatement({
        response, message: JSON.stringify(PublishPostControllerError),
        status: this.status.INTERNAL_SERVER_ERROR
    })
    }
  }
}
