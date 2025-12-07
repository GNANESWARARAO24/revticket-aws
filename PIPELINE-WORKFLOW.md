# Complete CI/CD Pipeline Workflow

## Pipeline Flow

```
Developer Push → GitHub → Jenkins → Build JAR → Docker Image → ECR → EC2 Deploy
```

## Step-by-Step Process

### 1. Developer Workflow
```bash
# Developer makes changes
git add .
git commit -m "feature: add new functionality"
git push origin main
```

### 2. Jenkins Triggers (Jenkinsfile.aws)
- **Checkout**: Pulls latest code from Git
- **Build JAR**: `mvnw clean package -DskipTests`
- **Build Images**: Creates Docker images for backend/frontend
- **Push to ECR**: Authenticates and pushes to AWS ECR
- **Deploy to EC2**: SSH to EC2 and runs deployment

### 3. Build Process Details

#### Backend Build (Maven)
```bash
cd Backend
./mvnw clean package -DskipTests
# Creates: target/revticket-backend-1.0.jar
```

#### Docker Image Build
```dockerfile
# Backend Dockerfile builds fat JAR into image
FROM openjdk:17-jre-slim
COPY target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

#### ECR Push
```bash
# Jenkins authenticates to ECR
aws ecr get-login-password | docker login --username AWS --password-stdin ECR_REGISTRY

# Tags and pushes images
docker tag revticket-backend:BUILD_NUMBER ECR_REGISTRY/revticket-backend:latest
docker push ECR_REGISTRY/revticket-backend:latest
```

### 4. EC2 Deployment
```bash
# Jenkins SSH to EC2 and runs:
aws ecr get-login-password | docker login --username AWS --password-stdin ECR_REGISTRY
cd ~/revticket
export ECR_REGISTRY=your-account-id.dkr.ecr.region.amazonaws.com
docker-compose pull  # Pulls latest images from ECR
docker-compose up -d # Starts containers
```

## Required Setup Checklist

### AWS Setup
- [ ] Create ECR repositories (revticket-backend, revticket-frontend)
- [ ] Create EC2 instance with Docker installed
- [ ] Configure IAM user with ECR permissions
- [ ] Set up security groups (ports 22, 80, 8081, 4200)

### Jenkins Setup
- [ ] Install required plugins (AWS Pipeline, Docker, Git, SSH)
- [ ] Add AWS credentials
- [ ] Add EC2 SSH key
- [ ] Create pipeline job pointing to Jenkinsfile.aws

### EC2 Setup
- [ ] Install Docker & Docker Compose
- [ ] Install AWS CLI
- [ ] Configure AWS credentials
- [ ] Upload docker-compose.ecr.yml
- [ ] Test ECR login

## Monitoring & Troubleshooting

### Health Checks
- Backend: http://ec2-ip:8081/actuator/health
- Frontend: http://ec2-ip:4200
- Database: Check container logs

### Common Issues
```bash
# Check container status
docker ps -a

# View logs
docker-compose logs backend
docker-compose logs frontend

# Restart services
docker-compose restart

# Full redeploy
docker-compose down
docker-compose pull
docker-compose up -d
```

## Security Best Practices
- Use IAM roles instead of access keys when possible
- Rotate credentials regularly
- Use private subnets for databases
- Enable CloudTrail for audit logging
- Use Application Load Balancer for production