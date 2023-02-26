const express = require('express');
const router = express.Router();
const { Event, Membership, Group, User, Venue, Attendance, EventImage } = require('../../db/models');
const { Op } = require('sequelize');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateNewEvent = [
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ min: 5 })
        .withMessage("Name must be at least 5 characters"),
    check('type')
        .exists({ checkFalsy: true })
        .isIn(['Online', 'In person'])
        .withMessage("Type must be Online or In person"),
    check('capacity')
        .exists({ checkFalsy: true })
        .isInt()
        .withMessage("Capacity must be an integer"),
    check('price')
        .exists({ checkFalsy: true })
        .isDecimal({ force_decimal: true })
        .withMessage("Price is invalid"),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage("Description is required"),
    handleValidationErrors
];


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

});


router.put('/:eventId', validateNewEvent, async (req,res) => {
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
        }
    });
    if (!event) {
        return res.status(404).json({
            message: "Event couldn't be found",
            statusCode: 404
        })
    };

    const eventGroup = await Group.findByPk(event.groupId);
    const userGroupRelationship = await Membership.findOne({
        where: {
            [Op.and]: [
                { userId: user.id },
                { groupId: eventGroup.id },
                { status: 'co-host' }
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

    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

    const venue = await Venue.findByPk(venueId);

    if (!venue) {
        return res.status(404).json({
            message: "Venue couldn't be found",
            statusCode: 404
        })
    };

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();


    if (start.getTime() < today.getTime()) {
        return res.status(400).json({
            message: "Validation error",
            statusCode: 400,
            errors: {
                startDate: "Start date must be in the future"
            }
        })
    };

    if (start.getTime() > end.getTime()) {
        return res.status(400).json({
            message: "Validation error",
            statusCode: 400,
            errors: {
                endDate: "End date is less than start date"
            }
        })
    };

    event.update({
        venueId: venueId,
        name: name,
        type: type,
        capacity: capacity,
        price: price,
        description: description,
        startDate: startDate,
        endDate: endDate
    });

    return res.status(200).json({
        id: event.id,
        venueId: event.venueId,
        groupId: event.groupId,
        name: event.name,
        type: event.type,
        capacity: event.capacity,
        price: event.price,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate
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


router.delete('/:eventId', async (req,res) => {
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
        }
    });
    if (!event) {
        return res.status(404).json({
            message: "Event couldn't be found",
            statusCode: 404
        })
    };

    const eventGroup = await Group.findByPk(event.groupId);
    const userGroupRelationship = await Membership.findOne({
        where: {
            [Op.and]: [
                { userId: user.id },
                { groupId: eventGroup.id },
                { status: 'co-host' }
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

    await event.destroy();

    return res.status(200).json({
        message: "Successfully deleted"
    })
});




module.exports = router;
