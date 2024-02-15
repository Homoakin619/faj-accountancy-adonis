import SubscriptionInterface from 'App/Systems/Client/Subscription/TypeChecking/Subscription/SubscriptionInterface'
import CreateNewRecordGeneric from 'App/Common/TypeChecking/CreateNewRecordGeneric'


type CreateSubscriptionRecordPayload = Pick<SubscriptionInterface, 'title'>

type CreateSubscriptionRecordOptions = CreateNewRecordGeneric<CreateSubscriptionRecordPayload>

export default CreateSubscriptionRecordOptions
