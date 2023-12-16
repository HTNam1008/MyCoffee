const path = require("path");
const express = require("express");
const morgan = require("morgan");
const { engine } = require("express-handlebars");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const session = require("express-session");

const app = express();
const port = 3000;

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

const Admin = require("./app/models/Admin");

const route = require("./routes");
const db = require("./config/db");

const createRootAdmin = async () => {
  try {
    // Tạo một salt ngẫu nhiên và hash mật khẩu
    const saltRounds = 10; // Số lần lặp để tạo salt
    const hashedPassword = await bcrypt.hash("anhthu123", saltRounds);

    // Tạo một admin gốc với mật khẩu đã được hash
    const rootAdmin = new Admin({
      username: "bapcaiday",
      password: hashedPassword,
    });

    // Lưu admin vào cơ sở dữ liệu
    await rootAdmin.save();
    console.log("Root admin account created");
  } catch (error) {
    console.error("Error creating root admin account:", error);
  }
};

const checkAndCreateRootAdmin = async () => {
  try {
    // Kiểm tra xem admin gốc đã được tạo chưa
    const existingAdmin = await Admin.findOne({ username: "bapcaiday" });

    if (!existingAdmin) {
      // Nếu chưa có admin gốc, thì tạo mới
      await createRootAdmin();
    } else {
      console.log("Root admin account already exists");
    }
  } catch (error) {
    console.error("Error checking root admin existence:", error);
  }
};

//connect db

db.connect("MyCoffee");
//db.connect("Administration")
checkAndCreateRootAdmin();

//app.use(authenticateMiddleware);
app.use("/public/js", express.static(__dirname + "/public/js"));
app.use("/public/image", express.static(__dirname + "/public/image"));

// app.use('/uploads',express.static(__dirname+'/src/uploads'));
// app.use('/uploads', express.static(path.join(__dirname, 'src', 'resource', 'views', 'admin', 'uploads')));
app.use(express.static(path.join(__dirname, "public")));
// app.use(express.static(path.join(__dirname,'src/uploads')));

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());
app.use(methodOverride("_method"));

//Template engine
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    helpers: {
      sum: (a, b) => a + b,
      ifEquals: function (a, b, opts) {
        if (a.toString() === b.toString()) {
          return opts.fn(this);
        }
        return opts.inverse(this);
      },
      ifNotEquals: function (a, b, opts) {
        if (a.toString() !== b.toString()) {
          return opts.fn(this);
        }
        return opts.inverse(this);
      },
      dateToString: function (mongooseDate) {
        return mongooseDate.toLocaleString("en-GB");
      },
    },
  })
);

// app.get('/getOrdersData', async (req, res) => {
//   try {
//     await client.connect();
//     const database = client.db('MyCoffee');
//     const collection = database.collection('orders');
//     const result = await collection.find({ date: req.query.date }).toArray();
//     res.json(result);
//   } finally {
//     await client.close();
//   }
// });

app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "resource", "views"));

route(app);

app.listen(port, () =>
  console.log(`App listening at http:://localhost:${port}`)
);
