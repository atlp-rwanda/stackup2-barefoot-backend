import Joi from '@hapi/joi';
import customMessages from '../utils/customMessages';

/**
* @param {string} pattern
* @param {string} messages
* @returns {object} a chained validation methods
*/
const validationMethods = (pattern, messages) => {
    const methods = Joi.string()
    .regex(pattern)
    .trim()
    .required()
    .messages(messages);
     return methods;
};

/**
* @param {object} user
* @returns {object} return body assigned to their validation methods
*/
const validateSignup = user => {
    const schema = Joi.object({
        firstName: validationMethods(/^([a-zA-Z]{3,})+$/, { 'string.pattern.base': `${customMessages.invalidFirstname}` }),
        lastName: validationMethods(/^([a-zA-Z]{3,})+$/, { 'string.pattern.base': `${customMessages.invalidLastname}` }),
        username: validationMethods(/^([a-zA-Z0-9@_.-]{3,})+$/, { 'string.pattern.base': `${customMessages.invalidUsername}` }),
        email: validationMethods(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, { 'string.pattern.base': `${customMessages.invalidEmail}` }),
        gender: validationMethods(/^Male$|^male$|^Female$|^female$/, { 'string.pattern.base': `${customMessages.invalidGender}` }),
        password: validationMethods(/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/, { 'string.pattern.base': `${customMessages.invalidPassword}` }),
        address: validationMethods(/^(\w)+$/, { 'string.pattern.base': `${customMessages.invalidAddress}` }),
});
    return schema.validate(user, {
    abortEarly: false
  });
};

/**
* @param {object} user
* @returns {object} return body assigned to their validation methods
*/
const validateRoleAssigning = user => {
  const schema = Joi.object({
    email: validationMethods(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, { 'string.pattern.base': `${customMessages.invalidEmail}` }),
    role: validationMethods(/^superAdmin$|^travelAdmin$|^travelTeamMember$|^manager|^requester$/, { 'string.pattern.base': `${customMessages.invalidRole}` })
  });
  return schema.validate(user, {
    abortEarly: false
  });
};
export { validateSignup, validateRoleAssigning };
