const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'XXX',
  password: 'XXX',
  port: 5432
})

const getVisitor = (request, response) => {
  pool.query(
    'SELECT * FROM visitors ORDER BY user_id ASC',
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    }
  )
}

const getVisitorById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query(
    'SELECT * FROM visitors WHERE user_id = $1',
    [id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    }
  )
}

// Get question text
const getQuestionsByStand = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query(
    'SELECT * FROM questions WHERE stand = $1',
    [id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    }
  )
}

// Get question text
const getQuestionsenByStand = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query(
    'SELECT * FROM questionsen WHERE stand = $1',
    [id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    }
  )
}

const createVisitor = (request, response) => {
  const { agreement, test_usr, tablet_num } = request.body
  var d = new Date()
  console.log(request.body)
  pool.query(
    'INSERT INTO visitors (agreement, test_usr, tablet_num, time_stamp) VALUES ($1, $2, $3, $4) RETURNING *',
    [
      agreement,
      test_usr,
      parseInt(tablet_num.substr(tablet_num.length - 6)),
      d
    ],
    (error, results) => {
      if (error) {
        throw error
      } else if (!Array.isArray(results.rows) || results.rows.length < 1) {
        throw error
      }
      console.log(results)
      response.status(201).send(results.rows[0])
    }
  )
}

const createAnswer = (request, response) => {
  const { value, stand_num, question_num, user_id } = request.body
  console.log(request.body)
  var d = new Date()
  try {
    pool.query(
      'INSERT INTO answers (value, stand_num, question_num, user_id, time_stamp) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [value, parseInt(stand_num), question_num, parseInt(user_id), d],
      (error, results) => {
        if (error) {
          throw error
        } else if (!Array.isArray(results.rows) || results.rows.length < 1) {
          throw error
        }
        response.status(201).send(`Answer added with ID: ${results.rows[0].id}`)
      }
    )
  } catch (error) {
    response.status('201').send(error)
  }
}

const updateVisitor = (request, response) => {
  const id = parseInt(request.params.id)
  const {
    misc1,
    misc2,
    misc3,
    misc4,
    misc5,
    misc6,
    misc7,
    misc8,
    misc9,
    misca,
    miscb,
    miscc
  } = request.body

  pool.query(
    'UPDATE visitors SET misc1 = $1,misc2 = $2,misc3 = $3,misc4 = $4,misc5 = $5,misc6 = $6,misc7 = $7,misc8 = $8,misc9 = $9,misca = $10,miscb = $11,miscc =$12,  WHERE id = $13 RETURNING *',
    [
      misc1,
      misc2,
      misc3,
      misc4,
      misc5,
      misc6,
      misc7,
      misc8,
      misc9,
      misca,
      miscb,
      miscc,
      id
    ],
    (error, results) => {
      if (error) {
        throw error
      }
      if (typeof results.rows == 'undefined') {
        response.status(404).send(`Resource not found`)
      } else if (Array.isArray(results.rows) && results.rows.length < 1) {
        response.status(404).send(`User not found`)
      } else {
        response
          .status(200)
          .send(`User modified with ID: ${results.rows[0].id}`)
      }
    }
  )
}

const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with ID: ${id}`)
  })
}

module.exports = {
  createAnswer,
  getVisitor,
  getVisitorById,
  createVisitor,
  updateVisitor,
  deleteUser,
  getQuestionsByStand,
  getQuestionsenByStand
}
