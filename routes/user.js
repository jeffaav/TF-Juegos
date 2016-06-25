var express = require('express'),
    router = express.Router(),
    User = require('../models/user.js');
    
router.get('/', function (req, res) {
    User.find(function (err, data) {
       if (err) {
           res.send(res);
       } 
       res.send(data);
    });
});

router.get('/:id', function (req, res) {
   User.findById(req.params.id, function (err, data) {
       if (err) {
           res.send(err);
       }
       res.json(data);
   }) 
});

router.post('/', function (req, res) {
    var user = new User();
    user.name = req.body.name;
    user.facebookId = req.body.facebookId;
    
    user.save(function (err) {
        if (err) {
            res.send(err);
        }
        res.json(user);
    })
});

module.exports = router;
