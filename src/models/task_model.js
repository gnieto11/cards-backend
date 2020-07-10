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
    const query = `SELECT *FROM tareas WHERE completado = 1`
    return this.db.runQuery(connection, query)
  }

  updateTask(connection, descripcion, titulo, id) {
    const query = `UPDATE tareas SET titulo = ?, descripcion = ? WHERE id = ?`
    return this.db.runQuery(connection, query, [titulo, descripcion, id])
  }

}

module.exports = TaskModel