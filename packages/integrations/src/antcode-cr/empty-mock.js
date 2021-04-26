module.exports = class {
  constructor() {}

  log() {
    console.log('yuyan log', ...arguments);
  }

  config() {
    console.log('yuyan config', ...arguments);
  }
};
