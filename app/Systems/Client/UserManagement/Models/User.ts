import { ManyToMany, beforeSave, column, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import AbstractModel from 'App/Common/Models/AbstractBaseModel'
import { DateTime } from 'luxon'
import Subscription from '../../Subscription/Models/Subscription'
import Hash from "@ioc:Adonis/Core/Hash"


export default class User extends AbstractModel {
  @column()
  public firstname: string

  @column()
  public lastname: string

  @column()
  public email: string

  @column({serializeAs: null}) 
  public password: string

  @column()
  public isAdmin: boolean;

  @column()
  public isActive: boolean

  @column.dateTime()
  public lastLogin: DateTime

  @manyToMany(() => Subscription,{
    pivotTable: "user_subscriptions",
    pivotTimestamps: true
  })
  public subscriptions: ManyToMany<typeof Subscription>

  @beforeSave()
  public static async hashPassword(user: User) {
    if(user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }
}
