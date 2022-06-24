# me-and-my-family backend

Contains the API and database source and tooling for local development.

## Development

For first time setup:
- Tested with `node v16.15.1` (LTS at time of writing)
- `npm i -g yarn`
- `yarn install`
- `yarn prisma migrate dev`

After schema changes:
- `yarn prisma migrate dev`

To start local dev server (must be running parent `docker-compose` locally):
- `yarn start`

Etc:
- `yarn prisma studio` db explorer
