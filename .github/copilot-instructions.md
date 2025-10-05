# OctoCAT Supply Chain Management Application

## GitHub Repo Information

This repo is hosted in GitHub:
- owner: octodemo
- repo: copilot_agent_mode-urban-waddle

## Architecture

The complete architecture is described in the [Architecture Document](../docs/architecture.md).

# Additional Guidelines for REST APIs

For REST APIs, use the following guidelines:

* Use descriptive naming
* Add Swagger docs for all API methods
* Implement logging and monitoring using [TAO](../docs/tao.md)
  - assume TAO is installed and never add the package

# Build and Run Instructions

Refer to [build instructions](../docs/build.md) for detailed build instructions.

Every time you change the code, make sure that the code compiles by running:

```bash
npm run build
```

To run the unit tests for the API, run:

```bash
npm run test:api
```
