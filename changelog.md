# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0](https://github.com/express-rate-limit/cluster-memory-store/releases/tag/v0.2.1)

### Added

- Added
  [npm package provenance](https://github.blog/2023-04-19-introducing-npm-package-provenance/)
  support to builds published to npm from GitHub Actions

## [0.2.1](https://github.com/express-rate-limit/cluster-memory-store/releases/tag/v0.2.1)

### Fixed

- Fixed an issue preventing multiple instances from being used in a single
  worker (e.g. to apply different limits to different paths)
  - Note: the fix requires that each instance in the worker have a unique
    `prefix`

## [0.2.0](https://github.com/express-rate-limit/cluster-memory-store/releases/tag/v0.2.0)

### Changed

- Increased initial setup timeout from 1 second to 10 seconds, preventing errors
  in some cases

### Added

- [debug](https://www.npmjs.com/package/debug) logging, enable by setting the
  environment property `DEBUG=cluster-memory-store:*` or `DEBUG=*`

## [0.1.1](https://github.com/express-rate-limit/cluster-memory-store/releases/tag/v0.1.1)

No functional changes

### Changed

- Fixed badges in readme
- Moved alternate installation methods to wiki
- Added link to example folder

## [0.1.0](https://github.com/express-rate-limit/cluster-memory-store/releases/tag/v0.1.0)

### Added

- Initial release
