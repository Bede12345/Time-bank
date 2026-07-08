
INSERT INTO users (username, email, password_hash, full_name, bio, skills, time_credits)
VALUES 
  ('alice', 'alice@example.com', 'alice123', 'Alice Johnson', 'Full-stack developer', ARRAY['JavaScript', 'React', 'Node.js'], 20),
  ('bob', 'bob@example.com', 'bob123', 'Bob Smith', 'UI/UX Designer', ARRAY['Figma', 'Design'], 15);


INSERT INTO offers (user_id, title, description, category, type, credits_per_hour, status, is_remote)
VALUES 
  (1, 'JavaScript Tutoring', 'I can teach JavaScript from beginner to advanced', 'Technology', 'offer', 2, 'open', true),
  (2, 'Logo Design', 'Professional logo design services', 'Creative', 'offer', 3, 'open', true);