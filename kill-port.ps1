# Kill any process using port 5173
$port = 5173
Write-Host "Checking port $port..." -ForegroundColor Cyan

# Find all processes using the port
$connections = netstat -ano | Select-String ":$port "

if ($connections) {
    Write-Host "Found processes using port $port. Killing them..." -ForegroundColor Yellow

    $processIds = @()
    foreach ($line in $connections) {
        if ($line -match '\s+(\d+)\s*$') {
            $processId = $matches[1]
            if ($processId -ne '0' -and $processIds -notcontains $processId) {
                $processIds += $processId
            }
        }
    }

    foreach ($processId in $processIds) {
        try {
            $process = Get-Process -Id $processId -ErrorAction SilentlyContinue
            if ($process) {
                Write-Host "Killing process $($process.ProcessName) (PID: $processId)" -ForegroundColor Yellow
                Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
            }
        } catch {
            # Process might have already exited
        }
    }

    Start-Sleep -Seconds 1
    Write-Host "Port $port cleared!" -ForegroundColor Green
} else {
    Write-Host "Port $port is already free!" -ForegroundColor Green
}

