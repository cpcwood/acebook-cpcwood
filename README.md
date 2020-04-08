<p>
  <h1 align="center">Wookiebook</h1>

  <p align="center">
    A place for the more hairy individuals of Kashyyyk to share
    <br />
  </p>
</p>

## Overview

A Starwars themed Facebook clone with instant messaging functionality. Users can sign up, select a home planet, and then post messages on their own and other users walls. 

This project was originally a Makers Academy group project, which has since been exported and modifed by myself. To see the original repository, please click [here](https://github.com/cpcwood/acebook-dosdosdesperadosdynamicos).

## How to Install

#### Prerequisites

The application has been developed using Ruby v2.6.5, Ruby on Rails v5.2.4.2, and PostgreSQL 12.1. Therefore, to setup the application please ensure you have the [Homebrew](https://brew.sh/) package manager the following installed:
- [Ruby](https://www.ruby-lang.org/en/) v2.6.5 (can be installed from the terminal using the ruby package manager [RVM](https://rvm.io/rvm/install) command ```rvm install 2.6.5```)
- [PostgreSQL](https://www.postgresql.org/) v12.1 (can be installed from the terminal using homebrew ```brew install postgres@12.1```)
- [Yarn](https://yarnpkg.com/) v1.22 (can be installed from the terminal using homebrew ```brew install yarn```)
- [Bundler](https://bundler.io/) v2.1.4 (can be installed from the terminal through ruby gems ```gem install bundler```)

Once the above has been installed, clone or download the git repository, move to the program root directory, then run the following in the command line to install the program:

```bash
bundle install
yarn install
```

#### Credientials and Database

For the chat functionality to work, the message broker 'redis' is used. Please either setup a redis server on your machines localhost (port 6379), or connect to a remote version using its url.

Since the application requires persistent data, such as users, a PSQL database is used in conjunction with ApplicationRecord. To set the database up, first ensure you have PSQL installed and running as a service. Then create the revelant rails credentials for each environment (development, test, and production) as shown below:
- Fill in the template for the global credientals, which be found in ```config/credentials.yml.enc.template```
- Open the rails credentials in your editor of choice ```EDITOR=vim rails credentials:edit``` (if this if your first time opening the credentials, a new rails master key ```config/master.key``` to encrypt the credentials will be generated, do not check this into your version control)
- Add the filled template to the credentials list, then save and exit

To setup the development and test database tables with the correct schema run the following in the command line:
```bash
rails db:create
rails db:migrate
```
To set up production databases, run the above commands with the following environment variable set: ```RAILS_ENV=production```

#### Server Configuration

The application uses Ruby on Rails default application server: Puma. The configuration for the puma server are in ```config/puma.rb```. The server is currently setup to listen for requests on the local unix socket ```shared/sockets/puma.sock```, to change the server to listen on a localhost port, comment the unix socket line and uncomment the local server port line to host on `http://localhost:3000/`.

#### How to run

To start the server run ```rails server``` in the relevant ```RAILS_ENV``` environment ('development' or 'production').

## Functionality

TBC

## Images of Site

TBC

## License

Distributed under the MIT License. See `LICENSE` for more information.
