CREATE VIEW ViewTricycleDriverViolations AS
SELECT
    APP.id,
    APP.body_num,
    APP.franchise_num,
    --  DP.last_name AS driver_last_name,
    --  DP.first_name AS driver_first_name,
    --  DP.middle_name AS driver_middle_name,
    CONCAT(DP.first_name, ' ', DP.last_name) AS driver_name,
    DP.license_num AS driver_license_num,
    --  OP.last_name AS operator_last_name,
    --  OP.first_name AS operator_first_name,
    --  OP.middle_name AS operator_middle_name,
    CONCAT(OP.first_name, ' ', OP.last_name) AS operator_name,
    OP.address AS operator_address,
    VOR.lto_plate_num AS vehicle_plate_num,
    VOR.date_registered AS vehicle_date_registered,
    VOR.zone AS vehicle_zone
FROM
    "Applications" AS APP
    JOIN "DriverProfiles" AS DP ON APP.driver_id = DP.id
    JOIN "OperatorProfiles" AS OP ON APP.operator_id = OP.id
    JOIN "VehicleOwnershipRecords" AS VOR ON OP.id = VOR.operator_id