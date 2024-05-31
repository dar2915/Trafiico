CREATE
OR REPLACE VIEW "ViewDriverComplaints" AS
SELECT
    CONCAT(DP.first_name, ' ', DP.last_name) AS driver_name,
    DP.address,
    EXTRACT(
        YEAR
        FROM
            RV.date
    ) AS year,
    SUM(
        CASE
            WHEN RV.complain = 'Over-Paying' THEN 1
            ELSE 0
        END
    ) AS total_over_paying,
    SUM(
        CASE
            WHEN RV.complain = 'Over-Loading' THEN 1
            ELSE 0
        END
    ) AS total_over_loading,
    SUM(
        CASE
            WHEN RV.complain = 'Over-Speeding' THEN 1
            ELSE 0
        END
    ) AS total_over_speeding,
    SUM(
        CASE
            WHEN RV.complain = 'Over-Pricing' THEN 1
            ELSE 0
        END
    ) AS total_over_pricing,
    SUM(
        CASE
            WHEN RV.complain NOT IN (
                'Over-Paying',
                'Over-Loading',
                'Over-Speeding',
                'Over-Pricing'
            ) THEN 1
            ELSE 0
        END
    ) AS total_other_complaints,
    COUNT(RV.complain) AS total_complaints
FROM
    "ReportViolations" AS RV
    JOIN "Applications" AS APP ON RV.body_num = APP.body_num
    JOIN "DriverProfiles" AS DP ON APP.driver_id = DP.id
GROUP BY
    DP.first_name,
    DP.last_name,
    DP.address,
    EXTRACT(
        YEAR
        FROM
            RV.date
    )
ORDER BY
    total_complaints DESC;