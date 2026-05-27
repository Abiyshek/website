# Convert all MOV files to MP4
$videoDir = ".\src\assets\videos"
$movFiles = Get-ChildItem -Path $videoDir -Filter "*.MOV" -File

if ($movFiles.Count -eq 0) {
    Write-Host "No MOV files found."
    exit
}

Write-Host "Found $($movFiles.Count) MOV file(s) to convert..."

foreach ($file in $movFiles) {
    $inputPath = $file.FullName
    $outputPath = Join-Path $videoDir ($file.BaseName + ".mp4")
    
    if (Test-Path $outputPath) {
        Write-Host "⚠️  Skipping $($file.Name) - MP4 already exists"
        continue
    }
    
    Write-Host "🔄 Converting: $($file.Name) → $($file.BaseName).mp4"
    
    try {
        ffmpeg -i "$inputPath" -c:v libx264 -preset medium -crf 23 -c:a aac -b:a 128k "$outputPath"
        
        if ($?) {
            Write-Host "✅ Converted: $($file.Name)"
        } else {
            Write-Host "❌ Failed: $($file.Name)"
        }
    }
    catch {
        Write-Host "❌ Error converting $($file.Name): $_"
    }
}

Write-Host "`n✨ Conversion complete!"
