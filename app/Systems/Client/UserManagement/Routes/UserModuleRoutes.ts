import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post("/signup","CreateUserController")
  Route.post("/admin/signup","CreateAdminUserController")
  Route.post("/login","SigninUserController")
  Route.post("/logout","SignoutUserController").middleware('auth:api')
  })
.prefix('/api')
.namespace('App/Systems/Client/UserManagement/Controllers/UserModule')