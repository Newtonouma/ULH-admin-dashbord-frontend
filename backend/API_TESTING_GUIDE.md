# Universal Lighthouse Backend - Postman API Testing Guide

This comprehensive guide provides Postman collections, test data, and scripts for testing all HTTP methods and API endpoints in the Universal Lighthouse backend.

**Base URL**: `https://universallighthouse-backend-production.up.railway.app`

---

## 📋 **Quick Setup - Import Postman Collection**

### **1. Import Collection JSON**

Copy and import this Postman collection into your workspace:

```json
{
  "info": {
    "name": "Universal Lighthouse API",
    "description": "Complete API testing collection for Universal Lighthouse backend",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "https://universallighthouse-backend-production.up.railway.app",
      "type": "string"
    },
    {
      "key": "causeId",
      "value": "",
      "type": "string"
    },
    {
      "key": "teamId",
      "value": "",
      "type": "string"
    },
    {
      "key": "eventId",
      "value": "",
      "type": "string"
    },
    {
      "key": "galleryId",
      "value": "",
      "type": "string"
    },
    {
      "key": "donationId",
      "value": "",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "Health Check",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{baseUrl}}/api/health",
          "host": ["{{baseUrl}}"],
          "path": ["api", "health"]
        }
      },
      "response": []
    },
    {
      "name": "Causes",
      "item": [
        {
          "name": "Get All Causes",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/causes",
              "host": ["{{baseUrl}}"],
              "path": ["api", "causes"]
            }
          },
          "response": []
        },
        {
          "name": "Create Cause",
          "event": [
            {
              "listen": "test",
              "script": {                "exec": [
                  "if (pm.response.code === 201) {",
                  "    const responseJson = pm.response.json();",
                  "    pm.collectionVariables.set('causeId', responseJson.id);",
                  "    pm.test('Cause created successfully', function () {",
                  "        pm.expect(responseJson.id).to.not.be.undefined;",
                  "    });",
                  "    pm.test('Image URL is saved', function () {",
                  "        pm.expect(responseJson.imageUrl).to.not.be.undefined;",
                  "        pm.expect(responseJson.imageUrl).to.include('https://');",
                  "    });",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Clean Water for Rural Communities\",\n  \"description\": \"Providing access to clean drinking water for underserved rural communities through well drilling and water purification systems.\",\n  \"goal\": 25000,\n  \"category\": \"Water & Sanitation\",\n  \"imageUrl\": \"https://example.com/clean-water-project.jpg\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/causes",
              "host": ["{{baseUrl}}"],
              "path": ["api", "causes"]
            }
          },
          "response": []
        },
        {
          "name": "Get Cause by ID",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/causes/{{causeId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "causes", "{{causeId}}"]
            }
          },
          "response": []
        },        {
          "name": "Update Cause",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 200) {",
                  "    const responseJson = pm.response.json();",
                  "    pm.test('Cause updated successfully', function () {",
                  "        pm.expect(responseJson.id).to.not.be.undefined;",
                  "    });",
                  "    pm.test('Updated fields are correct', function () {",
                  "        pm.expect(responseJson.title).to.include('Updated');",
                  "        pm.expect(responseJson.goal).to.equal(30000);",
                  "    });",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Clean Water for Rural Communities - Updated\",\n  \"goal\": 30000,\n  \"imageUrl\": \"https://example.com/updated-clean-water-project.jpg\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/causes/{{causeId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "causes", "{{causeId}}"]
            }
          },
          "response": []
        },
        {
          "name": "Delete Cause",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/causes/{{causeId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "causes", "{{causeId}}"]
            }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Teams",
      "item": [
        {
          "name": "Get All Teams",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/teams",
              "host": ["{{baseUrl}}"],
              "path": ["api", "teams"]
            }
          },
          "response": []
        },
        {
          "name": "Create Team Member",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 201) {",
                  "    const responseJson = pm.response.json();",
                  "    pm.collectionVariables.set('teamId', responseJson.id);",
                  "    pm.test('Team member created successfully', function () {",
                  "        pm.expect(responseJson.id).to.not.be.undefined;",
                  "    });",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Dr. Sarah Chen\",\n  \"description\": \"Emergency medicine physician with 15+ years of experience in disaster relief and humanitarian aid.\",\n  \"imageUrl\": \"https://example.com/team/sarah-chen.jpg\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/teams",
              "host": ["{{baseUrl}}"],
              "path": ["api", "teams"]
            }
          },
          "response": []
        },
        {
          "name": "Get Team Member by ID",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/teams/{{teamId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "teams", "{{teamId}}"]
            }
          },
          "response": []
        },
        {
          "name": "Update Team Member",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Dr. Sarah Chen, MD\",\n  \"description\": \"Senior Emergency Medicine Physician with 15+ years of experience in disaster relief, humanitarian aid, and community health programs.\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/teams/{{teamId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "teams", "{{teamId}}"]
            }
          },
          "response": []
        },
        {
          "name": "Delete Team Member",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/teams/{{teamId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "teams", "{{teamId}}"]
            }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Events",
      "item": [
        {
          "name": "Get All Events",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/events",
              "host": ["{{baseUrl}}"],
              "path": ["api", "events"]
            }
          },
          "response": []
        },
        {
          "name": "Create Event",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 201) {",
                  "    const responseJson = pm.response.json();",
                  "    pm.collectionVariables.set('eventId', responseJson.id);",
                  "    pm.test('Event created successfully', function () {",
                  "        pm.expect(responseJson.id).to.not.be.undefined;",
                  "    });",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Annual Charity Gala 2025\",\n  \"description\": \"Join us for an evening of inspiration, networking, and fundraising for our clean water initiatives. Features live auction, dinner, and keynote speakers.\",\n  \"date\": \"2025-07-15T19:00:00.000Z\",\n  \"location\": \"Grand Ballroom, Downtown Convention Center\",\n  \"imageUrl\": \"https://example.com/events/charity-gala-2025.jpg\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/events",
              "host": ["{{baseUrl}}"],
              "path": ["api", "events"]
            }
          },
          "response": []
        },
        {
          "name": "Get Event by ID",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/events/{{eventId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "events", "{{eventId}}"]
            }
          },
          "response": []
        },
        {
          "name": "Update Event",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Annual Charity Gala 2025 - SOLD OUT\",\n  \"location\": \"Grand Ballroom, Downtown Convention Center - Main Hall\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/events/{{eventId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "events", "{{eventId}}"]
            }
          },
          "response": []
        },
        {
          "name": "Delete Event",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/events/{{eventId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "events", "{{eventId}}"]
            }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Gallery",
      "item": [
        {
          "name": "Get All Gallery Items",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/gallery",
              "host": ["{{baseUrl}}"],
              "path": ["api", "gallery"]
            }
          },
          "response": []
        },
        {
          "name": "Create Gallery Item",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 201) {",
                  "    const responseJson = pm.response.json();",
                  "    pm.collectionVariables.set('galleryId', responseJson.id);",
                  "    pm.test('Gallery item created successfully', function () {",
                  "        pm.expect(responseJson.id).to.not.be.undefined;",
                  "    });",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"imageUrl\": \"https://example.com/gallery/well-drilling-village.jpg\",\n  \"caption\": \"Community members celebrating the completion of their new water well in rural Kenya\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/gallery",
              "host": ["{{baseUrl}}"],
              "path": ["api", "gallery"]
            }
          },
          "response": []
        },
        {
          "name": "Get Gallery Item by ID",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/gallery/{{galleryId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "gallery", "{{galleryId}}"]
            }
          },
          "response": []
        },
        {
          "name": "Update Gallery Item",
          "request": {
            "method": "PATCH",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"caption\": \"Community members and volunteers celebrating the completion of their new water well in rural Kenya - December 2024\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/gallery/{{galleryId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "gallery", "{{galleryId}}"]
            }
          },
          "response": []
        },
        {
          "name": "Delete Gallery Item",
          "request": {
            "method": "DELETE",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/gallery/{{galleryId}}",
              "host": ["{{baseUrl}}"],
              "path": ["api", "gallery", "{{galleryId}}"]
            }
          },
          "response": []
        }
      ]
    },
    {
      "name": "Donations",
      "item": [
        {
          "name": "Get All Donations",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/donations",
              "host": ["{{baseUrl}}"],
              "path": ["api", "donations"]
            }
          },
          "response": []
        },
        {
          "name": "Create Donation",
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "if (pm.response.code === 201) {",
                  "    const responseJson = pm.response.json();",
                  "    pm.collectionVariables.set('donationId', responseJson.id);",
                  "    pm.test('Donation created successfully', function () {",
                  "        pm.expect(responseJson.id).to.not.be.undefined;",
                  "    });",
                  "}"
                ]
              }
            }
          ],
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"amount\": 100.00,\n  \"donorName\": \"John Smith\",\n  \"donorEmail\": \"john.smith@example.com\",\n  \"causeId\": \"{{causeId}}\",\n  \"paymentMethod\": \"credit_card\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/donations",
              "host": ["{{baseUrl}}"],
              "path": ["api", "donations"]
            }
          },
          "response": []
        }
      ]
    }
  ]
}
```

