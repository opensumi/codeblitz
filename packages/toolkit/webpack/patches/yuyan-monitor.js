const NOOP = () => {}
module.exports = class YuyanMonitor {
  config = NOOP;
  log = NOOP;
  logError = NOOP;
  logRequestError = NOOP;
}
