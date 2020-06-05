import _ from 'lodash';
import AccommodationService from '../services/accommodation.service';
import responseHandlers from '../utils/responseHandlers';
import customMsg from '../utils/customMessages';
import statusCodes from '../utils/statusCodes';
import AccommodationRoomService from '../services/accommodationRoom.service';
import uploadImg from '../utils/profile.utils';
import { offsetAndLimit } from '../utils/comment.utils';
import RatingService from '../services/rating.service';
import BookAccommodationService from '../services/bookAccommodationService.service';
import handleEmailNotifications from '../utils/handleEmailNotifications.util';
import { bookAccommodationMessage, accommodationTripManager } from '../utils/emailMessages';

const {
    successResponse,
    errorResponse,
} = responseHandlers;

const {
    badRequest,
    created, ok, notFound
} = statusCodes;
const {
successRating,
failedRating,
} = customMsg;
    const {
    bookedAccommodation,
    duplicateAccommodationBookings,
    bookingInfo,
} = customMsg;


const {
    handleBookAccommodation,
    getBookingById
} = AccommodationService;


/**
 * 
 * @param {*} dataToUpdate 
 * @param {*} req 
 * @param {*} service 
 * @param {*} res 
 * @returns {*} response
 */
const update = async (dataToUpdate, req, service, res) => {
    await uploadImg(req, res);
    req.body.accommodationImage = req.body.myImage;
    const { id } = req.params;
    const updatedAccommodation = await service.updateBy(dataToUpdate, { id });
    
    if (updatedAccommodation[0]) {
        const { dataValues } = updatedAccommodation[1][0];
        successResponse(res, ok, undefined, undefined, dataValues);
    } else {
        errorResponse(res, notFound, customMsg.itemNotExist);
    }
};

/**
 * 
 * @param {*} req 
 * @param {*} service 
 * @param {*} res 
 * @param {*} message
 * @returns {*} response
 */
const deletion = async (req, service, res, message) => {
    const { id } = req.params;
    await service.temporaryDelete({ id });
    successResponse(res, ok, message, undefined, undefined);
};

/**
 * @description this class AccommodationController deals with all of the methods 
 * regarding with accommodation 
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
            const bookingData = req.body;
            const currentUser = req.sessionUser;
            const bookingDetail = await handleBookAccommodation(bookingData);
            const link = `${process.env.APP_URL}/api/accommodations/${bookingDetail.id}`;
            await handleEmailNotifications(currentUser, bookAccommodationMessage, link, 'Book accommodation');
            return successResponse(res, created, bookedAccommodation, undefined, bookingDetail);
        } catch (error) {
            errorResponse(res, badRequest, customMsg.duplicateAccommodationBookings);
        }
    }


    /**
     * @param {object} req
     * @param {object} res
     * @returns {object} newSavedAccommodation
     * @description sends response containing the saved accommodation to user
     */
    static addNewAccommodation = async (req, res) => {
        await uploadImg(req, res);
        const accommodationData = req.body;
        accommodationData.createdBy = req.sessionUser.id;
        accommodationData.accommodationImage = req.body.myImage;
        const { dataValues } = await AccommodationService.saveAll(accommodationData);
        successResponse(res, created, customMsg.accommodationCreated, undefined, dataValues);
    }

    /**
     * @param {object} req
     * @param {object} res
     * @returns {object} newSavedAccommodationRoom
     * @description sends response containing the saved accommodation room to user
     */
    static addNewAccommodationRoom = async (req, res) => {
        const accommodationRoomData = req.body;
        req.body.accommodationId = req.params.accommodationId;
        const data = await AccommodationRoomService
            .saveAll(accommodationRoomData);
        successResponse(res, created, customMsg.accommodationRoomCreated, undefined, data);
    }

    /**
     * @param {object} req
     * @param {object} res
     * @returns {object} sends response to user
     * @description it sends found accommodations to user in response payload
     */
    static getAccommodations = async (req, res) => {
        const { city, page } = req.query;
        const { offset, limit } = offsetAndLimit(page);
        const foundAccomms = await AccommodationService
            .getAndCountAllIncludeAssociation({ accommodationAddress: city }, offset, limit);

        if (foundAccomms.count !== 0) {
            const { rows } = foundAccomms;
            if (rows.length !== 0) {
                successResponse(res, ok, customMsg.accommodationsRetrieved, undefined, rows);
            } else {
                errorResponse(res, notFound, customMsg.pageNotFound);
            }
        } else {
            errorResponse(res, notFound, customMsg.noAccommodFoundInMatchInputs);
        }
    }

    /**
     * @param {object} req
     * @param {object} res
     * @returns {object} next
     * @method
     * @description it sends a response to the user about the updated accommodation
     */
    static updateAccommodation = async (req, res) => {
        update(req.body, req, AccommodationService, res);
    }

    /**
     * @param {object} req
     * @param {object} res
     * @returns {object} res
     * @method
     * @description it sends a response to the user about the updated accommodation room
     */
    static updateAccommodationRoom = async (req, res) => {
        update(req.body, req, AccommodationRoomService, res);
    }

    /**
     * @param {object} req
     * @param {object} res
     * @returns {object} res
     * @method
     * @description it sends a response to the user about the updated accommodation room
     */
    static deleteAccommodation = async (req, res) => {
        deletion(req, AccommodationService, res, customMsg.accommodationDeleted);
    }

    /**
     * @param {object} req
     * @param {object} res
     * @returns {object} res
     * @method
     * @description it sends a response to the user about the updated accommodation room
     */
    static deleteAccommodationRoom = async (req, res) => {
        deletion(req, AccommodationRoomService, res, customMsg.roomDeleted);
    }

    /**
     * @param {Request} req Node/express requesT
     * @param {Response} res Node/express response
     * @returns {Object} Custom response with accommodation facility details
     * @description Use this method to book an accommodation facility
     */
    static async rateAccommodation(req, res) {
        try {
            const ratingInfo = { ...req.body };
            const ratingDetail = await RatingService.saveAll(ratingInfo);
            return successResponse(
                res,
                created,
                successRating,
                undefined,
                ratingDetail
            );
        } catch (error) {
            return errorResponse(
                res,
                badRequest,
                failedRating
            );
        }
    }

    /**
     * @param {Request} req Node/express requesT
     * @param {Response} res Node/express response
     * @returns {Object} Custom response with accommodation facility details
     * @description Use this method to get booked accommodation
     */
    static async getBookedAccommodation(req, res) {
        const { accommodationId } = req.params;
        const accommodation = await getBookingById(accommodationId);
        return successResponse(res, ok, bookingInfo, null, accommodation);
    }
} 
