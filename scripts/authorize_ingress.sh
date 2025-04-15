#!/bin/bash

# Set your Security Group ID
SG_ID=$1

echo "🔓 Temporarily opening SSH (port 22) to the world..."
aws ec2 authorize-security-group-ingress \
  --group-id $SG_ID \
  --protocol tcp \
  --port 22 \
  --cidr 0.0.0.0/0

echo "⏳ SSH is open to the world for 15 minutes..."
sleep 900  # 15 minutes = 900 seconds

echo "🔐 Closing SSH (revoking world access)..."
aws ec2 revoke-security-group-ingress \
  --group-id $SG_ID \
  --protocol tcp \
  --port 22 \
  --cidr 0.0.0.0/0

echo "✅ SSH access locked down again."