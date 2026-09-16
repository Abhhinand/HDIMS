$src = 'C:\Users\Niranjan\Downloads\HDIMS_FullStack_Project'
$zip = 'C:\Users\Niranjan\Downloads\HDIMS_FullStack_Project.zip'

if (Test-Path $zip) {
    Remove-Item -Force $zip
}

Compress-Archive -Path "$src\*" -DestinationPath $zip -CompressionLevel Optimal
Write-Host "Zip file created at $zip"
Get-Item $zip | Select-Object Name, Length, LastWriteTime
