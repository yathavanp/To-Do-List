const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
var date = require(__dirname + "/date.js");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

mongoose.connect(
  "mongodb+srv://admin-yaddy:Test123@cluster0.ennyk.gcp.mongodb.net/todolistDB",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const itemsSchema = {
  name: String,
};

const listSchema = {
  name: String,
  items: [itemsSchema],
};

const Item = mongoose.model("Item", itemsSchema);

const List = mongoose.model("List", listSchema);

const item1 = new Item({
  name: "This is your todo list",
});

const item2 = new Item({
  name: "Type below to and press '+' add new task",
});

app.get("/", function (req, res) {
  Item.find(function (err, foundItems) {
    if (err) {
      console.log(err);
    } else if (foundItems.length === 0) {
      Item.insertMany([item1, item2], function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Upload Successful");
        }
      });
      res.redirect("/");
    } else {
      let today = date.getDate();
      res.render("list", {
        listName: today,
        listItems: foundItems,
        main: true,
      });
    }
  });
});

app.get("/:urlId", function (req, res) {
  const space = _.capitalize(req.params.urlId);
  List.findOne({ name: space }, function (err, found) {
    if (!err) {
      if (!found) {
        const list = new List({ name: space, items: [] });
        list.save();
        res.redirect("/" + space);
      } else {
        res.render("list", {
          listName: space,
          listItems: found.items,
          main: false,
        });
      }
    }
  });
});

app.post("/", function (req, res) {
  const listTitle = req.body.list;
  console.log(req.body.list);
  const task = new Item({
    name: req.body.nextTask,
  });
  if (listTitle === date.getDate()) {
    task.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listTitle }, function (err, found) {
      found.items.push(task);
      found.save();
    });
    res.redirect("/" + listTitle);
  }
});

app.post("/delete", function (req, res) {
  const listTitle = req.body.listName;
  if (listTitle === date.getDate()) {
    Item.deleteOne({ _id: req.body.checkbox }, function (err) {
      if (err) {
        console.log(err);
      }
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate(
      { name: listTitle },
      {
        $pull: { items: { _id: req.body.checkbox } },
      },
      function (err, found) {
        found.save();
      }
    );
    res.redirect("/" + listTitle);
  }
});

app.post("/clear", function (req, res) {
  const listTitle = req.body.list;
  if (listTitle === date.getDate()) {
    Item.remove({}, function (err) {
      if (err) {
        console.log(err);
      }
    });
    res.redirect("/");
  } else {
    List.findOneAndUpdate(
      { name: listTitle },
      {
        $pull: { items: {} },
      },
      function (err, found) {
        found.save();
      }
    );
    res.redirect("/" + listTitle);
  }
});

app.post("/reset", function (req, res) {
  Item.remove({}, function (err) {
    if (err) {
      console.log(err);
    }
  });
  List.remove({}, function (err) {
    if (err) {
      console.log(err);
    }
  });
  res.redirect("/");
});

app.listen(3000, function () {
  console.log("Server running on Port:3000 ...");
});
