import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PostInterface from 'App/Systems/Client/PostsManagement/TypeChecking/Post/PostInterface'
import returnStatement from 'App/Common/Helpers/ResponseStatement'
import PostRequestValidator from 'App/Systems/Client/PostsManagement/Validators/Posts/PostRequestValidator'
import PostActions from 'App/Systems/Client/PostsManagement/Actions/PostActions'
import Database from '@ioc:Adonis/Lucid/Database'
import CreateNewRecordGeneric from 'App/Common/TypeChecking/CreateNewRecordGeneric'

// import Sentry from '@ioc:Adonis/Addons/Sentry'

export default class CreatePostController {
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
  public async handle({ response,request }: HttpContextContract) {
    const dbTransaction = await Database.transaction()
    try {

      try {
        await request.validate(PostRequestValidator)

      } catch (validationError) {
          return returnStatement({
              response, message: validationError.messages,
              status: this.status.ERROR 
          })
      }

      const payload = <PostInterface>request.body();
      const Options : CreateNewRecordGeneric<PostInterface> = {
          createPayload: payload,
          dbTransactionOptions: {
            dbTransaction: dbTransaction,
            useTransaction: true
          }
          
      }
      const content = await PostActions.createPostRecord(Options);
      
      return returnStatement({
          response, body: [content], 
          message: "Content created successfully", 
          status: this.status.SUCCESS
      })

    } catch (PostControllerError) {
      console.log(
        '🚀 ~ PostControllerError.handle PostControllerError ->',
        PostControllerError
      )

      // Sentry.captureException(PostControllerError)

      return returnStatement({
        response, message: JSON.stringify(PostControllerError),
        status: this.status.INTERNAL_SERVER_ERROR
    })
    }
  }
}
