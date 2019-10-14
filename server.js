const express = require("express");
const app = express();
app.use(express.json());
const path = require("path");
const db = require("./db");
const { User } = db.models;
const jwt = require("jwt-simple");
const port = process.env.PORT || 3000;
const dotenv = require('dotenv').config();
// app.use(
//   require("express-session")({
//     secret: process.env.SECRET
//   })
// );

// db.syncAndSeed().then(() =>
// app.listen(port, () => console.log(`listening on port ${port}`))
// );

app.listen(port, () => console.log(`listening on port ${port}`))

app.get("/", (req, res, next) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.use("/dist", express.static(path.join(__dirname, "dist")));

app.post("/api/sessions", async (req, res, next) => {

    const { email, password } = req.body;

    User.findOne({raw: true},{
      where: {
        email,
        password
      }
    }).then( user => {
      if(!user){
        throw({status: 401})
      }
      const token = jwt.encode({ id: user.id }, process.env.SECRET);
      return res.send({token})
    })
    .catch(err => next(err))

  // User.findOne({raw: true},{
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
  const auth = req.headers.authorization;

  if (!auth) {
    return next();
  }

  const {id} = jwt.decode(auth, process.env.SECRET);

  User.findByPk(id)
    .then(user => {
      req.user = user.dataValues;
      next();
    })
    .catch(next);
});

app.get("/api/sessions", (req, res, next) => {
  if (req.user) {
    return res.send(req.user);
  }
  next({ status: 401 });
});

// app.delete("/api/sessions", (req, res, next) => {
//   req.session.destroy();
//   res.sendStatus(204);
// });



// app.use((err, req, res, next) => {
//   res.status(err.status || 500).send({error: err})
// })
