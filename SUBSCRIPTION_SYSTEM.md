# Course Subscription System

This document describes the implementation of the course subscription system for the ClubHub application, which allows users to subscribe their children to courses with different subscription types and manage those subscriptions.

## Overview

The subscription system enables parents/guardians to:

- Subscribe their children to courses with different pricing tiers
- View subscription status and details
- Manage subscriptions (cancel, renew)
- Track course bookings and sessions

## Features

### 1. Subscription Types

- **Drop-in**: Pay per session, flexible scheduling (6 months validity)
- **Monthly**: Unlimited sessions for 1 month, billed monthly
- **Quarterly**: Unlimited sessions for 3 months, billed quarterly (with savings)

### 2. Subscription Management

- View all subscriptions for selected child
- Cancel active subscriptions
- Renew expired subscriptions
- View subscription details and status

### 3. Profile Integration

- Subscriptions are tied to selected child profiles
- Users must select a profile before subscribing
- Subscription status displayed on course cards
- Profile switching updates subscription context

## Architecture

### Data Flow

```
Profile Selection → Course Browsing → Subscription Modal → Subscription Creation
       ↓                    ↓                    ↓                    ↓
  ProfileStore → CourseCard → SubscriptionModal → SubscriptionStore
```

### Components

#### 1. Subscription Store (`stores/subscriptionStore.ts`)

- Manages subscription state and operations
- Handles CRUD operations for subscriptions
- Integrates with Supabase database
- Fallback to mock data for offline functionality

**Key Functions:**

- `subscribeToCourse()`: Create new subscription
- `cancelSubscription()`: Cancel existing subscription
- `fetchSubscriptions()`: Get subscriptions for child
- `getSubscriptionForCourse()`: Check if child already subscribed

#### 2. Subscription Modal (`components/SubscriptionModal.tsx`)

- User interface for selecting subscription plans
- Displays pricing and benefits for each option
- Handles subscription creation flow
- Validates profile selection before proceeding

**Features:**

- Plan comparison (Drop-in vs Monthly vs Quarterly)
- Savings calculation for quarterly plans
- Profile validation
- Error handling and user feedback

#### 3. Enhanced Course Card (`components/CourseCard.tsx`)

- Displays subscription status on course cards
- Shows "Subscribed" badge for active subscriptions
- Different button states (Subscribe vs Manage)
- Integrated subscription modal trigger

**Visual Indicators:**

- Status badges with color coding (Green=Active, Yellow=Expiring, Red=Expired)
- Different button variants based on subscription status

#### 4. Subscription Management Screen (`app/(screens)/subscription-management.tsx`)

- Complete subscription management interface
- Profile selector for managing multiple children
- Subscription list with detailed information
- Action buttons for managing subscriptions

**Features:**

- Profile-based subscription filtering
- Subscription status and details display
- Cancel and renew functionality
- Empty state handling

## Database Schema

### Tables

#### subscriptions

```sql
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY,
    child_id UUID NOT NULL REFERENCES children(id),
    course_id UUID NOT NULL REFERENCES courses(id),
    subscription_type VARCHAR(20) NOT NULL, -- drop_in, monthly, quarterly
    status VARCHAR(20) NOT NULL, -- active, expiring, expired, on_hold
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    next_session TIMESTAMP WITH TIME ZONE,
    renewal_date TIMESTAMP WITH TIME ZONE,
    payment_method VARCHAR(255),
    UNIQUE(child_id, course_id)
);
```

#### bookings

```sql
CREATE TABLE bookings (
    id UUID PRIMARY KEY,
    subscription_id UUID NOT NULL REFERENCES subscriptions(id),
    session_date TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20), -- booked, completed, cancelled
    can_reschedule BOOLEAN
);
```

### Indexes and Constraints

- Unique constraint: One subscription per child per course
- Foreign key relationships with cascade delete
- Indexes for performance on frequently queried fields
- Check constraints for valid status and type values

