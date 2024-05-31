CREATE VIEW "ViewRequirementDocsWithYear" AS
SELECT
    APP.application_date,
    RD.*
FROM
    "RequirementDocuments" AS RD
    JOIN "Applications" AS APP ON RD.application_id = APP.id;