#!/bin/bash
set -e

mkdir -p final_site
TARGETS=$1
EVENT_ACTION=$2
CURRENT_PR_NUMBER=$3
REPO=$4

echo "$TARGETS" | jq -r 'keys[]' | while read name; do
    if [[ "$EVENT_ACTION" == "closed" && "$name" == "PR$CURRENT_PR_NUMBER" ]]; then
        echo "Skipping $name as the PR is closed."
        continue
    fi

    echo "Restoring $name..."
    KEY=$(echo "$TARGETS" | jq -r ".\"$name\".key")

    # Download the cache
    gh cache download "$KEY" --repo "$REPO" || {
        echo "Warning: Failed to download cache $KEY for $name, skipping..."
        continue
    }

    if [ "$name" == "main_site" ]; then
        cp -r main_site/* final_site/
    else
        cp -r "$name" final_site/
    fi
done
