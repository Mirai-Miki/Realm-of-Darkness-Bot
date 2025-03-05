# Realm of Darkness Discord Bot

![Project Banner](https://res.cloudinary.com/dze64d7cr/image/upload/v1701410603/Logo/banner_bg_index.webp)

A suite of Discord bots designed for World of Darkness tabletop roleplaying games. These bots provide character management, dice rolling, and other utilities specifically tailored for World of Darkness 5th Edition, 20th Editon and the Chronicles of Darkness games.

## 🌟 Features

- **Character Tracker Management**: Create, view, and update character Trackers
- **Dice Rolling**: Game-specific dice systems
- **Discord Slash Commands**: Modern command interface with autocomplete
- **Multi-Bot Architecture**: Specialized bots for different game systems
- **Integrated Website**: Features a modern graphical user interface and full Character sheets

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16.9.0 or higher)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)
- A Discord account with a registered application/bot
- **Backend Server**: The bots require a running backend server from [realmofdarkness.app repository](https://github.com/Mirai-Miki/realmofdarkness.app)

### Backend Setup (Required)

These Discord bots communicate with a Django backend SQL database server. You must set up the backend server first:

1. Clone the backend repository:

   ```bash
   git clone https://github.com/Mirai-Miki/realmofdarkness.app.git
   cd realmofdarkness.app
   ```

2. Follow the setup instructions in the backend repository's README.md file

3. Ensure the backend server is running before starting the Discord bots

4. Get your API key from the backend server (required for the .env file)

### Bot Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Mirai-Miki/Realm-of-Darkness-Bot.git
   cd Realm-of-Darkness-Bot
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a .env file in the root directory with:

   ```env
   # Environment
   NODE_ENV=development

   # Bot Application IDs
   CLIENT_ID_5TH=your_5th_client_id
   CLIENT_ID_20TH=your_20th_client_id
   CLIENT_ID_COD=your_cod_client_id

   # Bot Tokens
   TOKEN_5TH=your_5th_token
   TOKEN_20TH=your_20th_token
   TOKEN_COD=your_cod_token

   # Discord Server ID for testing
   DEV_SERVER_ID=your_server_id

   # API connection for the Backend (from backend setup)
   API_KEY=your_api_key
   ```

4. **Deploy slash commands**
   ```bash
   npm run deploy
   ```

## 🔧 Development

### Running in Development Mode

To start all bots at once:

```bash
npm run dev
```

Or run individual bots:

```bash
npm run dev:5th    # Start V5 bot
npm run dev:20th   # Start V20 bot
npm run dev:cod    # Start Chronicles of Darkness bot
```

### Project Structure

```
Realm-of-Darkness-Bot/
├── src/               # Source code
│   ├── bots/          # Bot entry points
│   └── shards/        # Shard managers
├── commands/          # Slash command implementations
│   ├── 5th/           # V5 specific commands
│   ├── 20th/          # V20 specific commands
│   └── cod/           # CoD specific commands
├── components/        # Message components (buttons/select menus)
├── events/            # Discord.js event handlers
├── modules/           # Shared utility modules
├── structures/        # Data structures and models
├── Constants/         # Constants and configuration
├── Errors/            # Error handling
├── realmAPI/          # API client for backend services
├── scripts/           # Utility scripts
└── alias.js           # Module alias definitions
```

### Module Alias System

This project uses a module alias system to avoid complex relative imports:

```javascript
// Instead of this:
const something = require("../../../../modules/something");

// You can use:
const something = require("@modules/something");
```

### TypeScript Support

The project is transitioning to TypeScript. To create new TypeScript files:

```bash
# Run TypeScript compiler in watch mode
npx tsc --watch

# Build the project for production
npm run build
```

## 🏗️ Building for Production

```bash
# Build the project
npm run build

# Start in production mode
npm start
```

## Code Style

This project uses [Prettier](https://prettier.io/) for code formatting. The configuration is in the `.prettierrc.json` file.

To format code:

```bash
npm run format
```

To check if files are formatted correctly:

```bash
npm run format:check
```

## 📝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b my-new-feature`
3. Make your changes
4. Run tests to ensure everything works
5. Commit your changes: `git commit -am 'Add new feature'`
6. Push to the branch: `git push origin my-new-feature`
7. Submit a pull request

Please follow the existing code style and include appropriate comments.

## 🐛 Known Issues

- Setting a ST role should force update members with that role
- Bot should create members for all active users on guild create
- `/w rite` does not do auto rage yet

## 🗺️ Roadmap

- Need autocomplete on `/character defaults`
- Include 'splat' in list values to make future pulls easier
- Split Roll commands into their own Commands
- Add Impairment penalty to 5th edition sheet roll
- ST updates should DM the update to the players
- Experience management server wide
- Commands to complement full sheets (healing, damage, etc.)
- `/resonance roll` should auto update sheets
- Compulsion roll should auto clan with sheet selected

## 📄 License

This project is licensed under the AGPL License. See the LICENSE file for details.

## 🤝 Connect

- **Website**: [Realm of Darkness](https://realmofdarkness.app)
- **Discord**: [Join our community](https://discord.com/invite/p82yc8sKx2)
- **Issues**: [Report bugs](https://github.com/Mirai-Miki/Realm-of-Darkness-Bot/issues)

---

Made with ❤️ for the World of Darkness community
