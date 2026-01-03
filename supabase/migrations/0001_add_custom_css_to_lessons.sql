-- Add custom_css column to lessons table for storing lesson-specific styles
ALTER TABLE lessons ADD COLUMN custom_css TEXT;

-- Update the types (handled by Supabase generation usually, but good to document)
COMMENT ON COLUMN lessons.custom_css IS 'Custom CSS styles for this specific lesson';
