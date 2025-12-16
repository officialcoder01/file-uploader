// controllers/fileController.js
const multer = require('multer');
const { check, validationResult } = require('express-validator');
const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const query = require('../queries/file');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

const uploadToCloudinary = (buffer, mimetype, folder = null) => {
  const resourceType = mimetype && mimetype.startsWith('image/') ? 'image' : 'raw';
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        use_filename: true,
        unique_filename: true,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

const handleUpload = [
  upload.single('file'), // use same field name as your form
  check('file').custom((value, { req }) => {
    if (!req.file) {
      throw new Error('File is required');
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      throw new Error('Invalid file type. Only JPEG, PNG, GIF, PDF, DOCX, XLSX, and TXT are allowed.');
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxSize) {
      throw new Error('File size exceeds the 5MB limit.');
    }

    return true;
  }),
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const cleanBuffer = req.file ? req.file.buffer = null : null;
        return res.status(400).json({ errors: errors.array() });
      }

      if (!req.file) return res.status(400).send('No file uploaded.');

      // upload buffer to cloudinary
      const result = await uploadToCloudinary(req.file.buffer, req.file.mimetype, 'app_uploads');

      // build fileData for DB
      const fileData = {
        filename: req.file.originalname,
        size: req.file.size,
        mimetype: req.file.mimetype,
        cloudPublicId: result.public_id,
        cloudResourceType: result.resource_type,
        userId: req.user?.id,
        folderId: req.body.folderId ? parseInt(req.body.folderId, 10) : null,
      };

      const saved = await query.createFile(fileData);

      res.redirect('/files');
    } catch (err) {
      console.error(err);
      res.status(500).send('Upload failed');
    }
  },
];

const getFileById = async (req, res) => {
  const fileId = req.params.fileId ?? req.params.id;

  try {
    const file = await query.getFileById(fileId);
    if (!file) {
      return res.status(404).json({ errors: [{ msg: 'File not found' }] });
    }

    let previewUrl = null;

    if (file.cloudPublicId) {
      // IMAGE PREVIEW
      if (file.mimeType?.startsWith('image')) {
        previewUrl = cloudinary.url(file.cloudPublicId, {
          resource_type: 'image',
          secure: true,
          transformation: [
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        });
      }

      // PDF PREVIEW (inline, not attachment)
      if (file.mimeType?.includes('pdf')) {
        previewUrl = cloudinary.url(file.cloudPublicId, {
          resource_type: 'image',
          format: 'jpg',
          page: 1,
          secure: true,
        });
      }
    }

    res.render('fileDetail', {
      user: req.user,
      file: {
        ...file,
        previewUrl, // 👈 derived
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ errors: [{ msg: 'Error fetching file' }] });
  }
};

const downloadFileById = async (req, res) => {
  const fileId = req.params.fileId;

  const file = await query.getFileById(fileId);
  if (!file) return res.status(404).send('File not found');

  if (file.userId !== req.user.id) {
    return res.status(403).send('Forbidden');
  }

  const resourceType = file.cloudResourceType || (file.mimeType && file.mimeType?.startsWith('image/') ? 'image' : 'raw');

  const downloadUrl = cloudinary.url(file.cloudPublicId, {
    resource_type: resourceType,
    flags: 'attachment',
    secure: true,
  });

  return res.redirect(downloadUrl);
};

const deleteFileById = async (req, res) => {
    const fileId = req.params.fileId ?? req.params.id;

    try {
        await query.deleteFileById(fileId);
        res.redirect('/files');
    } catch (err) {
        console.error(err);
        res.status(500).send('Delete failed');
    }
};

module.exports = { 
  handleUpload,
  getFileById,
  downloadFileById,
  deleteFileById,
};