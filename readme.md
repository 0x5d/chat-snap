# chat-snap
A simple, websockets-based image-only photo-chat.

## Install
Make sure bower is installed:
```sh
npm install -g bower
```

To install back-end and fron-end deps, run
```sh
npm install && bower install
```

## Run
```sh
node main
```

## Deploy with Heroku
Make sure the Heroku CLI is installed on your machine.
```sh
heroku login
heroku create <app name>
git remote add heroku https://git.heroku.com/<app name>.git
git push heroku master
```
Alternatively, you can just press this purple button:

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy)