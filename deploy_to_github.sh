#!/bin/bash

# Скрипт для быстрой загрузки сайта на GitHub
# Использование: ./deploy_to_github.sh YOUR_USERNAME YOUR_REPO_NAME

# Проверка аргументов
if [ "$#" -ne 2 ]; then
    echo "Использование: $0 YOUR_USERNAME YOUR_REPO_NAME"
    echo "Пример: $0 john-doe cleaning-service-website"
    exit 1
fi

USERNAME=$1
REPO_NAME=$2

echo "🚀 Загрузка сайта на GitHub..."
echo "Пользователь: $USERNAME"
echo "Репозиторий: $REPO_NAME"
echo ""

# Проверка, что мы в правильной папке
if [ ! -f "index.html" ]; then
    echo "❌ Ошибка: Файл index.html не найден в текущей папке"
    echo "Убедитесь, что вы запускаете скрипт из папки github_deployment"
    exit 1
fi

echo "✅ Найдены файлы сайта"

# Инициализация git
echo "📁 Инициализация git репозитория..."
git init

# Добавление файлов
echo "📄 Добавление файлов..."
git add .

# Создание коммита
echo "💾 Создание коммита..."
git commit -m "Initial commit: Cleaning service website with hero video fixes"

# Добавление remote origin
echo "🔗 Добавление remote origin..."
git remote add origin https://github.com/$USERNAME/$REPO_NAME.git

# Push на GitHub
echo "⬆️ Загрузка на GitHub..."
git branch -M main
git push -u origin main

echo ""
echo "🎉 Файлы успешно загружены на GitHub!"
echo ""
echo "📋 Следующие шаги:"
echo "1. Настройте GitHub Pages в настройках репозитория"
echo "2. Перейдите в Settings → Pages"
echo "3. Выберите Source: Deploy from a branch"
echo "4. Выберите Branch: main /"
echo "5. Нажмите Save"
echo ""
echo "🌐 Ваш сайт будет доступен по адресу:"
echo "https://$USERNAME.github.io/$REPO_NAME"
echo ""
echo "📖 Подробные инструкции см. в файле GITHUB_DEPLOYMENT_GUIDE.md"