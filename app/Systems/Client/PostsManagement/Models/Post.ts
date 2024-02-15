import { BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Subscription from '../../Subscription/Models/Subscription'
import AbstractModel from 'App/Common/Models/AbstractBaseModel'



export default class Post extends AbstractModel {
  @column()
  public title: string

  @column()
  public description: string

  @column()
  public isPublished: boolean

  @column({serializeAs: null})
  public subscriptionId: number

  @column()
  public body: string | null

  @column()
  public images: string | null

  @column()
  public video: string | null

  @belongsTo(() => Subscription,{
    serializeAs: "subscription"
  })
  public subscription: BelongsTo<typeof Subscription>
}

