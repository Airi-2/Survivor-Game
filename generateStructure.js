const fs = require("fs");
const path = require("path");

function getFileStructure(dir, depth = 0) {
  const items = fs.readdirSync(dir);
  let structure = "";

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stats = fs.statSync(fullPath);

    if (stats.isDirectory()) {
      // Добавляем директорию в структуру
      structure += " ".repeat(depth * 2) + "├─ " + item + "\n";
      structure += getFileStructure(fullPath, depth + 1); // Рекурсивно получаем содержимое директории
    } else if (stats.isFile() && fullPath.endsWith(".js")) {
      // Добавляем только .js файлы
      structure += " ".repeat(depth * 2) + "├─ " + item + "\n";
    }
  });

  return structure;
}

// Основной каталог проекта
const projectDir = "./src"; // Поменяй на свой путь, если необходимо

// Генерируем структуру файлов
const structure = getFileStructure(projectDir);

// Запись структуры в текстовый файл
fs.writeFileSync("project-structure.txt", structure);

// Вывод в консоль (по желанию)
console.log(structure);

// Если хочешь скопировать в буфер обмена, нужно использовать библиотеку clipboardy (потребуется установить через npm)
const clipboardy = require("clipboardy");
clipboardy.writeSync(structure);
console.log("Структура скопирована в буфер обмена!");
