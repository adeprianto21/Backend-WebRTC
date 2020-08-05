const { body } = require('express-validator');

module.exports = (field, msg = field) => {
  return body(field).custom((value) => {
    if (/\s+/.test(value)) {
      throw new Error(`${msg} tidak boleh menggunakan spasi`);
    }
    return true;
  });
};
