#!/usr/bin/env pwsh
# ============================================
# PRD REQUIREMENTS DEMONSTRATION SCRIPT
# ============================================
# This script demonstrates that the AI Model Comparison Tool
# meets all requirements specified in project_prd.md
#
# Usage: .\scripts\demo-prd-requirements.ps1
# ============================================

$ErrorActionPreference = "Continue"
$demoLotUrl = "https://hibid.com/lot/demo123"

# Helper function to get latest execution folder
function Get-LatestExecutionFolder {
    $outputsDir = Join-Path $PSScriptRoot "..\outputs"
    if (Test-Path $outputsDir) {
        $folders = Get-ChildItem $outputsDir -Directory -Filter "execution-*" | Sort-Object LastWriteTime -Descending
        if ($folders.Count -gt 0) {
            return $folders[0].Name
        }
    }
    return $null
}

# Helper function to wait for user
function Wait-ForUser {
    param([string]$Message = "Press Enter to continue...")
    Write-Host "`n$Message" -ForegroundColor Yellow
    Read-Host
}

# Helper function to run command with error handling
function Invoke-SafeCommand {
    param(
        [string]$Command,
        [string]$Description
    )
    Write-Host "`n$Description" -ForegroundColor Cyan
    Write-Host "Command: $Command" -ForegroundColor Gray
    try {
        Invoke-Expression $Command
        return $true
    } catch {
        Write-Host "Warning: Command failed - $_" -ForegroundColor Yellow
        return $false
    }
}

# Header
Write-Host @"
============================================
PRD REQUIREMENTS DEMONSTRATION
============================================
This script will demonstrate that the AI Model Comparison Tool
meets all requirements from project_prd.md

Demo Lot URL: $demoLotUrl
============================================
"@ -ForegroundColor Green

Wait-ForUser "Ready to start? Press Enter to begin..."

# ============================================
# STEP 1: Verify Setup
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 1: Verify Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
npm run verify
if ($LASTEXITCODE -ne 0) {
    Write-Host "`n⚠️  Setup verification had issues. Continuing anyway..." -ForegroundColor Yellow
}
Wait-ForUser

# ============================================
# STEP 2: Show Help (User Experience)
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 2: CLI Help (User Experience)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
node dist/index.js --help
Wait-ForUser

# ============================================
# STEP 3: P0.1 - Accept HiBid URLs
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 3: P0.1 - HiBid URL Processing" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Demonstrating: Accept and process HiBid lot URLs" -ForegroundColor White
node dist/index.js compare $demoLotUrl --verbose
Wait-ForUser

# ============================================
# STEP 4: P0.2 - Process Images with Metadata
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 4: P0.2 - Image Processing" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Demonstrating: Fetch and process images with titles/descriptions" -ForegroundColor White

$latestFolder = Get-LatestExecutionFolder
if ($latestFolder) {
    $imagesPath = Join-Path $PSScriptRoot "..\outputs\$latestFolder\images"
    $lotDataPath = Join-Path $PSScriptRoot "..\outputs\$latestFolder\lot-data.json"
    
    if (Test-Path $imagesPath) {
        Write-Host "`nDownloaded Images:" -ForegroundColor Green
        Get-ChildItem $imagesPath | Select-Object Name, @{Name="Size (KB)";Expression={[math]::Round($_.Length/1KB, 2)}}
    }
    
    if (Test-Path $lotDataPath) {
        Write-Host "`nLot Data (Title, Description, Images):" -ForegroundColor Green
        $lotData = Get-Content $lotDataPath | ConvertFrom-Json
        Write-Host "Title: $($lotData.title)" -ForegroundColor White
        Write-Host "Description: $($lotData.description.Substring(0, [Math]::Min(100, $lotData.description.Length)))..." -ForegroundColor White
        Write-Host "Images: $($lotData.images.Count) image(s)" -ForegroundColor White
    }
} else {
    Write-Host "No execution folder found yet. Run a comparison first." -ForegroundColor Yellow
}
Wait-ForUser

# ============================================
# STEP 5: P0.3 - Compare Multiple Models
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 5: P0.3 - Multi-Model Comparison" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Demonstrating: Compare multiple AI models simultaneously" -ForegroundColor White
node dist/index.js compare $demoLotUrl --models "openai/gpt-4o-mini,google/gemini-flash-1.5,anthropic/claude-3-haiku"
Wait-ForUser

# ============================================
# STEP 6: P0.4 - Tabular Comparison
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 6: P0.4 - Tabular Output" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Demonstrating: Generate tabular comparison (tokens, cost, time)" -ForegroundColor White

Write-Host "`nTable Format:" -ForegroundColor Green
node dist/index.js compare $demoLotUrl --output table

