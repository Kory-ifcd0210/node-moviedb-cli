const { Command } = require('commander');
const { prompt } = require('inquirer');
const { axios } = require('axios');
const { API_KEY } = require('../config/config');
const ora = require('ora');
const http = require('http');
const program = new Command();
const chalk = require('chalk');
const util = require('util');
program.version('0.0.1');

program
  .command('get-persons')
  .description('Make a network request to fetch most popular persons')
  .action(async () => {
    const answer = await prompt([
      {
        type: 'list',
        message: 'select popular',
        name: 'popular',
        choices: ['popular'],
      },
      {
        type: 'input',
        message: 'What page do you want?',
        name: 'page',
      },
    ]);

    const options = {
      hostname: 'api.themoviedb.org',
      path: `/3/person/popular?page=${answer.page}&api_key=17412c1653448ce298346a11dd12d464`,
      method: 'GET',
    };

    const req = http.request(options, (res) => {
      const spinner = ora(
        'Fetching the popular persons data...'
      ).start();
      let responseBody = '';
      console.log(`STATUS: ${res.statusCode}`);
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        responseBody = responseBody + chunk.toString();
      });
      res.on('end', () => {
        const data = JSON.parse(responseBody);

        console.log(
          chalk.white(
            '------------------------------------------- \n'
          ) + chalk.white(`Page: ${answer.page} of: 500`)
        );

        data.results.forEach((element) => {
          console.log(
            chalk.white('-----------------------------------------')
          );
          console.log(chalk.white('\n'));
          console.log(chalk.white(`Person:\n`));
          console.log(chalk.white(`ID: ${element.id}`));
          console.log(
            chalk.white(`Name:`) + chalk.bold.blue(`${element.name}`)
          );
          element.known_for_department == 'Acting'
            ? console.log('Department: ' + chalk.magenta('Acting'))
            : console.log('');
          console.log(chalk.white(`Apepearing in movies: \n`));
          if (element.known_for !== 'undefined') {
            element.known_for.forEach((movies) => {
              console.log(chalk.white(`\t Movie:`));
              console.log(chalk.white(`\t ID: ${movies.id}`));
              console.log(
                chalk.white(`\t Release date: ${movies.release_date}`)
              );
              console.log(chalk.white(`\t Title: ${movies.title}`));
              console.log(chalk.white(`\n`));
            });
          } else {
            console.log(
              chalk.yellow(
                `${element.name} + doesn't appear in any movie + \n`
              )
            );
          }
        });
        console.log('No more data in response.');
        spinner.succeed('Todo bien');
      });
    });

    req.on('error', (e) => {
      console.error(`problem with request: ${e.message}`);
    });
    req.end();
  });

program
  .command('get-person')
  .description(
    'Make a network request to fetch the data of a single person'
  )
  .action(async () => {
    const answer = await prompt([
      {
        type: 'input',
        message: 'The id of the person you want to consult',
        name: 'id',
      },
    ]);

    const options = {
      hostname: 'api.themoviedb.org',
      path: `/3/person/${answer.id}?api_key=17412c1653448ce298346a11dd12d464`,
      method: 'GET',
    };

    const req = http.request(options, (res) => {
      const spinner = ora('Fetching the person data...').start();
      console.log(options);
      let responseBody = '';
      console.log(`STATUS: ${res.statusCode}`);
      res.setEncoding('utf8');
      res.on('data', (chunk) => {
        responseBody = responseBody + chunk.toString();
      });
      res.on('end', () => {
        const data = JSON.parse(responseBody);
        console.log(data);
        console.log(
          chalk.white('\n -----------------------------------------')
        );
        console.log(chalk.white(`Person:\n`));
        console.log(chalk.white(`ID: ${data.id}`));
        console.log(
          chalk.white(`Name:`) + chalk.bold.blue(`${data.name}`)
        );
        console.log(
          chalk.white(`Birthday: ${data.birthday}`) +
            chalk.grey(' | ') +
            chalk.white(data.place_of_birth)
        );
        data.known_for_department == 'Acting'
          ? console.log('Department: ' + chalk.magenta('Acting'))
          : console.log('');
        console.log(
          chalk.white('Biography: ') +
            chalk.bold.blue(`${data.biography}`)
        );
        if (data.also_known_as !== []) {
          console.log(chalk.white('\n'));
          console.log(chalk.white('Also known as: \n'));
          data.also_known_as.forEach((element) => {
            console.log(chalk.white(`${element}`));
          });
        } else {
          console.log(chalk.white('\n'));
          console.log(
            chalk.yellow(
              `${data.name} + doesn't have any alternate names + \n`
            )
          );
        }
        console.log('No more data in response.');
        spinner.succeed('Todo bien');
      });
    });

    req.on('error', (e) => {
      spinner.fail(`problem with request: ${e.message}`);
    });
    req.end();
  });

program
  .command('get-movies')
  .description('Make a network request to fetch movies')
  .action(function handleAction() {
    console.log('hello-world');
  });

program
  .command('get-movie')
  .description(
    'Make a network request to fetch the data of a single person'
  )
  .action(function handleAction() {
    console.log('hello-world');
  });


program.parse(process.argv);
