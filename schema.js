require('dotenv').config();
const { v4: uuid } = require('uuid');
const { sendEmail } = require('./emails');

const {
  Checkbox,
  DateTime,
  Integer,
  Password,
  Relationship,
  Select,
  Text,
  CalendarDay,
  File,
  Slug,
} = require('@keystonejs/fields');
const { Markdown } = require('@keystonejs/fields-markdown');
const { CloudinaryAdapter, LocalFileAdapter } = require('@keystonejs/file-adapters');
const { CloudinaryImage } = require('@keystonejs/fields-cloudinary-image');
const { Wysiwyg } = require('@keystonejs/fields-wysiwyg-tinymce');

const cloudinaryAdapter = new CloudinaryAdapter({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
});

const fileAdapter = new LocalFileAdapter({
  src:'site/public/static/src',
  path:'site/public/static/path'
});

const access = {
  userIsAdmin: ({ authentication: { item: user } }) => Boolean(user && user.isAdmin),
  userIsCurrentAuth: ({ authentication: { item: user } }) => Boolean(user), // item will be undefined for anonymous user
};

// Read: public / Write: admin
const DEFAULT_LIST_ACCESS = {
  create: access.userIsAdmin,
  read: true,
  update: access.userIsAdmin,
  delete: access.userIsAdmin,
};

exports.User = {
  access: {
    update: access.userIsCurrentAuth,
    delete: access.userIsAdmin,
  },
  fields: {
    name: { type: Text },
    email: { type: Text, isUnique: true, access: { read: access.userIsCurrentAuth } },
    password: { type: Password, isRequired: true },
    isAdmin: { type: Checkbox, access: { update: access.userIsAdmin } },
    twitterHandle: { type: Text },
    image: { type: CloudinaryImage, adapter: cloudinaryAdapter },
  },
  hooks: {
    afterChange: async ({ updatedItem, existingItem }) => {
      if (existingItem && updatedItem.password !== existingItem.password) {
        const url = process.env.SERVER_URL || 'http://localhost:3000';

        const props = {
          recipientEmail: updatedItem.email,
          signinUrl: `${url}/signin`,
        };

        const options = {
          subject: 'Your password has been updated',
          to: updatedItem,
          from: process.env.MAILGUN_FROM,
          domain: process.env.MAILGUN_DOMAIN,
          apiKey: process.env.MAILGUN_API_KEY,
        };

        await sendEmail('password-updated.jsx', props, options);
      }
    },
  },
};


exports.Dish = {
  access: DEFAULT_LIST_ACCESS,
  fields: {
    name:{type:Text},
    image:{type: CloudinaryImage,adapter: cloudinaryAdapter},
    des:{type:Text},
    type:{type:Text},
    recipe:{type:Relationship,ref:'Recipe',many:true}
  }
};

exports.DishFav = {
  access:{
    create:access.userIsCurrentAuth,
    read:true,
    update:access.userIsCurrentAuth,
    delete:access.userIsCurrentAuth
  },
  fields:{
    dish:{type:Relationship,ref:'Dish'},
    user:{type:Relationship,ref:'User'},
  }
};


exports.Recipe = {
  access:{
    create:access.userIsCurrentAuth,
    read:true,
    update:access.userIsCurrentAuth,
    delete:access.userIsCurrentAuth
  },
  fields:{
    title:{type:Text},
    des:{type:Text},
    dish:{type:Relationship,ref:'Dish',many:false},
    prep:{type:Relationship,ref:'RecipeStep',many:true},//react-code-mirror2
    submittedby:{type:Relationship,ref:'User'},
    url:{type:Slug,from:'title'},
    timeP:{type:Text},
    timeM:{type:Text},
    timeT:{type:Text},
    ingredient:{type:Relationship,ref:'Ingredient',many:false}  
  }
};


exports.RecipeStep = {
  access:{
    create:access.userIsCurrentAuth,
    read:true,
    update:access.userIsCurrentAuth,
    delete:access.userIsCurrentAuth
  },
  fields:{
    recipe:{type:Relationship,ref:'Recipe',many:false},
    stepno:{type:Integer},
    steps:{type:Text},
    image:{type:CloudinaryImage,adapter:cloudinaryAdapter},
  }
}

exports.RecipeFav = {
  access:{
    create:access.userIsCurrentAuth,
    read:true,
    update:access.userIsCurrentAuth,
    delete:access.userIsCurrentAuth
  },
  fields:{
    recipe:{type:Relationship,ref:'Recipe'},
    user:{type:Relationship,ref:'User'}
  }
};

exports.Ingredient = {
  access:{
    create:access.userIsCurrentAuth,
    read:true,
    update:access.userIsCurrentAuth,
    delete:access.userIsCurrentAuth
  },
  fields:{
    recipe:{type:Relationship,ref:'Recipe'},
    name:{type:Text},
    type:{type:Text}
  }
};


exports.RecipeRating = {
  access:{
    create:access.userIsCurrentAuth,
    read:true,
    update:access.userIsCurrentAuth,
    delete:access.userIsCurrentAuth
  },
  fields:{
    user:{type:Relationship,ref:'User'},
    recipe:{type:Relationship,ref:'Recipe'},
    ratingF:{type:Integer},
    ratingI:{type:Integer},
    ratingT:{type:Integer},
    ratingD:{type:Integer},
    ratingO:{type:Integer},
  }
}

exports.FeaturedRecipe = {
  access:{
    create:access.userIsAdmin,
    read:true,
    update:access.userIsAdmin,
    delete:access.userIsAdmin
  },
  fields:{
    dish:{type:Relationship,ref:'Dish'}
  }
}

