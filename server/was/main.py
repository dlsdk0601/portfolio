import uvicorn

from was import config
from was.application import app

if __name__ == '__main__':
    print(app.docs_url)
    uvicorn.run('main:app', port=config.PORT, host='0.0.0.0', reload=True)
