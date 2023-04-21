const fs = require('fs')
const unzipper = require('unzipper')
const path = require('path')

const upload = async (req, res) => {
  try {
    // TODO: Complete code here

    // check if zippedFile and email is provided
    if (!req.file) {
      return res.status(400).json({ error: 'No zip file uploaded' })
    }
    if (!req.body.email) {
      return res.status(400).json({ error: 'No email provided' })
    }

    const extractDir = path.join(__dirname, '/extracted/')
    fs.mkdirSync(extractDir, { recursive: true })

    await fs.createReadStream(req.file.filename)
      .on('error', (err) => {
        console.error(err)
        return res.status(500).json({ error: 'Error reading zip file' })
      })
      .pipe(unzipper.Extract({ path: extractDir }))
      .promise()

    const files = []
    const walk = (dir) => {
      const filesInDir = fs.readdirSync(dir)
      for (const file of filesInDir) {
        const filePath = path.join(dir, file)
        if (fs.statSync(filePath).isDirectory()) {
          walk(filePath)
        } else {
          files.push(filePath)
        }
      }
    }
    walk(extractDir)

    if (files.length === 0) {
      throw new Error('No files found in zip archive')
    }

    let largestFile = ''
    let largestFileSize = 0
    for (const file of files) {
      const fileSize = fs.statSync(file).size
      if (fileSize > largestFileSize) {
        largestFileSize = fileSize
        largestFile = file.replace(`${extractDir}${path.sep}`, '')
      }
    }

    return res.status(200).json({
      fileCount: files.length,
      largestFile,
      largestFileSize,
      email: req.body.email
    })
  } catch (err) {
    console.error(err)

    if (err.message === 'No files found in zip archive') {
      return res.status(400).json({ error: 'Zip archive contains no files' })
    }

    res.sendStatus(500).json({ error: 'Server error' })
  }
}

module.exports = upload
