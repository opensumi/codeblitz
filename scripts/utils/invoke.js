module.exports = async (fn) => {
  try {
    await fn();
  } catch (err) {
    console.error(err);
    process.exit(128);
  }
};
