import database from './datebase'
class TaskModel {
  constructor() {
    this.db = new database()
  }

  insertTask (connection, descripcion, titulo) {
    const query = `INSERT INTO tareas (titulo, descripcion) VALUES (?, ?)`
    return this.db.runQuery(connection, query, [titulo, descripcion])
  }

  allTask (connection) {
    const query = `SELECT *from tareas`
    return this.db.runQuery(connection, query)
  }

}

module.exports = TaskModel