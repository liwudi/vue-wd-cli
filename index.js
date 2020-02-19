#!/usr/bin/env node
/**
 * Created by mapbar_front on 2020-02-17.
 */
const fs = require('fs');
const program = require('commander');
const download = require('download-git-repo');
const handlebars = require('handlebars');
const inquirer = require('inquirer');
const ora = require('ora');
const chalk = require('chalk');
const symbols = require('log-symbols');
program.version('1.0.0', '-v, --version')
    .command('init <name>')
    .action((name) => {
        if(!fs.existsSync(name)){
            inquirer.prompt([
                {
                    name: 'description',
                    message: '请输入项目描述：'
                },
                {
                    name: 'author',
                    message: '请输入作者名称：'
                },
                {
                    name: 'template',
                    message: '请输入模板类型（pc/mobile）：'
                }
            ]).then((answers) => {
                const spinner = ora('正在下载模板...');
                spinner.start();
                const template_mobile = 'https://github.com:liwudi/vue-mobile-template#master';
                const template_pc  = 'https://github.com:liwudi/vue-pc-template#master';
                const TEMPLATE = answers.template === 'pc' ? template_pc : template_mobile;
                download(TEMPLATE, name, {clone: true}, (err) => {
                    if(err){
                        spinner.fail();
                        console.log(symbols.error, chalk.red(err));
                    }else{
                        spinner.succeed();
                        const fileName = `${name}/package.json`;
                        const meta = {
                            name,
                            description: answers.description,
                            author: answers.author
                        }
                        if(fs.existsSync(fileName)){
                            const content = fs.readFileSync(fileName).toString();
                            const result = handlebars.compile(content)(meta);
                            fs.writeFileSync(fileName, result);
                        }
                        console.log(symbols.success, chalk.green('项目初始化完成'));
                    }
                })
            })
        }else{
            // 错误提示项目已存在，避免覆盖原有项目
            console.log(symbols.error, chalk.red('项目已存在'));
        }
    })
program.parse(process.argv);
