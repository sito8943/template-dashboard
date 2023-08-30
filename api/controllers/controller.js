// @ts-check
const assert = require("assert");
const fs = require("fs");

const { select, insert, update, deleteDocuments } = require("sito-node-mysql");

class Controller {
  /**
   *
   * @param {string} collection
   * @param {boolean} noDate
   * @param {string} remote
   * @param {object} remoteParams
   */
  constructor(collection, noDate = false, remote = "", remoteParams = {}) {
    this.collection = collection;
    this.noDate = noDate;
    this.remote = remote;
    this.remoteParams = remoteParams;
  }

  /**
   * @param {number} start
   * @param {number} end
   * @param {string[]} attributes
   * @param {any} query
   */
  async list(
    attributes = [],
    query = undefined,
    start = 0,
    end = 0,
    orderBy = "date"
  ) {
    const data = await select(
      this.collection,
      attributes,
      query,
      start,
      end,
      orderBy
    );
    return { list: data.rows };
  }

  /**
   * @param {string} user
   * @param {object} data
   */
  async create(user, data) {
    const { rows } = await select("users", ["id"], {
      attribute: "id",
      operator: "=",
      value: user,
    });
    assert(rows.length > 0, "the user shall exist");
    const attributes = ["id", ...Object.keys(data)];
    if (!this.noDate) attributes.push("date");
    const toInsert = {
      ...data,
    };
    if (!this.noDate) toInsert.date = new Date().getTime();
    const id = await insert(this.collection, attributes, toInsert);
    await insert("logs", ["id", "idUser", "date", "operation", "observation"], {
      idUser: rows[0].id,
      date: new Date().getTime(),
      operation: `created ${this.collection}`,
      observation: id,
    });
    return { id };
  }

  /**
   * @param {string} user
   * @param {object} data
   * @param {object} query
   */
  async update(user, data, query) {
    if (!query) assert(data.id !== undefined, "Data must have a string id");

    const { rows } = await select("users", ["id"], {
      attribute: "user",
      operator: "=",
      value: user,
    });
    assert(rows.length > 0, "the user shall exist");
    const attributes = [...Object.keys(data).filter((key) => key !== "id")];
    if (!this.noDate) attributes.push("date");
    const toUpdate = { ...data };
    if (!this.noDate) toUpdate.date = new Date().getTime();
    let result;
    if (query)
      result = await update(this.collection, attributes, toUpdate, query);
    else
      result = await update(this.collection, attributes, toUpdate, {
        attribute: "id",
        operator: "=",
        value: data.id,
      });

    if (query)
      await insert(
        "logs",
        ["id", "idUser", "date", "operation", "observation"],
        {
          idUser: rows[0].id,
          date: new Date().getTime(),
          operation: `updated ${this.collection}`,
          observation: `${query.attribute} ${query.value}`,
        }
      );
    else
      await insert(
        "logs",
        ["id", "idUser", "date", "operation", "observation"],
        {
          idUser: rows[0].id,
          date: new Date().getTime(),
          operation: `updated ${this.collection}`,
          observation: data.id,
        }
      );
    return { status: 200, data: { ...result } };
  }

  /**
   *
   * @param {string} user
   * @param {string[]} ids
   * @returns
   */
  async remove(user, ids) {
    assert(ids.length > 0, "at least one element must be deleted");
    const { rows } = await select("users", ["id"], {
      attribute: "id",
      operator: "=",
      value: user,
    });
    assert(rows.length > 0, "the user shall exist");
    // seeking for images to delete
    for (const item of ids) {
      const response = await select(this.collection, [], {
        attribute: "id",
        operator: "=",
        value: item,
      });
      const data = response.rows[0];
      try {
        if (data.photo) fs.rmSync(`./public${data.photo}`);
        if (data.photoDisplay) fs.rmSync(`./public${data.photoDisplay}`);
      } catch (err) {
        console.error(err);
        await insert("errors", ["id", "error", "idUser", "date"], {
          error: String(err),
          idUser: rows[0].id,
          date: String(new Date().getTime()),
        });
      }
      await deleteDocuments(this.collection, {
        attribute: "id",
        operator: "=",
        value: item,
      });
    }
    await insert("logs", ["id", "idUser", "date", "operation", "observation"], {
      idUser: rows[0].id,
      date: new Date().getTime(),
      operation: `delete ${this.collection}`,
      observation: ids.toString(),
    });
    return { message: "ok" };
  }
}

module.exports = Controller;
