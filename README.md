# member-front

## Packageing

```
$ docker run --rm \
    -v $(pwd)/node-cache:/etc/node-cache \
    -v $(pwd):/usr/src/app \
    -e REACT_APP_ENV=production \
    -w /usr/src/app \
    siriuszg/node-build:1.3 yarn build
```