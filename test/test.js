const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app.js')

const expect = chai.expect

chai.use(chaiHttp)

describe('GET /', () => {
  it('should return HTML', () => (
    chai.request(app)
      .get('/')
      .then((res) => {
        expect(res).to.have.status(200)
        expect(res).to.be.html
      })
      .catch((err) => {
        throw err
      })
  ))
})

describe('GET /login', () => {
  it('should return 200', () => (
    chai.request(app)
      .get('/login')
      .then((res) => {
        expect(res).to.have.status(200)
      })
      .catch((err) => {
        throw err
      })
  ))
})

describe('GET /search', () => {
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

describe('GET /callback', () => {
  it('should return 200', () => (
    chai.request(app)
      .get('/callback')
      .then((res) => {
        expect(res).to.have.status(200)
      })
      .catch((err) => {
        throw err
      })
  ))
})

describe('GET /refresh_token', () => {
  it('should return 200', () => (
    chai.request(app)
      .get('/refresh_token')
      .then((res) => {
        expect(res).to.have.status(200)
      })
      .catch((err) => {
        throw err
      })
  ))
})
