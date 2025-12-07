# AWS ECR Setup

## Create ECR Repositories

```bash
# Create repositories for backend and frontend
aws ecr create-repository --repository-name revticket-backend --region ap-south-2
aws ecr create-repository --repository-name revticket-frontend --region ap-south-2

# Get repository URIs
aws ecr describe-repositories --region ap-south-2 --query 'repositories[*].[repositoryName,repositoryUri]' --output table
```

## ECR Login Command
```bash
aws ecr get-login-password --region ap-south-2 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.ap-south-2.amazonaws.com
```

## IAM Policy for Jenkins
```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "ecr:GetAuthorizationToken",
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "ecr:InitiateLayerUpload",
                "ecr:UploadLayerPart",
                "ecr:CompleteLayerUpload",
                "ecr:PutImage"
            ],
            "Resource": "*"
        }
    ]
}
```