pipeline {
    agent any

    environment {
        DEPLOY_DIR = "/home/ubuntu/microservices"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Inject Env Files') {
            steps {
                script {
                    // Example: Add credentials for each .env file in Jenkins
                    withCredentials([file(credentialsId: 'admin-portal-env', variable: 'ENV_FILE')]) {
                        sh '''
                            cp "$ENV_FILE" "'${DEPLOY_DIR}/Admin-portal/.env'"
                            chmod 600 "'${DEPLOY_DIR}/Admin-portal/.env'"
                        '''
                    }
                    withCredentials([file(credentialsId: 'service-a-env', variable: 'ENV_FILE')]) {
                        sh '''
                            cp "$ENV_FILE" "'${DEPLOY_DIR}/service/service-a/.env'"
                            chmod 600 "'${DEPLOY_DIR}/service/service-a/.env'"
                        '''
                    }
                    withCredentials([file(credentialsId: 'service-b-env', variable: 'ENV_FILE')]) {
                        sh '''
                            cp "$ENV_FILE" "'${DEPLOY_DIR}/service/service-b/.env'"
                            chmod 600 "'${DEPLOY_DIR}/service/service-b/.env'"
                        '''
                    }
                    withCredentials([file(credentialsId: 'service-c-env', variable: 'ENV_FILE')]) {
                        sh '''
                            cp "$ENV_FILE" "'${DEPLOY_DIR}/service/service-c/.env'"
                            chmod 600 "'${DEPLOY_DIR}/service/service-c/.env'"
                        '''
                    }
                }
            }
        }

        stage('Update Changed Services Only') {
            steps {
                script {
                    def commitCount = sh(
                        script: "git rev-list --count HEAD",
                        returnStdout: true
                    ).trim().toInteger()

                    def changedFiles = []
                    if (commitCount > 1) {
                        changedFiles = sh(
                            script: "git diff --name-only HEAD~1 HEAD",
                            returnStdout: true
                        ).trim().split("\n")
                    } else {
                        echo "🚀 First build detected – syncing all folders"
                        changedFiles = sh(
                            script: "git ls-tree --name-only -r HEAD",
                            returnStdout: true
                        ).trim().split("\n")
                    }

                    def changedFolders = [] as Set
                    for (file in changedFiles) {
                        if (file.contains("/")) {
                            def folder = file.split("/")[0]   // e.g., Admin-portal or service
                            changedFolders.add(folder)
                        }
                    }

                    echo "📂 Updated folders: ${changedFolders}"

                    for (folder in changedFolders) {
                        echo "🔄 Updating folder: ${folder}"
                        sh """
                            mkdir -p ${DEPLOY_DIR}/${folder}
                            rsync -av --delete ${WORKSPACE}/${folder}/ ${DEPLOY_DIR}/${folder}/
                        """
                    }
                }
            }
        }
    }
}
