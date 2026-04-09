$BuildStartTime = Get-Date
Write-Host "Starting Tauri build..." -ForegroundColor Green

# Run the build
& npm run tauri build

$BuildEndTime = Get-Date
$Duration = $BuildEndTime - $BuildStartTime

Write-Host ""
Write-Host "Build completed in $($Duration.TotalMinutes) minutes" -ForegroundColor Green
Write-Host ""

# Check for output files
$BundlePath = "C:\Users\PhumudzoMahandana\personal\lory\src-tauri\target\release\bundle"

if (Test-Path $BundlePath) {
    Write-Host "Bundle generated at: $BundlePath" -ForegroundColor Green
    Write-Host ""
    Write-Host "Available installers:" -ForegroundColor Cyan
    Get-ChildItem -Path $BundlePath -Recurse -Include "*.exe", "*.msi", "*.dmg" | ForEach-Object {
        Write-Host "  - $($_.FullName)" -ForegroundColor Yellow
    }
} else {
    Write-Host "Bundle path not found. Build may have failed." -ForegroundColor Red
}
