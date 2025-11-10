# Scripts Directory

This directory contains utility scripts for the AI Model Comparison Tool.

## Available Scripts

### `verify-setup.js`
Verifies that the project is set up correctly.

**Usage:**
```bash
npm run verify
# or
node scripts/verify-setup.js
```

**Checks:**
- ✅ `dist/` folder exists
- ✅ `.env` file exists
- ✅ `OPENROUTER_API_KEY` is set
- ✅ `node_modules/` exists
- ✅ `outputs/` directory exists
- ✅ `config/models.json` exists

---

### `demo-prd-requirements.ps1`
Comprehensive demonstration script that shows how the project meets all PRD requirements.

**Usage:**
```powershell
# Direct execution
.\scripts\demo-prd-requirements.ps1

# Or using npm script
npm run demo
```

**What it demonstrates:**
- ✅ All P0 requirements (Must-have)
- ✅ All P1 requirements (Should-have)
- ✅ All P2 requirements (Nice-to-have)
- ✅ User stories for all personas
- ✅ Goals & success metrics
- ✅ Technical requirements
- ✅ Non-functional requirements

**Features:**
- Automatic detection of latest execution folders
- Error handling for missing files
- User-friendly prompts with pauses between steps
- Color-coded output for better readability
- Complete PRD requirement coverage

**Note:** The script will pause between steps so you can review the output. Press Enter to continue to the next step.

---

## Script Development

All scripts should:
- Include error handling
- Provide clear output messages
- Be executable from the project root
- Follow PowerShell/Node.js best practices


