#!/bin/bash
# Setup swap space on EC2 instance

echo "Checking if swap already exists..."
if [ -f /swapfile ]; then
    echo "Swap file already exists"
else
    echo "Creating 2GB swap file..."
    sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    echo "Swap created successfully"
fi

echo "Current memory status:"
free -h

echo "Stopping any running containers..."
docker stop $(docker ps -aq) 2>/dev/null || true

echo "Starting containers with memory limits..."
cd /home/ec2-user
docker-compose -f docker-compose.ec2.yml up -d

echo "Waiting 30 seconds for containers to start..."
sleep 30

echo "Container status:"
docker ps

echo "Memory usage:"
free -h
