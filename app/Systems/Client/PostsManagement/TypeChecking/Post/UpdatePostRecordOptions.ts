import UpdateRecordGeneric from 'App/Common/TypeChecking/GeneralPurpose/UpdateRecordGeneric'
import PostIdentifierOptions from 'App/Systems/Client/PostsManagement/TypeChecking/Post/PostIdentifierOptions'
import PostInterface from 'App/Systems/Client/PostsManagement/TypeChecking/Post/PostInterface'

type UpdatePostRecordPayload = Partial<PostInterface>

type UpdatePostRecordOptions = UpdateRecordGeneric<
  PostIdentifierOptions,
  UpdatePostRecordPayload
>

export default UpdatePostRecordOptions


