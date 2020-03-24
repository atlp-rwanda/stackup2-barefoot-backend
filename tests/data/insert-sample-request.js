export const INSERT_SAMPLE_REQUEST = `
INSERT INTO requests ("userId","travelFrom","travelTo","travelDate","travelReason","travelType",status,accommodation,"createdAt","updatedAt")
VALUES(1,'Tokyo','Seoul',NOW(),'Business Meeting','one-way','accepted',true,NOW(),NOW())`;
