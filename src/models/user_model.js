import database from './datebase'
class UserModel {
  constructor() {
    this.db = new database()
  }

  getUser (connection, email) {
    const query = `SELECT *FROM usuarios WHERE email = ?`
    return this.db.runQuery(connection, query,[email])
  }

  createUser (connection, params) {
    const query =  `INSERT INTO usuarios (nombre, apellido, password, email) VALUES (?, ?, ?, ?)`
    return this.db.runQuery(connection, query, [
      params.nombre,
      params.apellido,
      params.encryptedPassword,
      params.email
    ])
  }
  userData (connection) {
    const query = `SELECT *FROM usuarios`
    return this.db.runQuery(connection, query)
  }
}

module.exports = UserModel