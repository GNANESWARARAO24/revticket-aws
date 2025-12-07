#!/bin/bash

# EC2 Instance Setup Script for RevTicket

echo "Setting up EC2 instance for RevTicket deployment..."

# Update system
sudo yum update -y

# Install Docker
sudo yum install -y docker
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -a -G docker ec2-user

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install AWS CLI v2
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Create application directory
mkdir -p ~/revticket
cd ~/revticket

# Copy docker-compose file (you'll need to upload this)
# scp -i your-key.pem docker-compose.ecr.yml ec2-user@your-ec2-ip:~/revticket/docker-compose.yml

# Configure AWS credentials (run aws configure)
echo "Run 'aws configure' to set up AWS credentials"

# Create deployment script
cat > deploy.sh << 'EOF'
#!/bin/bash
export ECR_REGISTRY="<your-account-id>.dkr.ecr.ap-south-2.amazonaws.com"
aws ecr get-login-password --region ap-south-2 | docker login --username AWS --password-stdin $ECR_REGISTRY
docker-compose pull
docker-compose up -d
EOF

chmod +x deploy.sh

echo "EC2 setup complete!"
echo "Next steps:"
echo "1. Configure AWS credentials: aws configure"
echo "2. Update ECR_REGISTRY in deploy.sh"
echo "3. Upload docker-compose.ecr.yml as docker-compose.yml"
echo "4. Run ./deploy.sh to deploy"