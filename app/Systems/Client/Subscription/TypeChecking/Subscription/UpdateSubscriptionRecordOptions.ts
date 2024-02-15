import UpdateRecordGeneric from 'App/Common/TypeChecking/GeneralPurpose/UpdateRecordGeneric'
import SubscriptionIdentifierOptions from 'App/Systems/Client/Subscription/TypeChecking/Subscription/SubscriptionIdentifierOptions'
import SubscriptionInterface from 'App/Systems/Client/Subscription/TypeChecking/Subscription/SubscriptionInterface'

type UpdateSubscriptionRecordPayload = Partial<SubscriptionInterface>

type UpdateSubscriptionRecordOptions = UpdateRecordGeneric<
  SubscriptionIdentifierOptions,
  UpdateSubscriptionRecordPayload
>

export default UpdateSubscriptionRecordOptions


