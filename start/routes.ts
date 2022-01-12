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
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { msg: 'Welcome to Bimbi Philips' }
})

Route.get('/api/v1', async () => {
  return { msg: 'Welcome to Bimbi Philips API' }
})

/*
              ================================================================================
                      Start Auth Routes: Signup, Signin, currentUser and logout Routes
              ================================================================================
*/

Route.group(() => {
  Route.group(() => {
    Route.post('/signup', 'AuthController.signup') // /api/v1/signup
    Route.post('/signin', 'AuthController.signin') // /api/v1/signin
    Route.get('/currentuser', 'AuthController.currentUser').middleware(['auth:api', 'isActive']) // /api/v1/currentuser
    Route.get('/logout', 'AuthController.logout').middleware('auth:api')
  }).prefix('/v1')
}).prefix('/api')

/*
              ================================================================================
                      End Auth Routes: Signup, Signin, currentUser and logout Routes
              ================================================================================
*/

/*
              ================================================================================
                      Start ProductCategory Routes: store, show,  and destroy Routes
              ================================================================================
*/

Route.group(() => {
  Route.group(() => {
    Route.post('/category', 'ProductCategoriesController.store').middleware(['auth:api', 'isActive'])
    Route.get('/category', 'ProductCategoriesController.show').middleware(['auth:api', 'isActive'])
    Route
      .get('/category/:uid', 'ProductCategoriesController.showByUid')
      .middleware(['auth:api', 'isActive'])
    Route.put('/category/:uid', 'ProductCategoriesController.update').middleware(['auth:api', 'isActive'])
    Route.delete('/category/:uid', 'ProductCategoriesController.destroy').middleware(['auth:api', 'isActive'])
  }).prefix('/v1')
}).prefix('/api')

/*
              ================================================================================
                      End ProductCategory Routes: store, show,  and destroy Routes
              ================================================================================
*/

/*
              ================================================================================
                      Start ProductsSubCategory Routes: store, show,  and destroy Routes
              ================================================================================
*/

Route.group(() => {
  Route.group(() => {
    Route.post('/sub-category', 'ProductSubCategoriesController.store').middleware(['auth:api', 'isActive'])
    Route.get('/sub-category', 'ProductSubCategoriesController.show').middleware(['auth:api', 'isActive'])
    Route
      .get('/sub-category/:uid', 'ProductSubCategoriesController.showByUid')
      .middleware(['auth:api', 'isActive'])
    Route.put('/sub-category/:uid', 'ProductSubCategoriesController.update').middleware(['auth:api', 'isActive'])
    Route.delete('/sub-category/:uid', 'ProductSubCategoriesController.destroy').middleware(['auth:api', 'isActive'])
  }).prefix('/v1')
}).prefix('/api')

/*
              ================================================================================
                      End ProductsSubCategory Routes: store, show,  and destroy Routes
              ================================================================================
*/

/*
              ================================================================================
                      Start Products Routes: store, show,  and destroy Routes 
              ================================================================================
*/

Route.group(() => {
  Route.group(() => {
    Route.post('/product', 'ProductsController.store').middleware(['auth:api', 'isActive'])
    Route.get('/product', 'ProductsController.show').middleware(['auth:api', 'isActive'])
    Route
      .get('/product/user', 'ProductsController.showByCurrentUser')
      .middleware(['auth:api', 'isActive'])
    Route
      .get('/product/:uid', 'ProductsController.showByUid')
      .middleware(['auth:api', 'isActive'])
    Route.put('/product/:uid', 'ProductsController.update').middleware(['auth:api', 'isActive'])
    Route.delete('/product/:uid', 'ProductsController.destroy').middleware(['auth:api', 'isActive'])
  }).prefix('/v1')
}).prefix('/api')

/*
              ================================================================================
                      End Products Routes: store, show,  and destroy Routes
              ================================================================================
*/
