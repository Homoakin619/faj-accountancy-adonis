import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
    Route.post("/subscription","CreateSubscriptionController")
    Route.get("/subscription","GetAllSubscriptionController")
    Route.get("/subscription/:id","GetSubscriptionController")
    Route.delete('/subscription/:id',"DeleteSubscriptionController")
    Route.post("/subscription/:id/user/:user_id","SubscribeUserController")
    Route.post("/subscription/unsubscribe/:id/user/:user_id","UnsubscribeUserController")
  })
.prefix('/api/admin')
.middleware(['auth:api','admin'])
.namespace('App/Systems/Admin/AdminSubscriptionManagement/Controllers/AdminSubscriptionManagement')