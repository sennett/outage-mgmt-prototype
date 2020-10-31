module.exports = async () => {
  await global.db.destroy()
}
