const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
require('dotenv').config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const createFolder = async (folderData) => {
    return await prisma.folder.create({
        data: {
            name: folderData.name,
            userId: folderData.userId
        },
    });
}

const getFoldersByuserId = async (userId) => {
    return await prisma.folder.findMany({
        where: { userId: userId },
    });
};

const getFolderById = async (folderId) => {
    return await prisma.folder.findUnique({
        where: { id: Number(folderId) },
        include: { files: true, user: true },
    });
};

const updateFolderById = async (folderId, updateData) => {
    return await prisma.folder.update({
        where: { id: Number(folderId) },
        data: updateData,
    });
}

const deleteFolderById = async (folderId) => {
    return await prisma.folder.delete({
        where: {
            id: Number(folderId),
        },
        include: { files: true },
    });
};

module.exports = {
    createFolder,
    getFoldersByuserId,
    getFolderById,
    updateFolderById,
    deleteFolderById,
};