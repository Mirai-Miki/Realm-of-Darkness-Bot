# Realm-of-Darkness-Bot

Welcome to Realm-of-Darkness-Bot! This codebase is designed to power multiple Discord bots for the World of Darkness gaming community.

## Bot Structure

- The `index-xx.js` files serve as shard managers for each respective bot.
- The `xx-bot.js` files act as entry points for each bot.
- The `events` folder manages Discord events.
- The `commands` folder serves as the entry point for each Discord command event.
- The `components` folder serves as the entry point for each component event.
- The `modules` and `structures` folders contain functions and classes used throughout the program.
- The `RealmAPI` folder handles all API requests to the server

## Libraries

The major libraries being used in this codebase include:

- Discord.js: A powerful library for interacting with the Discord API.
- Node.js: A JavaScript runtime environment.
- npm: A package manager for Node.js.

## Installation

1. Clone the repository: `git clone https://github.com/Mirai-Miki/Realm-of-Darkness-Bot.git`
2. Install the required dependencies: `npm install`
3. Each bot requires a config file with the following structure:

```json
{
  "clientId": "APP_ID",
  "token": "APP_TOKEN",
  "APIKey": "API_KEY",
  "commandPath": "./commands/xx",
  "statChannel": "CHANNEL_ID"
}
```

4. Start the bot: `npm run xx` where xx is the game version

## Usage

To use the bot, invite it to your Discord server. Invite links can be found on https://realmofdarkness.app

## Contributing

Contributions are welcome! If you would like to contribute to this project, please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b my-feature-branch`
3. Make your changes and commit them: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin my-feature-branch`
5. Submit a pull request

## License

This project is licensed under the AGPL License. See the [LICENSE](LICENSE) file for more information.

## Things to Implement

- Add Impairment penalty to sheet roll
- autocomplete character names
- ST updates should DM the update to the players
- Exp managment server wide
- Commands to compliment full sheets. Healing, damage ect.
- v20 blood point reduction management
