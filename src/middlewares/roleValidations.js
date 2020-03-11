import { validateRole, displayErrorMessages } from '../utils/validations';

/**
 * @param {object} req
 * @param {object} res
 * @param {object} next
 * @returns{object} return next() if validations pass
 */
const roleValidation = async (req, res, next) => {
    const validated = validateRole(req.body);
    const { error } = validated;
    if (!error) {
    req.body = validated.value;
    }
    displayErrorMessages(error, res, next);
};

export { roleValidation };
