const app = require('../app.js')
const chai = require('chai')
const chaiHttp = require('chai-http')
const request = require('supertest')

const expect = chai.expect

chai.use(chaiHttp)

// This test is broken right now. I need to write something that authenticates a user and saves credentials that runs before this test.
describe('GET /search', () => {
  it('should return 200 if authenticated', () => (
    chai.request(app)
      .get('/search?&track=despacito')
      .then((res) => {
        console.log(res)
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
