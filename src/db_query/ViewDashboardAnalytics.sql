CREATE VIEW "ViewDashboardAnalytics" AS
SELECT
    (
        SELECT
            COUNT(DISTINCT VOR.lto_plate_num)
        FROM
            "VehicleOwnershipRecords" AS VOR
    ) AS total_vehicles,
    (
        SELECT
            COUNT(DISTINCT OP.id)
        FROM
            "OperatorProfiles" AS OP
    ) AS total_operators,
    (
        SELECT
            COUNT(DISTINCT DP.id)
        FROM
            "DriverProfiles" AS DP
    ) AS total_drivers,
    (
        SELECT
            COUNT(DISTINCT APP.id)
        FROM
            "Applications" AS APP
    ) AS total_applications,
    (
        SELECT
            COUNT(DISTINCT RV.id)
        FROM
            "ReportViolations" AS RV
    ) AS total_reports,
    (
        SELECT
            SUM(CAST(P.amount AS NUMERIC))
        FROM
            "Payments" AS P
    ) AS total_payments,
    (
        SELECT
            COUNT(DISTINCT APP.id)
        FROM
            "Applications" AS APP
        WHERE
            APP.status = 'approved'
    ) AS total_approved_applications;