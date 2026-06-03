param(
    [string]$ProxyHost = "127.0.0.1",
    [int]$ProxyPort = 7897,
    [string]$ProxyScheme = "http"
)

$ErrorActionPreference = "Stop"

$ProjectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$EnvPath = Join-Path $ProjectRoot ".env"
$BeginMarker = "# === LOCAL_PROXY_BEGIN ==="
$EndMarker = "# === LOCAL_PROXY_END ==="
$ProxyUrl = "${ProxyScheme}://${ProxyHost}:${ProxyPort}"
$NoProxy = "localhost,127.0.0.1,::1,*.local,10.*,192.168.*,172.16.*,172.17.*,172.18.*,172.19.*,172.20.*,172.21.*,172.22.*,172.23.*,172.24.*,172.25.*,172.26.*,172.27.*,172.28.*,172.29.*,172.30.*,172.31.*"

$ProxyBlock = @"
$BeginMarker
PROXY_HOST=$ProxyHost
PROXY_PORT=$ProxyPort
PROXY_SCHEME=$ProxyScheme
PROXY_URL=$ProxyUrl

HTTP_PROXY=$ProxyUrl
HTTPS_PROXY=$ProxyUrl
ALL_PROXY=$ProxyUrl
http_proxy=$ProxyUrl
https_proxy=$ProxyUrl
all_proxy=$ProxyUrl

NO_PROXY=$NoProxy
no_proxy=$NoProxy
$EndMarker
"@

if (Test-Path -LiteralPath $EnvPath) {
    $Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $BackupPath = Join-Path $ProjectRoot ".env.backup.$Timestamp"
    Copy-Item -LiteralPath $EnvPath -Destination $BackupPath
    $ExistingContent = Get-Content -LiteralPath $EnvPath -Raw
} else {
    New-Item -ItemType File -Path $EnvPath | Out-Null
    $ExistingContent = ""
}

$Pattern = "(?s)" + [regex]::Escape($BeginMarker) + ".*?" + [regex]::Escape($EndMarker)

if ([regex]::IsMatch($ExistingContent, $Pattern)) {
    $NewContent = [regex]::Replace($ExistingContent, $Pattern, [System.Text.RegularExpressions.MatchEvaluator]{ param($match) $ProxyBlock })
} else {
    $TrimmedContent = $ExistingContent.TrimEnd()
    if ([string]::IsNullOrWhiteSpace($TrimmedContent)) {
        $NewContent = $ProxyBlock + [Environment]::NewLine
    } else {
        $NewContent = $TrimmedContent + [Environment]::NewLine + [Environment]::NewLine + $ProxyBlock + [Environment]::NewLine
    }
}

Set-Content -LiteralPath $EnvPath -Value $NewContent -Encoding UTF8

Write-Host "Updated project .env proxy block:"
Write-Host $EnvPath
