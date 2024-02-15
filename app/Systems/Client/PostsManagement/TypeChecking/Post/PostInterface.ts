import { DateTime } from 'luxon'

export default interface PostInterface{
  title: string

  description: string

  body: string

  images: string

  video: string

  subscriptionId: number
  
  isPublished?: boolean

  createdAt?: DateTime

  updatedAt?: DateTime
}
