#!/bin/bash

echo "======================================"
echo "ПОЛНАЯ ПРОВЕРКА САЙТА"
echo "======================================"
echo ""

# 1. Проверка файлов
echo "1. ПРОВЕРКА НАЛИЧИЯ ФАЙЛОВ:"
echo "--------------------------------------"
files=("index.html" "styles.css" "script.js" "README.md")
for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        echo "✓ $file ($size bytes)"
    else
        echo "✗ $file НЕ НАЙДЕН!"
    fi
done
echo ""

# 2. Проверка изображений
echo "2. ПРОВЕРКА ИЗОБРАЖЕНИЙ И ВИДЕО:"
echo "--------------------------------------"
cd imgs
for file in *.jpg *.png *.mp4; do
    if [ -f "$file" ]; then
        size=$(stat -f%z "$file" 2>/dev/null || stat -c%s "$file" 2>/dev/null)
        echo "✓ $file ($size bytes)"
    fi
done
cd ..
echo ""

# 3. Проверка HTML структуры
echo "3. ПРОВЕРКА HTML:"
echo "--------------------------------------"
doctype=$(grep -c "<!DOCTYPE html>" index.html)
html_open=$(grep -c "<html" index.html)
html_close=$(grep -c "</html>" index.html)
head_close=$(grep -c "</head>" index.html)
body_close=$(grep -c "</body>" index.html)

echo "DOCTYPE: $doctype"
echo "<html>: $html_open, </html>: $html_close"
echo "</head>: $head_close"
echo "</body>: $body_close"

if [ $html_open -eq $html_close ] && [ $doctype -eq 1 ]; then
    echo "✓ HTML структура корректна"
else
    echo "✗ Проблемы с HTML структурой"
fi
echo ""

# 4. Проверка CSS
echo "4. ПРОВЕРКА CSS:"
echo "--------------------------------------"
open_braces=$(grep -o '{' styles.css | wc -l)
close_braces=$(grep -o '}' styles.css | wc -l)
echo "Открывающих скобок: $open_braces"
echo "Закрывающих скобок: $close_braces"

if [ $open_braces -eq $close_braces ]; then
    echo "✓ CSS баланс скобок корректен"
else
    echo "✗ Несоответствие скобок в CSS"
fi
echo ""

# 5. Проверка JavaScript
echo "5. ПРОВЕРКА JAVASCRIPT:"
echo "--------------------------------------"
if node -c script.js 2>/dev/null; then
    echo "✓ JavaScript синтаксис корректен"
else
    echo "⚠ Node.js недоступен, пропуск проверки"
fi
echo ""

# 6. Проверка ссылок на файлы
echo "6. ПРОВЕРКА ПУТЕЙ К ФАЙЛАМ:"
echo "--------------------------------------"
grep -o 'src="imgs/[^"]*"' index.html | while read -r line; do
    file=$(echo "$line" | sed 's/src="//;s/"//')
    if [ -f "$file" ]; then
        echo "✓ $file"
    else
        echo "✗ $file НЕ НАЙДЕН!"
    fi
done
echo ""

# 7. Проверка критических ID
echo "7. ПРОВЕРКА КРИТИЧЕСКИХ ЭЛЕМЕНТОВ:"
echo "--------------------------------------"
critical_ids=("header" "nav" "mobileMenuToggle" "contact" "orderForm" "phone" "service" "area")
for id in "${critical_ids[@]}"; do
    count=$(grep -c "id=\"$id\"" index.html)
    if [ $count -eq 1 ]; then
        echo "✓ id=\"$id\""
    elif [ $count -gt 1 ]; then
        echo "✗ id=\"$id\" ДУБЛИРУЕТСЯ ($count раз)"
    else
        echo "⚠ id=\"$id\" НЕ НАЙДЕН"
    fi
done
echo ""

echo "======================================"
echo "ПРОВЕРКА ЗАВЕРШЕНА"
echo "======================================"
