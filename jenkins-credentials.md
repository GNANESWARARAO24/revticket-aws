# Jenkins Credentials Configuration

## Required Credentials in Jenkins

### 1. AWS Credentials
- **ID**: `aws-credentials`
- **Type**: AWS Credentials
- **Access Key ID**: Your AWS Access Key
- **Secret Access Key**: Your AWS Secret Key

### 2. AWS Account ID
- **ID**: `aws-account-id`
- **Type**: Secret text
- **Secret**: Your 12-digit AWS Account ID

### 3. EC2 Host
- **ID**: `ec2-host`
- **Type**: Secret text
- **Secret**: Your EC2 instance public IP or domain

### 4. EC2 SSH Key
- **ID**: `ec2-ssh-key`
- **Type**: SSH Username with private key
- **Username**: ec2-user
- **Private Key**: Your EC2 key pair (.pem file content)

## Steps to Add Credentials:
1. Jenkins → Manage Jenkins → Credentials
2. System → Global credentials
3. Add Credential → Select appropriate type
4. Fill details and save