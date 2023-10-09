// @ts-check
const express = require("express");
const fs = require("fs");

const { select, update } = require("sito-node-mysql");

// auth
const { validator } = require("../utils/secure");

const pagesRoute = express.Router();

/**
 *
 * @param {string} section
 * @param {object} data
 */
const parseHomeData = async (section, data) => {
  switch (section) {
    case "contactUs": {
      const { socialMedia, photo } = data;
      // fetch current photo to erase
      const responsePhoto = await select("config", ["homeContactUsPhoto"]);
      const { rows } = responsePhoto;
      const { homeContactUsPhoto } = rows[0];
      if (photo)
        if (homeContactUsPhoto.length) {
          // deleting current photo
          fs.rmSync(`./public${homeContactUsPhoto}`);
        }
      let thePhoto = "";

      if (photo && photo.photo && photo.photo.blob) {
        const { blob } = photo.photo;
        // writing new photo
        const encoded = Buffer.from(
          blob.replace(/^data:image\/\w+;base64,/, ""),
          "base64"
        );
        const extension = blob.split(";")[0].split("/")[1];
        fs.writeFileSync(
          `./public/images/config/homeContactUsPhoto.${extension}`,
          encoded
        );
        thePhoto = `/images/config/homeContactUsPhoto.${extension}`;
      }
      // updating photo
      await update(
        "config",
        ["homeContactUsPhoto"],
        {
          homeContactUsPhoto: thePhoto,
        },
        {}
      );
      // updating social media
      for (const item of socialMedia) {
        const { id, active } = item;
        await update(
          "socialMedia",
          ["active"],
          { active },
          {
            attribute: "id",
            value: id,
            operator: "=",
          }
        );
      }

      break;
    }
    default: // hero
      break;
  }
};

pagesRoute.post("/save", [validator], async (req, res) => {
  const { page, data, user } = req.body;
  try {
    // validating user
    const userResponse = await select("users", ["id"], {
      attribute: "user",
      value: user,
      operator: "=",
    });
    if (userResponse.rows.length) {
      switch (page) {
        case "contactUs":
          break;
        default: // home;
          await parseHomeData(page.split("-")[1], data);
          res.send({ message: "ok" });
          break;
      }
    } else res.status(401).send({ error: "unauthorized" });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err });
  }
});

module.exports = pagesRoute;
