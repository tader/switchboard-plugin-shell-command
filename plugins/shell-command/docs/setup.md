---
title: Shell commands
services: [shell-command]
---

# Shell commands

The Shell command service runs a fixed command on the local machine and returns its standard output as the response body. It works on any Switchboard instance; no peers are required.

Before using it, a local administrator must enable **Allow shell commands** under **Plugins → Shell command → Settings** on this instance.

> [!CAUTION]
> A command has the Switchboard process's filesystem permissions. Configure each fixed command locally, then explicitly share it with trusted peers. Peer users can invoke only the shared command; they cannot create or change commands on this machine. Container filesystem access and mounted volumes still apply.

The command is stored as an encrypted connection credential on the local instance. It is not returned to other Switchboards. Every call runs the same command through `/bin/sh`, with a 30-second timeout, a 1 MB output limit, and an environment that omits Switchboard credentials. Request paths, query parameters, headers, and bodies are not interpolated into the command.

Successful commands return standard output with status `200`. Failed commands return captured standard output and standard error with status `500`; `X-Shell-Exit-Code` contains the exit code.
