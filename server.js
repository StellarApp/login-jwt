const express = require("express");
const app = express();
app.use(express.json());
const path = require("path");
const db = require("./db");
const { User } = db.models;
const jwt = require("jwt-simple");

// app.use(
//   require("express-session")({
//     secret: process.env.SECRET
//   })
// );
const port = process.env.PORT || 3000;
db.syncAndSeed().then(() =>
  app.listen(port, () => console.log(`listening on port ${port}`))
);

app.use("/dist", express.static(path.join(__dirname, "dist")));

app.post("/api/sessions", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: {
        email,
        password
      }
    });

    if (user) {
      const token = jwt.encode({ id: user.id }, process.env.SECRET);
      res.send({ token });
    } else {
      throw { status: 401 };
    }
  } catch (error) {
    next(error);
  }

  // User.findOne({
  //   where: {
  //     email: req.body.email,
  //     password: req.body.password
  //   }
  // })
  // .then( user => {
  //   if(!user){
  //     throw ({ status: 401 });
  //   }
  //   req.session.user = user;
  //   return res.send(user);
  // })
  // .catch( err => next(err));
});

app.use((req, res, next) => {
  console.log("use", req.headers.authorization)
  const auth = req.headers.authorization;

  if (auth) {
    const {id} = jwt.decode(auth, process.env.SECRET);
    User.findByPk(id)
      .then(user => {
        req.user = user;
        next();
      })
      .catch(next);
  }
  return next();
});

app.get("/api/sessions", (req, res, next) => {

  if (req.user) {
    return res.send(req.user);
  }
  next({ status: 401 });
});

app.delete("/api/sessions", (req, res, next) => {
  req.session.destroy();
  res.sendStatus(204);
});

app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
