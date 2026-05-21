-- Whitelist the test university domain for test account access
INSERT INTO allowed_email_domains (domain, university_name, country, is_active, is_wildcard)
VALUES ('dormr.university.local', 'Dormr Test University', 'United Kingdom', true, false)
ON CONFLICT (domain) DO UPDATE SET is_active = true;
