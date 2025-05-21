// empty template
import db from "./dbController.js";

const tables = ["user", "product", "orders", "order_product"];

export const getAll = (dbname) => {
  const sql = `SELECT * FROM ${dbname} WHERE 1=1`;
  return db.prepare(sql).all();
};

export const getAllWithFilter = (dbname, filter) => {
  const sql = `SELECT * FROM ${dbname} WHERE ${Object.keys(filter)
    .map((key) => `${key} = ?`)
    .join(" AND ")}`;
  return db.prepare(sql).all(...Object.values(filter));
};

export const getOne = (dbname, field, value) => {
  const sql = `SELECT * FROM ${dbname} WHERE ${field} = ?`;
  return db.prepare(sql).get(value);
};

export const createOne = (dbname, data) => {
  const keys = Object.keys(data).join(",");
  const values = Object.values(data);
  const placeholders = Object.keys(data)
    .map(() => "?")
    .join(",");
  const sql = `INSERT INTO ${dbname} (${keys}) VALUES (${placeholders})`;
  return db.prepare(sql).run(...values);
};

export const updateOne = (dbname, id, data) => {
  const keys = Object.keys(data);
  const setClause = keys.map((key) => `${key} = ?`).join(", ");
  const values = Object.values(data);
  const tableIdMap = {
    user: "userid",
    product: "productid",
    orders: "orderid",
    order_product: "order_productid",
    payment: "paymentid",
    paymentCard: "cardid",
  };

  const idField = tableIdMap[dbname];
  const sql = `UPDATE ${dbname} SET ${setClause} WHERE ${idField} = ?`;
  return db.prepare(sql).run(...values, id);
};

export const updateOneWithFilter = (dbname, filter, data) => {
  const keys = Object.keys(data);
  const setClause = keys.map((key) => `${key} = ?`).join(", ");
  const values = Object.values(data);

  const sql = `UPDATE ${dbname} SET ${setClause} WHERE ${Object.keys(filter)
    .map((key) => `${key} = ?`)
    .join(" AND ")}`;
  return db.prepare(sql).run(...values, ...Object.values(filter));
};

export const deleteOneByFilter = (dbname, filter) => {
  const sql = `DELETE FROM ${dbname} WHERE ${Object.keys(filter)
    .map((key) => `${key} = ?`)
    .join(" AND ")}`;
  return db.prepare(sql).run(...Object.values(filter));
};

export const deleteOne = (dbname, id) => {
  const allowedTables = ["user", "product", "orders", "order_product"];

  if (!allowedTables.includes(dbname)) {
    throw new Error("Invalid table name");
  }

  const sql = `DELETE FROM ${dbname} WHERE ${dbname}id = ?`;
  return db.prepare(sql).run(id);
};
