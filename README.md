# yourownmood.nl
[![CircleCI](https://circleci.com/gh/yourownmood/yourownmood.nl/tree/master.svg?style=shield)](https://circleci.com/gh/yourownmood/yourownmood.nl/tree/master)

This is yourownmood.nl uncompiled source code.

yourownmood.nl is built on Angular and inuit.css.

Despite being open sourced, all yourownmood.nl code and content remain copyright of yourownmood.

## Development

Start a local development environment by running `yarn start`.

## Creating a new release?

* Create a new version using the following command:
  ```
  yarn create-patch
  yarn create-minor
  yarn create-major
  ```
  * Where `create-patch` makes v0.1.0 → v0.1.1
  * Where `create-minor` makes v0.1.1 → v0.2.0
  * Where `create-major` makes v0.2.1 → v1.0.0

  This will create a git tag `vx.x.x`.

* Push the version and tag:

  ```
  git push --follow-tags
  ```

* Start a new release job via:

  ```
  yarn publish-test
  ```

* Wait. Get some coffee.
* Verify the release.
* If all lights are green and a release to production is okayed by the bosses, run:

  ```
  yarn publish-prod
  ```
* Verify the release on [yourownmood.nl](https://yourownmood.nl)

## Styleguide

The yourownmood styleguide (work in progress) can be found here: [yourownmood.nl/styleguide](https://yourownmood.nl/styleguide)