---

## 🚀 **Getting Started with Postman**

### **Step 1: Setup Collection**

1. Open Postman
2. Click **Import** button
3. Paste the JSON collection above
4. Click **Import**

### **Step 2: Configure Environment Variables**

The collection includes these variables:

- `baseUrl` - API base URL (pre-configured)
- `causeId` - Auto-populated when creating causes
- `teamId` - Auto-populated when creating teams
- `eventId` - Auto-populated when creating events
- `galleryId` - Auto-populated when creating gallery items
- `donationId` - Auto-populated when creating donations

### **Step 3: Test Workflow**

1. Start with **Health Check** to verify API is running
2. **Create** entities first (Causes, Teams, Events, Gallery)
3. **Read** entities (Get All, Get by ID)
4. **Update** entities with PATCH requests
5. **Delete** entities to clean up

---

## 🔧 **Advanced Postman Features**

### **1. Pre-request Scripts**

Add these scripts to collection or request level for enhanced functionality:

```javascript
// Set timestamp for dynamic data
pm.collectionVariables.set("timestamp", new Date().toISOString());

// Generate random test data
pm.collectionVariables.set("randomEmail", "test" + Math.floor(Math.random() * 1000) + "@example.com");
pm.collectionVariables.set("randomAmount", Math.floor(Math.random() * 1000) + 50);
```

