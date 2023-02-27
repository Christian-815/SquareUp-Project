const express = require('express');
const router = express.Router();
const { Group, Membership, GroupImage } = require('../../db/models');
const { Op } = require('sequelize');


router.delete('/:imageId', async (req,res) => {
    const user = req.user.dataValues;
    if (!user) {
        return res.status(401).json({
            message: "Authentication required",
            statusCode: 401
        })
    };
    const groupImage = await GroupImage.findByPk(req.params.imageId);
    if (!groupImage) {
        return res.status(404).json({
            message: "Group Image couldn't be found",
            statusCode: 404
        })
    };

    const group = await Group.findByPk(groupImage.groupId);
    const userGroupRelationshipPending = await Membership.findOne({
        where: {
            [Op.and]: [
                { userId: user.id },
                { groupId: group.id },
                { status: 'co-host' }
            ]
        }
    });

    if (!userGroupRelationshipPending && user.id !== group.organizerId) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    };

    await groupImage.destroy();

    return res.status(200).json({
        "message": "Successfully deleted",
        "statusCode": 200
    });
})




module.exports = router;
