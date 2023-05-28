#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import chalk from "chalk";
import minimist from "minimist";

const argv = minimist(process.argv.slice(2));

const fileRename = {
  _gitignore: '.gitignore',
}

const cwd = process.cwd();

try {
  const targetTemplate = argv.template || argv.t;
  const templateDir = path.resolve(
    fileURLToPath(import.meta.url),
    "../..",
    `template-${targetTemplate}-ts`
  );

  function copyDir(srcDir, destDir) {
    fs.mkdirSync(destDir, { recursive: true });
    for (const file of fs.readdirSync(srcDir)) {
      const srcFile = path.resolve(srcDir, file);
      const destFile = path.resolve(destDir, file);
      copy(srcFile, destFile);
    }
  }

  function copy(src, dest) {
    const stat = fs.statSync(src);

    if (stat.isDirectory()) {
      copyDir(src, dest);
    } else {
      fs.copyFileSync(src, dest);
    }
  }
  const files = fs.readdirSync(templateDir);

  const write = (fileSrc) => {
    const targetPath = path.join(cwd, fileRename[fileSrc] ?? fileSrc);
    copy(path.join(templateDir, fileSrc), targetPath);
  };

  for (const file of files.filter((f) => f !== "package.json")) {
    write(file);
  }

  console.log(chalk.cyan.bold(`create ${targetTemplate} project success!`));
} catch (e) {
  console.log(chalk.red("something gets wrong"));
}
