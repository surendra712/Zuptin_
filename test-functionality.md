# Zuptin Functionality Test Checklist

## Pre-Setup Requirements

### 1. Database Configuration
- [ ] Run `configure-supabase.sql` in Supabase SQL Editor
- [ ] Verify avatars bucket is created
- [ ] Verify all functions are created (delete_user, handle_new_user, etc.)
- [ ] Verify all triggers are active

### 2. Authentication Settings
- [ ] Go to Supabase Dashboard → Authentication → Settings
- [ ] **DISABLE** "Enable email confirmations"
- [ ] **DISABLE** "Enable email change confirmations" 
- [ ] Save changes

## Testing Checklist

### 🔐 Authentication Tests

#### Sign Up Flow
- [ ] Navigate to `/auth`
- [ ] Fill in signup form with:
  - Full Name: "Test User"
  - Phone: "+1234567890"
  - Email: "test@example.com"
  - Password: "TestPass123!"
- [ ] Click "Create Account"
- [ ] **Expected**: Immediate redirect to dashboard (no email confirmation)
- [ ] **Expected**: Profile created with name and phone number
- [ ] **Expected**: User preferences created with defaults

#### Sign In Flow
- [ ] Sign out and sign back in
- [ ] **Expected**: Immediate access to dashboard
- [ ] **Expected**: Profile data loads correctly

### 👤 Profile Tests

#### Profile Display
- [ ] Navigate to `/profile`
- [ ] **Expected**: Shows user's full name, email, phone number
- [ ] **Expected**: Shows "Not provided" for missing fields
- [ ] **Expected**: Shows join date

#### Profile Image Upload
- [ ] Click camera icon on profile picture
- [ ] Upload a valid image (JPEG/PNG < 5MB)
- [ ] **Expected**: Image uploads successfully
- [ ] **Expected**: Profile picture updates immediately
- [ ] **Expected**: Success toast appears
- [ ] Test invalid file (PDF, >5MB)
- [ ] **Expected**: Appropriate error messages

#### Profile Editing
- [ ] Click "Edit Profile" button
- [ ] **Expected**: Form fields become editable
- [ ] Change full name to "Updated Name"
- [ ] Change phone number to "+9876543210"
- [ ] Click "Save Changes"
- [ ] **Expected**: Success toast appears
- [ ] **Expected**: Form exits edit mode
- [ ] **Expected**: Updated data displays immediately
- [ ] **Expected**: Database updated (check Supabase dashboard)

#### Profile Validation
- [ ] Edit profile with name < 2 characters
- [ ] **Expected**: Validation error
- [ ] Edit profile with invalid phone number
- [ ] **Expected**: Validation error

### ⚙️ Settings Tests

#### App Preferences
- [ ] Navigate to `/settings`
- [ ] Toggle "Show Ads" switch
- [ ] **Expected**: Success toast, preference saved to database
- [ ] Toggle "Push Notifications" switch
- [ ] **Expected**: Success toast, preference saved to database
- [ ] Change "Default Platform" dropdown
- [ ] **Expected**: Success toast, preference saved to database
- [ ] Refresh page
- [ ] **Expected**: All preferences persist correctly

#### Password Change
- [ ] Click "Change Password"
- [ ] Enter weak password (< 8 chars)
- [ ] **Expected**: Validation error
- [ ] Enter mismatched passwords
- [ ] **Expected**: Validation error
- [ ] Enter valid matching passwords
- [ ] **Expected**: Success toast, password updated
- [ ] Sign out and sign in with new password
- [ ] **Expected**: Login works with new password

#### Email Change
- [ ] Click "Update Email"
- [ ] Enter invalid email
- [ ] **Expected**: Validation error
- [ ] Enter valid new email
- [ ] **Expected**: Success toast, no confirmation emails sent
- [ ] **Expected**: Email updated in both auth and profiles table
- [ ] Refresh page
- [ ] **Expected**: New email displays in profile

#### Account Deletion
- [ ] Click "Delete Account"
- [ ] Confirm both dialog prompts
- [ ] **Expected**: Success toast
- [ ] **Expected**: All user data deleted from database
- [ ] **Expected**: User signed out automatically
- [ ] **Expected**: Cannot sign in with deleted account

#### Data Management
- [ ] Test "Clear Recently Used" button
- [ ] **Expected**: Success toast, localStorage cleared
- [ ] Test "Clear Cache" button  
- [ ] **Expected**: Success toast, all cache cleared
- [ ] Test "Export Data" button
- [ ] **Expected**: JSON file downloads with user data

## Error Scenarios

### Network Errors
- [ ] Disconnect internet, try profile update
- [ ] **Expected**: Appropriate error message
- [ ] Reconnect, try again
- [ ] **Expected**: Works normally

### Database Errors
- [ ] Test with invalid user session
- [ ] **Expected**: Redirects to auth page

### File Upload Errors
- [ ] Upload file > 5MB
- [ ] **Expected**: File size error
- [ ] Upload non-image file
- [ ] **Expected**: File type error

## Performance Tests

### Loading States
- [ ] All buttons show loading states during operations
- [ ] No double-submissions possible during loading
- [ ] Appropriate loading indicators for image uploads

### Data Persistence
- [ ] All changes persist after page refresh
- [ ] User session persists across browser restarts
- [ ] Profile images load correctly after upload

## Security Tests

### Authorization
- [ ] Cannot access other users' data
- [ ] Cannot upload files to other users' folders
- [ ] RLS policies prevent unauthorized access

### Input Validation
- [ ] All forms validate input properly
- [ ] No SQL injection possible
- [ ] File uploads restricted to safe types

## Final Verification

- [ ] All functionality works without errors
- [ ] No email confirmations sent for any operations
- [ ] All database operations complete successfully
- [ ] User experience is smooth and intuitive
- [ ] All buttons and forms work as expected

## Common Issues & Solutions

### Email Confirmations Still Sent
- Double-check Authentication settings in Supabase dashboard
- Ensure both email confirmation settings are disabled

### Avatar Upload Fails
- Verify avatars bucket exists and has correct policies
- Check file size and type restrictions

### Delete Account Fails
- Verify delete_user function exists in database
- Check that all foreign key constraints are properly handled

### Profile Updates Don't Save
- Verify triggers are active
- Check RLS policies allow updates
- Ensure user is properly authenticated