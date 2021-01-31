const multer = require('multer');
var path = require('path')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, 'public/images/users')
  },
  filename: function (req, file, cb) {
    console.log(req.user);
    const ext = path.extname(file.originalname)
    //cb(null, Date.now() + '-' +file.originalname )
    cb(null, 'user_' + Date.now() + ext )
  }
})

const upload = multer({ storage: storage }).single('image')

module.exports = upload;