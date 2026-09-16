$pdf = 'C:\Users\Niranjan\.gemini\antigravity\scratch\hdims\public\HDIMS_FullStack_Comprehensive_Architecture_Report.pdf'
$destDocs = 'C:\Users\Niranjan\Downloads\HDIMS_FullStack_Project\docs_and_presentation'
$destDownloads = 'C:\Users\Niranjan\Downloads\HDIMS_FullStack_Comprehensive_Architecture_Report.pdf'

Copy-Item -Path $pdf -Destination $destDocs -Force
Copy-Item -Path $pdf -Destination $destDownloads -Force
Write-Host "Copied PDF to: $destDownloads"

$src = 'C:\Users\Niranjan\Downloads\HDIMS_FullStack_Project'
$zip = 'C:\Users\Niranjan\Downloads\HDIMS_FullStack_Project.zip'
if (Test-Path $zip) { 
    Remove-Item -Force $zip 
}
Compress-Archive -Path "$src\*" -DestinationPath $zip -CompressionLevel Optimal
Write-Host "Updated zip archive: $zip"

Get-Item $destDownloads | Select-Object Name, Length, LastWriteTime
Get-Item $zip | Select-Object Name, Length, LastWriteTime