### **2. Test Scripts for Validation**

#### **Enhanced Response Testing**

```javascript
// Test response time
pm.test("Response time is less than 500ms", function () {
    pm.expect(pm.response.responseTime).to.be.below(500);
});

// Test response structure
pm.test("Response has correct structure", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson).to.have.property('id');
    pm.expect(responseJson.id).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
});

// Test data types
pm.test("Amount is a number", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.goal).to.be.a('number');
    pm.expect(responseJson.raised).to.be.a('number');
});
```

### **3. Environment Management**

Create environments for different stages:

#### **Development Environment**

```json
{
  "name": "Development",
  "values": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000",
      "enabled": true
    }
  ]
}
```

#### **Production Environment**

```json
{
  "name": "Production",
  "values": [
    {
      "key": "baseUrl", 
      "value": "https://universallighthouse-backend-production.up.railway.app",
      "enabled": true
    }
  ]
}
```

## 📊 **Sample Test Data for Postman**

### **Causes Test Data**

Use this JSON data in your Postman requests:

```json
{
  "title": "Clean Water Initiative",
  "description": "Bringing clean, safe drinking water to rural communities through well construction and water purification systems.",
  "goal": 25000,
  "category": "Water & Sanitation",
  "imageUrl": "https://example.com/clean-water.jpg"
}
```

```json
{
  "title": "Educational Scholarship Fund", 
  "description": "Providing scholarships and educational resources to underprivileged children in developing regions.",
  "goal": 40000,
  "category": "Education",
  "imageUrl": "https://example.com/education.jpg"
}
```

### **Teams Test Data**

```json
{
  "name": "Dr. Sarah Chen",
  "description": "Emergency medicine physician with 15+ years of experience in disaster relief and humanitarian aid.",
  "imageUrl": "https://example.com/team/sarah-chen.jpg"
}
```

```json
{
  "name": "Michael Rodriguez",
  "description": "Water systems engineer specializing in sustainable infrastructure for rural communities.",
  "imageUrl": "https://example.com/team/michael-rodriguez.jpg"
}
```

### **Events Test Data**

```json
{
  "title": "Annual Fundraising Gala",
  "description": "Our signature fundraising event featuring dinner, live auction, and inspiring stories from the communities we serve.",
  "date": "2024-12-15T19:00:00.000Z",
  "location": "Grand Ballroom, Downtown Hotel",
  "imageUrl": "https://example.com/events/gala.jpg"
}
```

### **Gallery Test Data**

```json
{
  "imageUrl": "https://example.com/gallery/well-completion.jpg",
  "caption": "Community celebrates the completion of their new water well - providing clean water for 500+ families"
}
```

### **Donations Test Data**

```json
{
  "amount": 100.00,
  "donorName": "John Doe",
  "donorEmail": "john.doe@example.com",
  "causeId": "{{causeId}}"
}
```

---

## 🚀 **Postman Testing Workflows**

### **1. Collection Runner**

Run the entire collection automatically:

