const express = require('express');
const router = express.Router();
const { Group, Membership, GroupImage, User, Venue, Event, Attendance, EventImage } = require('../../db/models');
const { Op } = require('sequelize');


router.delete('/:imageId', async (req, res) => {
    const user = req.user.dataValues;
    if (!user) {
        return res.status(401).json({
            message: "Authentication required",
            statusCode: 401
        })
    };
    const eventImage = await EventImage.findByPk(req.params.imageId);
    if (!eventImage) {
        return res.status(404).json({
            message: "Event Image couldn't be found",
            statusCode: 404
        })
    };

    const event = await Event.findByPk(eventImage.eventId);
    const group = await Group.findByPk(event.groupId)
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

    await eventImage.destroy();

    return res.status(200).json({
        "message": "Successfully deleted",
        "statusCode": 200
    });
})




module.exports = router;
