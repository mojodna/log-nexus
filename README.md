# log-nexus

I am a rebroadcasting syslog server. I accept syslog messages and forward them
over HTTP and WebSocket connections.

## Why?

[Heroku](http://heroku.com/) and [Fastly](http://fastly.com/) support remote
syslog drains. [Papertrail](http://papertrailapp.com/) is a good choice for
bridging logs to client processes, but it comes with additional functionality
(searching, archiving, etc.) and associated costs. This is simpler and comes
with none of the frills.

You can also think of this as an alternative to `heroku logs -t`.

## Installation

```bash
npm install -g log-nexus
```

## Usage

```bash
log-nexus -s <syslog port> -p <http/ws port>
```

To feed data in locally:

```bash
tail -f /var/log/syslog | nc localhost 8514
```

Meanwhile:

```bash
http://localhost:8080/
```

or, using `wscat` (available as part of [`ws`](http://einaros.github.io/ws/)):

```bash
wscat --connect ws://localhost:8080
```

## Limitations

All streams are managed in-process, so this will only work when a single
instance of `log-nexus` is running.
