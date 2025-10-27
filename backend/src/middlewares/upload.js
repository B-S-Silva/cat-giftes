import multer from 'multer'
import path from 'path'
import fs from 'fs'

const uploadDir = path.join(process.cwd(), 'backend', 'uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname)
    const name = path.basename(file.originalname, ext)
    cb(null, `${Date.now()}-${name}${ext}`)
  },
})

function fileFilter(_req, file, cb) {
  if (/^image\/(png|jpe?g|gif|webp)$/i.test(file.mimetype)) cb(null, true)
  else cb(new Error('Unsupported file type'), false)
}

export const upload = multer({ storage, fileFilter })