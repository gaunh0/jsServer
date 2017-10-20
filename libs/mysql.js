
const schemaStore = {};

module.exports.model = function (table, schema) {
  schemaStore[table] = {};
  schemaStore[table].schema = [];
  schemaStore[table].foreignKey = {};

  for (let key in schema) {
    schemaStore[table].schema.push(key);
    if (schema[key].primaryKey) {
      schemaStore[table].primaryKey = key
    }
    if (schema[key].foreignKey) {
      schemaStore[table].foreignKey[schema[key].foreignKey] = key;
    }
  }
};

module.exports.schema = schemaStore;
