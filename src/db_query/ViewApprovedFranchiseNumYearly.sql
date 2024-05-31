CREATE VIEW "ViewApprovedFranchiseNumYearly" AS
SELECT
    EXTRACT(
        YEAR
        FROM
            application_date
    ) AS year,
    EXTRACT(
        MONTH
        FROM
            application_date
    ) AS month,
    COUNT(franchise_num) AS count
FROM
    "Applications" AS APP
WHERE
    status = 'approved'
GROUP BY
    year,
    month
ORDER BY
    year,
    month;