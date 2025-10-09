-- SQL Query to check if credentials are being stored correctly
-- Run this after approving an applicant to verify

-- Check the credential table contents
SELECT 
    c.registrationid,
    c.applicant_id,
    c.user_name,
    c.password_hash,
    c.created_date,
    c.is_active,
    a.applicant_full_name,
    app.application_status
FROM credential c
LEFT JOIN applicant a ON c.applicant_id = a.applicant_id
LEFT JOIN application app ON a.applicant_id = app.applicant_id
ORDER BY c.created_date DESC;

-- Check if there are any applicants with Approved status but no credentials
SELECT 
    a.applicant_id,
    a.applicant_full_name,
    app.application_status,
    CASE 
        WHEN c.registrationid IS NULL THEN 'No Credentials' 
        ELSE 'Has Credentials' 
    END as credential_status
FROM applicant a
LEFT JOIN application app ON a.applicant_id = app.applicant_id
LEFT JOIN credential c ON a.applicant_id = c.applicant_id
WHERE app.application_status = 'Approved'
ORDER BY a.applicant_id;