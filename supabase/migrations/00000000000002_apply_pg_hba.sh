#!/bin/bash
# PostgreSQL 초기화 후 pg_hba.conf 적용
set -e

echo "🔧 Applying custom pg_hba.conf..."

# /tmp에서 pg_hba.conf 복사
if [ -f /tmp/pg_hba.conf ]; then
    cp /tmp/pg_hba.conf /var/lib/postgresql/data/pg_hba.conf
    chmod 600 /var/lib/postgresql/data/pg_hba.conf
    chown postgres:postgres /var/lib/postgresql/data/pg_hba.conf
    echo "✅ pg_hba.conf applied successfully!"
else
    echo "⚠️  /tmp/pg_hba.conf not found, using default configuration"
fi

