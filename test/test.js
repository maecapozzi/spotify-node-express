const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app.js')

const expect = chai.expect

chai.use(chaiHttp)

describe('GET /auth/spotify', () => {
  it('should return 200', () => (
    chai.request(app)
      .get('/auth/spotify')
      .then((res) => {
        expect(res).to.have.status(200)
      })
      .catch((err) => {
        throw err
      })
  ))
})

describe('GET /callback', () => {
  it('should return 200', () => (
    chai.request(app)
      .get('/search?&track=despacito')
      .then((res) => {
        expect(res).to.have.status(200)
      })
      .catch((err) => {
        throw err
      })
  ))
})

describe('GET /search', () => {
  it('should return 200 if authenticated', () => (
    chai.request(app)
      .get('/search?&track=despacito')
      .then((res) => {
        expect(res).to.have.status(200)
      })
      .catch((err) => {
        throw err
      })
  ))
})

describe('GET /analyze/:id', () => {
  it('should return 200', () => (
    chai.request(app)
      .get('/analyze/0sNOF9WDwhWunNAHPD3Baj')
      .then((res) => {
        expect(res).to.have.status(200)
      })
      .catch((err) => {
        throw err
      })
  ))
})
