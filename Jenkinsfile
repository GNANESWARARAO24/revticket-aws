pipeline {
    agent any

    stages {

        stage('checkout') {
            steps {
                checkout([$class: 'GitSCM',
                    branches: [[name: "*/${BRANCH_NAME}"]],
                    userRemoteConfigs: [[url: 'https://github.com/harshWarbhe/revTicket.git']]
                ])
            }
        }

        stage('build') {
            steps {
                echo "Building branch: ${BRANCH_NAME}"
                dir('Backend') {
                    bat "mvn clean install -DskipTests=false"
                }
            }
        }

        stage('archive artifacts') {
            when {
                expression { env.BRANCH_NAME == 'master' }   // Only master
            }
            steps {
                archiveArtifacts artifacts: 'Backend/target/*.jar', fingerprint: true
                junit 'Backend/target/surefire-reports/*.xml'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo "Build success on branch: ${BRANCH_NAME}"
        }
        failure {
            echo "Build failed on branch: ${BRANCH_NAME}"
        }
    }
}
