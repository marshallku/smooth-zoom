#!/bin/bash
version=${1:-'patch'}
pnpm version "$version" -m "Update version to v%s"
