const express = require('express');
const router = express.Router();
const { Event, Membership, Group, User, Venue, Attendance, EventImage } = require('../../db/models');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


router.get('/', async (req, res) => {
    const events = await Event.findAll({
        attributes: {
            exclude: ['description', 'capacity', 'price', 'createdAt', 'updatedAt']
        },
        raw: true
    });

    for (let event of events) {
        const attendees = await Attendance.count({
            where: {
                eventId: event.id
            }
        });

        event.numAttending = attendees
    };

    for (let event of events) {
        const previewImage = await EventImage.findOne({
            where: {
                [Op.and]: [
                    { eventId: event.id },
                    { preview: true }
                ]
            },
            raw: true
        })
        if (!previewImage) {
            event.previewImage = "No preview Image available for this event."
        } else {
            event.previewImage = previewImage.url
        }
    };

    for (let event of events) {
        const groupAttending = await Group.findOne({
            attributes: ['id', 'name', 'city', 'state'],
            where: {
                id: event.groupId
            }
        });

        event.Group = groupAttending
    };

    for (let event of events) {
        const eventVenue = await Venue.findOne({
            attributes: ['id', 'city', 'state'],
            where: {
                id: event.venueId
            }
        })
        if (!eventVenue) {
            event.Venue = null;
        } else {
            event.Venue = eventVenue
        }
    };

    return res.status(200).json({
        Events: events
    })
});

router.get('/:eventId', async (req, res) => {
    const event = await Event.findByPk(req.params.eventId, {
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        raw: true
    });
    if (!event) {
        return res.status(404).json({
            message: "Event couldn't be found",
            statusCode: 404
        })
    };

    const attendees = await Attendance.count({
        where: {
            eventId: event.id
        }
    });

    event.numAttending = attendees;

    const groupAttending = await Group.findOne({
        attributes: ['id', 'name', 'private', 'city', 'state'],
        where: {
            id: event.groupId
        }
    });

    event.Group = groupAttending;

    const eventVenue = await Venue.findOne({
        attributes: ['id', 'address', 'city', 'state', 'lat', 'lng'],
        where: {
            id: event.venueId
        }
    });
    if (!eventVenue) {
        event.Venue = null;
    } else {
        event.Venue = eventVenue
    };

    const eventImages = await EventImage.findAll({
        attributes: ['id', 'url', 'preview'],
        where: {
            eventId: event.id
        },
        raw: true
    })
    if (!eventImages) {
        event.EventImages = "No Images available for this event."
    } else {
        event.EventImages = eventImages
    }


    return res.status(200).json({
        Events: event
    })
});

router.post('/:eventId/images', async (req, res) => {
    const user = req.user.dataValues;
    if (!user) {
        return res.status(401).json({
            message: "Authentication required",
            statusCode: 401
        })
    };

    const event = await Event.findByPk(req.params.eventId, {
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        },
        raw: true
    });
    if(!event) {
        return res.status(404).json({
            message: "Event couldn't be found",
            statusCode: 404
        })
    };
    // User is an attendee
    const userAttendee = await Attendance.findOne({
        where: {
            [Op.and]: [
                {eventId: event.id},
                {userId: user.id}
            ],
            [Op.or]: [
                {status: 'attending'},
                {status: 'member'}
            ]
        }
    });

    if (userAttendee) {
        const {url, preview} = req.body;

        const newEventImage = await EventImage.create({
            eventId: event.id,
            url,
            preview
        });

        return res.status(200).json({
            id: newEventImage.id,
            url: newEventImage.url,
            preview: newEventImage.preview
        })
    } else {
        // User is co-host
        const eventGroup = await Group.findByPk(event.groupId);
        const userGroupRelationship = await Membership.findOne({
            where: {
                [Op.and]: [
                    { userId: user.id },
                    { groupId: eventGroup.id },
                    { status: 'co-host'}
                ]
            },
            raw: true
        });


        if (!userGroupRelationship || eventGroup.organizerId !== user.id) {
            return res.status(403).json({
                message: "Forbidden",
                statusCode: 403
            })
        };

        const { url, preview } = req.body;

        const newEventImage = await EventImage.create({
            eventId: event.id,
            url,
            preview
        });

        return res.status(200).json({
            id: newEventImage.id,
            url: newEventImage.url,
            preview: newEventImage.preview
        });

    }

})




module.exports = router;
