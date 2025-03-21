-- First check if column exists
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 
                   FROM information_schema.columns 
                   WHERE table_name='cars' AND column_name='engine_sound_url') 
    THEN
        -- Add engine_sound_url column to cars table
        ALTER TABLE cars
        ADD COLUMN engine_sound_url TEXT;

        -- Add comment to describe the column
        COMMENT ON COLUMN cars.engine_sound_url IS 'URL to the engine sound audio file';
    END IF;
END $$;

-- Update RLS policy (if needed)
DO $$ 
BEGIN 
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'cars') THEN
        DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."cars";
        
        CREATE POLICY "Enable read access for all users" ON "public"."cars"
        FOR SELECT
        TO public
        USING (true);
    END IF;
END $$;
