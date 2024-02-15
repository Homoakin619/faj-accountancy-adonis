import { DateTime } from 'luxon'

export default interface SubscriptionInterface{
  id?: number

  title: string

  createdAt?: DateTime

  updatedAt?: DateTime
}
