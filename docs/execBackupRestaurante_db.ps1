$origem = "C:\ProgramData\MySQL\MySQL Server 8.0\Data\restaurante_db"  # Defina o caminho da pasta de origem
$destino = "C:\Users\Adeilson\Documents\AdDev\Projetos\Em_Andamento\backend-menu-digital-completo\restaurante_db"  # Defina o caminho da pasta de destino

# Copia os arquivos da pasta de origem para a pasta de destino, sobrescrevendo os existentes
Copy-Item -Path $origem\* -Destination $destino -Recurse -Force

Write-Output "Backup concluído com sucesso!"
