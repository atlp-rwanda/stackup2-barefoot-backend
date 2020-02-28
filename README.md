# Barefoot Nomad - Making company travel and accomodation easy and convinient.
[![Maintainability](https://api.codeclimate.com/v1/badges/e4f2f989e61455bf391a/maintainability)](https://codeclimate.com/github/Stackup-Rwanda/stackup2-barefoot-backend/maintainability)   [![Build Status](https://travis-ci.org/Stackup-Rwanda/stackup2-barefoot-backend.svg?branch=develop)](https://travis-ci.org/Stackup-Rwanda/stackup2-barefoot-backend)
[![Coverage Status](https://coveralls.io/repos/github/Stackup-Rwanda/stackup2-barefoot-backend/badge.svg?branch=develop)](https://coveralls.io/github/Stackup-Rwanda/stackup2-barefoot-backend?branch=develop)
[![Reviewed by Hound](https://img.shields.io/badge/Reviewed_by-Hound-8E64B0.svg)](https://houndci.com)

## Vision

Make company global travel and accommodation easy and convenient for the strong workforce of savvy members of staff, by leveraging the modern web.

---

## Deployments

* This application is deployed on heroku, we have two different versions, which are different by the app status, *__in testing mode__* or *__ready for production__*.

    * When the app is in testing mode is available on this link [stackup2-barefoot-backend-staging](https://stackup2-barefoot-backend-stag.herokuapp.com/)

    This deployment happens automatically, whenever there is a new merging to __develop__ branch

    => This helps whoever wants to test our application if it is giving the accurate outputs

    * When the app is ready for production is available on this link [stackup2-barefoot-backend](https://stackup2-barefoot-backend.herokuapp.com/)

* Whenever a new PR is opened, there is a new review app which is created and accessible in the browser which helps to access visualize your PR in the browser to check if it working as you wanted it to work.

* If your PR needs some environment variables, click [here](https://dashboard.heroku.com/pipelines/45438218-0719-4c45-8d9f-50d610d24ed5/settings) and click on the *__Reveal Config Vars__* button, a new small window opens which shows you where to enter your env variable key and value. Those env variables are accessed ass __process.env.{VARIABLE_NAME}__
=>Make sure you don't delete other env variables which were there previously.

_If the aforementioned link says *ACCESS DENIED*, then contact me _[here](mailto:emmanuellamugi@gmail.com)_ to add you_

* After raising a PR, and after setting up everything, you can click [here](https://dashboard.heroku.com/pipelines/45438218-0719-4c45-8d9f-50d610d24ed5/) and look at the tab called __REVIEW APPS__ and scroll down to find your PR and click on __Open App__ button.

* Another easy way to check your PR's deployment, after TravisCI build passes, scroll down to the PR's page and click on the `View Deployment` button.