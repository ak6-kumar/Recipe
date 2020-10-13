require('dotenv').config();

const { Keystone } = require('@keystonejs/keystone');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');
const { MongooseAdapter } = require('@keystonejs/adapter-mongoose');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { NextApp } = require('@keystonejs/app-next');
const { StaticApp } = require('@keystonejs/app-static');

const {
  User,
  ForgottenPasswordToken,
  customSchema,
  Dish,
  Recipe,
  Ingredient,
  RecipeRating,
  DishFav,
  RecipeFav,
  FeaturedRecipe,
  RecipeStep,
} = require('./schema');

const MEETUP = require('./meetupConfig');
const initialiseData = require('./initialData');

const keystone = new Keystone({
  adapter: new MongooseAdapter({ mongoUri: 'mongodb://localhost/meetup' }),
  onConnect: initialiseData,
});

keystone.createList('User', User);
keystone.createList('Dish', Dish);
keystone.createList('Recipe',Recipe);
keystone.createList('Ingredient',Ingredient);
keystone.createList('DishFav',DishFav);
keystone.createList('RecipeFav',RecipeFav);
keystone.createList('RecipeRating',RecipeRating);
keystone.createList('FeaturedRecipe',FeaturedRecipe);
keystone.createList('RecipeStep',RecipeStep);
keystone.createList('ForgottenPasswordToken', ForgottenPasswordToken);

keystone.extendGraphQLSchema(customSchema);

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: 'User',
});

const adminApp = new AdminUIApp({
  name: MEETUP.name,
  adminPath: '/admin',
  authStrategy,
  pages: [
    {
      label: 'Dish',
      children: ['Dish','Recipe','Ingredient','DishFav','RecipeFav'],
    },
    {
      label: 'People',
      children: ['User','FeaturedRecipe'],
    },
    {
      label:'Rating',
      children:['RecipeRating','RecipeStep'],
    },
  ],
});

module.exports = {
  keystone,
  apps: [new GraphQLApp(), adminApp, new NextApp({ dir: 'site' })],
};
