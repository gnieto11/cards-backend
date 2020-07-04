import database from './datebase'
class UserModel {
  constructor() {
    this.db = new database()
  }

  getUser (connection, document) {
    const query = `SELECT *FROM usuarios WHERE documento = ?`
    return this.db.runQuery(connection, query,[document])
  }

  getUserByEmail (connection, email) {
    const query = `SELECT *FROM usuarios WHERE email = ?`
    return this.db.runQuery(connection, query,[email])
  }

  createUser (connection, params) {
    const query =  `INSERT INTO usuarios (nombre, apellido, documento, password, email) VALUES (?, ?, ?, ?, ?)`
    return this.db.runQuery(connection, query, [
      params.name,
      params.lastName,
      params.document,
      params.encryptedPassword,
      params.email
    ])
  }
}

module.exports = UserModel