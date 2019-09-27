'use strict'

const Promise = require('bluebird')
const amqplib = require('amqplib')
const shortid = require('shortid')
const lodash = require('lodash')


const ERROR_CODE = {
  NORMAL: 500,
  TIMEOUT: 510
}

module.exports = class RabbitMQ {

  constructor({connectionString, rpcTimeout}) {
    this.connectionString = connectionString || 'amqp://localhost'
    this.channel = null
    this._initChannel()
    this.rpcCallbackQueue = null
    this.callbacks = {}
    this.rpcTimeout = rpcTimeout || 10000
    this.timeCallbacks = {}
    this.intervalLog = {}
  }

  publish({channel, topic, data}) {
    if (!channel) return Promise.reject('channel not found')
    
    // console.log('PUBLISH rabbit: ', channel, topic, JSON.stringify(data));
    (this.channel ? Promise.resolve.bind(this) : this._initChannel.bind(this))()
      .then(() => {
        this.channel.assertExchange(channel, 'topic', {durable: true})
        // console.log('PUBLISH rabbit: ', channel, topic, JSON.stringify(data));
        return this.channel.publish(channel, topic, Buffer.from(JSON.stringify(data)))
      })
      .catch(e => {
        e && console.error('rabbit publish error')
        this._onError(e)
        return Promise.reject(e)
      })
  }
}