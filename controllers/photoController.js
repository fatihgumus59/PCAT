const Photos = require('../models/Photo');
const fs = require('fs');

exports.getAllPhotos = async (req, res) => {
  const page = req.query.page || 1; // başlangıç sayfası
  const photoPerPage = 3; // her sayfada 3 foto göster
  const totalPhoto = await Photos.find({}).countDocuments(); // tüm fotolar sayısı

  const photos = await Photos.find({}) // tüm fotoları aldık
    .sort('-dataCreated') // sıraladık
    .skip((page - 1) * photoPerPage) // sayfa numarlandırma
    .limit(photoPerPage);

  res.render('index', {
    photos,
    current: page, // seçili sayfa
    pages: Math.ceil((totalPhoto / photoPerPage)),  // toplam sayfa sayısı 
  });
};

exports.getPhoto = async (req, res) => {
  const photo = await Photos.findById(req.params.id);
  res.render('photo', {
    photo,
  });
};

exports.createPhoto = async (req, res) => {
  const uploadDir = 'public/uploads';

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadImage = req.files.image;
  let uploadPath = __dirname + '/../public/uploads/' + uploadImage.name;

  uploadImage.mv(uploadPath, async () => {
    await Photos.create({
      ...req.body,
      image: '/uploads/' + uploadImage.name,
    });
    res.redirect('/');
  });
};

exports.updatePhoto = async (req, res) => {
  const photo = await Photos.findOne({ _id: req.params.id });
  photo.title = req.body.title;
  photo.description = req.body.description;
  photo.save();

  res.redirect(`/photos/${req.params.id}`);
};

exports.deletePhoto = async (req, res) => {
  const photo = await Photos.findOne({ _id: req.params.id });
  let deleteImage = __dirname + '/../public' + photo.image;
  fs.unlinkSync(deleteImage);
  await Photos.findByIdAndRemove(req.params.id);
  res.redirect('/');
};
