import PostInterface from 'App/Systems/Client/PostsManagement/TypeChecking/Post/PostInterface'
import CreateNewRecordGeneric from 'App/Common/TypeChecking/CreateNewRecordGeneric'


type CreatePostRecordOptions = CreateNewRecordGeneric<PostInterface>

export default CreatePostRecordOptions
