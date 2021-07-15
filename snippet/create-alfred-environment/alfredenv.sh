# When sourced, creates an Alfred-like environment

# getvar <name> | Read a value from info.plist
getvar() {
    local v="$1"
    /usr/libexec/PlistBuddy -c "Print :$v" info.plist
}

# Minimal workflow settings
export alfred_workflow_bundleid=$( getvar "bundleid" )
export alfred_workflow_name=$( getvar "name" )
# Required if you're using AwGo's built-in update mechanism
export alfred_workflow_version=$( getvar "version" )

# Check for new prefs.json file introduced in Alfred 4
if [[ -f "${HOME}/Library/Alfred/Application Support/prefs.json" ]]; then
    # Standard locations of Alfred 4+ cache & data directories
    export alfred_workflow_cache="${HOME}/Library/Caches/com.runningwithcrayons.Alfred/Workflow Data/${alfred_workflow_bundleid}"
    export alfred_workflow_data="${HOME}/Library/Application Support/Alfred/Workflow Data/${alfred_workflow_bundleid}"
else
    # Assume Alfred 3
    export alfred_workflow_cache="${HOME}/Library/Caches/com.runningwithcrayons.Alfred-3/Workflow Data/${alfred_workflow_bundleid}"
    export alfred_workflow_data="${HOME}/Library/Application Support/Alfred 3/Workflow Data/${alfred_workflow_bundleid}"
    export alfred_version="3.8"
fi

# Turn debugging on
# export alfred_debug=1

# If you want to extract workflow variables set in the workflow
# configuration sheet:
# export SCHEDULE_DAYS=$( getvar "variables:SCHEDULE_DAYS" )
# export EVENT_CACHE_MINS=$( getvar "variables:EVENT_CACHE_MINS" )