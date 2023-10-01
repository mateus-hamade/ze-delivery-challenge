const express = require('express')

const router = express.Router()

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const { createPartner, getPartnerById, getPartnerNearest } = require('../controllers/partnerController')

router.post('/nearest', async (request, response) => {
    await getPartnerNearest(request, response)
})

router.post('/', async (request, response) => {
    await createPartner(request, response)
})

router.get('/:id', async (request, response) => {
    await getPartnerById(request, response)
})

module.exports = router