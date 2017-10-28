const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');


//load  models
require('./models/User');
require('./models/Story');

//passport config 
require('./config/passport')(passport);


//load routes 
const index = require('./routes/index');
const auth = require('./routes/auth');
const stories = require('./routes/stories');

//load keys
const keys = require('./config/keys')

//Map Global promises
mongoose.Promise = global.Promise;
//Mongoose Connect
mongoose.connect(keys.mongoURI, {
    useMongoClient: true
})


.then(() => console.log('MongoDB Connected'))
    .catch(() => console.log(err));

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())


//Handlebars 
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars')




app.use(cookieParser());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

// passport middleware 
app.use(passport.initialize());
app.use(passport.session());

// set global vars 
app.use((req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

//set static folder 
app.use(express.static(path.join(__dirname, 'public')));



//Use Routes
app.use('/', index);
app.use('/auth', auth);
app.use('/stories', stories);



const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(` Server started on port ${port} `);
});