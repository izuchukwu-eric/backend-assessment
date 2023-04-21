const chai = require('chai')
const chaiHttp = require('chai-http')
const fs = require('fs')
const path = require('path')
const app = require('../../server.js').getApp()
const { describe, it } = require('mocha')

chai.use(chaiHttp)
const { expect } = chai

describe('Upload API', () => {
  it('should return an error when no zip is provided', async () => {
    const filePath = path.join('example.zip')
    const res = await chai.request(app)
      .post('/upload')
      .attach('uploaded-zip', fs.readFileSync(filePath), 'example.zip')
    expect(res).to.have.status(400)
    expect(res.body).to.have.property('error')
  })

  it('should return an error when no email file is uploaded', async () => {
    const res = await chai.request(app)
      .post('/upload')
      .field('email', 'test@example.com')
    expect(res).to.have.status(400)
    expect(res.body).to.have.property('error')
  })

  it('should successfully upload and extract a zip file', async () => {
    const filePath = path.join('example.zip')
    const res = await chai.request(app)
      .post('/upload')
      .field('email', 'test@example.com')
      .attach('uploaded-zip', fs.readFileSync(filePath), 'example.zip')
    expect(res).to.have.status(200)
    expect(res.body).to.have.property('fileCount', 4)
    expect(res.body).to.have.property('largestFile', path.resolve('app/aws/extracted/floor-plan.pdf'))
    expect(res.body).to.have.property('largestFileSize', 727957)
    expect(res.body).to.have.property('email', 'test@example.com')
  })
})
