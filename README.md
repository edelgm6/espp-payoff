# espp-payoff

**espp-payoff** is a Django + vanilla async Javascript calculator to help public-company employees understand their Employee Stock Purhcase Plan (ESPP) value. It is hosted at [esppvalue.com](https://esppvalue.com).

## Getting Started

*Requirements: Python 3*

Getting set up locally is simple. Once you've cloned the project:

1) Run `pip install requirements.txt`
2) Set up a local_settings.py file and drop it in the root folder where the settings.py file lives
3) If you want to be able to pull in stock data, you'll need to sign up for a polygon.io account

```python
# local_settings.py

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

POLYGON_API_KEY = [KEY_HERE]

SECRET_KEY = [KEY_HERE]

DEBUG = True

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

3) Run `python3 manage.py migrate`

## Built With

* [Django](https://www.djangoproject.com/)
* [Bootstrap](https://getbootstrap.com/)
* [Chart.js](https://www.chartjs.org/) - Open source HTML5 charts
* [polygon.io](https://polygon.io/) - Stock data API


## Author

**Garrett Edel**
[LinkedIn](https://www.linkedin.com/in/garrettedel/)

## License

MIT License

Copyright (c) 2023 Garrett Edel

See [LICENSE.txt](LICENSE.txt) file for details