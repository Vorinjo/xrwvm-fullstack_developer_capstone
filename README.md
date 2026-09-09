# fullstack_developer_capstone

Best Cars is the capstone project for the IBM Full Stack Software Developer
Professional Certificate. It is a responsive car-dealership portal where
visitors can browse and filter dealership branches, read customer reviews,
register or sign in, and post reviews with automated sentiment analysis.

## Architecture

- Django provides authentication, SQLite car-make/model data, static pages,
  and proxy API endpoints.
- React provides registration, login, dealer listings, dealer details, and
  review submission pages.
- Express and MongoDB provide dealership and review services.
- Flask provides the sentiment-analysis microservice.
- Docker, Kubernetes, IBM Cloud Container Registry, and GitHub Actions support
  build, deployment, and continuous integration.

## Main services

| Service | Default port |
| --- | ---: |
| Django/React application | 8000 |
| Express/Mongo dealership API | 3030 |
| Flask sentiment analyzer | 5000 |

This repository was completed from the IBM Skills Network starter project for
the Full Stack Application Development Capstone Project.