1. Click on your collection name
2. Select "Run collection"
3. Choose which requests to run
4. Set iterations and delay between requests
5. Click "Run Universal Lighthouse API"

### **2. Environment Variables**

Create different environments for testing:

**Development Environment:**

- `baseUrl`: `http://localhost:3000`

**Production Environment:**

- `baseUrl`: `https://universallighthouse-backend-production.up.railway.app`

### **3. Enhanced Test Scripts**

Add these to your requests for better validation:

```javascript
// Validate response time
pm.test("Response time is acceptable", function () {
    pm.expect(pm.response.responseTime).to.be.below(2000);
});

// Validate UUID format
pm.test("ID is valid UUID", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson.id).to.match(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
});

// Validate required fields
pm.test("Response has required fields", function () {
    const responseJson = pm.response.json();
    pm.expect(responseJson).to.have.property('title');
    pm.expect(responseJson).to.have.property('description');
});
```

### **4. Pre-request Scripts**

Generate dynamic test data:

```javascript
// Generate random test data
pm.collectionVariables.set("randomTitle", "Test Cause " + Math.floor(Math.random() * 1000));
pm.collectionVariables.set("randomAmount", Math.floor(Math.random() * 10000) + 1000);
pm.collectionVariables.set("randomEmail", "test" + Math.floor(Math.random() * 1000) + "@example.com");

// Set current timestamp
pm.collectionVariables.set("currentDate", new Date().toISOString());
```

---

## ✅ **Expected Response Formats**

### **Successful Create Response (201)**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Clean Water Initiative",
  "description": "Bringing clean water to communities",
  "goal": 25000,
  "raised": "0.00",
  "category": "Water & Sanitation",
  "imageUrl": "https://example.com/image.jpg",
  "createdAt": "2024-12-31T10:30:00.000Z",
  "updatedAt": "2024-12-31T10:30:00.000Z"
}
```

### **Successful Get All Response (200)**

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Clean Water Initiative",
    "description": "Bringing clean water to communities",
    "goal": 25000,
    "raised": "8500.00",
    "category": "Water & Sanitation",
    "imageUrl": "https://example.com/image.jpg",
    "createdAt": "2024-12-31T10:30:00.000Z",
    "updatedAt": "2024-12-31T10:30:00.000Z"
  }
]
```

### **Error Responses**

**400 Bad Request:**

```json
{
  "statusCode": 400,
  "message": ["title should not be empty"],
  "error": "Bad Request"
}
```

**404 Not Found:**

```json
{
  "statusCode": 404,
  "message": "Resource not found",
  "error": "Not Found"
}
```

---

## 🚀 **Testing Workflow Recommendations**

### **1. Basic Testing Sequence**

1. **Health Check** - Verify API is responsive
2. **Create Resources** - Create test data for each entity type
3. **Read Operations** - Test GET endpoints with created data
4. **Update Operations** - Test PATCH endpoints with partial updates
5. **Delete Operations** - Clean up test data

### **2. Error Testing**

Test these scenarios in Postman:

- **Missing required fields** - Submit incomplete data
- **Invalid data types** - Send strings where numbers expected
- **Non-existent IDs** - Try to fetch/update resources that don't exist
- **Invalid UUIDs** - Use malformed ID formats

### **3. Performance Testing**

Use Collection Runner with:

- Multiple iterations
- Delays between requests  
- Different data sets per iteration

---

## 📋 **Postman Testing Checklist**

- [ ] Collection imported successfully
- [ ] Variables configured (baseUrl, entity IDs)
- [ ] Health check passes
- [ ] All CRUD operations tested for each entity
- [ ] Response validation scripts added
- [ ] Error scenarios tested
- [ ] Performance testing completed
- [ ] Environment variables set up for different stages
- [ ] Collection exported for team sharing

---

## 🔗 **Additional Resources**

- **Postman Learning Center**: [learning.postman.com](https://learning.postman.com)
- **API Documentation**: Available in your Postman collection descriptions
- **Collection Sharing**: Export and share your customized collection with your team

---

## 📝 **Notes**

- All endpoints return JSON responses
- UUIDs are automatically generated for entity IDs
- Dates should be in ISO 8601 format (`2024-12-31T10:30:00.000Z`)
- Monetary amounts are in decimal format (e.g., `100.00`)
- Image URLs should be valid HTTP/HTTPS URLs
- Collection variables automatically populate IDs from create responses

---

**Last Updated**: December 31, 2024  
**API Version**: Production  
**Base URL**: <https://universallighthouse-backend-production.up.railway.app>

---
