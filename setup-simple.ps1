Write-Host "Zuptin Database Setup Helper" -ForegroundColor Green
Write-Host ""

$projectId = "zrlleoiqdojhavohneed"
$sqlEditorUrl = "https://supabase.com/dashboard/project/$projectId/sql"
$authSettingsUrl = "https://supabase.com/dashboard/project/$projectId/auth/settings"

Write-Host "STEP 1: Run Database Configuration" -ForegroundColor Yellow
Write-Host "1. Open: $sqlEditorUrl"
Write-Host "2. Copy and paste the content from configure-supabase.sql"
Write-Host "3. Run the SQL script"
Write-Host ""

Write-Host "STEP 2: Disable Email Confirmations" -ForegroundColor Red
Write-Host "1. Open: $authSettingsUrl"
Write-Host "2. Turn OFF 'Enable email confirmations'"
Write-Host "3. Turn OFF 'Enable email change confirmations'"
Write-Host "4. Save changes"
Write-Host ""

Write-Host "STEP 3: Test the Application" -ForegroundColor Cyan
Write-Host "1. Run: npm run dev"
Write-Host "2. Test signup (should redirect immediately)"
Write-Host "3. Test profile image upload"
Write-Host "4. Test profile editing"
Write-Host "5. Test email change"
Write-Host "6. Test account deletion"
Write-Host ""

$choice = Read-Host "Press 1 to open SQL Editor, 2 for Auth Settings, or Enter to continue"

if ($choice -eq "1") {
    Start-Process $sqlEditorUrl
} elseif ($choice -eq "2") {
    Start-Process $authSettingsUrl
}

Write-Host "Setup instructions displayed. Follow the steps above." -ForegroundColor Green