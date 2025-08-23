Param(
  [string]$Root = "c:\\Users\\Administrator\\AshuraGames\\public\\games",
  [switch]$WhatIf,
  [switch]$VerboseLog
)

function Build-CssBlock($content) {
  $lines = @('    <!-- ASHURA:shared-css -->')
  if ($content -notmatch '(?i)href="\./game-enhancement\.css"') { $lines += '    <link rel="stylesheet" href="./game-enhancement.css">' }
  if ($content -notmatch '(?i)href="\./game-optimization\.css"') { $lines += '    <link rel="stylesheet" href="./game-optimization.css">' }
  if ($content -notmatch '(?i)href="\./_assets/game-frame\.css"') { $lines += '    <link rel="stylesheet" href="./_assets/game-frame.css">' }
  if ($lines.Count -eq 1) { return '    <!-- ASHURA:shared-css -->' } else { return ($lines -join "`n") }
}

function Build-JsBlock($content) {
  $lines = @('    <!-- ASHURA:shared-js -->')
  if ($content -notmatch '(?i)src="\./game-optimization\.js"') { $lines += '    <script src="./game-optimization.js"></script>' }
  if ($content -notmatch '(?i)src="\./_assets/game-frame\.js"') { $lines += '    <script src="./_assets/game-frame.js"></script>' }
  if ($lines.Count -eq 1) { return '    <!-- ASHURA:shared-js -->' } else { return ($lines -join "`n") }
}

$updatedCount = 0
$files = Get-ChildItem -Path $Root -Filter *.html -File | Sort-Object Name
foreach ($f in $files) {
  $path = $f.FullName
  $content = [IO.File]::ReadAllText($path)
  $original = $content
  $updated = $false

  # CSS insertion
  if ($content -notmatch '(?i)ASHURA:shared-css') {
    $cssBlock = Build-CssBlock $content
    $m = [regex]::Match($content, '(?is)</title\s*>')
    if (-not $m.Success) { $m = [regex]::Match($content, '(?is)<head[^>]*>') }
    if ($m.Success) {
      $insertPos = $m.Index + $m.Length
      $content = $content.Insert($insertPos, "`r`n$cssBlock`r`n")
      $updated = $true
      if ($VerboseLog) { Write-Host "[CSS] Inserted into $($f.Name) after: $($m.Value.Trim())" }
    } else {
      Write-Warning "No <head> or </title> found in $($f.Name). Skipped CSS."
    }
  } else {
    $missingCss = @()
    if ($content -notmatch '(?i)href="\./game-enhancement\.css"') { $missingCss += '    <link rel="stylesheet" href="./game-enhancement.css">' }
    if ($content -notmatch '(?i)href="\./game-optimization\.css"') { $missingCss += '    <link rel="stylesheet" href="./game-optimization.css">' }
    if ($content -notmatch '(?i)href="\./_assets/game-frame\.css"') { $missingCss += '    <link rel="stylesheet" href="./_assets/game-frame.css">' }
    if ($missingCss.Count -gt 0) {
      $content = $content -replace '(?is)<!--\s*ASHURA:shared-css\s*-->', ([string]::Join("`n", @('<!-- ASHURA:shared-css -->') + $missingCss))
      $updated = $true
      if ($VerboseLog) { Write-Host "[CSS] Added missing lines in $($f.Name): $($missingCss -join ', ')" }
    }
  }

  # JS insertion
  if ($content -notmatch '(?i)ASHURA:shared-js') {
    $jsBlock = Build-JsBlock $content
    $m = [regex]::Match($content, '(?is)</body\s*>')
    if ($m.Success) {
      $insertPos = $m.Index
      $content = $content.Insert($insertPos, "$jsBlock`r`n")
      $updated = $true
      if ($VerboseLog) { Write-Host "[JS ] Inserted into $($f.Name) before </body>" }
    } else {
      Write-Warning "No </body> found in $($f.Name). Skipped JS."
    }
  } else {
    $missingJs = @()
    if ($content -notmatch '(?i)src="\./game-optimization\.js"') { $missingJs += '    <script src="./game-optimization.js"></script>' }
    if ($content -notmatch '(?i)src="\./_assets/game-frame\.js"') { $missingJs += '    <script src="./_assets/game-frame.js"></script>' }
    if ($missingJs.Count -gt 0) {
      $content = $content -replace '(?is)<!--\s*ASHURA:shared-js\s*-->', ([string]::Join("`n", @('<!-- ASHURA:shared-js -->') + $missingJs))
      $updated = $true
      if ($VerboseLog) { Write-Host "[JS ] Added missing lines in $($f.Name): $($missingJs -join ', ')" }
    }
  }

  if ($updated -and $content -ne $original) {
    if ($WhatIf) {
      Write-Host "Would update: $($f.FullName)"
    } else {
      Copy-Item -Path $path -Destination ($path + '.bak') -Force
      [IO.File]::WriteAllText($path, $content, (New-Object System.Text.UTF8Encoding($false)))
      Write-Host "Updated: $($f.Name)"
      $updatedCount++
    }
  } else {
    Write-Host "No change: $($f.Name)"
  }
}

Write-Host "Batch integration done. Files updated: $updatedCount / $($files.Count)"
