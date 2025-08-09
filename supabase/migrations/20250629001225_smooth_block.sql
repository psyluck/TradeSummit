/*
  # Sample Data for TradeSummit

  This migration adds sample data for testing and demonstration purposes.
  Includes organizations, users, subscriptions, AI agents, and sample conversations.
*/

-- Insert sample organizations
INSERT INTO organizations (id, name, domain, industry, size, status) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'TechCorp Solutions', 'techcorp.com', 'Technology', 'medium', 'active'),
  ('550e8400-e29b-41d4-a716-446655440002', 'HealthPlus Medical', 'healthplus.com', 'Healthcare', 'large', 'active'),
  ('550e8400-e29b-41d4-a716-446655440003', 'RetailMax Inc', 'retailmax.com', 'E-commerce', 'small', 'active'),
  ('550e8400-e29b-41d4-a716-446655440004', 'FinanceHub LLC', 'financehub.com', 'Financial Services', 'enterprise', 'active'),
  ('550e8400-e29b-41d4-a716-446655440005', 'RealEstate Pro', 'realestatepro.com', 'Real Estate', 'medium', 'active');

-- Insert sample users
INSERT INTO users (id, organization_id, email, full_name, role, last_login) VALUES
  ('550e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440001', 'john.doe@techcorp.com', 'John Doe', 'admin', now() - interval '2 hours'),
  ('550e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440001', 'sarah.smith@techcorp.com', 'Sarah Smith', 'user', now() - interval '1 day'),
  ('550e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440002', 'dr.wilson@healthplus.com', 'Dr. Michael Wilson', 'admin', now() - interval '3 hours'),
  ('550e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440003', 'emily.chen@retailmax.com', 'Emily Chen', 'admin', now() - interval '5 hours'),
  ('550e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440004', 'david.brown@financehub.com', 'David Brown', 'admin', now() - interval '1 hour'),
  ('550e8400-e29b-41d4-a716-446655440015', NULL, 'admin@tradesummit.ai', 'Atlas Admin', 'super_admin', now() - interval '30 minutes');

-- Insert sample subscriptions
INSERT INTO subscriptions (id, organization_id, plan_name, status, current_period_start, current_period_end, monthly_price, setup_fee, payment_provider) VALUES
  ('550e8400-e29b-41d4-a716-446655440020', '550e8400-e29b-41d4-a716-446655440001', 'professional', 'active', now() - interval '15 days', now() + interval '15 days', 2500.00, 5000.00, 'stripe'),
  ('550e8400-e29b-41d4-a716-446655440021', '550e8400-e29b-41d4-a716-446655440002', 'enterprise', 'active', now() - interval '10 days', now() + interval '20 days', 5000.00, 10000.00, 'payoneer'),
  ('550e8400-e29b-41d4-a716-446655440022', '550e8400-e29b-41d4-a716-446655440003', 'starter', 'active', now() - interval '5 days', now() + interval '25 days', 1200.00, 3000.00, 'stripe'),
  ('550e8400-e29b-41d4-a716-446655440023', '550e8400-e29b-41d4-a716-446655440004', 'professional', 'past_due', now() - interval '35 days', now() - interval '5 days', 2500.00, 5000.00, 'stripe'),
  ('550e8400-e29b-41d4-a716-446655440024', '550e8400-e29b-41d4-a716-446655440005', 'starter', 'active', now() - interval '8 days', now() + interval '22 days', 1200.00, 3000.00, 'payoneer');

-- Insert sample AI agents
INSERT INTO ai_agents (id, organization_id, name, description, industry, status, created_by, performance_metrics) VALUES
  ('550e8400-e29b-41d4-a716-446655440030', '550e8400-e29b-41d4-a716-446655440001', 'TechSupport Bot', 'Technical support and troubleshooting assistant', 'Technology', 'active', '550e8400-e29b-41d4-a716-446655440010', '{"satisfaction": 94.2, "resolution_rate": 87.5, "avg_response_time": 1.2}'),
  ('550e8400-e29b-41d4-a716-446655440031', '550e8400-e29b-41d4-a716-446655440001', 'Sales Assistant', 'Lead qualification and sales support', 'Technology', 'active', '550e8400-e29b-41d4-a716-446655440010', '{"satisfaction": 92.1, "conversion_rate": 23.4, "leads_qualified": 156}'),
  ('550e8400-e29b-41d4-a716-446655440032', '550e8400-e29b-41d4-a716-446655440002', 'Patient Care Agent', 'HIPAA-compliant patient support and scheduling', 'Healthcare', 'active', '550e8400-e29b-41d4-a716-446655440012', '{"satisfaction": 96.8, "appointments_scheduled": 234, "compliance_score": 100}'),
  ('550e8400-e29b-41d4-a716-446655440033', '550e8400-e29b-41d4-a716-446655440003', 'Order Assistant', 'Order tracking and customer support', 'E-commerce', 'active', '550e8400-e29b-41d4-a716-446655440013', '{"satisfaction": 89.7, "orders_processed": 1203, "return_rate": 5.2}'),
  ('550e8400-e29b-41d4-a716-446655440034', '550e8400-e29b-41d4-a716-446655440004', 'Account Manager', 'Account inquiries and transaction support', 'Financial Services', 'training', '550e8400-e29b-41d4-a716-446655440014', '{"training_progress": 78.5, "test_accuracy": 91.2}');

