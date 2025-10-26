# PowerShell script to refactor Vue components with embedded styles/scripts
param(
    [string]$ComponentPath
)

function Extract-VueComponent {
    param([string]$VuePath)
    
    $content = Get-Content $VuePath -Raw
    $dir = Split-Path $VuePath -Parent
    $baseName = (Split-Path $VuePath -Leaf) -replace '\.vue$'
    
    # Extract script section
    if ($content -match '<script[^>]*>(.*?)</script>') {
        $scriptContent = $Matches[1].Trim()
        if ($scriptContent -and -not ($content -match '<script[^>]*src=')) {
            $jsPath = Join-Path $dir "$baseName.js"
            Set-Content $jsPath $scriptContent -Encoding UTF8
            Write-Host "Created: $jsPath"
        }
    }
    
    # Extract style section
    if ($content -match '<style[^>]*scoped[^>]*>(.*?)</style>') {
        $styleContent = $Matches[1].Trim()
        if ($styleContent) {
            $cssPath = Join-Path $dir "$baseName.css"
            Set-Content $cssPath $styleContent -Encoding UTF8
            Write-Host "Created: $cssPath"
        }
    }
    
    # Update Vue file to use external files
    $newContent = $content
    if ($content -match '<script[^>]*>(.*?)</script>' -and -not ($content -match '<script[^>]*src=')) {
        $newContent = $newContent -replace '<script[^>]*>.*?</script>', "<script src=`"./$baseName.js`"></script>"
    }
    if ($content -match '<style[^>]*scoped[^>]*>(.*?)</style>') {
        $newContent = $newContent -replace '<style[^>]*scoped[^>]*>.*?</style>', "<style scoped src=`"./$baseName.css`"></style>"
    }
    
    if ($newContent -ne $content) {
        Set-Content $VuePath $newContent -Encoding UTF8
        Write-Host "Updated: $VuePath"
    }
}

# List of components to refactor (from our previous analysis)
$components = @(
    "src\components\Stalls\RaffleComponents\RafflesPage.vue",
    "src\components\Stalls\LiveComponents\videoComponents\VideoEffectsPanel.vue",
    "src\components\Stalls\LiveComponents\videoComponents\VideoArea.vue",
    "src\components\Stalls\LiveComponents\chatBoxComponents\ChatBox.vue",
    "src\components\Stalls\AuctionComponents\HighestBidder\HighestBidderPanel.vue",
    "src\components\Stalls\AuctionComponents\CountdownTimer\CountdownTimer.vue",
    "src\components\Stalls\AuctionComponents\AuctionsPage.vue",
    "src\components\MainLayout\MainLayout.vue",
    "src\components\Employees\Components\ManagePermissions\ManagePermissions.vue",
    "src\components\Employees\Components\EmployeeTable\EmployeeTable.vue",
    "src\components\Employees\Components\AddEmployee\AddEmployee.vue",
    "src\components\Branch\Components\BranchList\BranchList.vue",
    "src\components\Branch\Components\AssignManager\AssignManagerDialog.vue",
    "src\components\Branch\Components\AddBranch\AddBranchDialog.vue",
    "src\components\Employees\Components\EmployeeSearch\EmployeeSearch.vue",
    "src\components\Compliances\ComplianceComponents\ComplianceTable\ComplianceTable.vue",
    "src\components\Stalls\LiveComponents\controlPanelComponents\ParticipantsList.vue"
)

foreach ($component in $components) {
    $fullPath = Join-Path (Get-Location) $component
    if (Test-Path $fullPath) {
        Write-Host "Processing: $component"
        Extract-VueComponent $fullPath
    } else {
        Write-Host "Not found: $component" -ForegroundColor Yellow
    }
}

Write-Host "Refactoring complete!" -ForegroundColor Green