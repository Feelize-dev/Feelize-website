# Reports Directory

This directory stores all AI-generated project analysis reports for archival and development purposes.

## Features

### Automatic Report Saving
- All reports generated via `/api/ai/analyze-project` are automatically saved here
- Filename format: `YYYY-MM-DDTHH-MM-SS_project-description.html`
- Reports are complete HTML documents ready to open in a browser

### API Endpoints

#### List All Reports
```
GET /api/ai/reports
```

Returns a list of all saved reports with metadata:
```json
{
  "success": true,
  "reports": [
    {
      "filename": "2025-11-08T14-30-15_ecommerce-platform.html",
      "createdAt": "2025-11-08T14:30:15.000Z",
      "size": 45678,
      "sizeKB": 45
    }
  ],
  "total": 1
}
```

#### Get Specific Report
```
GET /api/ai/reports/:filename
```

Returns the full HTML content of a specific report:
```json
{
  "success": true,
  "filename": "2025-11-08T14-30-15_ecommerce-platform.html",
  "content": "<!DOCTYPE html>..."
}
```

## Usage Examples

### View all reports
```bash
curl http://localhost:3000/api/ai/reports
```

### Download specific report
```bash
curl http://localhost:3000/api/ai/reports/2025-11-08T14-30-15_ecommerce-platform.html
```

## Notes

- Reports are saved with timestamps in UTC
- Directory is automatically created if it doesn't exist
- Reports are excluded from git (see .gitignore)
- Each report is a complete HTML document with embedded CSS
- Reports can be opened directly in a browser for viewing/printing
