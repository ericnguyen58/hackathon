-- Seed data for Energy Management System

-- Insert achievements
INSERT INTO "achievements" ("id", "name", "description", "icon", "points", "requirement", "category") VALUES
('ach_1', 'First Step', 'Log your first energy reading', 'footprints', 10, '{"type":"first_reading"}', 'MILESTONE'),
('ach_2', 'Week Warrior', 'Stay under budget for 7 consecutive days', 'calendar-check', 50, '{"type":"streak_days","days":7}', 'STREAK'),
('ach_3', 'Month Master', 'Stay under budget for a full month', 'trophy', 100, '{"type":"under_budget_month"}', 'SAVINGS'),
('ach_4', 'Eco Warrior', 'Reduce usage by 20% from last month', 'leaf', 75, '{"type":"reduction_percentage","percent":20}', 'CONSERVATION'),
('ach_5', 'Limit Setter', 'Set your first monthly limit', 'target', 15, '{"type":"first_limit"}', 'MILESTONE');

-- Insert demo user (password: 'password123' - hashed with bcrypt)
INSERT INTO "users" ("id", "email", "name", "password", "role", "points", "streakDays", "createdAt", "updatedAt") VALUES
('user_1', 'demo@example.com', 'Demo User', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'HOMEOWNER', 85, 5, datetime('now'), datetime('now'));

-- Insert building
INSERT INTO "buildings" ("id", "name", "address", "userId", "createdAt", "updatedAt") VALUES
('bld_1', 'My Home', '123 Energy Street', 'user_1', datetime('now'), datetime('now'));

-- Insert 30 days of energy readings
WITH RECURSIVE dates(date) AS (
  SELECT date('now', '-30 days')
  UNION ALL
  SELECT date(date, '+1 day')
  FROM dates
  WHERE date < date('now')
)
INSERT INTO "energy_readings" ("id", "timestamp", "kWh", "cost", "source", "buildingId")
SELECT
  lower(hex(randomblob(12))),
  datetime(d.date || ' 12:00:00'),
  round(15 + abs(random() % 2000) / 100.0, 2),
  round((15 + abs(random() % 2000) / 100.0) * 0.15, 2),
  'manual',
  'bld_1'
FROM dates d;

-- Insert monthly limit for current month
INSERT INTO "monthly_limits" ("id", "year", "month", "kWhLimit", "costLimit", "alertThreshold", "isActive", "userId", "createdAt", "updatedAt") VALUES
('lim_1', strftime('%Y', 'now'), strftime('%m', 'now'), 800, 120, 80, 1, 'user_1', datetime('now'), datetime('now'));

-- Award achievements to user
INSERT INTO "user_achievements" ("id", "userId", "achievementId", "earnedAt", "progress") VALUES
('ua_1', 'user_1', 'ach_1', datetime('now'), 100),
('ua_2', 'user_1', 'ach_5', datetime('now'), 100);

-- Insert sample alerts
INSERT INTO "alerts" ("id", "type", "message", "severity", "isRead", "sentAt", "userId", "limitId") VALUES
('al_1', 'LIMIT_APPROACHING', 'You are at 78% of your monthly kWh limit', 'WARNING', 0, datetime('now'), 'user_1', 'lim_1'),
('al_2', 'ACHIEVEMENT_EARNED', 'You earned the First Step achievement!', 'INFO', 1, datetime('now', '-1 day'), 'user_1', NULL),
('al_3', 'DAILY_SUMMARY', 'Yesterday usage: 22.4 kWh ($3.36)', 'INFO', 1, datetime('now', '-1 day'), 'user_1', NULL);
