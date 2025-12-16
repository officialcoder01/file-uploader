const { body } = require('express-validator');
const query = require('../queries/folder');

const createFolder = [
    body('name').notEmpty().withMessage('Folder name is required'),
    async (req, res) => {
        const { name } = req.body;
        const userId = req.user.id;
        try {
            await query.createFolder({ name, userId });
            return res.redirect('/folders');
        } catch (error) {
            console.error('Error creating folder:', error);
            return res.status(500).json({ errors: [{ msg: 'Error creating folder' }] });
        }
    }
];

const getFolderById = async (req, res) => {
    const folderId = req.params.id;
    try {
        const folder = await query.getFolderById(folderId);
        if (!folder) {
            return res.status(404).json({ errors: [{ msg: 'Folder not found' }] });
        }
        return res.render('folderDetail', { user: req.user, folder });
    } catch (error) {
        console.error('Error fetching folder:', error);
        return res.status(500).json({ errors: [{ msg: 'Error fetching folder' }] });
    }
};

const updateFolderById = [
    body('name').notEmpty().withMessage('Folder name is required'),
    async (req, res) => {
        const folderId = req.params.id;
        const { name } = req.body;
        try {
            await query.updateFolderById(folderId, { name });
            return res.redirect('/folders');
        } catch (error) {
            console.error('Error updating folder:', error);
            return res.status(500).json({ errors: [{ msg: 'Error updating folder' }] });
        }
    }
]

const deleteFolderById = async (req, res) => {
    const folderId = req.params.folderId ?? req.params.id;

    if (!folderId) {
        return res.status(400).json({ errors: [{ msg: 'Folder ID is required' }] });
    }

    const id = Number(folderId);
    if (Number.isNaN(id)) {
        return res.status(400).json({ errors: [{ msg: 'Invalid Folder ID' }] });
    }
    try {
        await query.deleteFolderById(id);
        return res.redirect('/folders');
    } catch (error) {
        console.error('Error deleting folder:', error);
        return res.status(500).json({ errors: [{ msg: 'Error deleting folder' }] });
    }
};

module.exports = {
    createFolder,
    getFolderById,
    updateFolderById,
    deleteFolderById,
};