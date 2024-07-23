# BookVoyage

## Running via Dockerfile

built image

```shell
docker build -t book-voyage .
```

create .env file

```shell
touch .env
nano .env
# then fill the env with the necessary variable
```

running

```shell
docker run --name mashup -p 80:3000 -p 4000:4000 --env-file .env -i -t book-voyage
```

then access the website via `localhost:80`

## Building and running on EC2 via Dockerhub

built image targeting linux and push to dockerhub

```shell
docker buildx build --platform linux/amd64 --push -t pondpiu/book-voyage .
```

create .env file

```shell
touch .env
nano .env
# then fill the env with the necessary variable
```

running image on ec2

```shell
docker run --name mashup -p 80:3000 -p 4000:4000 --env-file .env -i -t pondpiu/book-voyage
```
