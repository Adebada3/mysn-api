// src/openapi.js
export const openapi = {
  openapi: "3.0.3",
  info: {
    title: "MySN API",
    version: "0.1.0",
    description: "API d’événements/groupes (spec minimale pour Swagger UI)."
  },
  servers: [{ url: "http://localhost:3001" }],
  components: {
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          email: { type: "string", format: "email" },
          firstName: { type: "string" },
          lastName: { type: "string" },
          avatarUrl: { type: "string", format: "uri" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        },
        required: ["id", "email", "firstName", "lastName", "createdAt", "updatedAt"]
      },

      Event: {
        type: "object",
        properties: {
          id: { type: "string" },
          title: { type: "string" },
          description: { type: "string" },
          startAt: { type: "string", format: "date-time" },
          endAt: { type: "string", format: "date-time" },
          location: {
            type: "object",
            properties: {
              address: { type: "string" },
              lat: { type: "number" },
              lng: { type: "number" }
            },
            required: ["address"]
          },
          isPublic: { type: "boolean" },
          coverUrl: { type: "string", format: "uri" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        },
        required: ["id", "title", "description", "startAt", "endAt", "location", "isPublic", "createdAt", "updatedAt"]
      },

      Group: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          description: { type: "string" },
          iconUrl: { type: "string", format: "uri" },
          coverUrl: { type: "string", format: "uri" },
          visibility: { type: "string", enum: ["public", "private", "secret"] },
          allowMemberPosts: { type: "boolean" },
          allowMemberEvents: { type: "boolean" },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" }
        },
        required: ["id", "name", "visibility", "allowMemberPosts", "allowMemberEvents", "createdAt", "updatedAt"]
      },

      // --- Threads & Messages ---
      Message: {
        type: "object",
        properties: {
          id: { type: "string" },
          threadId: { type: "string" },
          userId: { type: "string" },
          content: { type: "string" },
          createdAt: { type: "string", format: "date-time" }
        },
        required: ["id", "threadId", "userId", "content", "createdAt"]
      },
      Thread: {
        type: "object",
        properties: {
          id: { type: "string" },
          groupId: { type: "string", nullable: true },
          eventId: { type: "string", nullable: true },
          title: { type: "string" },
          createdAt: { type: "string", format: "date-time" }
        },
        required: ["id", "title", "createdAt"]
      },

      // --- Albums / Photos / Comments ---
      Album: {
        type: "object",
        properties: {
          id: { type: "string" },
          eventId: { type: "string" },
          title: { type: "string" },
          createdAt: { type: "string", format: "date-time" }
        },
        required: ["id", "eventId", "title", "createdAt"]
      },
      Photo: {
        type: "object",
        properties: {
          id: { type: "string" },
          albumId: { type: "string" },
          url: { type: "string", format: "uri" },
          uploadedBy: { type: "string" },
          createdAt: { type: "string", format: "date-time" }
        },
        required: ["id", "albumId", "url", "uploadedBy", "createdAt"]
      },
      PhotoComment: {
        type: "object",
        properties: {
          id: { type: "string" },
          photoId: { type: "string" },
          userId: { type: "string" },
          content: { type: "string" },
          createdAt: { type: "string", format: "date-time" }
        },
        required: ["id", "photoId", "userId", "content", "createdAt"]
      },

      // --- Polls ---
      Poll: {
        type: "object",
        properties: {
          id: { type: "string" },
          eventId: { type: "string" },
          title: { type: "string" },
          questions: { type: "array", items: { $ref: "#/components/schemas/PollQuestion" } },
          createdAt: { type: "string", format: "date-time" }
        },
        required: ["id", "eventId", "title", "questions", "createdAt"]
      },
      PollQuestion: {
        type: "object",
        properties: {
          id: { type: "string" },
          text: { type: "string" },
          options: { type: "array", items: { $ref: "#/components/schemas/PollOption" } }
        },
        required: ["id", "text", "options"]
      },
      PollOption: {
        type: "object",
        properties: { id: { type: "string" }, text: { type: "string" } },
        required: ["id", "text"]
      },
      Vote: {
        type: "object",
        properties: {
          id: { type: "string" },
          pollId: { type: "string" },
          questionId: { type: "string" },
          optionId: { type: "string" },
          userId: { type: "string" },
          createdAt: { type: "string", format: "date-time" }
        },
        required: ["id", "pollId", "questionId", "optionId", "userId", "createdAt"]
      },

      // --- Ticketing ---
      TicketType: {
        type: "object",
        properties: {
          id: { type: "string" },
          eventId: { type: "string" },
          name: { type: "string" },
          amount: { type: "number" },
          quantity: { type: "integer" },
          createdAt: { type: "string", format: "date-time" }
        },
        required: ["id", "eventId", "name", "amount", "quantity", "createdAt"]
      },
      Order: {
        type: "object",
        properties: {
          id: { type: "string" },
          ticketTypeId: { type: "string" },
          buyer: {
            type: "object",
            properties: {
              firstName: { type: "string" },
              lastName: { type: "string" },
              address: { type: "string" }
            },
            required: ["firstName", "lastName", "address"]
          },
          purchasedAt: { type: "string", format: "date-time" }
        },
        required: ["id", "ticketTypeId", "buyer", "purchasedAt"]
      }
    }
  },

  paths: {
    "/v1/health": {
      get: {
        summary: "Healthcheck",
        responses: { "200": { description: "OK" } }
      }
    },

    // --- Users ---
    "/v1/users": {
      post: {
        summary: "Create user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  email: { type: "string", format: "email" },
                  firstName: { type: "string" },
                  lastName: { type: "string" },
                  avatarUrl: { type: "string", format: "uri" }
                },
                required: ["email", "firstName", "lastName"]
              }
            }
          }
        },
        responses: {
          "201": { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
          "409": { description: "Conflict (email exists)" },
          "400": { description: "Validation error" }
        }
      },
      get: { summary: "List users", responses: { "200": { description: "OK" } } }
    },
    "/v1/users/{id}": {
      get: {
        summary: "Get user by id",
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/User" } } } },
          "404": { description: "Not Found" }
        }
      }
    },

    // --- Events ---
    "/v1/events": {
      post: {
        summary: "Create event",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  description: { type: "string" },
                  startAt: { type: "string", format: "date-time" },
                  endAt: { type: "string", format: "date-time" },
                  location: {
                    type: "object",
                    properties: { address: { type: "string" }, lat: { type: "number" }, lng: { type: "number" } },
                    required: ["address"]
                  },
                  isPublic: { type: "boolean" },
                  coverUrl: { type: "string", format: "uri" }
                },
                required: ["title", "description", "startAt", "endAt", "location", "isPublic"]
              }
            }
          }
        },
        responses: {
          "201": { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/Event" } } } },
          "400": { description: "Validation error" }
        }
      },
      get: {
        summary: "List events",
        parameters: [
          { in: "query", name: "publicOnly", schema: { type: "boolean" } },
          { in: "query", name: "from", schema: { type: "string", format: "date-time" } },
          { in: "query", name: "to", schema: { type: "string", format: "date-time" } }
        ],
        responses: { "200": { description: "OK" } }
      }
    },
    "/v1/events/{id}": {
      get: {
        summary: "Get event by id",
        parameters: [{ in: "path", name: "id", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/Event" } } } },
          "404": { description: "Not Found" }
        }
      }
    },

    // --- Threads ---
    "/v1/threads": {
      post: {
        summary: "Create thread (link to a group OR an event)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { title: { type: "string" }, groupId: { type: "string" }, eventId: { type: "string" } },
                oneOf: [{ required: ["title", "groupId"] }, { required: ["title", "eventId"] }]
              }
            }
          }
        },
        responses: {
          "201": { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/Thread" } } } }
        }
      }
    },
    "/v1/threads/{threadId}/messages": {
      post: {
        summary: "Post message to thread",
        parameters: [{ in: "path", name: "threadId", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { userId: { type: "string" }, content: { type: "string" } },
                required: ["userId", "content"]
              }
            }
          }
        },
        responses: {
          "201": { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/Message" } } } }
        }
      },
      get: {
        summary: "List messages of a thread",
        parameters: [{ in: "path", name: "threadId", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "OK" } }
      }
    },

    // --- Albums / Photos / Comments ---
    "/v1/events/{eventId}/albums": {
      post: {
        summary: "Create album for an event",
        parameters: [{ in: "path", name: "eventId", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: { "application/json": { schema: { type: "object", properties: { title: { type: "string" } }, required: ["title"] } } }
        },
        responses: {
          "201": { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/Album" } } } }
        }
      }
    },
    "/v1/albums/{albumId}": {
      get: {
        summary: "Get album with photos",
        parameters: [{ in: "path", name: "albumId", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "OK" } }
      }
    },
    "/v1/albums/{albumId}/photos": {
      post: {
        summary: "Add photo to album (URL upload)",
        parameters: [{ in: "path", name: "albumId", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { url: { type: "string", format: "uri" }, uploadedBy: { type: "string" } },
                required: ["url", "uploadedBy"]
              }
            }
          }
        },
        responses: {
          "201": { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/Photo" } } } }
        }
      }
    },
    "/v1/photos/{photoId}/comments": {
      post: {
        summary: "Comment a photo",
        parameters: [{ in: "path", name: "photoId", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { userId: { type: "string" }, content: { type: "string" } },
                required: ["userId", "content"]
              }
            }
          }
        },
        responses: {
          "201": { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/PhotoComment" } } } }
        }
      }
    },

    // --- Polls ---
    "/v1/events/{eventId}/polls": {
      post: {
        summary: "Create poll for an event",
        parameters: [{ in: "path", name: "eventId", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  questions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        text: { type: "string" },
                        options: {
                          type: "array",
                          items: { type: "object", properties: { text: { type: "string" } }, required: ["text"] }
                        }
                      },
                      required: ["text", "options"]
                    }
                  }
                },
                required: ["title", "questions"]
              }
            }
          }
        },
        responses: {
          "201": { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/Poll" } } } }
        }
      }
    },
    "/v1/polls/{pollId}/votes": {
      post: {
        summary: "Vote on a poll question (1 choice per question)",
        parameters: [{ in: "path", name: "pollId", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { questionId: { type: "string" }, optionId: { type: "string" }, userId: { type: "string" } },
                required: ["questionId", "optionId", "userId"]
              }
            }
          }
        },
        responses: {
          "201": { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/Vote" } } } }
        }
      }
    },
    "/v1/polls/{pollId}/results": {
      get: {
        summary: "Poll aggregated results",
        parameters: [{ in: "path", name: "pollId", required: true, schema: { type: "string" } }],
        responses: { "200": { description: "OK" } }
      }
    },

    // --- Ticketing ---
    "/v1/events/{eventId}/ticket-types": {
      post: {
        summary: "Create a ticket type",
        parameters: [{ in: "path", name: "eventId", required: true, schema: { type: "string" } }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { name: { type: "string" }, amount: { type: "number" }, quantity: { type: "integer" } },
                required: ["name", "amount", "quantity"]
              }
            }
          }
        },
        responses: {
          "201": { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/TicketType" } } } }
        }
      }
    },
    "/v1/orders": {
      post: {
        summary: "Create an order (1 ticket per external person)",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  ticketTypeId: { type: "string" },
                  buyer: {
                    type: "object",
                    properties: {
                      firstName: { type: "string" },
                      lastName: { type: "string" },
                      address: { type: "string" }
                    },
                    required: ["firstName", "lastName", "address"]
                  }
                },
                required: ["ticketTypeId", "buyer"]
              }
            }
          }
        },
        responses: {
          "201": { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/Order" } } } }
        }
      }
    },
    "/v1/orders/{orderId}": {
      get: {
        summary: "Get order by id",
        parameters: [{ in: "path", name: "orderId", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/Order" } } } },
          "404": { description: "Not Found" }
        }
      }
    },

    // --- Groups ---
    "/v1/groups": {
      post: {
        summary: "Create group",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  iconUrl: { type: "string", format: "uri" },
                  coverUrl: { type: "string", format: "uri" },
                  visibility: { type: "string", enum: ["public", "private", "secret"] },
                  allowMemberPosts: { type: "boolean" },
                  allowMemberEvents: { type: "boolean" }
                },
                required: ["name", "visibility", "allowMemberPosts", "allowMemberEvents"]
              }
            }
          }
        },
        responses: {
          "201": { description: "Created", content: { "application/json": { schema: { $ref: "#/components/schemas/Group" } } } },
          "400": { description: "Validation error" }
        }
      },
      get: {
        summary: "List groups",
        parameters: [{ in: "query", name: "visibility", schema: { type: "string", enum: ["public", "private", "secret"] } }],
        responses: { "200": { description: "OK" } }
      }
    },
    "/v1/groups/{groupId}": {
      get: {
        summary: "Get group by id",
        parameters: [{ in: "path", name: "groupId", required: true, schema: { type: "string" } }],
        responses: {
          "200": { description: "OK", content: { "application/json": { schema: { $ref: "#/components/schemas/Group" } } } },
          "404": { description: "Not Found" }
        }
      }
    }
  }
}
