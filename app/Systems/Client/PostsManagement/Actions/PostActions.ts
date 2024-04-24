// import { NULL_OBJECT } from 'App/Common/Helpers/Messages/SystemMessages'
import CreatePostRecordOptions from 'App/Systems/Client/PostsManagement/TypeChecking/Post/CreatePostRecordOptions'
import Post from 'App/Systems/Client/PostsManagement/Models/Post'
import PostIdentifierOptions from 'App/Systems/Client/PostsManagement/TypeChecking/Post/PostIdentifierOptions'
import User from '../../UserManagement/Models/User'
import Subscription from '../../Subscription/Models/Subscription'

export default class PostActions {

  /**
   * @description Method to create a Post record
   * @author CMMA-CLI
   * @static
   * @param {CreatePostRecordOptions} createPostRecordOptions
   * @returns {*}  {(Promise<Post>)}
   * @memberof PostActions
   */
  public static async createPostRecord(
    createPostRecordOptions: CreatePostRecordOptions
  ) {
    const { createPayload, dbTransactionOptions } = createPostRecordOptions

    const post = new Post()

    post.fill(createPayload)

    if (dbTransactionOptions.useTransaction) {
      post.useTransaction(dbTransactionOptions.dbTransaction)
    }
      console.log(post.subscriptionId)
     await post.save()

     post.load('subscription');
     return post
  }


  public static async fetchAllContents() {
    return Post.query().preload('subscription')
    
  }


  public static async fetchUserContent(postId: number,user: User) {
        
    const content = await this.getPostRecordById(postId)
    const usersubscriptions = (await user.related('subscriptions').query()).map(subscripton => subscripton.id);          
    
    if (usersubscriptions.includes(content!.subscriptionId)) {
        return content;
    } 
    return null 
}


  public static async fetchUserContents(subscriptions: Subscription[]) {
    let contents: Post[] = []
    for (let subscription of subscriptions) {
        let  content = await subscription.related('content').query().first();
        contents.push(content!)
    }
    
    return contents;
  }


  public static async publishContent(postId: number) {
    const query = await Post.query().where("id",postId).first()
    query!.isPublished = true;
    query!.save()
    return query;
}


  public static async unpublishContent(postId: number) {
    const query = await Post.query().where("id",postId).first()
    query!.isPublished = false;
    query!.save()
    return query;
  }


  public static async deleteContent(postId: number) {
    const content = await Post.query().where("id",postId).first();
    await content!.delete();
    return null
  }


  /**
   * @description Method to get a Post record by its primary key
   * @author CMMA-CLI
   * @static
   * @param {number} postId
   * @returns {*}  {(Promise<Post | null>)}
   * @memberof PostActions
   */
  private static async getPostRecordById(postId: number) {
    return Post.find(postId)
  }

  /**
   * @description Method to get a Post record by its identifier
   * @author CMMA-CLI
   * @static
   * @param {string} identifier
   * @returns {*}  {(Promise<Post | null>)}
   * @memberof PostActions
   */
  private static async getPostRecordByIdentifier(identifier: string) {
    return Post.query().where('identifier', identifier).first()
  }

  /**
   * @description Method to get a Post Record
   * @author CMMA-CLI
   * @static
   * @param { PostIdentifierOptions} getPostOptions
   * @returns {*}  {(Promise<Post | null>)}
   * @memberof PostActions
   */
  public static async getPostRecord(
    getPostOptions: PostIdentifierOptions
  ): Promise<Post | null> {
    const { identifier, identifierType } = getPostOptions

    const GetPost: Record<string, () => Promise<Post | null>> = {
      id: async () => await this.getPostRecordById(Number(identifier)),

      identifier: async () => await this.getPostRecordByIdentifier(String(identifier)),
    }

    return await GetPost[identifierType]()
  }

  /**
   * @description
   * @author CMMA-CLI
   * @static
   * @param {UpdatePostRecordOptions} updatePostRecordOptions
   * @returns {*}  {(Promise<Post | null>)}
   * @memberof PostActions
   */
  // public static async updatePostRecord(updatePostRecordOptions: UpdatePostRecordOptions) {
  //   const { identifierOptions, updatePayload, dbTransactionOptions } = updatePostRecordOptions

  //   const post = await this.getPostRecord(identifierOptions)

  //   // if (post === this.POST_RECORD_NOT_FOUND) return this.POST_RECORD_NOT_FOUND

  //   await post!.merge(updatePayload)

  //   if (dbTransactionOptions.useTransaction) {
  //     post!.useTransaction(dbTransactionOptions.dbTransaction)
  //   }

  //   return post!.save()
  // }
}
