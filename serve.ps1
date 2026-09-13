# Prévisualisation locale du site "Les Clés de la Réussite" (aucun envoi réel de formulaire).
# Sert les fichiers statiques, simule contact.php (PHP indisponible en local), applique les
# redirections 301 et le statut 410 définis dans .htaccess pour la parité avec la production.

$root = $PSScriptRoot
$port = if ($env:PORT) { [int]$env:PORT } else { 8900 }
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Prévisualisation : http://localhost:$port/"

$mime = @{
  ".html"="text/html; charset=utf-8"; ".css"="text/css"; ".js"="application/javascript";
  ".png"="image/png"; ".jpg"="image/jpeg"; ".jpeg"="image/jpeg"; ".svg"="image/svg+xml";
  ".xml"="application/xml; charset=utf-8"; ".txt"="text/plain; charset=utf-8"; ".ico"="image/x-icon";
  ".json"="application/json; charset=utf-8"; ".webmanifest"="application/manifest+json"
}

$redirects = @{
  "/about" = "/a-propos"
  "/privacy-policy" = "/politique-confidentialite"
  "/terms-and-conditions" = "/mentions-legales"
}

function Write-Json($res, [int]$status, [string]$json) {
  $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
  $res.StatusCode = $status
  $res.ContentType = "application/json; charset=utf-8"
  $res.ContentLength64 = $bytes.Length
  $res.OutputStream.Write($bytes, 0, $bytes.Length)
}

function Write-File($res, [int]$status, [string]$filePath) {
  $ext = [System.IO.Path]::GetExtension($filePath)
  $ct = $mime[$ext]
  if (-not $ct) { $ct = "application/octet-stream" }
  $bytes = [System.IO.File]::ReadAllBytes($filePath)
  $res.StatusCode = $status
  $res.ContentType = $ct
  $res.ContentLength64 = $bytes.Length
  $res.OutputStream.Write($bytes, 0, $bytes.Length)
}

while ($listener.IsListening) {
  $context = $listener.GetContext()
  $req = $context.Request
  $res = $context.Response
  $path = [System.Uri]::UnescapeDataString($req.Url.AbsolutePath).TrimEnd('/')
  if ($path -eq "") { $path = "/" }

  try {
    if ($path -eq "/contact.php") {
      # Simulation locale : ne transmet rien réellement, permet de tester le flux client/serveur.
      $body = $null
      $reader = New-Object System.IO.StreamReader($req.InputStream, $req.ContentEncoding)
      $body = $reader.ReadToEnd()
      $fields = @{}
      foreach ($pair in ($body -split '&')) {
        if ($pair -eq '') { continue }
        $kv = $pair -split '=', 2
        $key = [System.Uri]::UnescapeDataString($kv[0]).Replace('+',' ')
        $val = if ($kv.Length -gt 1) { [System.Uri]::UnescapeDataString($kv[1]).Replace('+',' ') } else { '' }
        $fields[$key] = $val
      }
      if ($fields['site-web']) {
        Write-Json $res 200 '{"success":true,"message":"Merci."}'
      } elseif (-not $fields['nom'] -or -not $fields['email'] -or -not $fields['commune'] -or -not $fields['type_logement'] -or -not $fields['message']) {
        Write-Json $res 422 '{"success":false,"message":"Certains champs sont manquants ou invalides (simulation locale)."}'
      } else {
        Write-Host "[contact.php - simulation locale, aucun e-mail envoye] $body"
        Write-Json $res 200 '{"success":true,"message":"(Previsualisation locale) Votre demande a bien ete recue par le formulaire de test - aucun e-mail n''a reellement ete envoye."}'
      }
    }
    elseif ($path -eq "/nos-logements") {
      Write-File $res 410 (Join-Path $root "nos-logements/index.html")
    }
    elseif ($redirects.ContainsKey($path)) {
      $res.StatusCode = 301
      $res.RedirectLocation = $redirects[$path]
      $res.OutputStream.Close()
      continue
    }
    else {
      $candidate = Join-Path $root ($path.TrimStart("/"))
      if (Test-Path $candidate -PathType Container) {
        $candidate = Join-Path $candidate "index.html"
      } elseif (-not (Test-Path $candidate -PathType Leaf)) {
        $asIndex = Join-Path $root ($path.TrimStart("/") + "/index.html")
        if (Test-Path $asIndex -PathType Leaf) { $candidate = $asIndex }
      }
      if (Test-Path $candidate -PathType Leaf) {
        Write-File $res 200 $candidate
      } else {
        Write-File $res 404 (Join-Path $root "404.html")
      }
    }
  } catch {
    $msg = [System.Text.Encoding]::UTF8.GetBytes("Erreur serveur local : $_")
    $res.StatusCode = 500
    $res.OutputStream.Write($msg, 0, $msg.Length)
  }
  $res.OutputStream.Close()
}
