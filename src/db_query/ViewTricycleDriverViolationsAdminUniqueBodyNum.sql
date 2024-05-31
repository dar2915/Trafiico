-- it is used in the new implementation of data row Tricycle Driver's Violation
CREATE
OR REPLACE VIEW "ViewTricycleDriverViolationsAdminUniqueBodyNum" AS
SELECT
    RV.*,
    APP.franchise_status,
    CONCAT(DP.first_name, ' ', DP.last_name) AS driver_name,
    DP.license_num AS driver_license_num,
    CONCAT(OP.first_name, ' ', OP.last_name) AS operator_name,
    OP.address AS operator_address,
    VOR.lto_plate_num AS vehicle_plate_num,
    VOR.date_registered AS vehicle_date_registered,
    APP.zone AS vehicle_zone,
    CONCAT(E.first_name, ' ', E.last_name) AS enforcer_name,
    CONCAT(P.first_name, ' ', P.last_name) AS passenger_name
FROM
    (
        SELECT
            *,
            ROW_NUMBER() OVER (
                PARTITION BY body_num
                ORDER BY
                    body_num
            ) as rn
        FROM
            "ReportViolations"
    ) AS RV
    JOIN "Applications" AS APP ON RV.body_num = APP.body_num
    JOIN "DriverProfiles" AS DP ON APP.driver_id = DP.id
    JOIN "OperatorProfiles" AS OP ON APP.operator_id = OP.id
    LEFT JOIN "UserLists" AS E ON RV.enforcer_id = E.id
    LEFT JOIN "UserLists" AS P ON RV.passenger_id = P.id
    JOIN (
        SELECT
            operator_id,
            lto_plate_num,
            date_registered,
            zone
        FROM
            (
                SELECT
                    operator_id,
                    lto_plate_num,
                    date_registered,
                    zone,
                    ROW_NUMBER() OVER (
                        PARTITION BY operator_id
                        ORDER BY
                            date_registered DESC
                    ) as rn
                FROM
                    "VehicleOwnershipRecords"
            ) t
        WHERE
            rn = 1
    ) AS VOR ON OP.id = VOR.operator_id
WHERE
    RV.rn = 1
ORDER BY
    CASE
        WHEN RV.action_taken = 'pending' THEN 1
        WHEN RV.action_taken = 'resolved' THEN 2
        WHEN RV.action_taken = 'penalty-imposed' THEN 3
        ELSE 4
    END;