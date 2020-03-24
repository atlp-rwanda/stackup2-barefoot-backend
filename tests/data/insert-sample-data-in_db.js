export const INSERT_SAMPLE_REQUEST = `
INSERT INTO requests ("userId","travelFrom","travelTo","travelDate","travelReason","travelType",status,accommodation,"createdAt","updatedAt")
VALUES(10,'Tokyo','Seoul',NOW(),'Business Meeting','one-way','accepted',true,NOW(),NOW())`;

export const UPDATE_USER_8_TO_MANAGER = 'UPDATE users SET role=\'manager\' WHERE id=11';
export const INSERT_SAMPLE_COMMENT = `
INSERT INTO requests ("userId","requestId",comment,"createdAt","updatedAt")
VALUES(6,1,'Welcome to the new world',NOW(),NOW())`;
