const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');


router.get('/', (req, res) => {
    res.render('stories/index')
});

//add story form 
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('stories/add')
});


// Process add story 
router.post('/', (req, res) => {
    let allowComments;
    if (req.body.allowComments) {
        allowComments = true;
    } else {
        allowComments = false;
    }

    const newStory = {
        title: req.body.title,
        body: req.body.status,
        status: req.body.status,
        allowComments: allowComments,
        user: req.user.id
    }

    //Create story
    new Story(newStory)
        .save()
        .then(story => {
            res.redirect(`/stories/show/${story.id}`);
        });
});

module.exports = router;