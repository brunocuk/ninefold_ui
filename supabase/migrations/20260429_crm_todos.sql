-- CRM Todos for Bruno and Petar
-- Each person sees only their own assigned todos

CREATE TABLE crm_todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Who created and who it's for
  created_by TEXT NOT NULL,  -- 'bruno' or 'petar'
  assigned_to TEXT NOT NULL, -- 'bruno' or 'petar'

  -- Todo details
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),

  -- Optional: link to client/project/lead
  related_to_type TEXT CHECK (related_to_type IN ('client', 'project', 'lead', 'quote')),
  related_to_id UUID,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast filtering by assigned user
CREATE INDEX idx_crm_todos_assigned ON crm_todos(assigned_to, status);
CREATE INDEX idx_crm_todos_due_date ON crm_todos(due_date) WHERE status != 'completed';

-- Auto-update updated_at
CREATE TRIGGER update_crm_todos_updated_at
  BEFORE UPDATE ON crm_todos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS (optional - if you want row-level security later)
-- For now, all CRM users can see all todos but we'll filter in the app
