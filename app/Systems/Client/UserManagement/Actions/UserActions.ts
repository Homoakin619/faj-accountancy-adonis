import CreateUserRecordOptions from 'App/Systems/Client/UserManagement/TypeChecking/User/CreateUserRecordOptions'
import User from 'App/Systems/Client/UserManagement/Models/User'
import UserIdentifierOptions from 'App/Systems/Client/UserManagement/TypeChecking/User/UserIdentifierOptions'

// import UpdateUserRecordOptions from 'App/Systems/Client/UserManagement/TypeChecking/User/UpdateUserRecordOptions'

export default class UserActions {

  /**
   * @description Method to create a User record
   * @author CMMA-CLI
   * @static
   * @param {CreateUserRecordOptions} createUserRecordOptions
   * @returns {*}  {(Promise<User>)}
   * @memberof UserActions
   */
  public static async createUserRecord(
    createUserRecordOptions: CreateUserRecordOptions,
    isAdmin:boolean = false
  ): Promise<User> {
    const { createPayload, dbTransactionOptions } = createUserRecordOptions

    const user = new User()

    await user.fill(createPayload)

    if (dbTransactionOptions.useTransaction) {
      user.useTransaction(dbTransactionOptions.dbTransaction)
    }
    if (isAdmin) user.isAdmin = true;
    await user.save();
    return user;
  }

  

  /**
   * @description Method to get a User record by its primary key
   * @author CMMA-CLI
   * @static
   * @param {number} userId
   * @returns {*}  {(Promise<User | null>)}
   * @memberof UserActions
   */
  public static async getUserRecordById(userId: number) {
    return User.find(userId);
  }
  

  public static async getUserRecordByEmail(email: string) {
    return User.query().where("email",email).first();
  }

  /**
   * @description Method to get a User record by its identifier
   * @author CMMA-CLI
   * @static
   * @param {string} identifier
   * @returns {*}  {(Promise<User | null>)}
   * @memberof UserActions
   */
  private static async getUserRecordByIdentifier(identifier: string) {
    return User.query().where('identifier', identifier).first()
  }

  /**
   * @description Method to get a User Record
   * @author CMMA-CLI
   * @static
   * @param { UserIdentifierOptions} getUserOptions
   * @returns {*}  {(Promise<User | null>)}
   * @memberof UserActions
   */
  public static async getUserRecord(
    getUserOptions: UserIdentifierOptions
  ): Promise<User | null> {
    const { identifier, identifierType } = getUserOptions

    const GetUser: Record<string, () => Promise<User | null>> = {
      id: async () => await this.getUserRecordById(Number(identifier)),

      identifier: async () => await this.getUserRecordByIdentifier(String(identifier)),
    }

    return await GetUser[identifierType]()
  }

  /**
   * @description
   * @author CMMA-CLI
   * @static
   * @param {UpdateUserRecordOptions} updateUserRecordOptions
   * @returns {*}  {(Promise<User | null>)}
   * @memberof UserActions
   */
  // public static async updateUserRecord(updateUserRecordOptions: UpdateUserRecordOptions) {
  //   const { identifierOptions, updatePayload, dbTransactionOptions } = updateUserRecordOptions

  //   const user = await this.getUserRecord(identifierOptions)

  //   if (user === this.USER_RECORD_NOT_FOUND) return this.USER_RECORD_NOT_FOUND

  //   await user.merge(updatePayload)

  //   if (dbTransactionOptions.useTransaction) {
  //     user.useTransaction(dbTransactionOptions.dbTransaction)
  //   }

  //   return user.save()
  // }
}
