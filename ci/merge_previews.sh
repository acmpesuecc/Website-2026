#!/bin/bash
set -e

echo "=== Debug Info ==="
echo "Arguments:"
echo "TARGETS: $1"
echo "EVENT_ACTION: $2"
echo "CURRENT_PR_NUMBER: $3"
echo "REPO: $4"
echo "=================="

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
    RUN_ID=$(echo "$TARGETS" | jq -r ".\"$name\".run_id")
    echo "Target name: $name, RUN_ID: $RUN_ID"

    set +e
    if [ "$name" == "main_site" ]; then
        echo "Running: gh run download \"$RUN_ID\" -n \"main_site\" -D final_site --repo \"$REPO\""
        gh run download "$RUN_ID" -n "main_site" -D final_site --repo "$REPO"
    else
        echo "Running: gh run download \"$RUN_ID\" -n \"$name\" -D \"final_site/$name\" --repo \"$REPO\""
        gh run download "$RUN_ID" -n "$name" -D "final_site/$name" --repo "$REPO"
    fi
    status=$?
    set -e

    echo "gh run download exit code: $status"
    if [ $status -ne 0 ]; then
        echo "Error: gh run download failed"
        exit $status
    fi

    echo "Contents of final_site/$name (first 10 items):"
    ls -la "final_site/$name" | head -n 12 || echo "ls failed"
done

echo "=== Final contents of final_site ==="
find final_site -maxdepth 3 || echo "find failed"
echo "====================================="

