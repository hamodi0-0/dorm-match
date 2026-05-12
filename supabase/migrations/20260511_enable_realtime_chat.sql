-- Enable Realtime for messages and conversations tables

-- First, ensure the supabase_realtime publication exists
-- (it should exist on Supabase instances, but just to be safe, alter it)
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
