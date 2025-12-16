const prisma = require('../lib/prisma');

const createFile = async (fileData) => {
    return await prisma.file.create({
        data: {
            name: fileData.filename,
            size: fileData.size,
            mimeType: fileData.mimetype,
            cloudPublicId: fileData.cloudPublicId,
            cloudResourceType: fileData.cloudResourceType,
            userId: fileData.userId,
            folderId: fileData.folderId || null,
        },
    });
};

const getAllfilesByUserId = async (userId) => {
    return await prisma.file.findMany({
        where: { 
            userId: userId,
         },
         include: { folder: true },
    });
};

const getFileById = async (fileId) => {
    return await prisma.file.findUnique({
        where: { id: Number(fileId) },
        include: { folder: true, user: true },
    });
};

const deleteFileById = async (fileId) => {
    return await prisma.file.delete({
        where: { id: Number(fileId) },
    });
};

module.exports = {
    createFile,
    getAllfilesByUserId,
    getFileById,
    deleteFileById,
};