# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [v3.0.1] - 2021-02-14

### Changed
- ISSUE([99](https://github.com/meateam/drive-project/issues/99)): update pkg, delete unused pkg and update deps, update proto script

## [v3.0.0] - 2020-11-16

## Added

-FEAT([203](https://github.com/meateam/file-service/issues/203)): upload requires a new field named appID that tells which app uploaded the file.

### Refactor

- REFACTOR([95](https://github.com/meateam/drive-project/issues/96)): upgrade docker compose to v3 and use env_file

## [v2.0.0] - 2020-10-28

### Added

- FEAT([219](https://github.com/meateam/file-service/pull/219)): inserted basic CI.

- FEAT([214](https://github.com/meateam/file-service/pull/214/files)): new RPC method GetFileSizeByID

- FEAT([205](https://github.com/meateam/file-service/pull/205/files)): new RPC method DeleteUploadByKey

- FEAT([197](https://github.com/meateam/file-service/pull/197/files)): new RPC method UpdateQuota

### Fixed

- BUG([195](https://github.com/meateam/file-service/issues/195)): uploads with same `fileName-parntID-ownerID` cannot exist simultaneously.

[unreleased]: https://github.com/meateam/file-service/compare/master...develop
[v2.0.0]: https://github.com/meateam/file-service/compare/v1.3...v2.0.0
[v3.0.0]: https://github.com/meateam/file-service/compare/v2.0.0...v3.0.0
[v3.0.1]: https://github.com/meateam/file-service/compare/v3.0.0...v3.0.1
