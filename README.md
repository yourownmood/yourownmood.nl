# yourownmood.nl

This is yourownmood.nl uncompiled source code.

yourownmood.nl is built on Angular and inuit.css.

Despite being open sourced, all yourownmood.nl code and content remain copyright of yourownmood.

## Creating a new release?

* Create a new version using the following command:
  ```
  gulp create-patch
  gulp create-minor
  gulp create-major
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
  gulp publish-test
  ```

* Wait. Get some coffee.
* Verify the release.
* If all lights are green and a release to production is okayed by the bosses, run:

  ```
  gulp publish-prod
  ```
* Verify the release on [yourownmood.nl](https://yourownmood.nl)
