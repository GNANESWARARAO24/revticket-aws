# AWS Deployment Guide

## Your AWS Configuration
- **Account ID**: 290768402442
- **Region**: ap-south-2 (Hyderabad)
- **ECR Registry**: 290768402442.dkr.ecr.ap-south-2.amazonaws.com

## EC2 Setup (Already Done)
✅ Docker installed
✅ Docker Compose installed
✅ AWS CLI installed
✅ IAM role attached

## Next Steps

### 1. Copy Files to EC2

On your EC2 instance, run:
```bash
cd ~/revticket
nano docker-compose.yml
```
Paste content from `docker-compose.ec2.yml`

```bash
nano .env
```
Paste content from `.env.ec2`

### 2. Test ECR Login on EC2
```bash
aws ecr get-login-password --region ap-south-2 | docker login --username AWS --password-stdin 290768402442.dkr.ecr.ap-south-2.amazonaws.com
```

### 3. Jenkins Setup

#### Install Plugins:
- Pipeline: AWS Steps
- SSH Agent Plugin
- Docker Pipeline

#### Add Credentials:
1. **aws-account-id** (Secret text): `290768402442`
2. **aws-credentials** (AWS Credentials): Your AWS Access Key
3. **ec2-host** (Secret text): Your EC2 Public IP
4. **ec2-ssh-key** (SSH Username with private key): 
   - Username: `ec2-user`
   - Private Key: Content of `revticket-key.pem`

#### Create Pipeline:
- New Item → Pipeline
- Name: `revticket-aws-deploy`
- Pipeline script from SCM
- Repository: Your GitHub repo
- Script Path: `Jenkinsfile.aws`

### 4. Deploy
```bash
git add .
git commit -m "Add AWS deployment"
git push
```

Then run Jenkins pipeline.

### 5. Access Application
```
Frontend: http://<EC2-PUBLIC-IP>
Backend: http://<EC2-PUBLIC-IP>:8080
```

## Troubleshooting

### Check EC2 containers:
```bash
ssh -i revticket-key.pem ec2-user@<EC2-IP>
cd ~/revticket
docker-compose ps
docker-compose logs -f
```

### Restart services:
```bash
docker-compose restart
```

### Pull latest images:
```bash
docker-compose pull
docker-compose up -d
```
