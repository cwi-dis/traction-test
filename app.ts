import * as express from "express";
import * as session from "express-session";
import * as connectMongo from "connect-mongo";
import * as logger from "morgan";

import * as path from "path"
import * as createError from "http-errors";
import * as cookieParser from "cookie-parser";

import { MongoClient } from "mongodb";

import indexRouter from "./routes/index";

var app = express();

// view engine setup
app.set('views', path.join(__dirname, "views"));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());

const MongoStore = connectMongo(session);

app.use(session({
  secret: "vJa2/FiwYmBTCp+f3tWR9WySpR74GSLYKaFVrcWTJqU=",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false },
  store: new MongoStore({ url: "mongodb://mongo:27017/traction" })
}));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

MongoClient.connect("mongodb://mongo:27017", (err, client) => {
  if (!err) {
    console.log("DB connection established");
    app.locals.db = client.db("traction");
  } else {
    console.error(err);
  }
});

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err: any, req: express.Request, res: express.Response) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
