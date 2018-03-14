'use strict'

const debug = require('debug')('platziverse:db::setup')
const db = require('./lib')

async function setup () {
  const config = {
    database: process.env.DB_NAME || 'platziverse',
    username: process.env.DB_USER || 'ronny',
    password: process.env.DB_PASS || 'ronny',
    host: process.env.DB_HOST || 'localhost',
    logging: s => debug(s),
    setup: true
  }

  await db(config).catch(handleFatalError)

  console.log('Success!')
}

function handleFatalError (err) {
  console.error(err.message)
  console.error(err.stack)
  process.exit(1)
}

module.exports = async function (config) {
  const sequelize = setupDatabase(config)
  const AgentModel = setupAgentModel(config)
  const MetricModel = setupMetricModel(config)

  AgentModel.hasMany(MetricModel)
  MetricModel.belongsTo(AgentModel)

  await sequelize.authenticate()

  const Agent = {}
  const Metric = {}

  return {
    Agent,
    Metric
  }
}
