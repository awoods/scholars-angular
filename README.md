[![Build Status](https://travis-ci.org/vivo-community/scholars-angular.svg?branch=master)](https://travis-ci.org/vivo-community/scholars-angular)
[![Coverage Status](https://coveralls.io/repos/github/vivo-community/scholars-angular/badge.svg?branch=master)](https://coveralls.io/github/vivo-community/scholars-angular?branch=master)

# scholars-angular

## Docker Deployment

1. Build the image
```bash
  docker build -t scholars/angular .
```

2. Deploy the container
```bash
  docker run -d -p 4200:4200 \
  -e HOST=localhost \
  -e PORT=4200 \
  -e BASE_HREF=/ \
  -e SERVICE_URL="http://localhost:9000" \
  -e EMBED_URL="http://localhost:4201" \
  -e VIVO_URL="http://scholars.library.tamu.edu/vivo" \
  -e VIVO_EDITOR_URL="http://scholars.library.tamu.edu/vivo_editor" \
  scholars/angular
```

> Above environment variables passed into the container are defaults. URLs must be enclosed in double quotes. BASE_HREF must start and end with a forward slash.
