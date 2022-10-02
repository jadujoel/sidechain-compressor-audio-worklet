import { defineConfig } from 'cypress'
import { pluginConfig } from './cypress/plugins/index'

export default defineConfig({
    fileServerFolder: 'audio',
    e2e: {
        setupNodeEvents(on, config) {
            return pluginConfig(on, config)
        },
        fileServerFolder: "audio"
    },
    projectId: "ybf6mv", // ecas project id
    // npx cypress run --record --key a9f7e4f3-9fe3-4336-aebc-fdb2095cfc3e
})
