import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.post("/post/create","CreatePostController")
  Route.get("/post","GetAllPostController")
  Route.delete('/post/:id',"DeletePostController")
  Route.post('/post/:id/publish','PublishPostController')
  Route.post('/post/:id/unpublish','UnpublishPostController')
  })
.prefix('/api/admin')
.middleware(['auth:api','admin'])
.namespace('App/Systems/Admin/AdminPostManagement/Controllers/AdminPostManagement')