### Database Functions

- `update_subscription_status()`: Automatically update subscription status
- `check_expiring_subscriptions()`: Find subscriptions expiring within 7 days
- `create_initial_bookings()`: Generate bookings for monthly/quarterly subscriptions

## Integration Points

### Profile System Integration

- Subscriptions are always tied to a selected child profile
- Profile switching automatically updates subscription context
- Subscription operations validate profile selection
- Profile data used in subscription display and management

### Course System Integration

- Subscriptions reference existing course data
- Course pricing used in subscription calculations
- Course schedules used for booking generation
- Course details displayed in subscription management

### Store Integration

- Subscription store integrates with existing profile and club stores
- State synchronization between stores
- Error handling and loading states
- Offline fallback with mock data

## Usage Examples

### Subscribing to a Course

1. User selects a child profile via ProfileSwitcher
2. User browses courses in search or club screens
3. User clicks "Subscribe" on desired course
4. Subscription modal appears with plan options
5. User selects plan and confirms
6. Subscription is created and status updated

### Managing Subscriptions

1. User navigates to subscription management screen
2. User selects child from profile selector
3. System displays all subscriptions for selected child
4. User can view details, cancel, or renew subscriptions
5. Actions trigger appropriate store methods

### Viewing Subscription Status

1. Course cards display subscription status badges
2. Different button states indicate subscription status
3. Profile switching updates all subscription indicators
4. Real-time status updates from store

## Error Handling

### Validation

- Profile must be selected before subscribing
- Cannot have multiple subscriptions to same course
- Subscription dates must be valid
- Payment method required

### User Feedback

- Clear error messages for validation failures
- Success confirmation after subscription creation
- Loading states during async operations
- Offline mode indicators

### Edge Cases

- No profiles available
- No subscriptions for selected child
- Expired subscriptions
- Network connectivity issues

## Future Enhancements

### Potential Improvements

1. **Payment Integration**: Add real payment processing
2. **Auto-renewal**: Automatic subscription renewal options
3. **Notifications**: Push notifications for expiring subscriptions
4. **Analytics**: Subscription usage and retention metrics
5. **Bulk Operations**: Manage multiple subscriptions at once
6. **Waitlists**: Join waitlists for full courses
7. **Gift Subscriptions**: Gift subscriptions to other children

### Technical Improvements

1. **Caching**: Implement subscription data caching
2. **Background Sync**: Sync subscriptions in background
3. **Performance**: Optimize subscription queries
4. **Testing**: Add comprehensive unit and integration tests
5. **Accessibility**: Improve accessibility features

## Testing

### Manual Testing Scenarios

1. **Subscription Flow**: Complete subscription creation process
2. **Profile Switching**: Verify subscription context updates
3. **Status Management**: Test cancel and renew functionality
4. **Error Cases**: Test validation and error handling
5. **Offline Mode**: Test functionality without network

### Test Data

- Use mock subscriptions from `mocks/subscriptions.ts`
- Test with different subscription statuses
- Verify profile-child relationships
- Test course-subscription associations

## Deployment

### Database Migration

1. Run `schema-updates.sql` on production database
2. Verify table creation and constraints
3. Test RLS policies if using Supabase
4. Validate trigger and function creation

### Code Deployment

1. Deploy updated components and stores
2. Test subscription functionality end-to-end
3. Verify integration with existing features
4. Monitor for any performance impacts

### Rollback Plan

1. Database changes are additive (no destructive operations)
2. Code changes can be rolled back independently
3. Mock data fallback ensures functionality during issues
4. Feature flags could be added for gradual rollout

## Conclusion

The course subscription system provides a comprehensive solution for managing course enrollments in the ClubHub application. It integrates seamlessly with the existing profile and course systems while providing a user-friendly interface for subscription management.

The implementation follows best practices for state management, error handling, and user experience, ensuring a robust and maintainable solution.
