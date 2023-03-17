const express = require('express');
const router = express.Router();
const { Group, Membership, GroupImage, User, Venue, Event, Attendance, EventImage } = require('../../db/models');
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
    check('groupPrivate')
        .exists({ checkFalsy: true })
        .isBoolean()
        .withMessage("Private must be a boolean"),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage("City is required"),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage("State is required"),
    handleValidationErrors
];

const validateNewVenue = [
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
        .isDecimal({ force_decimal: true })
        .withMessage('Latitude is not valid'),
    check('lng')
        .exists({ checkFalsy: true })
        .isDecimal({ force_decimal: true })
        .withMessage('Longitude is not valid'),
    handleValidationErrors
];

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
            },
            raw: true
        })
        if (!previewImage) {
            group.previewImage = "No preview Image available for this group."
        } else {
            group.previewImage = previewImage.url
        }

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
        } else {
            group.previewImage = previewImage.dataValues.url
        }
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

    const { name, about, type, groupPrivate, city, state } = req.body;

    const group = await Group.create({
        organizerId: currentUser,
        name,
        about,
        type,
        private: groupPrivate,
        city,
        state
    });

    const newGoupMember = await Membership.create({
        userId: group.organizerId,
        groupId: group.id,
        status: 'co-host'
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

router.post('/:groupId/images', async (req, res) => {
    const user = req.user.dataValues.id;
    if (!user) {
        return res.status(401).json({
            message: "Authentication required",
            statusCode: 401
        })
    };
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


router.put('/:groupId', validateNewGroup, async (req, res) => {
    const user = req.user.dataValues.id;
    if (!user) {
        return res.status(401).json({
            message: "Authentication required",
            statusCode: 401
        })
    };

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

    const { name, about, type, private, city, state } = req.body;

    group.update({
        name: name,
        about: about,
        type: type,
        private: private,
        city: city,
        state: state
    });


    return res.status(200).json(group)
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

router.delete('/:groupId', async (req, res) => {
    const user = req.user.dataValues.id;
    if (!user) {
        return res.status(401).json({
            message: "Authentication required",
            statusCode: 401
        })
    };

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

    await group.destroy();

    return res.status(200).json({
        message: "Successfully deleted",
        statusCode: 200
    });
});

router.get('/:groupId/venues', async (req, res) => {
    const user = req.user.dataValues;
    if (!user) {
        return res.status(401).json({
            message: "Authentication required",
            statusCode: 401
        })
    };
    const group = await Group.findByPk(req.params.groupId);
    if (!group) {
        return res.status(404).json({
            message: "Group couldn't be found",
            statusCode: 404
        })
    };

    const userGroupRelationship = await Membership.findOne({
        where: {
            [Op.and]: [
                { userId: user.id },
                { groupId: group.id },
                { status: 'co-host'}
            ]
        },
        raw: true
    });

    if (user.id !== group.organizerId && !userGroupRelationship) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    };

    const groupVenues = await Venue.findAll({
        where: {
            groupId: group.id
        },
        raw: true
    });

    return res.status(200).json({
        Venues: groupVenues
    });

});

router.post('/:groupId/venues', validateNewVenue, async (req, res) => {
    const user = req.user.dataValues;
    if (!user) {
        return res.status(401).json({
            message: "Authentication required",
            statusCode: 401
        })
    };

    const group = await Group.findByPk(req.params.groupId);
    if (!group) {
        return res.status(404).json({
            message: "Group couldn't be found",
            statusCode: 404
        })
    };

    const userGroupRelationship = await Membership.findOne({
        where: {
            [Op.and]: [
                { userId: user.id },
                { groupId: group.id },
                { status: 'co-host'}
            ]
        },
        raw: true
    });

    if (user.id !== group.organizerId && !userGroupRelationship) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    };

    const { address, city, state, lat, lng } = req.body

    const newVenue = await Venue.create({
        groupId: group.id,
        address,
        city,
        state,
        lat,
        lng
    });

    return res.status(200).json({
        id: newVenue.id,
        groupId: newVenue.groupId,
        address: newVenue.address,
        city: newVenue.city,
        state: newVenue.city,
        lat: newVenue.lat,
        lng: newVenue.lng
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

router.get('/:groupId/events', async (req, res) => {
    const group = await Group.findByPk(req.params.groupId, {
        attributes: ['id', 'name', 'city', 'state']
    });
    if (!group) {
        return res.status(404).json({
            message: "Group couldn't be found",
            statusCode: 404
        })
    };

    const events = await Event.findAll({
        attributes: {
            exclude: ['description', 'capacity', 'price', 'createdAt', 'updatedAt']
        },
        where: {
            groupId: group.id
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
        event.Group = group;

        const eventVenue = await Venue.findOne({
            attributes: ['id', 'city', 'state'],
            where: {
                id: event.venueId
            }
        });

        if (!eventVenue) {
            event.Venue = null
        } else {
            event.Venue = eventVenue
        }
    };

    return res.status(200).json({
        Events: events
    })
});

router.post('/:groupId/events', validateNewEvent, async (req,res) => {
    const user = req.user.dataValues;
    if (!user) {
        return res.status(401).json({
            message: "Authentication required",
            statusCode: 401
        })
    };

    const group = await Group.findByPk(req.params.groupId);
    if (!group) {
        return res.status(404).json({
            message: "Group couldn't be found",
            statusCode: 404
        })
    };

    const userGroupRelationship = await Membership.findOne({
        where: {
            [Op.and]: [
                { userId: user.id },
                { groupId: group.id },
                { status: 'co-host'}
            ]
        },
        raw: true
    });

    if (user.id !== group.organizerId && !userGroupRelationship) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    };

    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;

    const checkVenueExist = await Venue.findByPk(venueId);

    if (!checkVenueExist) {
        return res.status(400).json({
            message: "Validation error",
            statusCode: 400,
            errors: {
                venueId: "Venue does not exist"
            }
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


    const newGroupEvent = await Event.create({
        groupId: group.id,
        venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate
    });

    return res.status(200).json({
        id: newGroupEvent.id,
        groupId: newGroupEvent.groupId,
        venueId: newGroupEvent.venueId,
        name: newGroupEvent.name,
        type: newGroupEvent.type,
        capacity: newGroupEvent.capacity,
        price: newGroupEvent.price,
        description: newGroupEvent.description,
        startDate: newGroupEvent.startDate,
        endDate: newGroupEvent.endDate
    });

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


router.get('/:groupId/members', async (req,res) => {
    const user = req.user.dataValues
    const group = await Group.findByPk(req.params.groupId);
    if (!group) {
        return res.status(404).json({
            message: "Group couldn't be found",
            statusCode: 404
        })
    };

    const userGroupRelationship = await Membership.findOne({
        where: {
            [Op.and]: [
                {groupId: group.id},
                {userId: user.id},
                {status: 'co-host'}
            ]
        }
    })

    if (group.organizerId === user.id || userGroupRelationship) {
        const groupMembers = await Membership.findAll({
            where: {
                groupId: group.id
            },
            raw: true
        })

        for (let groupMember of groupMembers) {
            const groupMemberInfo = await User.findByPk(groupMember.userId, {
                attributes: ['firstName', 'lastName']
            });
            groupMember.firstName = groupMemberInfo.firstName;
            groupMember.lastName = groupMemberInfo.lastName;
            groupMember.Membership = {
                status: groupMember.status
            };

            delete groupMember.userId;
            delete groupMember.groupId;
            delete groupMember.status;
            delete groupMember.createdAt;
            delete groupMember.updatedAt;
        }

        return res.status(200).json({
            Members: groupMembers
        })
    } else {
        const groupMembers = await Membership.findAll({
            where: {
                [Op.and]: [
                    {groupId: group.id},
                    {status: {
                        [Op.not]: "pending"
                    }}
                ]
            },
            raw: true
        })

        for (let groupMember of groupMembers) {
            const groupMemberInfo = await User.findByPk(groupMember.userId, {
                attributes: ['firstName', 'lastName']
            });
            groupMember.firstName = groupMemberInfo.firstName;
            groupMember.lastName = groupMemberInfo.lastName;
            groupMember.Membership = {
                status: groupMember.status
            };

            delete groupMember.userId;
            delete groupMember.groupId;
            delete groupMember.status;
            delete groupMember.createdAt;
            delete groupMember.updatedAt;
        }

        return res.status(200).json({
            Members: groupMembers
        })
    }
});

router.post('/:groupId/membership', async (req,res) => {
    const user = req.user.dataValues;
    if (!user) {
        return res.status(401).json({
            message: "Authentication required",
            statusCode: 401
        })
    };
    const group = await Group.findByPk(req.params.groupId);
    if (!group) {
        return res.status(404).json({
            message: "Group couldn't be found",
            statusCode: 404
        })
    };

    const userGroupRelationshipPending = await Membership.findOne({
        where: {
            [Op.and]: [
                {userId: user.id},
                {groupId: group.id},
                {status: 'pending'}
            ]
        }
    });

    if (userGroupRelationshipPending) {
        return res.status(400).json({
            message: "Membership has already been requested",
            statusCode: 400
        })
    } else {
        const userGroupRelationshipMember = await Membership.findOne({
            where: {
                [Op.and]: [
                    { userId: user.id },
                    { groupId: group.id }
                ]
            }
        });

        if (userGroupRelationshipMember) {
            return res.status(400).json({
                message: "User is already a member of the group",
                statusCode: 400
            })
        }
    };


    const newMember = await Membership.create({
        userId: user.id,
        groupId: group.id,
        status: 'pending'
    });

    return res.status(200).json({
        memberId: newMember.id,
        status: newMember.status
    })

});

router.put('/:groupId/membership', async (req, res) => {
    const user = req.user.dataValues;
    if (!user) {
        return res.status(401).json({
            message: "Authentication required",
            statusCode: 401
        })
    };
    const group = await Group.findByPk(req.params.groupId);
    if (!group) {
        return res.status(404).json({
            message: "Group couldn't be found",
            statusCode: 404
        })
    };

    const { memberId, status } = req.body;

    const userToEdit = await User.findByPk(memberId);

    if (!userToEdit) {
        return res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "memberId": "User couldn't be found"
            }
        })
    };

    const member = await Membership.findOne({
        where: {
            [Op.and]: [
                { userId: memberId },
                { groupId: group.id}
            ]
        }
    })

    if (!member) {
        return res.status(404).json({
            "message": "Membership between the user and the group does not exists",
            "statusCode": 404
        })
    };

    if (status === 'pending') {
        return res.status(400).json({
            message: "Validation Error",
            statusCode: 400,
            errors: {
                status: "Cannot change a membership status to pending"
            }
        });
    }

    if (status === 'member') {
        const userGroupRelationship = await Membership.findOne({
            where: {
                [Op.and]: [
                    {userId: user.id},
                    {groupId: group.id},
                    {status: 'co-host'}
                ]
            }
        });

        if (!userGroupRelationship && group.organizerId !== user.id) {
            return res.status(403).json({
                message: "Forbidden",
                statusCode: 403
            })
        };

        member.update({
            status: 'member'
        });

        return res.status(200).json({
            id: member.id,
            groupId: member.groupId,
            memberId: member.userId,
            status: member.status
        })

    };

    if (status === 'co-host') {
        if (group.organizerId !== user.id) {
            return res.status(403).json({
                message: "Forbidden",
                statusCode: 403
            })
        };

        member.update({
            status: 'co-host'
        });

        return res.status(200).json({
            id: member.id,
            groupId: member.groupId,
            memberId: member.userId,
            status: member.status
        })
    }

});


router.delete('/:groupId/membership', async (req,res) => {
    const user = req.user.dataValues;
    if (!user) {
        return res.status(401).json({
            message: "Authentication required",
            statusCode: 401
        })
    };

    const group = await Group.findByPk(req.params.groupId);
    if (!group) {
        return res.status(404).json({
            message: "Group couldn't be found",
            statusCode: 404
        })
    };

    const {memberId} = req.body;

    const userMembershipToDelete = await User.findByPk(memberId);

    if (!userMembershipToDelete) {
        return res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "memberId": "User couldn't be found"
            }
        })
    };

    const member = await Membership.findOne({
        where: {
            [Op.and]: [
                {userId: memberId},
                {groupId: group.id}
            ]
        }
    });
    if (!member) {
        return res.status(404).json({
            "message": "Membership does not exist for this User",
            "statusCode": 404
        })
    };

    if (user.id !== group.organizerId && user.id !== member.userId) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        })
    };

    await member.destroy();

    return res.status(200).json({
        message: "Successfully deleted membership from group"
    });
})


module.exports = router;