-- Insert sample conversations
INSERT INTO conversations (id, organization_id, ai_agent_id, customer_id, customer_email, status, satisfaction_score, resolution_time) VALUES
  ('550e8400-e29b-41d4-a716-446655440040', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440030', 'cust_001', 'customer1@example.com', 'resolved', 5, interval '15 minutes'),
  ('550e8400-e29b-41d4-a716-446655440041', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440030', 'cust_002', 'customer2@example.com', 'resolved', 4, interval '8 minutes'),
  ('550e8400-e29b-41d4-a716-446655440042', '550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440032', 'patient_001', 'patient1@example.com', 'resolved', 5, interval '12 minutes'),
  ('550e8400-e29b-41d4-a716-446655440043', '550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440033', 'order_001', 'shopper1@example.com', 'active', NULL, NULL),
  ('550e8400-e29b-41d4-a716-446655440044', '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440031', 'lead_001', 'prospect1@example.com', 'escalated', 3, interval '45 minutes');

-- Insert sample messages
INSERT INTO messages (conversation_id, sender_type, content) VALUES
  ('550e8400-e29b-41d4-a716-446655440040', 'user', 'Hi, I''m having trouble with my software installation'),
  ('550e8400-e29b-41d4-a716-446655440040', 'agent', 'I''d be happy to help you with the installation. What operating system are you using?'),
  ('550e8400-e29b-41d4-a716-446655440040', 'user', 'I''m using Windows 11'),
  ('550e8400-e29b-41d4-a716-446655440040', 'agent', 'Great! Let me walk you through the Windows 11 installation process...'),
  ('550e8400-e29b-41d4-a716-446655440042', 'user', 'I need to schedule an appointment with Dr. Smith'),
  ('550e8400-e29b-41d4-a716-446655440042', 'agent', 'I can help you schedule an appointment. Dr. Smith has availability next Tuesday at 2 PM or Thursday at 10 AM. Which works better for you?'),
  ('550e8400-e29b-41d4-a716-446655440043', 'user', 'Where is my order #12345?'),
  ('550e8400-e29b-41d4-a716-446655440043', 'agent', 'Let me check the status of order #12345 for you...');

-- Insert sample integrations
INSERT INTO integrations (organization_id, name, type, status, last_sync) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Salesforce CRM', 'crm', 'active', now() - interval '1 hour'),
  ('550e8400-e29b-41d4-a716-446655440001', 'Slack Workspace', 'communication', 'active', now() - interval '30 minutes'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Epic MyChart', 'healthcare', 'active', now() - interval '2 hours'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Shopify Store', 'ecommerce', 'active', now() - interval '15 minutes'),
  ('550e8400-e29b-41d4-a716-446655440004', 'QuickBooks', 'accounting', 'active', now() - interval '45 minutes');

-- Insert sample analytics
INSERT INTO analytics (organization_id, ai_agent_id, metric_type, metric_value, period_start, period_end) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440030', 'conversations', 1247, now() - interval '30 days', now()),
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440030', 'satisfaction', 94.2, now() - interval '30 days', now()),
  ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440032', 'conversations', 2891, now() - interval '30 days', now()),
  ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440032', 'satisfaction', 96.8, now() - interval '30 days', now()),
  ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440033', 'conversations', 1654, now() - interval '30 days', now());

-- Insert sample invoices
INSERT INTO invoices (organization_id, subscription_id, invoice_number, amount, status, due_date, paid_at, payment_provider) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440020', 'INV-2025-001', 2500.00, 'paid', now() - interval '5 days', now() - interval '3 days', 'stripe'),
  ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440021', 'INV-2025-002', 5000.00, 'paid', now() - interval '10 days', now() - interval '8 days', 'payoneer'),
  ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440022', 'INV-2025-003', 1200.00, 'paid', now() - interval '2 days', now() - interval '1 day', 'stripe'),
  ('550e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440023', 'INV-2025-004', 2500.00, 'overdue', now() - interval '15 days', NULL, 'stripe'),
  ('550e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440024', 'INV-2025-005', 1200.00, 'pending', now() + interval '5 days', NULL, 'payoneer');

-- Insert sample system logs
INSERT INTO system_logs (organization_id, user_id, action, resource_type, resource_id, details) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010', 'login', 'user', '550e8400-e29b-41d4-a716-446655440010', '{"ip": "192.168.1.100", "success": true}'),
  ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440010', 'create_agent', 'ai_agent', '550e8400-e29b-41d4-a716-446655440030', '{"agent_name": "TechSupport Bot"}'),
  ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440012', 'update_agent', 'ai_agent', '550e8400-e29b-41d4-a716-446655440032', '{"changes": ["description", "configuration"]}'),
  ('550e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440013', 'payment_processed', 'invoice', '550e8400-e29b-41d4-a716-446655440022', '{"amount": 1200.00, "provider": "stripe"}');