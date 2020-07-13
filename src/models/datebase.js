import mysql from 'mysql'
/* global process */

class database {
  constructor() {
    this.pool = mysql.createPool({
      //set env
      connectionLimit: 15,
      host: 'us-cdbr-east-02.cleardb.com',
      user: 'b29b7fa696af9a',
      password: 'bbc089e9',
      database: 'heroku_eee006e252ab492'
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