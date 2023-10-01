const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const pointInPolygon = require('@turf/boolean-point-in-polygon').default
const distance = require('@turf/distance').default
const createPartner = async (request, response) => {
    try {
        const { id, tradingName, ownerName, document, coverageArea, address } = request.body

        const partner = await prisma.partner.create({
            data: {
                id: parseInt(id),
                tradingName,
                ownerName,
                document,
                coverageArea,
                address
            }
        })

        response.json(partner)
    } catch (error) {
        response.status(500).json({ error: error.message })
    }
}

const getPartnerById = async (request, response) => {
    try {
        const { id } = request.params

        const partner = await prisma.partner.findUnique({
            where: {
                id: parseInt(id)
            }
        })

        response.json(partner)
    } catch (error) {
        response.status(500).json({ error: error.message })
    }
}

const getPartnerNearest = async (request, response) => {
    try {
        const { longitude, latitude } = request.body

        const point = {
            "type": "Point",
            "coordinates": [longitude, latitude]
        };

        const partners = await prisma.partner.findMany()

        const partnersCoveringThePoint = partners.filter(partner => {
            return pointInPolygon(point, partner['coverageArea'])
        })

        try {
            const nearestPartner = partnersCoveringThePoint.reduce((prev, current) => {
                const distancePrev = distance(point, prev['address'], { units: 'kilometers' })
                const distanceCurrent = distance(point, current['address'], { units: 'kilometers' })

                return distancePrev < distanceCurrent ? prev : current
            })

            response.json(nearestPartner)
        } catch (error) {
            response.status(500).json({ error: 'No partner found' })
        }
    } catch (error) {
        response.status(500).json({ error: error.message })
    }
}

module.exports = {
    createPartner,
    getPartnerById,
    getPartnerNearest
}