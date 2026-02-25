-- Course Subscription System Database Schema Updates
-- This file contains the SQL statements needed to add subscription functionality to the existing database

-- Add subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    subscription_type VARCHAR(20) NOT NULL CHECK (subscription_type IN ('drop_in', 'monthly', 'quarterly')),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expiring', 'expired', 'on_hold')),
    start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    next_session TIMESTAMP WITH TIME ZONE,
    renewal_date TIMESTAMP WITH TIME ZONE NOT NULL,
    payment_method VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure only one subscription per child per course
    UNIQUE(child_id, course_id),
    
    -- Indexes for performance
    INDEX idx_subscriptions_child_id (child_id),
    INDEX idx_subscriptions_course_id (course_id),
    INDEX idx_subscriptions_status (status),
    INDEX idx_subscriptions_end_date (end_date)
);

-- Add bookings table for tracking course sessions
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    session_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'booked' CHECK (status IN ('booked', 'completed', 'cancelled')),
    can_reschedule BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Indexes for performance
    INDEX idx_bookings_subscription_id (subscription_id),
    INDEX idx_bookings_session_date (session_date),
    INDEX idx_bookings_status (status)
);

-- Add trigger to update updated_at timestamp for subscriptions
CREATE OR REPLACE FUNCTION update_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subscriptions_updated_at 
    BEFORE UPDATE ON subscriptions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_subscriptions_updated_at();

-- Add trigger to update updated_at timestamp for bookings
CREATE OR REPLACE FUNCTION update_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bookings_updated_at 
    BEFORE UPDATE ON bookings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_bookings_updated_at();

-- Add function to check for expiring subscriptions
CREATE OR REPLACE FUNCTION check_expiring_subscriptions()
RETURNS TABLE (
    subscription_id UUID,
    child_name VARCHAR,
    course_name VARCHAR,
    end_date TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        c.name,
        co.name,
        s.end_date
    FROM subscriptions s
    JOIN children c ON s.child_id = c.id
    JOIN courses co ON s.course_id = co.id
    WHERE s.status = 'active' 
    AND s.end_date BETWEEN NOW() AND NOW() + INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- VVVVV ---
-- Add function to automatically update subscription status
CREATE OR REPLACE FUNCTION update_subscription_status()
RETURNS void AS $$
BEGIN
    -- Mark expired subscriptions
    UPDATE subscriptions 
    SET status = 'expired'
    WHERE status = 'active' 
    AND end_date < NOW();
    
    -- Mark expiring subscriptions
    UPDATE subscriptions 
    SET status = 'expiring'
    WHERE status = 'active' 
    AND end_date BETWEEN NOW() AND NOW() + INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- Add function to create initial bookings for monthly/quarterly subscriptions
-- NOTE: This trigger is disabled to prevent timestamp format conflicts
-- Booking creation is now handled in the application layer
-- CREATE OR REPLACE FUNCTION create_initial_bookings()
-- RETURNS TRIGGER AS $$
-- DECLARE
--     course_schedule RECORD;
--     booking_date TIMESTAMP;
-- BEGIN
--     -- Only create bookings for monthly and quarterly subscriptions
--     IF NEW.subscription_type IN ('monthly', 'quarterly') THEN
--         -- Get course schedule
--         FOR course_schedule IN 
--             SELECT days, time FROM course_schedules WHERE course_id = NEW.course_id
--         LOOP
--             -- Create bookings for the subscription period
--             booking_date := NEW.start_date;
--             
--             WHILE booking_date <= NEW.end_date LOOP
--                 -- Check if this day matches the course schedule
--                 IF EXTRACT(DOW FROM booking_date)::text = ANY(STRING_TO_ARRAY(course_schedule.days, ',')) THEN
--                     INSERT INTO bookings (subscription_id, session_date, status)
--                     VALUES (NEW.id, booking_date + course_schedule.time::interval, 'booked');
--                 END IF;
--                 
--                 booking_date := booking_date + INTERVAL '1 day';
--             END LOOP;
--         END LOOP;
--     END IF;
--     
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql;

-- CREATE TRIGGER create_initial_bookings_trigger
--     AFTER INSERT ON subscriptions
--     FOR EACH ROW
--     EXECUTE FUNCTION create_initial_bookings();

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_child_status ON subscriptions(child_id, status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_course_status ON subscriptions(course_id, status);
CREATE INDEX IF NOT EXISTS idx_bookings_subscription_status ON bookings(subscription_id, status);

-- Add RLS policies for subscriptions (if using Row Level Security)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own subscriptions" ON subscriptions
    FOR SELECT USING (
        child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
    );

CREATE POLICY "Users can insert subscriptions for their children" ON subscriptions
    FOR INSERT WITH CHECK (
        child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
    );

CREATE POLICY "Users can update their own subscriptions" ON subscriptions
    FOR UPDATE USING (
        child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
    );

CREATE POLICY "Users can delete their own subscriptions" ON subscriptions
    FOR DELETE USING (
        child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
    );

-- Add RLS policies for bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view bookings for their subscriptions" ON bookings
    FOR SELECT USING (
        subscription_id IN (
            SELECT id FROM subscriptions 
            WHERE child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
        )
    );

CREATE POLICY "Users can insert bookings for their subscriptions" ON bookings
    FOR INSERT WITH CHECK (
        subscription_id IN (
            SELECT id FROM subscriptions 
            WHERE child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
        )
    );

CREATE POLICY "Users can update their own bookings" ON bookings
    FOR UPDATE USING (
        subscription_id IN (
            SELECT id FROM subscriptions 
            WHERE child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
        )
    );

CREATE POLICY "Users can delete their own bookings" ON bookings
    FOR DELETE USING (
        subscription_id IN (
            SELECT id FROM subscriptions 
            WHERE child_id IN (SELECT id FROM children WHERE parent_id = auth.uid())
        )
    );