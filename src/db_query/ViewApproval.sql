CREATE
OR REPLACE VIEW "ViewApproval" AS
SELECT
    APP.id AS app_id,
    APP.application_date,
    APP.franchise_num,
    APP.franchise_status,
    APP.operator_id AS app_operator_id,
    APP.driver_id,
    APP.insurance_company,
    APP.insurance_coc_num,
    APP.insurance_expiry_date,
    APP.body_num,
    APP.zone,
    APP.status,
    OP.id AS op_id,
    CONCAT(
        OP.last_name,
        ', ',
        OP.first_name,
        ' ',
        COALESCE(LEFT(OP.middle_name, 1), '')
    ) AS operator_name,
    OP.birth_date AS operator_birth_date,
    OP.address AS operator_address,
    OP.civil_status AS operator_civil_status,
    OP.contact_num AS operator_contact_num,
    OP.is_active AS operator_is_active,
    VOR.id AS vor_id,
    VOR.operator_id AS vor_operator_id,
    VOR.date_registered,
    VOR.chassis_num,
    VOR.lto_plate_num,
    VOR.color_code,
    VOR.motor_num,
    VOR.front_view_image,
    VOR.left_side_view_image,
    VOR.right_side_view_image,
    VOR.inside_front_image,
    VOR.back_view_image,
    DP.id AS dp_id,
    CONCAT(
        DP.last_name,
        ', ',
        DP.first_name,
        ' ',
        COALESCE(LEFT(DP.middle_name, 1), '')
    ) AS driver_name,
    DP.birth_date AS driver_birth_date,
    DP.address AS driver_address,
    DP.civil_status AS driver_civil_status,
    DP.contact_num AS driver_contact_num,
    DP.is_active AS driver_is_active,
    DP.license_num AS driver_license_num,
    DP.license_expiration AS driver_license_expiration
FROM
    "Applications" AS APP
    JOIN "DriverProfiles" AS DP ON APP.driver_id = DP.id
    JOIN "OperatorProfiles" AS OP ON APP.operator_id = OP.id
    LEFT JOIN "VehicleOwnershipRecords" AS VOR ON OP.id = VOR.operator_id
    AND APP.body_num = VOR.body_num;