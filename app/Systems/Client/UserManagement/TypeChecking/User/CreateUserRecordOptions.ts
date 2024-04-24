import UserInterface from 'App/Systems/Client/UserManagement/TypeChecking/User/UserInterface'
import CreateNewRecordGeneric from 'App/Common/TypeChecking/CreateNewRecordGeneric'


type CreateUserRecordPayload = Pick<UserInterface, 'firstname'|'lastname'|'email'|'password'>

type CreateUserRecordOptions = CreateNewRecordGeneric<CreateUserRecordPayload>

export default CreateUserRecordOptions
