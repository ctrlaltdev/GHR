Programmatically create your GitHub Releases

You are handling dozen of repositories and you realize rapidly that going over all the repos to create those releases is dull and slow?
Yeah, same here.

## Install

You can run the `install.sh` to install the dependency of the project and create a symlink in your `~/.local/bin` folder.
If `~/.local/bin` is not in your path, you can add it by adding `export PATH=$PATH:$HOME/.local/bin` to your shell config file.

## Set Up

First thing, create a [personal token from GitHub](https://github.com/settings/tokens/new) and check the `repo` scope.
Now save that token in a `.env` file:
```
GH_PERSONAL_TOKEN=wootWootToken\o/
```

## Defining the releases

You can define your releases with a yaml file with the following structure:
```yml
# The organisation or user that owns the repository
owner:
  # The repository for which you want to create a release
  repository:
    # The tag marking your release, this is mandatory
    tag: "v1.0.0"
    # Name for the release, optional, default to tag value
    name: "Version 1"
    # Branch to use for the release, optional, default to master
    branch: "master"
    # Description of your release, optional, default to empty string
    body: "# CHANGELOG\n\nNow using GHR\n"
    # Specify if release is a draft, optional, default to false
    draft: false
    # Specify if release is not production ready, optional, default to false
    prerelease: false
```

You can save your release list in a yaml file.
When running `GHR`, it will automatically look for a `.releases.yml` file. You can pass a file path as an argument to specify another file to use: `GHR myDopeReleases.yml`

If you're allergic to yml, you can use a json file instead by either using the `--json` flag (it will look for `.releases.json`) or simply passing a json file as an argument: `GHR releases.json`

## Creating the releases

You can run GHR simply with: `GHR` or `GHR releases.yml` to specify a different releases file.
You can also do a dry run by using -n or --dryrun flags: `GHR -n`

GHR will check the latest release of your repository and won't create if the tag, name and branch are identical to what you're trying to create.
