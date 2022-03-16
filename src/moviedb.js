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
          console.log(element.name);
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
  .action(function handleAction() {
    console.log('hello-world');
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

// error on unknown commands

program.parse(process.argv);
