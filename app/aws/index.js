'use strict'

const upload = require('./upload')

const express = require('express')
const multer = require('multer')

// Initialisation
const router = new express.Router()
const paths = {
  index: '/'
}

// setup multer middleware
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const uploadMulterMiddleware = multer({ storage })

// Routing
router.post('/upload', uploadMulterMiddleware.single('uploaded-zip'), upload)

// Export
module.exports = {
  router,
  paths
}
