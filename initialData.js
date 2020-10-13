require('dotenv').config();
const { createItems } = require('@keystonejs/server-side-graphql-client');

// Lets not hardcode password, even for test data
const password = process.env.INITIAL_DATA_PASSWORD;
const PASSWORD_MIN_LENGTH = 8;

// You can force a re-init in development with the RECREATE_DATABASE
// environment variable.
const shouldRecreateDatabase = () =>
  process.env.NODE_ENV !== 'production' && process.env.RECREATE_DATABASE;

const validatePassword = () => {
  if (!password) {
    throw new Error(`To seed initial data, set the 'INITIAL_DATA_PASSWORD' environment variable`);
  } else if (password.length < PASSWORD_MIN_LENGTH) {
    throw new Error(
      `To seed initial data, the 'INITIAL_DATA_PASSWORD' environment variable must be at least ${PASSWORD_MIN_LENGTH} characters`
    );
  }
};

module.exports = async keystone => {
  // Check the users list to see if there are any; if we find none, assume
  // it's a new database and initialise the demo data set.
  const users = await keystone.lists.User.adapter.findAll();
  if (!users.length || shouldRecreateDatabase()) {
    // Ensure a valid initial password is available to be used
    validatePassword();
    // Drop the connected database to ensure no existing collections remain
    await Promise.all(Object.values(keystone.adapters).map(adapter => adapter.dropDatabase()));
    console.log('💾 Creating initial data...');
    await seedData(initialData, keystone);
  }
};

async function seedData(initialData, keystone) {
  /* 1. Insert the data which has no associated relationships
   * 2. Insert the data with the required relationships using connect
   */

  const users = await createItems({
    keystone,
    listKey: 'User',
    items: initialData['User'].map(x => ({ data: x })),
    // name field is required for connect query for setting up Organiser list
    returnFields: 'id, name',
  });
}



const initialData = {
  User: [
    { name: 'Admin User', email: 'admin@keystonejs.com', isAdmin: true, password },
    {name:'Normal User', email: 'user@keystonejs.com', isAdmin: false, password},
    ],
};
