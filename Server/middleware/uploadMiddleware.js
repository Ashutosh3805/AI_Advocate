import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Resolve uploads directory inside current Server folder
const uploadDir = './uploads';

// Verify uploads directory exists; if not, create it
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique name: timestamp + original filename extension
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// Multer File Validation Filters
const fileFilter = (req, file, cb) => {
  const filetypes = /pdf/;
  const mimetype = file.mimetype === 'application/pdf';
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Invalid file type. Secure Legal Terminal only supports PDF (.pdf) documents.'));
};

// Expose Multer instance
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter,
});

export default upload;