exports.ForgottenPasswordToken = {
  access: {
    create: true,
    read: true,
    update: access.userIsAdmin,
    delete: access.userIsAdmin,
  },
  fields: {
    user: {
      type: Relationship,
      ref: 'User',
      access: {
        read: access.userIsAdmin,
      },
    },
    token: {
      type: Text,
      isRequired: true,
      isUnique: true,
      access: {
        read: access.userIsAdmin,
      },
    },
    requestedAt: { type: DateTime, isRequired: true },
    accessedAt: { type: DateTime },
    expiresAt: { type: DateTime, isRequired: true },
  },
  hooks: {
    afterChange: async ({ context, updatedItem, existingItem }) => {
      if (existingItem) return null;

      const now = new Date().toISOString();

      const { errors, data } = await context.executeGraphQL({
        context: context.createContext({ skipAccessControl: true }),
        query: `
        query GetUserAndToken($user: ID!, $now: DateTime!) {
          User( where: { id: $user }) {
            id
            email
          }
          allForgottenPasswordTokens( where: { user: { id: $user }, expiresAt_gte: $now }) {
            token
            expiresAt
          }
        }
      `,
        variables: { user: updatedItem.user.toString(), now },
      });

      if (errors) {
        console.error(errors, `Unable to construct password updated email.`);
        return;
      }

      const { allForgottenPasswordTokens, User } = data;
      const forgotPasswordKey = allForgottenPasswordTokens[0].token;
      const url = process.env.SERVER_URL || 'http://localhost:3000';

      const props = {
        forgotPasswordUrl: `${url}/change-password?key=${forgotPasswordKey}`,
        recipientEmail: User.email,
      };

      const options = {
        subject: 'Request for password reset',
        to: User.email,
        from: process.env.MAILGUN_FROM,
        domain: process.env.MAILGUN_DOMAIN,
        apiKey: process.env.MAILGUN_API_KEY,
      };

      await sendEmail('forgot-password.jsx', props, options);
    },
  },
};

exports.customSchema = {
  mutations: [
    {
      schema: 'startPasswordRecovery(email: String!): ForgottenPasswordToken',
      resolver: async (obj, { email }, context) => {
        const token = uuid();

        const tokenExpiration =
          parseInt(process.env.RESET_PASSWORD_TOKEN_EXPIRY) || 1000 * 60 * 60 * 24;

        const now = Date.now();
        const requestedAt = new Date(now).toISOString();
        const expiresAt = new Date(now + tokenExpiration).toISOString();

        const { errors: userErrors, data: userData } = await context.executeGraphQL({
          context: context.createContext({ skipAccessControl: true }),
          query: `
            query findUserByEmail($email: String!) {
              allUsers(where: { email: $email }) {
                id
                email
              }
            }
          `,
          variables: { email: email },
        });

        if (userErrors || !userData.allUsers || !userData.allUsers.length) {
          console.error(
            userErrors,
            `Unable to find user when trying to create forgotten password token.`
          );
          return;
        }

        const userId = userData.allUsers[0].id;

        const result = {
          userId,
          token,
          requestedAt,
          expiresAt,
        };

        const { errors } = await context.executeGraphQL({
          context: context.createContext({ skipAccessControl: true }),
          query: `
            mutation createForgottenPasswordToken(
              $userId: ID!,
              $token: String,
              $requestedAt: DateTime,
              $expiresAt: DateTime,
            ) {
              createForgottenPasswordToken(data: {
                user: { connect: { id: $userId }},
                token: $token,
                requestedAt: $requestedAt,
                expiresAt: $expiresAt,
              }) {
                id
                token
                user {
                  id
                }
                requestedAt
                expiresAt
              }
            }
          `,
          variables: result,
        });

        if (errors) {
          console.error(errors, `Unable to create forgotten password token.`);
          return;
        }

        return true;
      },
    },
    {
      schema: 'changePasswordWithToken(token: String!, password: String!): User',
      resolver: async (obj, { token, password }, context) => {
        const now = Date.now();

        const { errors, data } = await context.executeGraphQL({
          context: context.createContext({ skipAccessControl: true }),
          query: `
            query findUserFromToken($token: String!, $now: DateTime!) {
              passwordTokens: allForgottenPasswordTokens(where: { token: $token, expiresAt_gte: $now }) {
                id
                token
                user {
                  id
                }
              }
            }`,
          variables: { token, now },
        });

        if (errors || !data.passwordTokens || !data.passwordTokens.length) {
          console.error(errors, `Unable to find token`);
          throw errors.message;
        }

        const user = data.passwordTokens[0].user.id;
        const tokenId = data.passwordTokens[0].id;

        const { errors: passwordError } = await context.executeGraphQL({
          context: context.createContext({ skipAccessControl: true }),
          query: `mutation UpdateUserPassword($user: ID!, $password: String!) {
            updateUser(id: $user, data: { password: $password }) {
              id
            }
          }`,
          variables: { user, password },
        });

        if (passwordError) {
          console.error(passwordError, `Unable to change password`);
          throw passwordError.message;
        }

        await context.executeGraphQL({
          context: context.createContext({ skipAccessControl: true }),
          query: `mutation DeletePasswordToken($tokenId: ID!) {
            deleteForgottenPasswordToken(id: $tokenId) {
              id
            }
          }
        `,
          variables: { tokenId },
        });

        return true;
      },
    },
  ],
};