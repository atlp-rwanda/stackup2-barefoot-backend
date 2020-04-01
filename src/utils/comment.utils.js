/**
 * 
 * @param {object} page 
 * @returns {object} offset and limit
 * @description it returns offset and limit which are the variables to be used 
 * to know the delimitations of data to retrieve from the database when a user wants 
 * to retrieve requests or comments
 */
export const offsetAndLimit = (page) => {
    let result, offset;
    let limit = 10;
    if (page) {
        offset = (page - 1) * limit;
        result = { offset, limit };
    } else {
        offset = 0;
        limit = null;
        result = { offset, limit };
    }
    
    return result;
};