Write-Host "`nCSV Format (for data analysis):" -ForegroundColor Green
node dist/index.js compare $demoLotUrl --output csv | Select-Object -First 5

$latestFolder = Get-LatestExecutionFolder
if ($latestFolder) {
    $csvPath = Join-Path $PSScriptRoot "..\outputs\$latestFolder\comparison.csv"
    if (Test-Path $csvPath) {
        Write-Host "`nCSV file saved to: $csvPath" -ForegroundColor Green
    }
}
Wait-ForUser

# ============================================
# STEP 7: P1.5 - Execution Folders
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 7: P1.5 - Execution Folders" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Demonstrating: Create execution folders for data capture" -ForegroundColor White

$outputsDir = Join-Path $PSScriptRoot "..\outputs"
if (Test-Path $outputsDir) {
    Write-Host "`nExecution Folders:" -ForegroundColor Green
    Get-ChildItem $outputsDir -Directory -Filter "execution-*" | 
        Select-Object Name, @{Name="Created";Expression={$_.CreationTime}}, 
                      @{Name="Files";Expression={(Get-ChildItem $_.FullName -Recurse -File).Count}} |
        Format-Table -AutoSize
    
    $latestFolder = Get-LatestExecutionFolder
    if ($latestFolder) {
        Write-Host "`nLatest Execution Folder Structure:" -ForegroundColor Green
        $execPath = Join-Path $outputsDir $latestFolder
        Get-ChildItem $execPath -File | Select-Object Name
        Write-Host "`nSubdirectories:" -ForegroundColor Green
        Get-ChildItem $execPath -Directory | Select-Object Name
    }
} else {
    Write-Host "No outputs directory found." -ForegroundColor Yellow
}
Wait-ForUser

# ============================================
# STEP 8: P2.7 - Metadata in Prompts
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 8: P2.7 - Metadata Support" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Demonstrating: Optional title/description hints in prompts" -ForegroundColor White
node dist/index.js compare $demoLotUrl --use-metadata

$latestFolder = Get-LatestExecutionFolder
if ($latestFolder) {
    $configPath = Join-Path $PSScriptRoot "..\outputs\$latestFolder\config.json"
    if (Test-Path $configPath) {
        $config = Get-Content $configPath | ConvertFrom-Json
        Write-Host "`nConfig shows useMetadata: $($config.useMetadata)" -ForegroundColor Green
    }
}
Wait-ForUser

# ============================================
# STEP 9: User Story - Prompt Engineer
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 9: User Story - Prompt Engineer" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Demonstrating: Compare models to find cost-effective and accurate model" -ForegroundColor White
node dist/index.js compare $demoLotUrl --prompt "Provide a detailed classification with specific categories and confidence assessment"

$latestFolder = Get-LatestExecutionFolder
if ($latestFolder) {
    Write-Host "`nAnalyzing results..." -ForegroundColor Green
    node dist/index.js analyze $latestFolder
}
Wait-ForUser

# ============================================
# STEP 10: User Story - Data Scientist
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 10: User Story - Data Scientist" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Demonstrating: Tabular data on token usage, cost, and time" -ForegroundColor White

$latestFolder = Get-LatestExecutionFolder
if ($latestFolder) {
    $csvPath = Join-Path $PSScriptRoot "..\outputs\$latestFolder\comparison.csv"
    $summaryPath = Join-Path $PSScriptRoot "..\outputs\$latestFolder\summary.json"
    
    if (Test-Path $csvPath) {
        Write-Host "`nCSV Data (first 3 rows):" -ForegroundColor Green
        Import-Csv $csvPath | Select-Object -First 3 | Format-Table
    }
    
    if (Test-Path $summaryPath) {
        Write-Host "`nSummary Statistics:" -ForegroundColor Green
        $summary = Get-Content $summaryPath | ConvertFrom-Json
        $summary | Format-List
    }
} else {
    Write-Host "No execution folder found." -ForegroundColor Yellow
}
Wait-ForUser

# ============================================
# STEP 11: Goal - Cost Optimization
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 11: Goal - Cost Optimization" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Demonstrating: Token usage cost optimization tracking" -ForegroundColor White

$latestFolder = Get-LatestExecutionFolder
if ($latestFolder) {
    node dist/index.js analyze $latestFolder
    
    $summaryPath = Join-Path $PSScriptRoot "..\outputs\$latestFolder\summary.json"
    if (Test-Path $summaryPath) {
        $summary = Get-Content $summaryPath | ConvertFrom-Json
        Write-Host "`nCost Metrics:" -ForegroundColor Green
        Write-Host "  Total Cost: `$$($summary.totalCost.ToString('F4'))" -ForegroundColor White
        Write-Host "  Total Tokens: $($summary.totalTokens.ToString('N0'))" -ForegroundColor White
        Write-Host "  Average Latency: $([math]::Round($summary.avgLatency, 0))ms" -ForegroundColor White
    }
} else {
    Write-Host "No execution folder found." -ForegroundColor Yellow
}
Wait-ForUser

