const prisma = require('../lib/prisma');

const createUser = async (userData) => {
    return await prisma.user.create({
        data: {
            name: userData.name,
            email: userData.email,
            password: userData.password
        },
    });
};

const getUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: { email: email },
    });
};

const getUserById = async (id) => {
    return await prisma.user.findUnique({
        where: { id: id },
    });
};

module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
};