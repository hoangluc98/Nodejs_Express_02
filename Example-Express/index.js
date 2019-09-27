var express = require("express");
var cookieParser = require('cookie-parser');
var userRoutes = require('./routes/user.route');
var authRoutes = require('./routes/auth.route');

var authMiddleware = require('./middlewares/auth.middleware');

var port = 3000;

var app = express();
app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(cookieParser('jmghnfgbdfvsdvf'));
app.use(express.static('public'));

app.get('/', function(req, res){
	res.render('index', {
		name: 'AAA'
	});
});

app.use('/users', authMiddleware.requireAuth, userRoutes);
app.use('/auth', authRoutes);

app.listen(port, function(){
	console.log('Server listening on port:' + port);
});