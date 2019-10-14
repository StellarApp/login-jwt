const Sequelize = require('sequelize');
const { UUID, UUIDV4, STRING, ENUM } = Sequelize;
const conn = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/lca_db', {logging:false});

const User = conn.define('user', {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    primaryKey: true 
  },
  firstName: {
    type: STRING,
    allowNull: false,
  },
  lastName: {
    type: STRING,
    allowNull: false,
  },
  streetAddress1: {
    type: STRING,
    allowNull: false,
  },
  streetAddress2: {
    type: STRING,
    allowNull: false,
  },
  city: {
    type: STRING,
    allowNull: false,
  },
  zipCode: {
    type: STRING,
    allowNull: false,
    validate: {
      isNumeric: true
    }
  },
  state:{
    type: STRING,
    allowNull: false
  },
  country:{
    type: STRING,
    defaultValue: 'United States'
  },
  email: {
    type: STRING,
    allowNull: false,
    unique: true,
    validate: {
      len: {
        args: [6, 128],
        msg: "Email address must be between 6 and 128 characters in length"
      },
      isEmail: {
          msg: "Email address must be valid"
      }
    }
  },
  password: {
    type: STRING,
    allowNull: false
  },
  accountTypeDetail: {
    type: ENUM,
    values: ['CECONY','ORU'],
    allowNull: false
  }
});

const syncAndSeed = async()=> {
  await conn.sync({ force: false });
  const users = [
    { firstName: 'Stella', lastName: 'Kim' }
  ];
  const [stella] = await Promise.all(
      users.map( user => User.create({ 
        firstName: user.firstName,
        lastName: user.lastName,
        streetAddress1: '30 West 60th Street',
        streetAddress2: '707',
        city: 'New York',
        zipCode: 10001,
        state: 'NY',
        email: `${user.lastName}@gmail.com`, 
        password: user.lastName.toUpperCase(),
        accountTypeDetail: 'CECONY'
      }))
  );
};

module.exports = {
  models: {
    User
  },
  syncAndSeed
};

