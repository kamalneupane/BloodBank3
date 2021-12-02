const User = require('../models/user');
const dotenv = require('dotenv')

const connectDatabase = require('../config/database')

const user = require('../data/user')

// setting config file
dotenv.config({ path: 'config/config.env'})

connectDatabase();

const seedUser = async () => {
    try {

        await User.create(user);
        console.log('User created')
        process.exit()

    } catch (error) {
        
        console.log(error)
        process.exit()

    }
}
seedUser()