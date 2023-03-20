const express = require('express');
const router = express.Router();
const { Event, Membership, Group, User, Venue, Attendance, EventImage, GroupImage } = require('../../db/models');
const { Op } = require('sequelize');
const { check, query } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateNewEvent = [
    check('venueId')
        .exists({ checkFalsy: true })
        .withMessage("Venue does not exist"),
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ min: 5 })
        .withMessage("Name must be at least 5 characters"),
    check('type')
        .exists({ checkFalsy: true })
        .isIn(['Online', 'In Person'])
        .withMessage("Type must be Online or In Person"),
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

const validateEventsQueries = [
    query("page")
        .optional({ checkFalsy: true })
        .isInt({ min: 1 })
        .withMessage("Page must be greater than or equal to one"),
    query("size")
        .optional({ checkFalsy: true })
        .isInt({ min: 1 })
        .withMessage("Size must be greather than or equal to one"),
    query("name")
        .optional()
        .isString()
        .withMessage("Name must be a string"),
    query("type")
        .optional()
        .isIn(["Online", "In Person"])
        .withMessage("Type must be 'Online' or 'In Person'"),
    query("startDate")
        .optional()
        .isDate()
        .withMessage("Start date must be a valid datetime"),
    handleValidationErrors,
];



router.get('/', validateEventsQueries, async (req, res) => {
    let { page, size, name, type, startDate } = req.query;

    const where = {};

    if (name) {
        where.name = name
    };
    if (type) {
        where.type = type
    };
    if (startDate) {
        let dayBegins = new Date(startDate);
        let dayEnds = new Date(dayBegins);

        dayEnds.setDate(dayBegins.getDate() + 1);

        where.startDate = { [Op.between]: [dayBegins, dayEnds] };
    }

    let pagination = {};
    if (page <= 0 || isNaN(page) || !page) { page = 1 };
    if (size <= 0 || isNaN(size) || !size) { size = 20 };
    if (page > 10) { page = 10 }
    if (size > 20) { size = 20 }

    if (parseInt(page) >= 1 && parseInt(size) >= 1) {
        pagination.limit = size;
        pagination.offset = size * (page - 1);
    }


    const events = await Event.findAll({
        attributes: {
            exclude: ['capacity', 'price', 'createdAt', 'updatedAt']
        },
        where,
        raw: true,
        ...pagination
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

    for (let event of events) {
        const eventImages = await EventImage.findAll({
            where: {
                eventId: event.id
            }
        });

        event.EventImages = eventImages
    };

    return res.status(200).json({
        Events: events
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
        attributes: ['id', 'organizerId', 'name', 'private', 'city', 'state'],
        where: {
            id: event.groupId
        }
    });

    event.Group = groupAttending;

    const groupAttendingImage = await GroupImage.findOne({
        where: {
            [Op.and]: [
                { groupId: event.groupId },
                { preview: true }
            ]
        }
    });

    if (groupAttendingImage) {
        event.GroupImage = groupAttendingImage
    }

    const eventOrganizer = await User.findByPk(groupAttending.organizerId);

    event.Host = eventOrganizer

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


    return res.status(200).json(event)
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
    if (!event) {
        return res.status(404).json({
            message: "Event couldn't be found",
            statusCode: 404
        })
    };
    // User is an attendee
    const userAttendee = await Attendance.findOne({
        where: {
            [Op.and]: [
                { eventId: event.id },
                { userId: user.id }
            ],
            [Op.or]: [
                { status: 'attending' },
                { status: 'member' }
            ]
        }
    });

    if (userAttendee) {
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
        })
    } else {
        // User is co-host
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


        if (!userGroupRelationship && eventGroup.organizerId !== user.id) {
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


router.put('/:eventId', validateNewEvent, async (req, res) => {
    const user = req.user.dataValues;
    if (!user) {
        return res.status(401).json({
            message: "Authentication required",
            statusCode: 401
        })
    };

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


    if (!userGroupRelationship && eventGroup.organizerId !== user.id) {
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


router.delete('/:eventId', async (req, res) => {
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


    if (!userGroupRelationship && eventGroup.organizerId !== user.id) {
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


router.get('/:eventId/attendees', async (req, res) => {
    const user = req.user.dataValues;
    const event = await Event.findByPk(req.params.eventId);
    if (!event) {
        return res.status(404).json({
            "message": "Event couldn't be found",
            "statusCode": 404
        })
    };

    const group = await Group.findByPk(event.groupId);
    const userGroupRelationship = await Membership.findOne({
        where: {
            [Op.and]: [
                { userId: user.id },
                { groupId: group.id },
                { status: 'co-host' }
            ]
        }
    });

    if (userGroupRelationship || group.organizerId === user.id) {
        const attendees = await Attendance.findAll({
            where: {
                eventId: event.id
            },
            raw: true
        });

        for (let attendee of attendees) {
            const attendeeInfo = await User.findByPk(attendee.userId, {
                attributes: ['firstName', 'lastName']
            });

            attendee.firstName = attendeeInfo.firstName;
            attendee.lastName = attendeeInfo.lastName;
            attendee.Attendace = {
                status: attendee.status
            };

            delete attendee.eventId;
            delete attendee.userId;
            delete attendee.status
            delete attendee.createdAt;
            delete attendee.updatedAt;

        };

        return res.status(200).json({
            Attendees: attendees
        });

    } else {
        const attendees = await Attendance.findAll({
            where: {
                [Op.and]: [
                    { eventId: event.id },
                    {
                        status: {
                            [Op.not]: 'pending'
                        }
                    }
                ]
            },
            raw: true
        });

        for (let attendee of attendees) {
            const attendeeInfo = await User.findByPk(attendee.userId, {
                attributes: ['firstName', 'lastName']
            });

            attendee.firstName = attendeeInfo.firstName;
            attendee.lastName = attendeeInfo.lastName;
            attendee.Attendace = {
                status: attendee.status
            };

            delete attendee.eventId;
            delete attendee.userId;
            delete attendee.status
            delete attendee.createdAt;
            delete attendee.updatedAt;

        };

        return res.status(200).json({
            Attendees: attendees
        });
    }
});


router.post('/:eventId/attendance', async (req, res) => {
    const user = req.user.dataValues;
    if (!user) {
        return res.status(401).json({
            message: "Authentication required",
            statusCode: 401
        })
    };
    const event = await Event.findByPk(req.params.eventId);
    if (!event) {
        return res.status(404).json({
            "message": "Event couldn't be found",
            "statusCode": 404
        })
    };

    const group = await Group.findByPk(event.groupId);
    const userGroupRelationship = await Membership.findOne({
        where: {
            [Op.and]: [
                { userId: user.id },
                { groupId: group.id },
                {
                    status: {
                        [Op.not]: 'pending'
                    }
                }
            ]
        }
    });

    if (!userGroupRelationship) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    };

    const userAttendanceRelationship = await Attendance.findOne({
        where: {
            [Op.and]: [
                { eventId: event.id },
                { userId: user.id }
            ]
        }
    });

    if (userAttendanceRelationship) {
        if (userAttendanceRelationship.status === 'member' || userAttendanceRelationship.status === 'attending') {
            return res.status(400).json({
                "message": "User is already an attendee of the event",
                "statusCode": 400
            })
        } else {
            return res.status(400).json({
                "message": "Attendance has already been requested",
                "statusCode": 400
            })
        }
    } else {
        const newAttendee = await Attendance.create({
            eventId: event.id,
            userId: user.id,
            status: 'pending'
        });

        return res.status(200).json({
            userId: newAttendee.userId,
            status: newAttendee.status
        })

    }

});


router.put('/:eventId/attendance', async (req, res) => {
    const user = req.user.dataValues;
    if (!user) {
        return res.status(401).json({
            message: "Authentication required",
            statusCode: 401
        })
    };

    const event = await Event.findByPk(req.params.eventId);
    if (!event) {
        return res.status(404).json({
            "message": "Event couldn't be found",
            "statusCode": 404
        })
    };

    const group = await Group.findByPk(event.groupId);
    const userGroupRelationship = await Membership.findOne({
        where: {
            [Op.and]: [
                { userId: user.id },
                { groupId: group.id },
                { status: 'co-host' }
            ]
        }
    });

    if (!userGroupRelationship && group.organizerId !== user.id) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    };

    const { userId, status } = req.body;

    const userEventRelationship = await Attendance.findOne({
        attributes: ['id', 'eventId', 'userId', 'status'],
        where: {
            [Op.and]: [
                { eventId: event.id },
                { userId: userId }
            ]
        }
    });
    if (!userEventRelationship) {
        return res.status(404).json({
            "message": "Attendance between the user and the event does not exist",
            "statusCode": 404
        })
    };

    if (status === 'pending') {
        return res.status(400).json({
            "message": "Cannot change an attendance status to pending",
            "statusCode": 400
        })
    };

    userEventRelationship.update({
        status: status
    });

    return res.status(200).json({
        id: userEventRelationship.id,
        eventId: userEventRelationship.eventId,
        userId: userEventRelationship.userId,
        status: userEventRelationship.status
    })

});


router.delete('/:eventId/attendance', async (req, res) => {
    const user = req.user.dataValues;
    if (!user) {
        return res.status(401).json({
            message: "Authentication required",
            statusCode: 401
        })
    };

    const event = await Event.findByPk(req.params.eventId);
    if (!event) {
        return res.status(404).json({
            "message": "Event couldn't be found",
            "statusCode": 404
        })
    };

    const group = await Group.findByPk(event.groupId);
    const { userId } = req.body;

    if (user.id !== userId && user.id !== group.organizerId) {
        return res.status(403).json({
            "message": "Only the User or organizer may delete an Attendance",
            "statusCode": 403
        })
    }

    const userAttendanceRelationship = await Attendance.findOne({
        where: {
            [Op.and]: [
                { userId: userId },
                { eventId: event.id }
            ]
        }
    });

    if (!userAttendanceRelationship) {
        return res.status(404).json({
            "message": "Attendance does not exist for this User",
            "statusCode": 404
        })
    } else {
        await userAttendanceRelationship.destroy();

        return res.status(200).json({
            "message": "Successfully deleted attendance from event"
        })
    }

})




module.exports = router;
