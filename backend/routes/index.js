
require('dotenv').config()

const PORT = process.env.PORT

const server = () => {
    console.log('Server is running on port:', PORT);
}

server()