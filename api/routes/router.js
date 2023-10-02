var express = require("express");
const fs = require("fs");

const { insert } = require("sito-node-mysql");

const Controller = require("../controllers/controller");

class Router {
  /**
   *
   * @param {string} user
   * @param {object} err
   * @returns
   */
  static async throwError(user, err) {
    console.error(err);
    await insert("errors", ["id", "error", "user", "date"], {
      error: err,
      user,
      date: new Date().getTime(),
    });
    return { status: 500, data: { message: err } };
  }

  /**
   *
   * @param {string} collection
   * @param {any[]} middleware
   * @param {string[]} initials
   * @param {string} remote
   * @param {object} remoteParams

   */
  constructor(
    collection,
    middleware,
    initials = ["insert", "list", "update", "delete"],
    noDate = false,
    remote = "",
    remoteParams = {}
  ) {
    const [insert, update, list, remove] = initials;
    this.collection = collection;
    this.controller = new Controller(collection, noDate, remote, remoteParams);
    this.router = express.Router();
    if (insert !== undefined || initials === "CRUD") {
      // adding shortcut to controller
      this.create = this.controller.create;
      this.router.post("/insert", middleware, async (req, res) => {
        console.info(`saving ${collection}`);
        const { user, data } = req.body;
        try {
          const result = await this.controller.create(user, data);
          console.info(`${collection} created successfully`);
          res.status(200).send({ ...result });
        } catch (err) {
          console.error(err);
          const error = await Router.throwError(
            user,
            `error saving element of ${collection}, user: ${user}`
          );
          res.status(error.status).send(error.data);
        }
      });
    }
    if (update !== undefined || initials === "CRUD") {
      // adding shortcut to controller
      this.update = this.controller.update;
      this.router.post("/update", middleware, async (req, res) => {
        console.info(`saving ${collection}`);
        const { user, data, query } = req.body;
        try {
          if (data.photo && data.photo.length) {
            try {
              const encoded = Buffer.from(
                data.photo.replace(/^data:image\/\w+;base64,/, ""),
                "base64"
              );
              const extension = data.photo.split(";")[0].split("/")[1];
              if (extension !== "images") {
                fs.writeFileSync(
                  `./public/images/${this.collection}/${
                    data.id || query.value
                  }-photo.${extension}`,
                  encoded
                );
                data.photo = `/images/${this.collection}/${
                  data.id || query.value
                }-photo.${extension}`;
              }
            } catch (err) {
              console.error(err);
            }
          }

          const result = await this.controller.update(user, data, query);

          console.info(`${collection} updated successfully`);
          res.status(200).send({ ...result });
        } catch (err) {
          console.error(err);
          const error = await Router.throwError(
            user,
            `error updating element of ${collection}, user: ${user} item ${data.id}`
          );
          res.status(error.status).send(error.data);
        }
      });
    }
    if (remove !== undefined || initials === "CRUD") {
      // adding shortcut to controller
      this.remove = this.controller.remove;
      this.router.post("/delete", middleware, async (req, res) => {
        console.info(`deleting ${collection}`);
        const { user, ids } = req.body;
        try {
          const result = await this.controller.remove(user, ids);
          console.info(`${collection} deleted successfully`);
          res.status(200).send({ ...result });
        } catch (err) {
          console.error(err);
          const error = await Router.throwError(
            user,
            `error deleting elements of ${collection}, user: ${user}, items: ${ids.toString()}`
          );
          res.status(error.status).send(error.data);
        }
      });
    }
    if (list !== undefined || initials === "CRUD") {
      // adding shortcut to controller
      this.list = this.controller.list;
      this.router.get("/list", async (req, res) => {
        console.info(`listing ${collection}`);
        const { lang } = req.body;
        try {
          const result = await this.controller.list(
            ["id", "name", "description", "photo"],
            query,
            page,
            count,
            orderBy
          );
          console.info(
            `${result.list ? result.list.length : 0} retrieved successfully`
          );
          res.status(200).send({ ...result });
        } catch (err) {
          console.error(err);
          const error = await Router.throwError(
            user,
            `error listing elements of ${collection}, user: ${user}`
          );
          res.status(error.status).send(error.data);
        }
      });
      this.router.post("/list", middleware, async (req, res) => {
        console.info(`listing ${collection}`);
        const { user, attributes, query, page, count, orderBy } = req.body;
        try {
          const result = await this.controller.list(
            attributes,
            query,
            page,
            count,
            orderBy
          );
          console.info(
            `${result.list ? result.list.length : 0} retrieved successfully`
          );
          res.status(200).send({ ...result });
        } catch (err) {
          console.error(err);
          const error = await Router.throwError(
            user,
            `error listing elements of ${collection}, user: ${user}`
          );
          res.status(error.status).send(error.data);
        }
      });
    }
  }

  addRoute(route, method, middleware, callback) {
    switch (method) {
      case "POST":
        this.router.post(route, middleware, callback);
        break;
      default: // get
        this.router.get(route, middleware, callback);
        break;
    }
    // for call function without a route
    this[route] = callback;
  }
}

module.exports = Router;
