// @ts-check
const assert = require("assert");
const fs = require("fs");

const { select, insert, update, deleteDocuments } = require("sito-node-mysql");
const { toSlug } = require("../utils/parse");

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
    // if it has password (pw) and rPassword check if they are equal
    if (data.pw && data.rPassword) {
      if (data.pw !== data.rPassword)
        return { message: "passwords are not equal" };
      delete data.rPassword
    }
    // security name check
    {
      const { rows } = await select(this.collection, ["name"], {
        attribute: "name",
        operator: "=",
        value: data.name,
      });
      if (rows.length > 0) return { message: "name taken" };
    }
    // security user check
    const { rows } = await select("users", ["id", "user"], {
      attribute: "user",
      operator: "=",
      value: user,
    });
    assert(rows.length > 0, "the user shall exist");

    const attributes = ["id", ...Object.keys(data), "slugName"];
    const slugName = toSlug(data.user || data.title || data.name);
    if (!this.noDate) attributes.push("date");
    const toInsert = {
      ...data,
      slugName,
    };
    if (!this.noDate) toInsert.date = new Date().getTime();

    if (toInsert.photo) {
      try {
        const encoded = Buffer.from(
          toInsert.photo.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        );
        const extension = toInsert.photo.split(";")[0].split("/")[1];
        fs.writeFileSync(
          `./public/images/${this.collection}/${slugName}.${extension}`,
          encoded
        );
        toInsert.photo = `/images/${this.collection}/${slugName}.${extension}`;
      } catch (err) {
        console.error(err);
      }
    }
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
    // if it has password and rPassword check if they are equal
    if (data.password && data.rPassword) {
      if (data.password !== data.rPassword)
        return { message: "passwords are not equal" };
      delete data.rPassword
    }
    if (!query) assert(data.id !== undefined, "Data must have a string id");

    const { rows } = await select("users", ["id", "user"], {
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
    if (data.photo) {
      try {
        // updating photo
        // checking if it has a photo already
        const oldData = await select(this.collection, ["photo"], {
          attribute: "id",
          value: data.id,
          operator: "=",
        });
        const resultObj = oldData.rows[0];
        if (resultObj.photo !== data.photo) {
          if (resultObj.photo && resultObj.photo.length) {
            // deleting old photo if they are the same
            fs.rmSync(`./public${resultObj.photo}`);
          }
          // writing new photo
          const encoded = Buffer.from(
            data.photo.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
          );
          const extension = data.photo.split(";")[0].split("/")[1];
          fs.writeFileSync(
            `./public/images/${this.collection}/${data.name}.${extension}`,
            encoded
          );
          data.photo = `/images/${this.collection}/${data.name}.${extension}`;
        }
      } catch (err) {
        console.error(err);
      }
    }
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
    const { rows } = await select("users", ["id", "user"], {
      attribute: "user",
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
