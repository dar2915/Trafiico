CREATE VIEW "ViewRenewedTricycles" AS
SELECT
    APP.body_num,
    VOR.motor_num,
    VOR.lto_plate_num,
    CONCAT(OP.first_name, ' ', OP.last_name) AS operator_name,
    CONCAT(DP.first_name, ' ', DP.last_name) AS driver_name,
    DP.address AS driver_address
FROM
    "Applications" AS APP
    JOIN "DriverProfiles" AS DP ON APP.driver_id = DP.id
    JOIN "OperatorProfiles" AS OP ON APP.operator_id = OP.id
    LEFT JOIN "VehicleOwnershipRecords" AS VOR ON OP.id = VOR.operator_id
    AND APP.body_num = VOR.body_num
WHERE
    APP.franchise_status = 'renewal';