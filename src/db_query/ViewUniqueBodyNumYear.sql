-- body number should not be used in the same year
CREATE
OR REPLACE VIEW "ViewUniqueBodyNumYear" AS
SELECT
    OP.id,
    OP.last_name,
    OP.first_name,
    OP.middle_name,
    VOR.body_num,
    APP.application_date,
    APP.status
FROM
    "OperatorProfiles" AS OP
    JOIN "VehicleOwnershipRecords" AS VOR ON OP.id = VOR.operator_id
    LEFT JOIN "Applications" AS APP ON OP.id = APP.operator_id
    AND VOR.body_num = APP.body_num
WHERE
    APP.body_num IS NULL
    OR EXTRACT(
        YEAR
        FROM
            APP.application_date
    ) != EXTRACT(
        YEAR
        FROM
            NOW()
    )