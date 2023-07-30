const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const { userSchema } = require("./models/user");
const Quiz = require("./models/quiz");
const Question = require("./models/question");
const DetUser = require("./models/detailedUser");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const cors = require("cors");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use(
  cors({
    origin: "http://localhost:3000",
    methods : ["GET","POST"],
    credentials : true
  })
);
app.use(
    session({
        secret: process.env.SECRET,
        resave: true,
        saveUninitialized: false,
        cookie: {
            secure:true,
            expires:  1000*60*60*24
        }
    })
);



app.use(passport.initialize());
app.use(passport.session());

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoose.connect(process.env.MONGO_URI);

app.get("/", (req, res) => {
  // res.send("DOCS coming soon...");
  if(req.session.user){
    res.send({loggedIn : true,user:req.session.user});
  }else{
    res.send({loggedIn : false})
  }
});

app.get("/isAuthenticated", passport.authenticate("local"), (req, res) => {
  res.status(200).json({ message: "Signed up successfully!" });
});

app.get('/quiz-all',function(req,res){
  Quiz.find({}).then(result=>{
    res.status(200).json({data : result});
  })
})

app.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    DetUser.findOne({ username: req.user.username }).then((user) => {
      Quiz.find({ author: req.user.username }).then((qz) => {
        // console.log(qz);
        res.status(200).json({ user: user, quizzes: qz });
      });
    });
  } else {
    res.status(200).json({ message: "To see Dashboard, Log In First!" });
  }
});

app.get("/quiz/:id", (req, res) => {
  Quiz.findOne({ _id: req.params.id }).then((ans) => {
    res.status(200).json({ quiz: ans });
  });
});

app.get("/login", function (req, res) {
  res.status(200).json({user : req.session.user});
});

app.get("/logout", function (req, res) {
  req.logout(function (err) {
    res.status(200).json({message:"Failed to Logout , Retry!"});
  });
  res.status(200).json({ message: "Logged Out Successfully!" });
});

app.post("/login", function (req, res) {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, function (err) {
    if (err) {
      res.status(200).json({ message: err });
    } else {
      passport.authenticate("local")(req, res, function () {
        DetUser.findOne({ username: req.user.username }).then((foundUser)=>{
          req.session.user = req.user.username;
          res.status(200).json({status:true,session:req.session});
        })
      });
    }
  });
});

app.get("/stats", function (req, res) {
  Quiz.find({}).then((res1) => {
    Quiz.find({ subject: "maths" }).then((maths) => {
      Quiz.find({ subject: "marathi" }).then((marathi) => {
        Quiz.find({ subject: "it" }).then((it) => {
          Quiz.find({ subject: "english" }).then((english) => {
            res.status(200).json({
              all: res1.length,
              it: it.length,
              marathi: marathi.length,
              english: english.length,
              maths: maths.length,
            });
          });
        });
      });
    });
  });
});

app.post("/logout", function (req, res) {});

app.get("/signup", function (req, res, next) {});

app.post("/signup", function (req, res) {
  User.register(
    { username: req.body.username },
    req.body.password,
    function (err, user) {
      if (err) {
        // console.log(err);
        res.status(501).json({ message: err });
      } else {
        const newUser = new DetUser({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          username: req.body.username,
          quizCreated: 0,
        });
        newUser.save();
        passport.authenticate("local")(req, res, function () {
          res.status(200).json({ message: "Signed up successfully!" });
        });
      }
    }
  );
});

// app.get("/create-quiz", function (req, res) {
//   if (req.isAuthenticated()) {
//     res.render("create");
//   } else {
//     res.render("login", { msg: "To create a quiz, Log In First!" });
//   }
// });

app.post("/create-quiz", function (req, res) {
  var qa = [];
  qa.push(
    new Question({
      statement: req.body.q1,
      opt1: req.body.o11,
      opt2: req.body.o12,
      opt3: req.body.o13,
      opt4: req.body.o14,
      ans: req.body.c1,
    })
  );
  qa.push(
    new Question({
      statement: req.body.q2,
      opt1: req.body.o21,
      opt2: req.body.o22,
      opt3: req.body.o23,
      opt4: req.body.o24,
      ans: req.body.c2,
    })
  );
  qa.push(
    new Question({
      statement: req.body.q3,
      opt1: req.body.o31,
      opt2: req.body.o32,
      opt3: req.body.o33,
      opt4: req.body.o34,
      ans: req.body.c3,
    })
  );
  qa.push(
    new Question({
      statement: req.body.q4,
      opt1: req.body.o41,
      opt2: req.body.o42,
      opt3: req.body.o43,
      opt4: req.body.o44,
      ans: req.body.c4,
    })
  );
  qa.push(
    new Question({
      statement: req.body.q5,
      opt1: req.body.o51,
      opt2: req.body.o52,
      opt3: req.body.o53,
      opt4: req.body.o54,
      ans: req.body.c5,
    })
  );
  qa.push(
    new Question({
      statement: req.body.q6,
      opt1: req.body.o61,
      opt2: req.body.o62,
      opt3: req.body.o63,
      opt4: req.body.o64,
      ans: req.body.c6,
    })
  );
  qa.push(
    new Question({
      statement: req.body.q7,
      opt1: req.body.o71,
      opt2: req.body.o72,
      opt3: req.body.o73,
      opt4: req.body.o74,
      ans: req.body.c7,
    })
  );
  qa.push(
    new Question({
      statement: req.body.q8,
      opt1: req.body.o81,
      opt2: req.body.o82,
      opt3: req.body.o83,
      opt4: req.body.o84,
      ans: req.body.c8,
    })
  );
  qa.push(
    new Question({
      statement: req.body.q9,
      opt1: req.body.o91,
      opt2: req.body.o92,
      opt3: req.body.o93,
      opt4: req.body.o94,
      ans: req.body.c9,
    })
  );
  qa.push(
    new Question({
      statement: req.body.q10,
      opt1: req.body.o111,
      opt2: req.body.o112,
      opt3: req.body.o113,
      opt4: req.body.o114,
      ans: req.body.c11,
    })
  );
  qa.push(
    new Question({
      statement: req.body.q12,
      opt1: req.body.o121,
      opt2: req.body.o122,
      opt3: req.body.o123,
      opt4: req.body.o124,
      ans: req.body.c12,
    })
  );
  qa.push(
    new Question({
      statement: req.body.q13,
      opt1: req.body.o131,
      opt2: req.body.o132,
      opt3: req.body.o133,
      opt4: req.body.o134,
      ans: req.body.c13,
    })
  );
  qa.push(
    new Question({
      statement: req.body.q14,
      opt1: req.body.o141,
      opt2: req.body.o142,
      opt3: req.body.o143,
      opt4: req.body.o144,
      ans: req.body.c14,
    })
  );
  qa.push(
    new Question({
      statement: req.body.q15,
      opt1: req.body.o151,
      opt2: req.body.o152,
      opt3: req.body.o153,
      opt4: req.body.o154,
      ans: req.body.c15,
    })
  );
  const newQuiz = new Quiz({
    title: req.body.title,
    instructions: req.body.instructions,
    author: req.user.username,
    questions: qa,
  });
  console.log(newQuiz);
  newQuiz.save().then((nq) => {
    DetUser.findOneAndUpdate(
      { username: req.user.username },
      { $inc: { quizCreated: 1 }, $push: { quizzes: newQuiz._id } }
    ).then((user) => {
      res.status(200).json({ message: "Created Quiz successfully!" });
    });
  });
});
const port = process.env.PORT || 3000;
app.listen(port, console.log(`listening on ${port}`));
