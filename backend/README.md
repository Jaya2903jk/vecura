ALTER TABLE issueTicket
ADD type VARCHAR(50) NULL;

ALTER TABLE CustomerRefundComplaint
ADD ticketId int NULL;

ALTER TABLE issueTicket
ALTER COLUMN AttachFile NVARCHAR(MAX) NULL;

DELETE FROM issueTicket
WHERE ticketId IN (87295, 87297, 87300);

DELETE FROM CustomerRefundComplaint
WHERE complaintid IN (307, 308, 309,310,311);
