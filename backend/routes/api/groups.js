const express = require('express');
const router = express.Router();
const { Group, Membership, GroupImage, User, Venue } = require('../../db/models');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateNewGroup = [
    check('name')
        .exists({ checkFalsy: true })
        .withMessage("Name is required"),
    check('name')
        .isLength({ max: 60 })
        .withMessage("Name must be 60 characters or less"),
    check('about')
        .exists({ checkFalsy: true })
        .isLength({ min: 50 })
        .withMessage("About must be 50 characters or more"),
    check('type')
        .exists({ checkFalsy: true })
        .isIn(['Online', 'In person'])
        .withMessage("Type must be 'Online' or 'In person'"),
    check('private')
        .exists({ checkFalsy: true })
        .isBoolean()
        .withMessage("Private must be a boolean"),
    check('city')
        .exists({ checkFalsy: true})
        .withMessage("City is required"),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage("State is required"),
    handleValidationErrors
]


router.get('/', async (req, res) => {
    const groups = await Group.findAll({ raw: true });
    // console.log(allGroups)

    for (let group of groups) {
        const numMembers = await Membership.count({
            where: {
                groupId: group.id
            }
        })
        group.numMembers = numMembers
    };

    for (let group of groups) {
        const previewImage = await GroupImage.findOne({
            where: {
                [Op.and]: [
                    { groupId: group.id },
                    { preview: true }
                ]
            }
        })
        if (!previewImage) {
            group.previewImage = "No preview Image available for this group."
        }
        // console.log(previewImage)
        group.previewImage = previewImage.dataValues.url
    }

    return res.json({
        Groups: groups
    })
});

router.get('/current', async (req, res) => {
    const { user } = req;
    // console.log(user.dataValues.id)
    if (!user) {
        return res.status(401).json({
            message: "Authentication required",
            statusCode: 401
        })
    }
    currentUser = user.dataValues.id

    const groups = await Group.findAll({
        where: {
            organizerId: currentUser
        },
        raw: true
    })

    for (let group of groups) {
        const numMembers = await Membership.count({
            where: {
                groupId: group.id
            }
        })
        group.numMembers = numMembers
    };

    for (let group of groups) {
        const previewImage = await GroupImage.findOne({
            where: {
                [Op.and]: [
                    { groupId: group.id },
                    { preview: true }
                ]
            }
        })
        if (!previewImage) {
            group.previewImage = "No preview Image available for this group."
        }
        // console.log(previewImage)
        group.previewImage = previewImage.dataValues.url
    }

    return res.json({
        Groups: groups
    })
});

router.get('/:groupId', async (req, res) => {

    const group = await Group.findByPk(req.params.groupId, { raw: true });

    if (!group) {
        return res.status(404).json({
            message: "Group couldn't be found",
            statusCode: 404
        })
    }

    group.numMembers = await Membership.count({
        where: {
            groupId: req.params.groupId
        }
    });

    group.GroupImages = await GroupImage.scope('currentGroup').findAll({
        where: {
            groupId: req.params.groupId
        }
    });

    group.Organizer = await User.findByPk(group.organizerId, {
        attributes: ['id', 'firstName', 'lastName']
    });

    group.Venues = await Venue.findAll({
        where: {
            groupId: req.params.groupId
        }
    });


    return res.json(group)
});


router.post('/', validateNewGroup, async (req, res) => {
    const user = req.user;
    if (!user) {
        return res.status(401).json({
            message: "Authentication required",
            statusCode: 401
        })
    };
    // console.log(user)
    const currentUser = user.dataValues.id;
    // console.log(currentUser)

    const { name, about, type, private, city, state } = req.body;

    const group = await Group.create({
        organizerId: currentUser,
        name,
        about,
        type,
        private,
        city,
        state
    });


    return res.status(201).json(group)


}, async (err, req, res, next) => {
    if (err.errors) {
        err.status = 400;
        err.message = "Validation Error";
        delete err.title

        return res.status(400).json({
            message: err.message,
            statusCode: err.status,
            error: err.errors
        })
    };

});

router.post('/:groupId/images', async (req,res) => {
    const user = req.user.dataValues.id
    const group = await Group.findByPk(req.params.groupId);
    if (!group) {
        return res.status(404).json({
            message: "Group couldn't be found",
            statusCode: 404
        })
    };
    if (user !== group.organizerId) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    };

    const { url, preview } = req.body

    const newGroupImage = await GroupImage.create({
        groupId: group.id,
        url,
        preview
    });

    return res.status(200).json({
        id: newGroupImage.id,
        url: newGroupImage.url,
        preview: newGroupImage.preview
    });

});





module.exports = router;
