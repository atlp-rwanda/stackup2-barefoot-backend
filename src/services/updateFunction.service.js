/* eslint-disable require-jsdoc */
import models from '../database/models';

const { user } = models;

const updateFunc = async (data1, whereData2) => {
    const assignRoles = await user.update(
        { data1 },
        { where: { whereData2 } }
    );
    return assignRoles;
};

export default updateFunc;
