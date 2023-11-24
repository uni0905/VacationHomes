const express = require('express');
const router = express.Router({ mergeParams: true });
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware')
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviews');

//1. New Review
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReviews))

//2. Delete
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReviews))

module.exports = router;