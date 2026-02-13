# Enterprise Spark MCP Blueprint

This repository provides a production-grade **architecture + TypeScript blueprint** for a Node.js MCP server that enables LLM agents to analyze Spark performance in authenticated enterprise environments.

## What you get

- Multi-path capability discovery (Spark REST, Spark History, YARN RM, browser fallback)
- Enterprise auth-aware session model (cookie, token, Kerberos-modeled)
- Performance scoring engine for Spark runs
- MCP tools contract for agentic IDE mode
- Security and observability hooks for production operations

## Quick start (local)

```bash
cp .env.example .env
npm install
npm run build
npm start
```

## Downloadable artifact

A packaged tarball can be generated locally at:

```bash
artifacts/enterprise-spark-mcp-blueprint.tar.gz
```

Regenerate it with:

```bash
npm run package:artifact
```

## Primary design document

See [`docs/architecture.md`](docs/architecture.md).
