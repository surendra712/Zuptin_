Write-Host "Zuptin Merge Verification" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if all required files exist
$requiredFiles = @(
    "src\hooks\useUserPreferences.tsx",
    "src\components\Chatbot.tsx",
    "src\lib\userActions.ts",
    "configure-supabase.sql",
    "test-functionality.md",
    "FIXES_SUMMARY.md"
)

Write-Host "Checking merged files..." -ForegroundColor Yellow
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "  OK $file" -ForegroundColor Green
    } else {
        Write-Host "  MISSING $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Checking configuration..." -ForegroundColor Yellow

# Check .env file
if (Test-Path ".env") {
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "zrlleoiqdojhavohneed.supabase.co") {
        Write-Host "  OK Supabase URL configured correctly" -ForegroundColor Green
    } else {
        Write-Host "  ERROR Supabase URL not configured" -ForegroundColor Red
    }
} else {
    Write-Host "  ERROR .env file missing" -ForegroundColor Red
}

Write-Host ""
Write-Host "Testing application build..." -ForegroundColor Yellow

try {
    $buildResult = npm run build 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  OK Build successful" -ForegroundColor Green
    } else {
        Write-Host "  ERROR Build failed" -ForegroundColor Red
        Write-Host "  Error: $buildResult" -ForegroundColor Red
    }
} catch {
    Write-Host "  ERROR Build test failed: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Run database setup: .\setup-simple.ps1" -ForegroundColor White
Write-Host "2. Disable email confirmations in Supabase dashboard" -ForegroundColor White
Write-Host "3. Start development server: npm run dev" -ForegroundColor White
Write-Host "4. Test all functionality using test-functionality.md" -ForegroundColor White

Write-Host ""
Write-Host "Merge verification complete!" -ForegroundColor Green