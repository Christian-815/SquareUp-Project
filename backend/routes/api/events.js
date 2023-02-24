const express = require('express');
const router = express.Router();
const { Event, Membership, Group, User, Venue, Attendance, EventImage } = require('../../db/models');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');


router.get('/', async (req,res) => {
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
})




module.exports = router;
