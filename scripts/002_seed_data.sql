-- Insert test vehicles
INSERT INTO public.vehicles (registration, make, model, year, status) VALUES
('ABC123', 'Toyota', 'Hiace', 2022, 'active'),
('XYZ789', 'Mercedes', 'Sprinter', 2021, 'active'),
('DEF456', 'Isuzu', 'NPR', 2020, 'active')
ON CONFLICT DO NOTHING;
