type SubscriptionIdentifierOptions =
| {
      identifierType: 'id'
      identifier: number
    }
  | {
      identifierType: 'identifier'
      identifier: string
    }

export default SubscriptionIdentifierOptions
