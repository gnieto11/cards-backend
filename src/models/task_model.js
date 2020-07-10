import database from './datebase'
class TaskModel {
  constructor() {
    this.db = new database()
  }

  insertTask (connection, descripcion, titulo, id_usuario) {
    const query = `INSERT INTO tareas (titulo, descripcion, id_usuario) VALUES (?, ?, ?)`
    return this.db.runQuery(connection, query, [titulo, descripcion, id_usuario])
  }

  allTask (connection, userId) {
    const query = `SELECT *FROM tareas WHERE completado = 1 AND id_usuario = ?`
    return this.db.runQuery(connection, query, [userId])
  }

  updateTask(connection, descripcion, titulo, id) {
    const query = `UPDATE tareas SET titulo = ?, descripcion = ? WHERE id = ?`
    return this.db.runQuery(connection, query, [titulo, descripcion, id])
  }

  deleteTaskById (connection, id) {
    const query = `UPDATE tareas SET completado = 0 WHERE id = ?`
    return this.db.runQuery(connection, query, [id])
  }

}

module.exports = TaskModel