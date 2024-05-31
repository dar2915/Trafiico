CREATE
OR REPLACE VIEW "ViewDriversNotInApplicationsCurrentYear" AS
SELECT
    DP.id,
    DP.last_name,
    DP.first_name,
    DP.middle_name,
    DP.birth_date,
    DP.birth_place,
    DP.address,
    DP.civil_status,
    DP.blood_type,
    DP.contact_num,
    DP.license_num,
    DP.license_expiration,
    DP.is_active,
    DP.contact_relationship_driver,
    DP.contact_person,
    DP.contact_person_num,
    DP.contact_address,
    DP.face_photo,
    DP.signature_photo,
    DP.created_at
FROM
    "DriverProfiles" AS DP
    LEFT JOIN "Applications" AS APP ON DP.id = APP.driver_id
    AND EXTRACT(
        YEAR
        FROM
            APP.application_date
    ) = EXTRACT(
        YEAR
        FROM
            NOW()
    )
WHERE
    APP.driver_id IS NULL;