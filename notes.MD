# Database Dependencies
    "mongodb": "^4.0.0", // MongoDB
    "pg": "^8.6.0" // Postgres

## Dependencies
### @fastify/type-provider-json-schema-to-ts

This is to make strict mode work in typescript for fastify with typescript higher than v4.3. One of two official libraries. Other uses typebox.

### @fastify/fastify-env

Wrapper around dotenv and adds schema to the env.

### @fastify/fastify-autoLoad

Self explanatory.

## Dev Dependencies

### rimraf
Utility to recursively delete folder e.g. when rebuilding thats agnostic towards OS.