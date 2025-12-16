const { Router } = require('express');
const folderController = require('../controllers/folderController');
const folderQuery = require('../queries/folder');

const router = Router();

router.get('/', async (req, res) => {
    const userId = req.user ? req.user.id : null;
    const folders = req.user ? await folderQuery.getFoldersByuserId(userId) : [];
    res.render('folder', { user: req.user, folders });
});

router.get('/new', (req, res) => {
    res.render('folderForm', { user: req.user });
});
router.post('/new', folderController.createFolder);

router.get('/:id', folderController.getFolderById);

router.get('/:id/edit', async (req, res) => {
    const folderId = req.params.id;
    const folder = await folderQuery.getFolderById(folderId);
    res.render('folderEdit', { user: req.user, folderId, folder });
});
router.post('/:id/edit', folderController.updateFolderById);

router.post('/:id/delete', folderController.deleteFolderById)

module.exports = router;