import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  Route.get('/content/:id',"GetAllUserPostController")
  Route.get('/content/',"GetUserPostController")
  })
.prefix('/api')
.namespace('App/Systems/Client/PostsManagement/Controllers/Posts')