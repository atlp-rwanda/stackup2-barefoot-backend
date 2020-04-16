import AccommodationService from '../services/accommodation.service';
import responseHandlers from '../utils/responseHandlers';
import customMessages from '../utils/customMessages';
import statusCodes from '../utils/statusCodes';

const {
    successResponse,
    errorResponse,
} = responseHandlers;

const {
    bookedAccommodation,
    duplicateAccommodationBookings,
} = customMessages;

const {
    badRequest,
    created,
} = statusCodes;

const {
    handleBookAccommodation,
} = AccommodationService;

/**
* @description Accommodations controller class
*/
export default class AccommodationController {
    /**
     * @param {Request} req Node/express requesT
     * @param {Response} res Node/express response
     * @returns {Object} Custom response with accommodation facility details
     * @description Use this method to book an accommodation facility
     */
    static async bookAccommodation(req, res) {
        try {
            const bookingInfo = req.body;
            const bookingDetail = await handleBookAccommodation(bookingInfo);
            return successResponse(res, created, bookedAccommodation, undefined, bookingDetail);    
        } catch (error) {
            return errorResponse(res, badRequest, duplicateAccommodationBookings);
        }
    }
}
