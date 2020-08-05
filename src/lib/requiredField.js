const { body } = require('express-validator');

module.exports = (field, msg = field) => {
  return body(field).custom((value) => {
    if (!value) {
      throw new Error(`${msg} tidak boleh kosong`);
    }
    return true;
  });
};
