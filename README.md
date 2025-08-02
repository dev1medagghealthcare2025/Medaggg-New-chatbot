# Medagg 2.0 - AI Medical Assistant

An advanced AI-powered medical assistant application built with React.js, featuring intelligent chatbot capabilities for healthcare consultations.

## Features

- **AI Medical Assistant** - Intelligent chatbot for health consultations
- **Real-time Chat** - Instant responses with typing indicators
- **Responsive Design** - Works seamlessly on all devices
- **Modern UI** - Beautiful glassmorphism design with gradient themes
- **Fast Performance** - Optimized React 18 with Webpack 5
- **Professional** - Medical-grade interface and responses

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

### Development

Start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

### Production Build

Create a production build:
```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
├── public/
│   ├── index.html          # HTML template
│   └── Chatbot.jpeg        # Chatbot avatar image
├── src/
│   ├── components/
│   │   ├── Chatbot.js      # Main chatbot component
│   │   └── Chatbot.css     # Chatbot styling
│   ├── App.js             # Main application component
│   ├── App.css            # Application styles
│   ├── index.js           # Entry point
│   └── index.css          # Global styles
├── package.json           # Dependencies and scripts
├── webpack.config.js      # Webpack configuration
└── README.md             # This file
```

## Available Scripts

- `npm start` - Start development server with hot reload
- `npm run dev` - Alternative development server command
- `npm run build` - Create optimized production build

## Technologies Used

- **React 18** - Modern UI library with hooks
- **Webpack 5** - Advanced module bundler
- **Babel** - JavaScript transpiler for modern syntax
- **CSS3** - Advanced styling with gradients and animations

## Medical Assistant Features

### Chat Interface
- Professional medical assistant persona
- Predefined responses for common health queries
- Typing indicators and message timestamps
- Responsive chat window with smooth animations

### Health Topics Covered
- General health consultations
- Appointment scheduling guidance
- Symptom information (general)
- Medication guidance (general)
- Emergency protocol information

### UI/UX Design
- Clean, medical-grade interface
- Gradient backgrounds with glassmorphism effects
- Responsive design for mobile and desktop
- Accessibility-focused design patterns

## Customization

- **Chatbot Responses**: Edit `src/components/Chatbot.js` to modify bot responses
- **Styling**: Customize colors and themes in `src/App.css` and `src/components/Chatbot.css`
- **Content**: Update medical information and features in the main components
- **Branding**: Replace logo and images in the `public/` directory

## Important Medical Disclaimer

This application provides general health information only and is not intended to replace professional medical advice, diagnosis, or treatment. Always consult qualified healthcare professionals for medical concerns.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details.

## Support

For technical support or feature requests, please open an issue in the repository.
