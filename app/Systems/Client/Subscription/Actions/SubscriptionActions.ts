import CreateSubscriptionRecordOptions from 'App/Systems/Client/Subscription/TypeChecking/Subscription/CreateSubscriptionRecordOptions'
import Subscription from 'App/Systems/Client/Subscription/Models/Subscription'
import SubscriptionIdentifierOptions from 'App/Systems/Client/Subscription/TypeChecking/Subscription/SubscriptionIdentifierOptions'
import UpdateSubscriptionRecordOptions from 'App/Systems/Client/Subscription/TypeChecking/Subscription/UpdateSubscriptionRecordOptions'
import User from '../../UserManagement/Models/User'

export default class SubscriptionActions {

  /**
   * @description Method to create a Subscription record
   * @author CMMA-CLI
   * @static
   * @param {CreateSubscriptionRecordOptions} createSubscriptionRecordOptions
   * @returns {*}  {(Promise<Subscription>)}
   * @memberof SubscriptionActions
   */
  public static async createSubscriptionRecord(
    createSubscriptionRecordOptions: CreateSubscriptionRecordOptions
  ): Promise<Subscription> {
    const { createPayload, dbTransactionOptions } = createSubscriptionRecordOptions

    const subscription = new Subscription()

    await subscription.fill(createPayload)

    if (dbTransactionOptions.useTransaction) {
      subscription.useTransaction(dbTransactionOptions.dbTransaction)
    }

    await subscription.save()
    return subscription
  }


  public static async deleteSubscription(subscription_id: number) {
    const subscription = await this.getSubscriptionRecordById(subscription_id);
    await subscription!.delete()
    return null 
  }


  public static async getAllSubscriptions() {
    const subscriptions = await Subscription.query();

    return subscriptions;
  }


  public static async subscribeUser(userId: number, subscriptionId: number) {
    const user = await User.find(userId);
    const subscriptionExists = await user?.related('subscriptions')
                                        .query()
                                        .where('subscription_id',subscriptionId)
                                        .first();

    if (!subscriptionExists) user!.related('subscriptions').attach([subscriptionId])
    
    return user;
}

  public static async unsubscribeUser(userId: number, subscriptionId: number) {
      const user = await User.find(userId);
      const subscriptionExists = await user?.related('subscriptions')
                                          .query()
                                          .where('subscription_id',subscriptionId)
                                          .first();

      if(subscriptionExists) user!.related('subscriptions').detach([subscriptionId])
      return user;
  }


  /**
   * @description Method to get a Subscription record by its primary key
   * @author CMMA-CLI
   * @static
   * @param {number} subscriptionId
   * @returns {*}  {(Promise<Subscription | null>)}
   * @memberof SubscriptionActions
   */
  public static async getSubscriptionRecordById(subscriptionId: number) {
    return Subscription.find(subscriptionId);
  }

  /**
   * @description Method to get a Subscription record by its identifier
   * @author CMMA-CLI
   * @static
   * @param {string} identifier
   * @returns {*}  {(Promise<Subscription | null>)}
   * @memberof SubscriptionActions
   */
  private static async getSubscriptionRecordByIdentifier(identifier: string) {
    return Subscription.query().where('identifier', identifier).first()
  }

  /**
   * @description Method to get a Subscription Record
   * @author CMMA-CLI
   * @static
   * @param { SubscriptionIdentifierOptions} getSubscriptionOptions
   * @returns {*}  {(Promise<Subscription | null>)}
   * @memberof SubscriptionActions
   */
  public static async getSubscriptionRecord(
    getSubscriptionOptions: SubscriptionIdentifierOptions
  ): Promise<Subscription | null> {
    const { identifier, identifierType } = getSubscriptionOptions

    const GetSubscription: Record<string, () => Promise<Subscription | null>> = {
      id: async () => await this.getSubscriptionRecordById(Number(identifier)),

      identifier: async () => await this.getSubscriptionRecordByIdentifier(String(identifier)),
    }

    return await GetSubscription[identifierType]()
  }

  /**
   * @description
   * @author CMMA-CLI
   * @static
   * @param {UpdateSubscriptionRecordOptions} updateSubscriptionRecordOptions
   * @returns {*}  {(Promise<Subscription | null>)}
   * @memberof SubscriptionActions
   */
  public static async updateSubscriptionRecord(updateSubscriptionRecordOptions: UpdateSubscriptionRecordOptions) {
    const { identifierOptions, updatePayload, dbTransactionOptions } = updateSubscriptionRecordOptions

    const subscription = await this.getSubscriptionRecord(identifierOptions)

    if (!subscription) return null

    await subscription.merge(updatePayload)

    if (dbTransactionOptions.useTransaction) {
      subscription.useTransaction(dbTransactionOptions.dbTransaction)
    }

    return subscription.save()
  }
}
