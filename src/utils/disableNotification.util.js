/* eslint-disable require-jsdoc */
import userService from '../services/user.service';
import requestService from '../services/request.service';

const { updateIsVerifiedOrUpdateNotification, getUserById } = userService;
const { updateInAppNotification } = requestService;

const disableNotification = async (mode, id) => {
    const { dataValues } = await getUserById(id);
    const emailNotificationStatus = dataValues.emailNotification;
    const inappNotificationStatus = dataValues.inAppNotification;
    if (mode === 'email') {
       await updateIsVerifiedOrUpdateNotification(id, emailNotificationStatus);
    } else if (mode === 'inapp') {
        await updateInAppNotification(id, inappNotificationStatus);
    } else {
        return null;
    }
};  
export default disableNotification;
