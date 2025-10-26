# PowerShell script to automatically refactor remaining Vue components
Write-Host "=== Vue Component Refactoring Script ===" -ForegroundColor Green
Write-Host "This script will extract embedded <script> and <style> sections from Vue files" -ForegroundColor Yellow
Write-Host ""

$componentsToProcess = @(
    "src\components\Branch\Components\AddBranch\AddBranchDialog.vue",
    "src\components\Branch\Components\AssignManager\AssignManagerDialog.vue", 
    "src\components\Branch\Components\BranchList\BranchList.vue",
    "src\components\Employees\Components\AddEmployee\AddEmployee.vue",
    "src\components\Employees\Components\EmployeeSearch\EmployeeSearch.vue",
    "src\components\Employees\Components\EmployeeTable\EmployeeTable.vue",
    "src\components\Stalls\AuctionComponents\AuctionsPage.vue",
    "src\components\Stalls\AuctionComponents\CountdownTimer\CountdownTimer.vue",
    "src\components\Stalls\AuctionComponents\HighestBidder\HighestBidderPanel.vue",
    "src\components\Stalls\LiveComponents\chatBoxComponents\ChatBox.vue",
    "src\components\Stalls\LiveComponents\controlPanelComponents\ParticipantsList.vue",
    "src\components\Stalls\LiveComponents\videoComponents\VideoArea.vue",
    "src\components\Stalls\LiveComponents\videoComponents\VideoEffectsPanel.vue",
    "src\components\Complaints\ComplaintsComponents\ComplaintsTable\ComplaintsTable.vue",
    "src\components\Complaints\ComplianceComponents\ComplaintsTable\ComplaintsTable.vue",
    "src\components\Compliances\ComplianceComponents\ComplianceTable\ComplianceTable.vue"
)

function Extract-VueComponent {
    param([string]$VuePath)
    
    if (!(Test-Path $VuePath)) {
    Write-Host "File not found: $VuePath" -ForegroundColor Red
        return
    }
    
    $content = Get-Content $VuePath -Raw -Encoding UTF8
    $dir = Split-Path $VuePath -Parent
    $baseName = (Split-Path $VuePath -Leaf) -replace '\.vue$'
    
    $hasScript = $false
    $hasStyle = $false
    $newContent = $content
    
    # Extract and replace script section (only if not already external)
    if ($content -match '<script[^>]*>([\s\S]*?)</script>' -and !($content -match '<script[^>]*src=')) {
        $scriptContent = $Matches[1].Trim()
        if ($scriptContent) {
            $jsPath = Join-Path $dir "$baseName.js"
            Set-Content $jsPath $scriptContent -Encoding UTF8
            Write-Host "  Created JS: $jsPath" -ForegroundColor Blue
            $newContent = $newContent -replace '<script[^>]*>[\s\S]*?</script>', "<script src=`"./$baseName.js`"></script>"
            $hasScript = $true
        }
    }
    
    # Extract and replace style section (only scoped styles)
    if ($content -match '<style[^>]*scoped[^>]*>([\s\S]*?)</style>') {
        $styleContent = $Matches[1].Trim()
        if ($styleContent) {
            $cssPath = Join-Path $dir "$baseName.css"
            Set-Content $cssPath $styleContent -Encoding UTF8
            Write-Host "  Created CSS: $cssPath" -ForegroundColor Magenta
            $newContent = $newContent -replace '<style[^>]*scoped[^>]*>[\s\S]*?</style>', "<style scoped src=`"./$baseName.css`"></style>"
            $hasStyle = $true
        }
    }
    
    # Update Vue file if changes were made
    if ($hasScript -or $hasStyle) {
        Set-Content $VuePath $newContent -Encoding UTF8
        Write-Host "  Updated Vue file: $VuePath" -ForegroundColor Green
        return $true
    } else {
        Write-Host "  No embedded styles/scripts found in: $VuePath" -ForegroundColor Gray
        return $false
    }
}

# Process each component
$processedCount = 0
$totalCount = $componentsToProcess.Count

    Write-Host "Processing $totalCount components..." -ForegroundColor Cyan
    Write-Host ""

    foreach ($componentPath in $componentsToProcess) {
        $fullPath = Join-Path (Get-Location) $componentPath
        Write-Host "Processing: $componentPath" -ForegroundColor Yellow
        
        $result = Extract-VueComponent $fullPath
        if ($result) {
            $processedCount++
        }
        Write-Host ""
    }

    Write-Host "=== Summary ===" -ForegroundColor Green
    Write-Host "Total components: $totalCount" -ForegroundColor White
    Write-Host "Successfully processed: $processedCount" -ForegroundColor Green
    Write-Host "Skipped/Not found: $($totalCount - $processedCount)" -ForegroundColor Yellow

    if ($processedCount -gt 0) {
        Write-Host ""
        Write-Host "Refactoring complete! All processed components now use external .js and .css files." -ForegroundColor Green
        Write-Host "Please review the generated files and test your application." -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "No components were refactored. They may already be using external files." -ForegroundColor Gray
    }