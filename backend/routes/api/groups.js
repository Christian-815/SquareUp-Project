const express = require('express');
const router = express.Router();
const { Group, Membership, GroupImage } = require('../../db/models');
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
        // console.log(previewImage)
        group.previewImage = previewImage.dataValues.url
    }

    return res.json({
        Groups: groups
    })
})



module.exports = router;
