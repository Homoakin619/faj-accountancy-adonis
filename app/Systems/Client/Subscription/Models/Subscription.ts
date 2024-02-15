
import { HasOne, ManyToMany, column, hasOne, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from '../../UserManagement/Models/User'
import Post from '../../PostsManagement/Models/Post'
import AbstractModel from 'App/Common/Models/AbstractBaseModel'



export default class Subscription extends AbstractModel {
  @column()
  public title: string


  @hasOne(() => Post)
  public content: HasOne<typeof Post>

  @manyToMany(() => User,{
    pivotTable: "user_subscriptions",
    pivotTimestamps: true
  })
  public subscriptions: ManyToMany<typeof User>

}

