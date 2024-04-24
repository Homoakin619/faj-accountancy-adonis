type UserIdentifierOptions =
| {
      identifierType: 'id'
      identifier: number
    }
  | {
      identifierType: 'identifier'
      identifier: string
    }

export default UserIdentifierOptions
