export const openapi = {
  openapi: "3.0.3",
  info: { title: "MySN API", version: "0.1.0" },
  servers: [{ url: "http://localhost:3000/v1" }],
  paths: {
    "/health": {
      get: {
        summary: "Health check",
        responses: { "200": { description: "OK" } }
      }
    },
    "/events": {
      get: {
        summary: "List events",
        parameters: [
          { in: "query", name: "publicOnly", schema: { type: "boolean" } }
        ],
        responses: { "200": { description: "OK" } }
      },
      post: {
        summary: "Create event",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["title","description","startAt","endAt","location","isPublic"],
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  startAt: { type: "string", format: "date-time" },
                  endAt: { type: "string", format: "date-time" },
                  location: {
                    type: "object",
                    required: ["address"],
                    properties: { address: { type: "string" }, lat: { type: "number" }, lng: { type: "number" } }
                  },
                  isPublic: { type: "boolean" },
                  coverUrl: { type: "string", format: "uri" }
                }
              }
            }
          }
        },
        responses: { "201": { description: "Created" } }
      }
    },
    "/events/{id}": {
      get: {
        summary: "Get event by id",
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "OK" }, "404": { description: "Not Found" } }
      }
    }
  }
}
