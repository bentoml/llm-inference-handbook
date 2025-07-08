---
sidebar_position: 2
---

# Model Context Protocol

[Model Context Protocol (MCP)](https://modelcontextprotocol.io/introduction) is an open-source communication standard that allows AI assistants to connect with and use various external services and data sources.

MCP uses a client-server architecture with the following components:

- **MCP host**: This is where the AI assistant lives. It could be a chat application like Claude Desktop, an IDE code assistant, or any other AI-powered application. The host can contain one or multiple MCP clients.
- **MCP clients**: A client is the low-level implementation inside the host that maintains one-to-one links with MCP servers.
- **MCP servers**: The connectors that expose different capabilities and data sources. Each server can connect to various backends like databases, third-party APIs, GitHub repositories, local files, or any other data source. Multiple servers can be running simultaneously on your local machine or connected to remotes services.
- **MCP protocol**: This is the transport layer that enables communication between the host and servers, regardless of how many servers are connected.

![mcp-architecture.png](attachment:f3db4703-3171-4fcf-9371-8d860a7909be:mcp-architecture.png)

When your AI assistant needs to access external data or tools, here's what happens at a high level:

1. The MCP host makes a request through the MCP protocol
2. The appropriate MCP server receives the request
3. The server connects to the actual data source (database, API, file system, etc.)
4. The server processes the request and returns the data back through the protocol
5. The AI assistant receives the information and can use it in its response