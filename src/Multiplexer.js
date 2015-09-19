import Emitter from 'events'

export default class Multiplexer extends Emitter {
  static DEFAULTS = {
    // Interval in ms "drain" will be periodically emitted.
    duration: 200
  }

  constructor(options) {
    super()
    this.options = {...Multiplexer.DEFAULTS, ...options}
    this.buffer = []
  }

  /**
   * Start periodically drain.
   *
   * @api public
   */
  start() {
    // Make sure we can't run 2 intervals.
    this.stop()
    this.intervalId = setInterval(::this.drain, this.options.duration)
    return this
  }

  /**
   * Stop periodically drain.
   *
   * @api public
   */
  stop() {
    clearInterval(this.intervalId)
    return this
  }

  /**
   * Get buffer.
   *
   * @api public
   */
  get() {
    return this.buffer
  }

  /**
   * Add data to the buffer.
   *
   * @api public
   */
  add(data) {
    if (Array.isArray(data)) {
      this.buffer.push.apply(this.buffer, data)
      return this
    }
    this.buffer.push(data)
    return this
  }

  /**
   * Reset buffer.
   *
   * @api public
   */
  reset() {
    this.buffer = []
    return this
  }

  /**
   * Destroy multiplexer.
   *
   * @api public
   */
  destroy() {
    this.stop()
    this.removeAllListeners()
    return this
  }

  /**
   * Reset and emit "drain".
   *
   * @api private
   */
  drain() {
    let {buffer} = this
    if (!buffer.length) return
    this.reset()
    this.emit('drain', buffer)
  }
}
