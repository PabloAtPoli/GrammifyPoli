#!/usr/bin/env python
"""Script to create the grammify_db database."""

import psycopg2
from psycopg2 import sql

# Test different password combinations
passwords = ['', 'password', 'postgres', 'admin']

for pwd in passwords:
    try:
        conn = psycopg2.connect(
            host='localhost',
            user='postgres',
            password=pwd,
            port=5432,
            connect_timeout=3
        )
        print(f'Connected with password: "{pwd}"')
        conn.autocommit = True
        cursor = conn.cursor()
        
        try:
            cursor.execute(sql.SQL('CREATE DATABASE {}').format(sql.Identifier('grammify_db')))
            print('Database grammify_db created successfully')
        except psycopg2.Error as e:
            if 'already exists' in str(e):
                print('Database grammify_db already exists')
            else:
                print(f'Error creating database: {e}')
        
        cursor.close()
        conn.close()
        break
    except psycopg2.Error as e:
        print(f'Failed with password "{pwd}": {str(e)[:60]}...')
        continue
else:
    print('Could not connect to PostgreSQL with any credentials')
