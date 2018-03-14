'use strict'

const debug = require('debug')('platziverse:db::setup')
const inquirer = require('inquirer')
const chalk = require('chalk')
const db = require('./')

const prompt = inquirer.createPromptModule()

async function setup () {
  const answer = await prompt([
    {
      type: 'confirm',
      name: 'setup',
      message: 'This will destroy your database, are you sure?'
    }
  ])

  if (!answer.setup) {
    return console.log('Nothing happened :)')
  }

  const config = {
    database: process.env.DB_NAME || 'platziverse',
    username: process.env.DB_USER || 'ronny',
    password: process.env.DB_PASS || 'ronny',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: s => debug(s),
    setup: true
  }

  await db(config).catch(handleFatalError)

  console.log('Success!')
  process.exit(0)
}

function handleFatalError (err) {
  console.error(`${chalk.red('[fatal error]')} ${err.message}`)
  console.error(err.stack)
  process.exit(1)
}

setup()

// module.exports = async function (config) {
//   const sequelize = setupDatabase(config)
//   const AgentModel = setupAgentModel(config)
//   const MetricModel = setupMetricModel(config)

//   AgentModel.hasMany(MetricModel)
//   MetricModel.belongsTo(AgentModel)

//   await sequelize.authenticate()

//   const Agent = {}
//   const Metric = {}

//   return {
//     Agent,
//     Metric
//   }
// }
