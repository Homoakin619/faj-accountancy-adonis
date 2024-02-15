/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'
import HttpStatusCodeEnum from 'App/Common/Helpers/HttpStatusCodeEnum'
import  { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"

Route.get('/', async ({ view }) => {
  return view.render('welcome')
})

Route.get("/unauthorized",({response}: HttpContextContract) => {
  return response.status(HttpStatusCodeEnum.UNAUTHORIZED_REQUEST).send({
    body: [],
    message: "Unauthorized Request",
    status: HttpStatusCodeEnum.UNAUTHORIZED_REQUEST
  })
})

import 'App/Systems/ProjectRoutes'
