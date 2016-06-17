var express = require('express');
var models = require('../models');
var validate = require('express-jsonschema').validate;
var router = express.Router();

var ProductSchema = {
    type: 'object',
    properties: {
        code: {
            type: 'string',
            required: true,
            maxLength: 10
        },
        name: {
            type: 'string',
            required: true,
            maxLength: 20
        },
        price: {
            type: 'decimal',
            required: true
        }
    }
}

router.post('/', validate({body: ProductSchema}), function (req, res) {
    models.Product.create(
        req.body
    ).then(function (productSaved) {
        models.Promotion.create(req.body.promotion).then(function (promotionSaved) {
            return productSaved.setPromotion(promotionSaved);
        }).then(function () {
            res.send('Saved!');
        });
    });
});

module.exports = router;