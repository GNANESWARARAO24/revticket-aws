// ============================================
// RevTicket CI/CD Pipeline with Docker
// ============================================
// Prerequisites:
// 1. Jenkins with Docker plugin installed
// 2. Docker installed on Jenkins server
// 3. Docker Hub credentials added to Jenkins (ID: 'dockerhub-credentials')
// 4. GitHub webhook configured for automatic builds
// ============================================

pipeline {
    agent any
    
    environment {
        JAVA_HOME = "/opt/homebrew/opt/openjdk@17"
        PATH = "${JAVA_HOME}/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"
        DOCKERHUB_USERNAME = 'harshwarbhe'
        BACKEND_IMAGE = "${DOCKERHUB_USERNAME}/revticket-backend"
        FRONTEND_IMAGE = "${DOCKERHUB_USERNAME}/revticket-frontend"
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {
        
        stage('Checkout') {
            steps {
                echo "Checking out code from GitHub..."
                git branch: 'master', url: 'https://github.com/harshWarbhe/revTicket.git'
            }
        }

        stage('Build Backend') {
            steps {
                echo "Building Backend..."
                dir('Backend') {
                    script {
                        if (isUnix()) {
                            sh 'mvn dependency:purge-local-repository -DactTransitively=false -DreResolve=false'
                            sh 'mvn clean package -DskipTests -U'
                        } else {
                            bat 'mvn dependency:purge-local-repository -DactTransitively=false -DreResolve=false'
                            bat 'mvn clean package -DskipTests -U'
                        }
                    }
                }
            }
        }
        
        stage('Run Tests') {
            steps {
                echo "Running Backend Tests"
                dir('Backend') {
                    script {
                        if (isUnix()) {
                            sh 'mvn test'
                        } else {
                            bat 'mvn test'
                        }
                    }
                }
            }
        }

        stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'Backend/target/*.jar', fingerprint: true
                junit allowEmptyResults: true, testResults: 'Backend/target/surefire-reports/*.xml'
            }
        }
    }

    post {
        success {
            echo "✅ Build and Tests SUCCESS"
        }
        failure {
            echo "❌ Build FAILED"
        }
    }
}

// ============================================
// Setup Instructions:
// ============================================
// 1. Install Jenkins Plugins:
//    - Docker Pipeline
//    - Docker plugin
//    - Git plugin
//
// 2. Add Docker Hub Credentials:
//    Jenkins > Manage Jenkins > Credentials
//    - ID: dockerhub-credentials
//    - Username: your Docker Hub username
//    - Password: your Docker Hub password/token
//
// 3. Configure Jenkins Job:
//    - New Item > Pipeline
//    - Pipeline script from SCM
//    - SCM: Git
//    - Repository URL: https://github.com/harshWarbhe/revTicket.git
//    - Branch: */master
//
// 4. GitHub Webhook (Optional):
//    GitHub Repo > Settings > Webhooks
//    - Payload URL: http://your-jenkins-url/github-webhook/
//    - Content type: application/json
//    - Events: Push events
// ============================================
