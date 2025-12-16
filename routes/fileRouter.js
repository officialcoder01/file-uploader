const { Router } = require('express');
const fileController = require('../controllers/fileController');
const { getFoldersByuserId } = require('../queries/folder');
const { getAllfilesByUserId } = require('../queries/file')

const router = Router();

router.get('/', async (req, res) => {
    try {
        const userId = req.user?.id || null;
        const files = userId ? await getAllfilesByUserId(userId) : [];
        res.render('file', { user: req.user, files });
    } catch (err) {
        console.error('Error getting files:', err);
        res.status(500).json({ errors: [{ msg: 'Error getting files' }] });
    }
})

router.get('/upload', async (req, res) => {
    try {
        const userId = req.user?.id || null;
        const folders = userId ? await getFoldersByuserId(userId) : [];
        const folderId = req.query.folderId || '';
        res.render('fileForm', { user: req.user, folders, folderId });
    } catch (err) {
        console.error('Error loading upload page:', err);
        res.status(500).json({ errors: [{ msg: 'Error loading upload page' }] });
    }
});
router.post('/upload', fileController.handleUpload);

router.get('/:fileId', fileController.getFileById);

router.get('/:fileId/download', fileController.downloadFileById);

router.post('/:fileId/delete', fileController.deleteFileById);

module.exports = router;