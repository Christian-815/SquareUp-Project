const express = require('express');
const router = express.Router();
const { Group, Membership, GroupImage, User, Venue } = require('../../db/models');
const { Op } = require('sequelize')


router.get('/', async (req,res) => {
    const groups = await Group.findAll({raw: true});
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
                    {groupId: group.id},
                    {preview: true}
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

router.get('/current', async (req,res) => {
    const {user} = req;
    // console.log(user.dataValues.id)
    if (!user) { res.json({ Message: "Currently no user logged in" })}
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

router.get('/:groupId', async (req,res) => {

    const group = await Group.findByPk(req.params.groupId, {raw:true});

    if(!group) {
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
})



module.exports = router;
