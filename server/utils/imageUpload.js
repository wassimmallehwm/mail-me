const multer = require('multer');
var path = require('path')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'public/images')
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    //cb(null, Date.now() + '-' +file.originalname )
    cb(null, 'user_' + Date.now() + ext )
  }
})

const upload = multer({ storage: storage }).single('image')

module.exports = upload;