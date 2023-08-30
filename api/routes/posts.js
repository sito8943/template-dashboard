const fs = require("fs");

// @ts-check
const Router = require("./router");

const { sortBy } = require("some-javascript-utils/array");

// mysql
const { select, insert, update } = require("sito-node-mysql");

// auth
const { validator } = require("../utils/secure");

// utils
const { toSlug } = require("../utils/parse");

const postRouter = new Router("posts", [validator]);

postRouter.addRoute("/save", "POST", [], async (req, res) => {
  console.info(`saving post`);
  const { user, data } = req.body;

  try {
    if (!data.id) {
      const { type, title, description, banner, content } = data;
      // getting type id
      const responseType = await select(
        ["posttypes"],
        ["id", "name"],
        [{ attribute: "name", operator: "=", value: type }]
      );
      const typeObj = responseType.rows[0];
      // getting user id
      const responseUser = await select(
        ["users"],
        ["id"],
        [{ attribute: "user", value: user, operator: "=" }]
      );
      const userId = responseUser.rows[0].id;
      // saving post
      const result = await insert(
        "posts",
        [
          "id",
          "type",
          "title",
          "description",
          "content",
          "banner",
          "owner",
          "date",
        ],
        {
          title,
          description,
          date: new Date().getTime(),
          type: typeObj.id,
          owner: userId,
          content,
          banner: "",
        }
      );
      // setting banner
      console.info("setting banner");
      if (banner && banner.blob) {
        try {
          const encoded = Buffer.from(
            banner.blob.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
          );
          const extension = banner.blob.split(";")[0].split("/")[1];
          const slugged = toSlug(typeObj.name);
          fs.writeFileSync(
            `./public/images/${slugged}/${result}-banner.${extension}`,
            encoded
          );
          // save banner on bd
          await update(
            "posts",
            ["banner"],
            {
              banner: `/images/${slugged}/${result}-banner.${extension}`,
            },
            { attribute: "id", value: result, operator: "=" }
          );
        } catch (err) {
          console.error(err);
        }
      }
      console.info(`post created successfully`);
      // @ts-ignore
      res.status(200).send({ id: result });
    } else {
      const { title, description, content } = data;
      await update(
        "posts",
        ["title", "description", "content"],
        {
          title,
          description,
          content,
        },
        { attribute: "id", value: data.id, operator: "=" }
      );
      // setting banner
      console.info("setting banner");
      if (data.banner && data.banner.blob) {
        // getting type id
        const responseType = await select(
          ["posttypes"],
          ["id", "name"],
          [{ attribute: "name", operator: "=", value: data.type }]
        );
        const typeObj = responseType.rows[0];

        try {
          const encoded = Buffer.from(
            data.banner.blob.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
          );
          const extension = data.banner.blob.split(";")[0].split("/")[1];
          const slugged = toSlug(typeObj.name);
          fs.writeFileSync(
            `./public/images/${slugged}/${data.id}-banner.${extension}`,
            encoded
          );
          // save banner on bd
          await update(
            "posts",
            ["banner"],
            {
              banner: `/images/${slugged}/${data.id}-banner.${extension}`,
            },
            { attribute: "id", value: data.id, operator: "=" }
          );
        } catch (err) {
          console.error(err);
        }
      }
      console.info(`post saved successfully`);
      // @ts-ignore
      res.status(200).send({ message: "saved" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: String(err) });
  }
});

postRouter.addRoute("/fetch", "GET", [], async (req, res) => {
  const { page, type, user, slug } = req.query;
  try {
    let rows = [];
    if (type) {
      // getting type id
      const responseType = await select(["posttypes"], ["id"], {
        attribute: "name",
        value: type,
        operator: "=",
      });
      const typeId = responseType.rows[0].id;
      // getting post by type id
      const response = await select(
        ["posts"],
        [],
        [
          { attribute: "type", operator: "=", value: typeId },
          { attribute: "owner", operator: "=", value: user, logic: "AND" },
        ],
        -1,
        0,
        "date"
      );
      rows = response.rows;
      // seeing if the user is an admin
      const responseUser = await select(
        ["users"],
        ["type"],
        [
          {
            attribute: "user",
            value: user,
            operator: "=",
          },
          {
            attribute: "id",
            value: user,
            operator: "=",
            logic: "OR",
          },
        ]
      );
      const userAdmin = responseUser.rows[0].type;
      if (userAdmin === 1) {
        // got to take owners for users
        for (const post of rows) {
          const responseOwner = await select(["users"], ["name"], {
            attribute: "id",
            value: post.owner,
            operator: "=",
          });
          post.owner = responseOwner.rows[0].name;
        }
      }
    } else if (slug) {
      // getting post by type id
      const response = await select(["posts"], []);
      rows = response.rows;

      for (let i = 0; i < rows.length; i++)
        if (toSlug(rows[i].title) !== slug) rows.splice(i, 1);
    }
    res.send({
      list: page !== undefined ? rows.slice(page, (page + 1) * 10) : rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: String(err) });
  }
});

postRouter.addRoute("/", "GET", [], async (req, res) => {
  const { page } = req.query;
  try {
    // taking posts
    const responsePost = await select(
      ["posts", "posttypes"],
      [
        "posts.id as id",
        "banner",
        "title",
        "description",
        "posts.date as date",
        "owner",
        "posttypes.name as type",
      ],
      [{ attribute: "type", operator: "=", value: "posttypes.id" }]
    );

    // getting posts tags
    const postsRows = responsePost.rows;
    for (const post of postsRows) {
      // checking for tags
      const responseTags = await select(
        ["posttags", "tags"],
        ["name"],
        [
          { attribute: "idPost", value: post.id, operator: "=" },
          { attribute: "idTag", operator: "=", value: "tags.id", logic: "AND" },
        ]
      );
      post.type = toSlug(post.type);
      if (responseTags.rows.length)
        post.tags = responseTags.rows.map((tag) => `#${tag.name}`);
    }
    // getting posts owner
    for (const post of postsRows) {
      // checking for tags
      const responseOwners = await select(
        ["mipymes"],
        ["name", "photo"],
        [{ attribute: "mipymes.owner", value: post.owner, operator: "=" }]
      );
      if (responseOwners.rows.length)
        post.owner = { ...responseOwners.rows[0] };
    }
    // taking mipymes
    const responseMipymes = await select(
      ["mipymes"],
      ["id", "name", "photo", "date", "description"]
    );
    // getting mipymes tags
    const mipymesRows = responseMipymes.rows.filter(
      (mipyme) => mipyme.photo && mipyme.photo.length
    );
    for (const mipyme of mipymesRows) {
      // checking for tags
      const responseTags = await select(
        ["mipymetags", "tags"],
        ["name"],
        [
          { attribute: "idMipyme", value: mipyme.id, operator: "=" },
          { attribute: "idTag", operator: "=", value: "tags.id", logic: "AND" },
        ]
      );
      mipyme.type = "mipyme";
      if (responseTags.rows.length)
        mipyme.tags = responseTags.rows.map((tag) => `#${tag.name}`);
    }
    // concat

    const result = sortBy([...postsRows, ...mipymesRows], "date", false);
    res.send({ list: result.slice(page, (page + 1) * 10) });
  } catch (err) {
    console.error(err);
    res.status(500).send({ message: String(err) });
  }
});

module.exports = postRouter.router;
