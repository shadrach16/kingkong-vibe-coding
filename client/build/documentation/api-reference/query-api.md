
## 4. Query API

The KingKong platform provides a RESTful API for executing your natural language prompts and more complex AI tasks. This is the API that the Figma plugin uses, and you can integrate it into your own applications for testing or production.

**API Endpoint:** POST https://api.kingkong.io/v1/query (Note: This is an example URL and should be replaced with the actual URL)

**Authentication:**

All requests must be authenticated using your Project API Key. Include the key in the X-API-Key header for every request.
```
| Header | Value | Description |
--------------------------------------------
| Content-Type | application/json | The format of the request body. |
| X-API-Key | your-project-api-key | Your unique API key obtained from the KingKong web app. |
```
**Request Body:**

The request body is a JSON object that contains the prompts and optional parameters for the AI task.
```
| Parameter | Type | Required | Description |
--------------------------------------------
| prompts | array<string> | Yes | A list of natural language prompts for the AI to execute. |
| variables | object | No | A dictionary of key-value pairs to be used as variables within your prompts. |
| attachment_variables| object | No | A dictionary of key-value pairs for variables containing attachments (e.g., base64-encoded images). |
| projectId | string | Yes | The unique ID of the project the query belongs to. |
| settings | object | No | An object containing optional settings to fine-tune the AI model's behavior. |
```
```json
// Example Request Body
{
  "prompts": [
    "Create a customer table with name 'man_customer' and add necessary fields like email and customerName.",
    "Populate the 'man_customer' table with one record, and return the record."
  ],
  "variables": {
    "PROJECT_NAME": "KingKong"
  },
  "attachment_variables": {
    "PROJECT_LOGO": "data:image/png;base64,iVBORw0KGgoAAAA..."
  },
  "projectId": "68ad1161f3dc0e130018624c",
  "settings": {
    "model": "google/gemini-pro",
    "temperature": 0.7,
    "topP": 1,
    "optimiseTask": true
  }
}
```

**Response Body (Success):**

A successful response will return a structured JSON object.
```
| Parameter | Type | Description | 
--------------------------------------------
| message | string | A confirmation message that the task was executed successfully. |
| result | object | The output from the AI query. The structure of this object depends on the prompts provided. |
```
```json
// Example success response
{
  "message": "AI task executed successfully.",
  "result": {
    "results": {
      "1": {
        "acknowledged": true,
        "insertedId": "68add868be4935050a144c07"
      },
      "2": [
        {
          "_id": "68add868be4935050a144c07",
          "email": "customer@example.com",
          "customerName": "John Doe"
        }
      ]
    }
  }
}
```

**Response Body (Error):**

An error response will return a structured JSON object with a clear error message.

```json
// Example error response
{
  "status": "error",
  "type": "invalid_request",
  "message": "The provided projectId is invalid."
}
```

### Query API Endpoints:
```
| Endpoint | Method | Description | 
--------------------------------------------
| /v1/query | POST | The primary endpoint to execute a natural language prompt or complex AI task. |
| /v1/projects/{id} | GET | Get details about a specific project. |
| /v1/data-models | GET | List all data models for your project. |
| /v1/data-models/{model_name} | GET | Get the schema for a specific data model. |

```