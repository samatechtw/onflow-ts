<h2 align='center'>@samatech/onflow-ts</h2>

<p align='center'>TypeScript test and dApp utils for the Flow blockchain.</p>

<p align='center'>
<a href='https://www.npmjs.com/package/@samatech/onflow-ts'>
  <img src='https://img.shields.io/npm/v/@samatech/onflow-ts?color=222&style=flat-square'>
</a>
</p>

<br>

## Installation

```bash
npm i -D @samatech/onflow-ts
```

## Usage

### Configuration

**BASE_PATH**

_Required_

Directory where the app's Cadence files are located

**CDC_DIRECTORIES**

Subdirectories containing Cadence contracts, transactions, and scripts.

Default

```ts
{
  'CONTRACT': './contracts/',
  'TRANSACTION': './transactions/',
  'SCRIPT': './scripts/',
}
```

## Development

#### Install packages with [PNPM](https://pnpm.io/installation)

```bash
pnpm install
```

#### Build

```bash
# tsc
npm run build
```

#### Test

```bash
# Jest
npm run test
```

#### Lint

```bash
# ESlint
npm run lint
```

#### Format

```bash
# Use Prettier to format files
npm run format
# Just check the formatting (used in CI)
npm run format:check
```

#### Release

Currently, a custom release script is used to update the version and publish to NPM. This must be executed on the main branch, and `<version>` must not equal the current version on NPM.

```bash
node scripts/release.js <version>
```
