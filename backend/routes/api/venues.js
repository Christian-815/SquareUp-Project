const express = require('express');
const router = express.Router();
const { Group, Membership, GroupImage, User, Venue } = require('../../db/models');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


const validateVenue = [
    check('address')
        .exists({ checkFalsy: true })
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .isDecimal({force_decimal: true})
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .isDecimal({ force_decimal: true })
        .withMessage('Longitude is not valid'),
    handleValidationErrors
];


router.put('/:venueId', validateVenue, async (req,res) => {
    const user = req.user.dataValues
    const venue = await Venue.findByPk(req.params.venueId);
    if (!venue) {
        return res.status(404).json({
            message: "Venue couldn't be found",
            statusCode: 404
        })
    };
    const group = await Group.findByPk(venue.groupId);

    const userGroupRelationship = await Membership.findOne({
        where: {
            [Op.and]: [
                { userId: user.id },
                { groupId: group.id }
            ]
        },
        raw: true
    });

    if (user.id !== group.organizerId || !userGroupRelationship || userGroupRelationship.status !== 'co-host') {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    };

    const { address, city, state, lat, lng } = req.body

    venue.update({
        address: address,
        city: city,
        state: state,
        lat: lat,
        lng: lng
    })

    return res.status(200).json({
        id: venue.id,
        groupId: group.id,
        address: venue.address,
        city: venue.city,
        state: venue.state,
        lat: venue.lat,
        lng: venue.lng
    })

}, async (err, req, res, next) => {
    if (err.errors) {
        err.status = 400;
        err.message = "Validation Error";
        delete err.title

        return res.status(400).json({
            message: err.message,
            statusCode: err.status,
            errors: err.errors
        })
    };

});


module.exports = router;
