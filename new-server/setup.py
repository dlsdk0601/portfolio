from setuptools import setup, find_packages

setup(
    name='portfolio_was',
    version='1.0.0',
    packages=find_packages(),
    install_requires=[
        'setuptools==69.1.0',
        # was
        'Flask==3.0.2',
        'sconfig==0.0.3',
        'pydantic==2.7.3',
        'stringcase==1.2.0',
        'werkzeug==3.0.3',
        'Flask-Cors==4.0.0',
        # DB
        'SQLAlchemy==2.0.27',
        'Flask-SQLAlchemy==3.1.1',
        'alembic==1.13.1',
        'psycopg2-binary==2.9.9',
        'coint-paginatify-sqlalchemy==0.0.4',
        'Faker==25.8.0',
        # ex
        'pytz==2024.1',
        'types-pytz==2024.1.0.20240417',
        'more-itertools==10.2.0',
        'PyJWT==2.8.0',
        # 정적 타입 분석
        'mypy==1.10.0',
        'watchdog==4.0.1',
        'boto3==1.34.122',
        'requests==2.32.3',
        'types-requests==2.32.0.20240602',
    ]
)
