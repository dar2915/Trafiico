CREATE VIEW "ViewViolatorsOverview" AS
SELECT
    VTDVA.body_num,
    VTDVA.driver_name,
    COUNT(VTDVA.complain) AS num_of_violations,
    VTDVA.franchise_status,
    VTDVA.date
FROM
    "ViewTricycleDriverViolationsAdmin" AS VTDVA
GROUP BY
    VTDVA.body_num,
    VTDVA.driver_name,
    VTDVA.franchise_status,
    VTDVA.date
ORDER BY
    num_of_violations,
    VTDVA.date DESC;