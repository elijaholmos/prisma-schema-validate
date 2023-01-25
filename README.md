# prisma-schema-validate

GitHub Action to validate a `schema.prisma` file using the [Prisma CLI](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#prismavalidator).

# Usage

Create a Github workflow file that checks out your repository, then uses this action (`elijaholmos/prisma-schema-validate@v1`).

## Sample workflow file:

```yml
name: Prisma Schema Validation
on:
    pull_request:
        branches: [main]
        paths: ['**/schema.prisma']

jobs:
    lint:
        name: Validate prisma.schema
        runs-on: ubuntu-latest
        steps:
            - name: Checkout repository
              uses: actions/checkout@v3

            # Prisma validation fails if it cannot load env vars
            - name: Create dummy .env file
              run: echo "DATABASE_URL=mongodb+srv://test:test@localhost" > .env

            - name: Run validator
              uses: elijaholmos/prisma-schema-validate@v1
              with:
                  # All inputs are optional - see Configuration section below
                  version: latest # If empty, pulls from package.json
                  schema: path/to/schema.prisma
```

# Configuration

There are a handful of configuration values that can be customized as [action inputs](https://docs.github.com/en/actions/using-workflows/workflow-syntax-for-github-actions#jobsjob_idwith):

### `version`

_The NPM version of Prisma to use._

If unspecified, uses the version of `prisma` in the repository's `package.json` file. If not found in `package.json`, uses the latest published version of [Prisma](https://www.npmjs.com/package/prisma).

### `schema`

_The path to the Prisma schema file._

Passed directly into the `--schema` argument of the [`prisma validate`](https://www.prisma.io/docs/reference/api-reference/command-reference#arguments-2) command.
