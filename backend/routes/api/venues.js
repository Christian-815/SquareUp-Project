const express = require('express');
const router = express.Router();
const { Group, Membership, GroupImage, User, Venue } = require('../../db/models');
const { Op } = require('sequelize');


// router.get()
