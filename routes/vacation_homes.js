const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn, validateHome, isAuthor } = require('../middleware');
const vacation_homes = require('../controllers/vacation_homes');
const multer = require('multer');

const { storage } = require('../cloudinary');
const upload = multer({ storage });

router.route('/')
    .get(catchAsync(vacation_homes.index))
    .post(isLoggedIn, upload.array('image'), validateHome, catchAsync(vacation_homes.createVacationHome))

router.route('/new')
    .get(isLoggedIn, catchAsync(vacation_homes.renderNewForm))

router.route('/search')
    .get(catchAsync(vacation_homes.search))

router.route('/:id')
    .get(catchAsync(vacation_homes.showVacationHome))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateHome, catchAsync(vacation_homes.updateVacationHomes))
    .delete(isAuthor, catchAsync(vacation_homes.deleteVacationHomes))

router.route('/:id/edit')
    .get(isLoggedIn, isAuthor, catchAsync(vacation_homes.renderEditForm))

module.exports = router;