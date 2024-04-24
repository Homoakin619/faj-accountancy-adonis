type PostIdentifierOptions =
| {
      identifierType: 'id'
      identifier: number
    }
  | {
      identifierType: 'identifier'
      identifier: string
    }

export default PostIdentifierOptions
