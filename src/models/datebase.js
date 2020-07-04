import mysql from 'mysql'

class database {
  constructor() {
    this.pool = mysql.createPool({
      connectionLimit: 15,
      host: 'localhost',
      user: 'root',
      password: 'ROOT',
      database: 'sasuke'
    })
  }

  parseResults(result) {
    return JSON.parse(JSON.stringify(result))
  }

  establishConnection ()  {
    return new Promise ((resolve, reject) => {
      this.pool.getConnection((error, connection) => {
        if (error) {
          return reject(error)
        } else {
          return resolve(connection)
        }
      })
    })
  }

  runQuery (connection, query, params = []) {
    return new Promise((resolve, reject) => {
      connection.query(query, params, (err, rows) => {
        if (!err) {
          resolve(this.parseResults(rows))
        } else {
          console.log(err)
          connection.destroy()
          reject(err)
        }
      })
    })
  }

  endConnection(connection) {
    connection.destroy()
  }
}

module.exports = database