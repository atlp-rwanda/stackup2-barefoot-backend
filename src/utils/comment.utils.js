/**
 * 
 * @param {object} page 
 * @returns {object} offset and limit 
 * @description it returns offset and limit when it is passed a page
 */
export const dbPage = (page) => {
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
