# DermaDetect Backend - Security Configuration Guide

## 🔒 API Key Security

This guide explains how to securely configure the OpenAI API key for the DermaDetect backend.

### ⚠️ Important Security Notes

- **Never commit API keys to version control**
- **Never hardcode API keys in source code**
- **Use environment variables for all sensitive configuration**
- **The `.env` file is in `.gitignore` to prevent accidental commits**

## 🚀 Quick Setup

### 1. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit the .env file with your actual values
# Replace "your-openai-api-key-here" with your real API key
```

### 2. Validate Configuration

```bash
# Run the configuration validator
python validate_config.py
```

### 3. Start the Server Securely

```bash
# Option 1: Use the secure startup script (recommended)
python start_secure.py

# Option 2: Traditional startup (after validation)
python main.py
```

## 📁 Environment Variables

Create a `.env` file in the backend directory with these variables:

```env
# OpenAI Configuration
OPENAI_API_KEY=your-actual-openai-api-key-here
OPENAI_BASE_URL=https://openrouter.ai/api/v1
OPENAI_MODEL=gpt-3.5-turbo

# Server Configuration
HOST=0.0.0.0
PORT=3000
DEBUG=False
```

## 🔧 Configuration Validation

The system includes several validation mechanisms:

### 1. Startup Validation
- `main.py` checks configuration on startup
- Warns if API key is missing or set to example value
- Falls back to basic responses if OpenAI is not configured

### 2. Runtime Validation
- `openai_service.py` checks if API key is configured before making requests
- Gracefully falls back to predefined responses if API is unavailable
- Never exposes API keys in logs or error messages

### 3. Manual Validation
```bash
python validate_config.py
```

## 🛡️ Security Features

### API Key Protection
- ✅ No hardcoded API keys in source code
- ✅ Environment variable validation
- ✅ Graceful fallback when API key is missing
- ✅ No API key exposure in logs or error messages
- ✅ `.env` file in `.gitignore`

### Error Handling
- ✅ Secure error messages (no sensitive data exposure)
- ✅ Timeout handling for API requests
- ✅ Connection error handling
- ✅ Fallback responses for service unavailability

### Logging
- ✅ Request/response logging without sensitive data
- ✅ Configuration status logging
- ✅ Error logging without exposing secrets

## 🚨 Troubleshooting

### Common Issues

1. **"OPENAI_API_KEY environment variable is not set"**
   - Check if `.env` file exists
   - Verify the API key is set in `.env`
   - Run `python validate_config.py`

2. **"OpenAI API request timed out"**
   - Check internet connection
   - Verify OpenAI service status
   - Check if API key is valid

3. **"Failed to connect to OpenAI API"**
   - Check internet connection
   - Verify base URL is correct
   - Check firewall settings

### Validation Commands

```bash
# Check if .env file is properly configured
python validate_config.py

# Test OpenAI service initialization
python -c "from openai_service import openai_service; print('✅ Service OK' if openai_service._is_configured() else '❌ Not configured')"

# Start with verbose logging
python main.py --log-level debug
```

## 📝 Deployment Considerations

### Production Deployment
1. Use environment variables instead of `.env` files
2. Store API keys in secure secret management systems
3. Enable HTTPS/TLS for all communications
4. Monitor API usage and costs
5. Implement rate limiting
6. Use proper logging and monitoring

### Environment-Specific Configuration
```bash
# Development
DEBUG=True
OPENAI_MODEL=gpt-3.5-turbo

# Production
DEBUG=False
OPENAI_MODEL=gpt-4  # Optional upgrade
```

## 🆘 Support

If you encounter issues:
1. Run `python validate_config.py` first
2. Check the logs for specific error messages
3. Verify your OpenAI API key is valid and has sufficient credits
4. Ensure your environment variables are properly set

## 📚 Additional Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Environment Variables Best Practices](https://12factor.net/config)
- [FastAPI Security Guide](https://fastapi.tiangolo.com/tutorial/security/)