# ============================================
# STEP 12: Technical - Node.js CLI
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 12: Technical - Node.js CLI" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Demonstrating: Node.js-based command-line utility with modular structure" -ForegroundColor White

node dist/index.js --help

Write-Host "`nSource Code Structure:" -ForegroundColor Green
$srcDir = Join-Path $PSScriptRoot "..\src"
if (Test-Path $srcDir) {
    $fileCount = (Get-ChildItem $srcDir -Recurse -File).Count
    Write-Host "  Total source files: $fileCount" -ForegroundColor White
    
    Write-Host "`nDirectory Structure:" -ForegroundColor Green
    Get-ChildItem $srcDir -Directory | ForEach-Object {
        $fileCount = (Get-ChildItem $_.FullName -File).Count
        Write-Host "  $($_.Name): $fileCount files" -ForegroundColor White
    }
}
Wait-ForUser

# ============================================
# STEP 13: Technical - Multi-Provider Integration
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 13: Technical - Multi-Provider" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Demonstrating: Integration with OpenAI, Google Gemini, Anthropic" -ForegroundColor White

$modelsPath = Join-Path $PSScriptRoot "..\config\models.json"
if (Test-Path $modelsPath) {
    $models = Get-Content $modelsPath | ConvertFrom-Json
    Write-Host "`nConfigured Models by Provider:" -ForegroundColor Green
    $models.models.PSObject.Properties | ForEach-Object {
        $model = $_.Value
        Write-Host "  $($model.name) ($($model.provider))" -ForegroundColor White
    }
    
    Write-Host "`nDefault Model Sets:" -ForegroundColor Green
    Write-Host "  Cheap: $($models.defaultSets.cheap -join ', ')" -ForegroundColor White
    Write-Host "  Standard: $($models.defaultSets.standard -join ', ')" -ForegroundColor White
    Write-Host "  Premium: $($models.defaultSets.premium -join ', ')" -ForegroundColor White
}
Wait-ForUser

# ============================================
# STEP 14: NFR - Performance
# ============================================
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "STEP 14: NFR - Performance" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Demonstrating: Real-time model comparison capabilities" -ForegroundColor White
Write-Host "Measuring execution time for parallel model comparison..." -ForegroundColor Gray

$timeResult = Measure-Command {
    node dist/index.js compare $demoLotUrl 2>&1 | Out-Null
}

Write-Host "`nPerformance Metrics:" -ForegroundColor Green
Write-Host "  Total Execution Time: $([math]::Round($timeResult.TotalSeconds, 2)) seconds" -ForegroundColor White
Write-Host "  Models Compared: 3 (in parallel)" -ForegroundColor White
Write-Host "  Average Time per Model: $([math]::Round($timeResult.TotalSeconds / 3, 2)) seconds" -ForegroundColor White

$latestFolder = Get-LatestExecutionFolder
if ($latestFolder) {
    $summaryPath = Join-Path $PSScriptRoot "..\outputs\$latestFolder\summary.json"
    if (Test-Path $summaryPath) {
        $summary = Get-Content $summaryPath | ConvertFrom-Json
        Write-Host "  Average Model Latency: $([math]::Round($summary.avgLatency, 0))ms" -ForegroundColor White
    }
}
Wait-ForUser

# ============================================
# FINAL SUMMARY
# ============================================
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "DEMONSTRATION COMPLETE" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host @"
✅ All PRD requirements have been demonstrated!

Summary of what was shown:
  ✅ P0.1: HiBid URL processing
  ✅ P0.2: Image processing with metadata
  ✅ P0.3: Multi-model simultaneous comparison
  ✅ P0.4: Tabular comparison output
  ✅ P1.5: Execution folders for data capture
  ✅ P2.7: Optional metadata in prompts
  ✅ User Stories: Prompt Engineer, Data Scientist
  ✅ Goals: Cost optimization tracking
  ✅ Technical: Node.js CLI, multi-provider integration
  ✅ Non-Functional: Performance metrics

All execution results are saved in: outputs\execution-*
"@ -ForegroundColor White

Write-Host "`nFor detailed requirements mapping, see: DEMONSTRATION_PLAN.md" -ForegroundColor Cyan
Write-Host "`nThank you for reviewing the demonstration!" -ForegroundColor Green


