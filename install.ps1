$ErrorActionPreference = "Stop"

$Repo = "PaxtonTerryDev/genid"
$BinName = "genid"
$BinDir = "$env:USERPROFILE\.local\bin"
$Asset = "${BinName}-windows-x86_64.exe"
$Url = "https://github.com/$Repo/releases/latest/download/$Asset"

New-Item -ItemType Directory -Force -Path $BinDir | Out-Null
Invoke-WebRequest -Uri $Url -OutFile "$BinDir\$BinName.exe" -UseBasicParsing

$UserPath = [Environment]::GetEnvironmentVariable("PATH", "User")
if ($UserPath -notlike "*$BinDir*") {
    [Environment]::SetEnvironmentVariable("PATH", "$BinDir;$UserPath", "User")
    Write-Host "Added $BinDir to your user PATH. Restart your terminal for it to take effect."
}

Write-Host "Installed $BinName to $BinDir\$BinName.exe"
