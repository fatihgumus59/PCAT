const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
var methodOverride = require('method-override');

const path = require('path');
const ejs = require('ejs');
const fs = require('fs');

const Photos = require('./models/Photo');

const app = express();

mongoose.connect('mongodb://localhost/pcat-test-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(fileUpload());
app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
  const photos = await Photos.find({}).sort('-dataCreated');
  res.render('index', {
    photos,
  });
});

app.get('/photos/:id', async (req, res) => {
  const photo = await Photos.findById(req.params.id);
  res.render('photo', {
    photo,
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/photos', async (req, res) => {
  const uploadDir = 'public/uploads';

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadImage = req.files.image;
  let uploadPath = __dirname + '/public/uploads/' + uploadImage.name;

  uploadImage.mv(uploadPath, async () => {
    await Photos.create({
      ...req.body,
      image: '/uploads/' + uploadImage.name,
    });
    res.redirect('/');
  });
});

app.get('/photos/edit/:id', async (req, res) => {
  const photo = await Photos.findOne({ _id: req.params.id });

  res.render('edit', {
    photo,
  });
});

app.put('/photos/:id', async (req, res) => {
  const photo = await Photos.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();

  res.redirect(`/photos/${req.params.id}`);
});

const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı...`);
});
