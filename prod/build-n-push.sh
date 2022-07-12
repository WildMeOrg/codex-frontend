#!/usr/bin/env bash

tag=latest
git_ref=develop
repo=${REPO-wildme}


function print_help(){
  cat <<EOF
Usage: ${0} ARGS

Optional Arguments:
  --tag                 image tag name (default: $tag)
  --git-ref             git reference name (default: $git_ref)
  --repo                repo the image resides (default: wildme)

Example:
  ${0} --tag main --git-ref main --repo mmulich
  # results in building and pushing the mmulich/codex-frontend:main image

EOF
}


for arg in $@
do
  case $arg in
    --tag)
      tag="$2"
      shift
      shift
    ;;
    --git-ref)
      git_ref="$2"
      shift
      shift
    ;;
    --repo)
      repo="$2"
      shift
      shift
    ;;
    --help)
      print_help
      exit 0
    ;;
    # --option)
    #   # $2 is the value for the option
    #   site_name="$2"
    #   shift
    #   shift
    #   ;;
    [?])
      echo "Invalid Argument Passed: $arg"
      print_help
      exit 1
    ;;
  esac
done


function main() {
  docker build --no-cache --build-arg git_ref=$git_ref -t ${repo}/codex-frontend:${tag} .
  docker push ${repo}/codex-frontend:${tag}
}

main
